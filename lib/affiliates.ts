export interface AffiliatePartner {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  bestFor: string;
  features: string[];
  url: string;
  recommended?: boolean;
}

function buildAffiliateUrl(baseUrl: string): string {
  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}utm_source=nexuscheck&utm_medium=referral&utm_campaign=checker_results`;
}

export const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  {
    id: "kintsugi",
    name: "Kintsugi",
    tagline: "Sales tax compliance automation",
    description: "Automate your sales tax calculation, filing, and remittance. Built for growing ecommerce brands.",
    price: "From $75/filing",
    bestFor: "SMB ecommerce (1\u20135 nexus states)",
    features: ["Automated calculations", "Filing included", "Registration support"],
    url: buildAffiliateUrl("https://trykintsugi.com"),
    recommended: true,
  },
  {
    id: "avalara",
    name: "Avalara",
    tagline: "Enterprise tax compliance",
    description: "Multi-state sales tax compliance with broad integration support for complex business scenarios.",
    price: "From ~$200/mo",
    bestFor: "Multi-state sellers (5+ states)",
    features: ["Extensive integrations", "Real-time calculation", "Filing available", "Enterprise support"],
    url: buildAffiliateUrl("https://www.avalara.com"),
  },
  {
    id: "zamp",
    name: "Zamp",
    tagline: "Managed sales tax service",
    description: "Hands-off compliance. Zamp handles registration, calculation, filing, and remittance.",
    price: "Custom (managed)",
    bestFor: "Sellers who want it fully managed",
    features: ["Fully managed service", "Registration handled", "Filing & remittance", "Dedicated support"],
    url: buildAffiliateUrl("https://zamp.com"),
  },
];

export function getRecommendation(nexusCount: number): AffiliatePartner {
  if (nexusCount >= 8) return AFFILIATE_PARTNERS.find(p => p.id === "zamp")!;
  if (nexusCount >= 4) return AFFILIATE_PARTNERS.find(p => p.id === "avalara")!;
  return AFFILIATE_PARTNERS.find(p => p.id === "kintsugi")!;
}
