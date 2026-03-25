declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type EventParams = Record<string, string | number | boolean>;

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

export function trackEvent(eventName: string, params?: EventParams) {
  gtag("event", eventName, params);
}

export const events = {
  calculatorStarted: () => trackEvent("calculator_started"),

  calculatorCompleted: (nexusCount: number, totalRevenue: number) => {
    const revenueBucket =
      totalRevenue < 100000 ? "under_100k" :
      totalRevenue < 500000 ? "100k_500k" :
      totalRevenue < 1000000 ? "500k_1m" : "over_1m";
    trackEvent("calculator_completed", { nexus_count: nexusCount, revenue_range: revenueBucket });
  },

  resultsViewed: (nexusCount: number) =>
    trackEvent("results_viewed", { nexus_count: nexusCount }),

  affiliateSectionVisible: () => trackEvent("affiliate_section_visible"),

  affiliateCardClick: (provider: string) =>
    trackEvent("affiliate_card_click", { provider }),

  comparisonTableViewed: () => trackEvent("comparison_table_viewed"),
};
