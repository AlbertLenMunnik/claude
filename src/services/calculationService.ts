/**
 * Tax Calculation Service
 *
 * Calculates sales tax for a transaction given:
 * - The destination state (where the buyer is located — destination-based sourcing)
 * - The sale amount
 * - Optional: whether to use state rate only vs. combined (state + avg local)
 *
 * Note: This engine uses state-level rates plus average local rates.
 * For precise address-level rates, integrate a geocoding + rate lookup
 * service (e.g. TaxJar API, Avalara, USPS). This is appropriate for
 * MVP / most small-business use cases.
 */

import { STATE_TAX_RATES, StateTaxRate } from "../data/stateTaxRates";

export type RateType = "state_only" | "combined_avg" | "combined_max";

export interface TaxCalculationInput {
  /** Two-letter destination state abbreviation */
  destinationState: string;
  /** Pre-tax sale amount in USD */
  saleAmount: number;
  /** Which rate to apply */
  rateType?: RateType;
  /** Optional: quantity (for per-unit calculations) */
  quantity?: number;
}

export interface TaxCalculationResult {
  destinationState: string;
  stateName: string;
  saleAmount: number;
  taxableAmount: number;
  rateType: RateType;
  stateRate: number;
  localRate: number;
  appliedRate: number;
  taxAmount: number;
  totalAmount: number;
  breakdown: {
    stateTax: number;
    localTax: number;
  };
  hasSalesTax: boolean;
}

export interface BulkCalculationInput {
  transactions: Array<{
    id: string;
    destinationState: string;
    saleAmount: number;
    rateType?: RateType;
  }>;
}

export interface BulkCalculationResult {
  results: Array<TaxCalculationResult & { id: string }>;
  totals: {
    totalSales: number;
    totalTax: number;
    totalWithTax: number;
    byState: Record<string, { sales: number; tax: number; count: number }>;
  };
}

/**
 * Round to 2 decimal places (standard for currency)
 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculate tax for a single transaction
 */
export function calculateTax(input: TaxCalculationInput): TaxCalculationResult {
  const abbr = input.destinationState.toUpperCase();
  const stateInfo: StateTaxRate | undefined = STATE_TAX_RATES[abbr];

  if (!stateInfo) {
    throw new Error(`Unknown state abbreviation: ${input.destinationState}`);
  }

  const rateType: RateType = input.rateType ?? "combined_avg";
  const quantity = input.quantity ?? 1;
  const taxableAmount = round2(input.saleAmount * quantity);

  let appliedRate: number;
  let localRateApplied: number;

  if (!stateInfo.hasSalesTax) {
    appliedRate = 0;
    localRateApplied = 0;
  } else {
    switch (rateType) {
      case "state_only":
        appliedRate = stateInfo.stateRate;
        localRateApplied = 0;
        break;
      case "combined_max":
        appliedRate = stateInfo.maxCombinedRate;
        localRateApplied = stateInfo.maxCombinedRate - stateInfo.stateRate;
        break;
      case "combined_avg":
      default:
        // Use average local rate (clamped to 0 — NJ has a negative avg local rate)
        localRateApplied = Math.max(0, stateInfo.avgLocalRate);
        appliedRate = stateInfo.stateRate + localRateApplied;
        break;
    }
  }

  const taxAmount = round2(taxableAmount * appliedRate);
  const stateTax = round2(taxableAmount * stateInfo.stateRate);
  const localTax = round2(taxableAmount * localRateApplied);
  const totalAmount = round2(taxableAmount + taxAmount);

  return {
    destinationState: abbr,
    stateName: stateInfo.state,
    saleAmount: input.saleAmount,
    taxableAmount,
    rateType,
    stateRate: stateInfo.stateRate,
    localRate: localRateApplied,
    appliedRate,
    taxAmount,
    totalAmount,
    breakdown: {
      stateTax,
      localTax,
    },
    hasSalesTax: stateInfo.hasSalesTax,
  };
}

/**
 * Calculate tax for multiple transactions at once
 */
export function calculateBulkTax(input: BulkCalculationInput): BulkCalculationResult {
  const byState: Record<string, { sales: number; tax: number; count: number }> = {};

  const results = input.transactions.map((tx) => {
    const result = calculateTax({
      destinationState: tx.destinationState,
      saleAmount: tx.saleAmount,
      rateType: tx.rateType,
    });

    const abbr = tx.destinationState.toUpperCase();
    if (!byState[abbr]) {
      byState[abbr] = { sales: 0, tax: 0, count: 0 };
    }
    byState[abbr].sales = round2(byState[abbr].sales + result.taxableAmount);
    byState[abbr].tax = round2(byState[abbr].tax + result.taxAmount);
    byState[abbr].count += 1;

    return { ...result, id: tx.id };
  });

  const totalSales = round2(results.reduce((sum, r) => sum + r.taxableAmount, 0));
  const totalTax = round2(results.reduce((sum, r) => sum + r.taxAmount, 0));

  return {
    results,
    totals: {
      totalSales,
      totalTax,
      totalWithTax: round2(totalSales + totalTax),
      byState,
    },
  };
}

/**
 * Get the effective tax rate for a state (helper)
 */
export function getEffectiveRate(
  stateAbbreviation: string,
  rateType: RateType = "combined_avg"
): number {
  const stateInfo = STATE_TAX_RATES[stateAbbreviation.toUpperCase()];
  if (!stateInfo || !stateInfo.hasSalesTax) return 0;

  switch (rateType) {
    case "state_only":   return stateInfo.stateRate;
    case "combined_max": return stateInfo.maxCombinedRate;
    case "combined_avg": return stateInfo.stateRate + Math.max(0, stateInfo.avgLocalRate);
  }
}
