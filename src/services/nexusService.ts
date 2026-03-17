/**
 * Nexus Determination Service
 *
 * Determines whether a business has economic nexus in a given US state
 * based on their sales volume and transaction count over the relevant period.
 *
 * Physical nexus (employee, office, warehouse, etc.) is tracked separately
 * and always results in nexus regardless of sales thresholds.
 */

import { NEXUS_THRESHOLDS, NexusThreshold } from "../data/nexusThresholds";
import { STATE_TAX_RATES } from "../data/stateTaxRates";

export type NexusType = "economic" | "physical" | "both" | "none";

export interface NexusCheckInput {
  /** Two-letter state abbreviation */
  stateAbbreviation: string;
  /** Total sales amount into this state over the lookback period (USD) */
  totalSales: number;
  /** Total number of transactions into this state over the lookback period */
  totalTransactions: number;
  /** Whether the business has a physical presence in this state */
  hasPhysicalPresence?: boolean;
}

export interface NexusCheckResult {
  state: string;
  abbreviation: string;
  hasNexus: boolean;
  nexusType: NexusType;
  economicNexusTriggered: boolean;
  salesThresholdMet: boolean;
  transactionThresholdMet: boolean;
  salesThreshold: number;
  transactionThreshold: number | null;
  thresholdLogic: "OR" | "AND";
  lookbackPeriod: string;
  hasSalesTax: boolean;
  notes?: string;
}

export interface BulkNexusInput {
  /** Map of state abbreviation → { totalSales, totalTransactions } */
  salesByState: Record<string, { totalSales: number; totalTransactions: number }>;
  /** States where physical presence exists */
  physicalPresenceStates?: string[];
}

export interface BulkNexusResult {
  nexusStates: NexusCheckResult[];
  nonNexusStates: NexusCheckResult[];
  summary: {
    totalNexusStates: number;
    economicNexusOnly: number;
    physicalNexusOnly: number;
    bothTypes: number;
  };
}

/**
 * Check nexus for a single state
 */
export function checkNexus(input: NexusCheckInput): NexusCheckResult {
  const abbr = input.stateAbbreviation.toUpperCase();
  const threshold: NexusThreshold | undefined = NEXUS_THRESHOLDS[abbr];
  const rateInfo = STATE_TAX_RATES[abbr];

  if (!threshold || !rateInfo) {
    throw new Error(`Unknown state abbreviation: ${input.stateAbbreviation}`);
  }

  // No sales tax — nexus is irrelevant (except Alaska which has local taxes)
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
      notes: threshold.notes ?? "No state sales tax — nexus not applicable at state level",
    };
  }

  const salesThresholdMet = threshold.salesThreshold > 0
    ? input.totalSales >= threshold.salesThreshold
    : true; // $0 threshold means any amount triggers it

  const transactionThresholdMet = threshold.transactionThreshold !== null
    ? input.totalTransactions >= threshold.transactionThreshold
    : false; // No transaction threshold

  let economicNexusTriggered: boolean;
  if (threshold.thresholdLogic === "AND") {
    // Both must be met
    economicNexusTriggered = salesThresholdMet && (
      threshold.transactionThreshold !== null ? transactionThresholdMet : true
    );
  } else {
    // Either meeting sales OR transactions triggers nexus
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

/**
 * Check nexus across all states in bulk
 */
export function checkBulkNexus(input: BulkNexusInput): BulkNexusResult {
  const physicalStates = new Set(
    (input.physicalPresenceStates ?? []).map((s) => s.toUpperCase())
  );

  const results: NexusCheckResult[] = Object.entries(NEXUS_THRESHOLDS).map(([abbr]) => {
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
