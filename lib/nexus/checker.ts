import { NEXUS_THRESHOLDS } from "./thresholds";
import { STATE_TAX_RATES } from "./taxRates";
import type { NexusCheckInput, NexusCheckResult, NexusType, BulkNexusInput, BulkNexusResult } from "./types";

export function checkNexus(input: NexusCheckInput): NexusCheckResult {
  const abbr = input.stateAbbreviation.toUpperCase();
  const threshold = NEXUS_THRESHOLDS[abbr];
  const rateInfo = STATE_TAX_RATES[abbr];

  if (!threshold || !rateInfo) {
    throw new Error(`Unknown state abbreviation: ${input.stateAbbreviation}`);
  }

  if (!threshold.enacted) {
    return {
      state: threshold.state,
      abbreviation: abbr,
      hasNexus: false,
      nexusType: "none",
      economicNexusTriggered: false,
      salesThresholdMet: false,
      transactionThresholdMet: false,
      salesThreshold: threshold.salesThreshold,
      transactionThreshold: threshold.transactionThreshold,
      thresholdLogic: threshold.thresholdLogic,
      lookbackPeriod: threshold.lookbackPeriod,
      hasSalesTax: rateInfo.hasSalesTax,
      notes: threshold.notes ?? "No state sales tax",
    };
  }

  const salesThresholdMet = threshold.salesThreshold > 0
    ? input.totalSales >= threshold.salesThreshold
    : true;

  const transactionThresholdMet = threshold.transactionThreshold !== null
    ? input.totalTransactions >= threshold.transactionThreshold
    : false;

  let economicNexusTriggered: boolean;
  if (threshold.thresholdLogic === "AND") {
    economicNexusTriggered = salesThresholdMet && (
      threshold.transactionThreshold !== null ? transactionThresholdMet : true
    );
  } else {
    economicNexusTriggered = salesThresholdMet || transactionThresholdMet;
  }

  const hasPhysical = input.hasPhysicalPresence ?? false;
  const hasNexus = economicNexusTriggered || hasPhysical;

  let nexusType: NexusType = "none";
  if (economicNexusTriggered && hasPhysical) nexusType = "both";
  else if (economicNexusTriggered) nexusType = "economic";
  else if (hasPhysical) nexusType = "physical";

  return {
    state: threshold.state,
    abbreviation: abbr,
    hasNexus,
    nexusType,
    economicNexusTriggered,
    salesThresholdMet,
    transactionThresholdMet,
    salesThreshold: threshold.salesThreshold,
    transactionThreshold: threshold.transactionThreshold,
    thresholdLogic: threshold.thresholdLogic,
    lookbackPeriod: threshold.lookbackPeriod,
    hasSalesTax: rateInfo.hasSalesTax,
    notes: threshold.notes,
  };
}

export function checkBulkNexus(input: BulkNexusInput): BulkNexusResult {
  const physicalStates = new Set(
    (input.physicalPresenceStates ?? []).map((s) => s.toUpperCase())
  );

  const results: NexusCheckResult[] = Object.keys(NEXUS_THRESHOLDS).map((abbr) => {
    const salesData = input.salesByState[abbr] ?? { totalSales: 0, totalTransactions: 0 };
    return checkNexus({
      stateAbbreviation: abbr,
      totalSales: salesData.totalSales,
      totalTransactions: salesData.totalTransactions,
      hasPhysicalPresence: physicalStates.has(abbr),
    });
  });

  const nexusStates = results.filter((r) => r.hasNexus);
  const nonNexusStates = results.filter((r) => !r.hasNexus);

  return {
    nexusStates,
    nonNexusStates,
    summary: {
      totalNexusStates: nexusStates.length,
      economicNexusOnly: nexusStates.filter((r) => r.nexusType === "economic").length,
      physicalNexusOnly: nexusStates.filter((r) => r.nexusType === "physical").length,
      bothTypes: nexusStates.filter((r) => r.nexusType === "both").length,
    },
  };
}
