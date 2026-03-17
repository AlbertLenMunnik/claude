/**
 * US Economic Nexus Thresholds — post South Dakota v. Wayfair (2018)
 *
 * Economic nexus is triggered when a remote seller's sales INTO a state
 * exceed either a dollar threshold OR a transaction count threshold within
 * a 12-month (or calendar year) period.
 *
 * Physical nexus (office, employee, warehouse) is assumed to exist separately.
 *
 * Data current as of Q1 2025. Always verify with a tax professional for
 * production use — thresholds change frequently.
 */

export type NexusThresholdPeriod = "calendar_year" | "rolling_12_months" | "current_or_prior_year";

export interface NexusThreshold {
  state: string;
  abbreviation: string;
  /** Dollar amount of sales that triggers nexus (0 = no threshold / any amount) */
  salesThreshold: number;
  /** Number of transactions that triggers nexus (null = no transaction threshold) */
  transactionThreshold: number | null;
  /** Whether thresholds are combined (OR) or both must be met (AND) */
  thresholdLogic: "OR" | "AND";
  /** Lookback period for determining nexus */
  lookbackPeriod: NexusThresholdPeriod;
  /** Any special notes for this state */
  notes?: string;
  /** Whether economic nexus law is enacted */
  enacted: boolean;
}

export const NEXUS_THRESHOLDS: Record<string, NexusThreshold> = {
  AL: { state: "Alabama",        abbreviation: "AL", salesThreshold: 250000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  AK: { state: "Alaska",         abbreviation: "AK", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true, notes: "No statewide sales tax; local jurisdictions may have nexus rules" },
  AZ: { state: "Arizona",        abbreviation: "AZ", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  AR: { state: "Arkansas",       abbreviation: "AR", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  CA: { state: "California",     abbreviation: "CA", salesThreshold: 500000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  CO: { state: "Colorado",       abbreviation: "CO", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  CT: { state: "Connecticut",    abbreviation: "CT", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "AND","lookbackPeriod": "rolling_12_months",       enacted: true  },
  DE: { state: "Delaware",       abbreviation: "DE", salesThreshold: 0,      transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: false, notes: "No sales tax" },
  FL: { state: "Florida",        abbreviation: "FL", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  GA: { state: "Georgia",        abbreviation: "GA", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  HI: { state: "Hawaii",         abbreviation: "HI", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  ID: { state: "Idaho",          abbreviation: "ID", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  IL: { state: "Illinois",       abbreviation: "IL", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "rolling_12_months",         enacted: true  },
  IN: { state: "Indiana",        abbreviation: "IN", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  IA: { state: "Iowa",           abbreviation: "IA", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  KS: { state: "Kansas",         abbreviation: "KS", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  KY: { state: "Kentucky",       abbreviation: "KY", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  LA: { state: "Louisiana",      abbreviation: "LA", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  ME: { state: "Maine",          abbreviation: "ME", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "rolling_12_months",         enacted: true  },
  MD: { state: "Maryland",       abbreviation: "MD", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  MA: { state: "Massachusetts",  abbreviation: "MA", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "rolling_12_months",         enacted: true  },
  MI: { state: "Michigan",       abbreviation: "MI", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  MN: { state: "Minnesota",      abbreviation: "MN", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "rolling_12_months",         enacted: true  },
  MS: { state: "Mississippi",    abbreviation: "MS", salesThreshold: 250000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "rolling_12_months",         enacted: true  },
  MO: { state: "Missouri",       abbreviation: "MO", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  MT: { state: "Montana",        abbreviation: "MT", salesThreshold: 0,      transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: false, notes: "No sales tax" },
  NE: { state: "Nebraska",       abbreviation: "NE", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  NV: { state: "Nevada",         abbreviation: "NV", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  NH: { state: "New Hampshire",  abbreviation: "NH", salesThreshold: 0,      transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: false, notes: "No sales tax" },
  NJ: { state: "New Jersey",     abbreviation: "NJ", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  NM: { state: "New Mexico",     abbreviation: "NM", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  NY: { state: "New York",       abbreviation: "NY", salesThreshold: 500000, transactionThreshold: 100,   thresholdLogic: "AND","lookbackPeriod": "rolling_12_months",       enacted: true  },
  NC: { state: "North Carolina", abbreviation: "NC", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  ND: { state: "North Dakota",   abbreviation: "ND", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  OH: { state: "Ohio",           abbreviation: "OH", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  OK: { state: "Oklahoma",       abbreviation: "OK", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  OR: { state: "Oregon",         abbreviation: "OR", salesThreshold: 0,      transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: false, notes: "No sales tax" },
  PA: { state: "Pennsylvania",   abbreviation: "PA", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "rolling_12_months",         enacted: true  },
  RI: { state: "Rhode Island",   abbreviation: "RI", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  SC: { state: "South Carolina", abbreviation: "SC", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  SD: { state: "South Dakota",   abbreviation: "SD", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  TN: { state: "Tennessee",      abbreviation: "TN", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "rolling_12_months",         enacted: true  },
  TX: { state: "Texas",          abbreviation: "TX", salesThreshold: 500000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  UT: { state: "Utah",           abbreviation: "UT", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  VT: { state: "Vermont",        abbreviation: "VT", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  VA: { state: "Virginia",       abbreviation: "VA", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  WA: { state: "Washington",     abbreviation: "WA", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "rolling_12_months",         enacted: true  },
  WV: { state: "West Virginia",  abbreviation: "WV", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  WI: { state: "Wisconsin",      abbreviation: "WI", salesThreshold: 100000, transactionThreshold: null,  thresholdLogic: "OR", lookbackPeriod: "rolling_12_months",         enacted: true  },
  WY: { state: "Wyoming",        abbreviation: "WY", salesThreshold: 100000, transactionThreshold: 200,   thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
  DC: { state: "Washington D.C.","abbreviation": "DC", salesThreshold: 100000, transactionThreshold: 200, thresholdLogic: "OR", lookbackPeriod: "calendar_year",             enacted: true  },
};

export function getNexusThreshold(abbreviation: string): NexusThreshold | undefined {
  return NEXUS_THRESHOLDS[abbreviation.toUpperCase()];
}

export function getAllThresholds(): NexusThreshold[] {
  return Object.values(NEXUS_THRESHOLDS);
}
