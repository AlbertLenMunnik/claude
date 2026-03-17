/**
 * US State Tax Rates
 * Rates are base state rates (%). Local/county rates are additive and listed separately.
 * Source: Sales Tax Institute / Tax Foundation (2024)
 */

export interface StateTaxRate {
  state: string;
  abbreviation: string;
  stateRate: number;       // Base state rate as a decimal (e.g., 0.06 = 6%)
  avgLocalRate: number;    // Average combined local rate as decimal
  maxCombinedRate: number; // Max combined rate (state + local)
  hasSalesTax: boolean;    // Some states have no sales tax
}

export const STATE_TAX_RATES: Record<string, StateTaxRate> = {
  AL: { state: "Alabama",        abbreviation: "AL", stateRate: 0.04,   avgLocalRate: 0.0522, maxCombinedRate: 0.14,   hasSalesTax: true  },
  AK: { state: "Alaska",         abbreviation: "AK", stateRate: 0.00,   avgLocalRate: 0.0176, maxCombinedRate: 0.076,  hasSalesTax: false },
  AZ: { state: "Arizona",        abbreviation: "AZ", stateRate: 0.056,  avgLocalRate: 0.0278, maxCombinedRate: 0.1073, hasSalesTax: true  },
  AR: { state: "Arkansas",       abbreviation: "AR", stateRate: 0.065,  avgLocalRate: 0.0295, maxCombinedRate: 0.115,  hasSalesTax: true  },
  CA: { state: "California",     abbreviation: "CA", stateRate: 0.0725, avgLocalRate: 0.0157, maxCombinedRate: 0.1025, hasSalesTax: true  },
  CO: { state: "Colorado",       abbreviation: "CO", stateRate: 0.029,  avgLocalRate: 0.0481, maxCombinedRate: 0.112,  hasSalesTax: true  },
  CT: { state: "Connecticut",    abbreviation: "CT", stateRate: 0.0635, avgLocalRate: 0.00,   maxCombinedRate: 0.0635, hasSalesTax: true  },
  DE: { state: "Delaware",       abbreviation: "DE", stateRate: 0.00,   avgLocalRate: 0.00,   maxCombinedRate: 0.00,   hasSalesTax: false },
  FL: { state: "Florida",        abbreviation: "FL", stateRate: 0.06,   avgLocalRate: 0.0101, maxCombinedRate: 0.075,  hasSalesTax: true  },
  GA: { state: "Georgia",        abbreviation: "GA", stateRate: 0.04,   avgLocalRate: 0.032,  maxCombinedRate: 0.09,   hasSalesTax: true  },
  HI: { state: "Hawaii",         abbreviation: "HI", stateRate: 0.04,   avgLocalRate: 0.0044, maxCombinedRate: 0.045,  hasSalesTax: true  },
  ID: { state: "Idaho",          abbreviation: "ID", stateRate: 0.06,   avgLocalRate: 0.0003, maxCombinedRate: 0.085,  hasSalesTax: true  },
  IL: { state: "Illinois",       abbreviation: "IL", stateRate: 0.0625, avgLocalRate: 0.0275, maxCombinedRate: 0.1125, hasSalesTax: true  },
  IN: { state: "Indiana",        abbreviation: "IN", stateRate: 0.07,   avgLocalRate: 0.00,   maxCombinedRate: 0.07,   hasSalesTax: true  },
  IA: { state: "Iowa",           abbreviation: "IA", stateRate: 0.06,   avgLocalRate: 0.0094, maxCombinedRate: 0.07,   hasSalesTax: true  },
  KS: { state: "Kansas",         abbreviation: "KS", stateRate: 0.065,  avgLocalRate: 0.0214, maxCombinedRate: 0.1125, hasSalesTax: true  },
  KY: { state: "Kentucky",       abbreviation: "KY", stateRate: 0.06,   avgLocalRate: 0.00,   maxCombinedRate: 0.06,   hasSalesTax: true  },
  LA: { state: "Louisiana",      abbreviation: "LA", stateRate: 0.0445, avgLocalRate: 0.0551, maxCombinedRate: 0.1163, hasSalesTax: true  },
  ME: { state: "Maine",          abbreviation: "ME", stateRate: 0.055,  avgLocalRate: 0.00,   maxCombinedRate: 0.055,  hasSalesTax: true  },
  MD: { state: "Maryland",       abbreviation: "MD", stateRate: 0.06,   avgLocalRate: 0.00,   maxCombinedRate: 0.06,   hasSalesTax: true  },
  MA: { state: "Massachusetts",  abbreviation: "MA", stateRate: 0.0625, avgLocalRate: 0.00,   maxCombinedRate: 0.0625, hasSalesTax: true  },
  MI: { state: "Michigan",       abbreviation: "MI", stateRate: 0.06,   avgLocalRate: 0.00,   maxCombinedRate: 0.06,   hasSalesTax: true  },
  MN: { state: "Minnesota",      abbreviation: "MN", stateRate: 0.06875,avgLocalRate: 0.0055, maxCombinedRate: 0.0888, hasSalesTax: true  },
  MS: { state: "Mississippi",    abbreviation: "MS", stateRate: 0.07,   avgLocalRate: 0.0007, maxCombinedRate: 0.08,   hasSalesTax: true  },
  MO: { state: "Missouri",       abbreviation: "MO", stateRate: 0.04225,avgLocalRate: 0.039,  maxCombinedRate: 0.1135, hasSalesTax: true  },
  MT: { state: "Montana",        abbreviation: "MT", stateRate: 0.00,   avgLocalRate: 0.00,   maxCombinedRate: 0.00,   hasSalesTax: false },
  NE: { state: "Nebraska",       abbreviation: "NE", stateRate: 0.055,  avgLocalRate: 0.0171, maxCombinedRate: 0.075,  hasSalesTax: true  },
  NV: { state: "Nevada",         abbreviation: "NV", stateRate: 0.0685, avgLocalRate: 0.0132, maxCombinedRate: 0.0825, hasSalesTax: true  },
  NH: { state: "New Hampshire",  abbreviation: "NH", stateRate: 0.00,   avgLocalRate: 0.00,   maxCombinedRate: 0.00,   hasSalesTax: false },
  NJ: { state: "New Jersey",     abbreviation: "NJ", stateRate: 0.06625,avgLocalRate: -0.0003,maxCombinedRate: 0.0663, hasSalesTax: true  },
  NM: { state: "New Mexico",     abbreviation: "NM", stateRate: 0.05,   avgLocalRate: 0.0243, maxCombinedRate: 0.09125,hasSalesTax: true  },
  NY: { state: "New York",       abbreviation: "NY", stateRate: 0.04,   avgLocalRate: 0.0494, maxCombinedRate: 0.0875, hasSalesTax: true  },
  NC: { state: "North Carolina", abbreviation: "NC", stateRate: 0.0475, avgLocalRate: 0.022,  maxCombinedRate: 0.075,  hasSalesTax: true  },
  ND: { state: "North Dakota",   abbreviation: "ND", stateRate: 0.05,   avgLocalRate: 0.0185, maxCombinedRate: 0.08,   hasSalesTax: true  },
  OH: { state: "Ohio",           abbreviation: "OH", stateRate: 0.0575, avgLocalRate: 0.0142, maxCombinedRate: 0.08,   hasSalesTax: true  },
  OK: { state: "Oklahoma",       abbreviation: "OK", stateRate: 0.045,  avgLocalRate: 0.0448, maxCombinedRate: 0.115,  hasSalesTax: true  },
  OR: { state: "Oregon",         abbreviation: "OR", stateRate: 0.00,   avgLocalRate: 0.00,   maxCombinedRate: 0.00,   hasSalesTax: false },
  PA: { state: "Pennsylvania",   abbreviation: "PA", stateRate: 0.06,   avgLocalRate: 0.0034, maxCombinedRate: 0.08,   hasSalesTax: true  },
  RI: { state: "Rhode Island",   abbreviation: "RI", stateRate: 0.07,   avgLocalRate: 0.00,   maxCombinedRate: 0.07,   hasSalesTax: true  },
  SC: { state: "South Carolina", abbreviation: "SC", stateRate: 0.06,   avgLocalRate: 0.0122, maxCombinedRate: 0.09,   hasSalesTax: true  },
  SD: { state: "South Dakota",   abbreviation: "SD", stateRate: 0.042,  avgLocalRate: 0.0194, maxCombinedRate: 0.065,  hasSalesTax: true  },
  TN: { state: "Tennessee",      abbreviation: "TN", stateRate: 0.07,   avgLocalRate: 0.0247, maxCombinedRate: 0.0975, hasSalesTax: true  },
  TX: { state: "Texas",          abbreviation: "TX", stateRate: 0.0625, avgLocalRate: 0.019,  maxCombinedRate: 0.0825, hasSalesTax: true  },
  UT: { state: "Utah",           abbreviation: "UT", stateRate: 0.061,  avgLocalRate: 0.0197, maxCombinedRate: 0.09,   hasSalesTax: true  },
  VT: { state: "Vermont",        abbreviation: "VT", stateRate: 0.06,   avgLocalRate: 0.0018, maxCombinedRate: 0.07,   hasSalesTax: true  },
  VA: { state: "Virginia",       abbreviation: "VA", stateRate: 0.053,  avgLocalRate: 0.0035, maxCombinedRate: 0.07,   hasSalesTax: true  },
  WA: { state: "Washington",     abbreviation: "WA", stateRate: 0.065,  avgLocalRate: 0.0272, maxCombinedRate: 0.104,  hasSalesTax: true  },
  WV: { state: "West Virginia",  abbreviation: "WV", stateRate: 0.06,   avgLocalRate: 0.0039, maxCombinedRate: 0.07,   hasSalesTax: true  },
  WI: { state: "Wisconsin",      abbreviation: "WI", stateRate: 0.05,   avgLocalRate: 0.0056, maxCombinedRate: 0.065,  hasSalesTax: true  },
  WY: { state: "Wyoming",        abbreviation: "WY", stateRate: 0.04,   avgLocalRate: 0.0191, maxCombinedRate: 0.06,   hasSalesTax: true  },
  DC: { state: "Washington D.C.","abbreviation": "DC", stateRate: 0.06, avgLocalRate: 0.00,   maxCombinedRate: 0.06,   hasSalesTax: true  },
};

export function getStateRate(abbreviation: string): StateTaxRate | undefined {
  return STATE_TAX_RATES[abbreviation.toUpperCase()];
}

export function getAllStates(): StateTaxRate[] {
  return Object.values(STATE_TAX_RATES);
}
