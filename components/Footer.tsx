export default function Footer() {
  return (
    <footer className="border-t border-brand-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <svg width="120" height="28" viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="footerRoundedSquare">
                <rect x="10" y="20" width="80" height="80" rx="14" ry="14" />
              </clipPath>
            </defs>
            <rect x="10" y="20" width="80" height="80" rx="14" ry="14" fill="#3F4426" />
            <g clipPath="url(#footerRoundedSquare)">
              <rect x="54" y="20" width="36" height="80" fill="#BFD85A" />
            </g>
            <path d="M30 61 L46 76 L74 47" fill="none" stroke="#F4F5F0" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <text x="110" y="73" fontFamily="Inter, Arial, sans-serif" fontSize="36" fontWeight="500" fill="#2C2F1F">NexusCheck</text>
          </svg>
          <p className="max-w-md text-sm text-primary-500">
            Free sales tax nexus calculator for ecommerce sellers. Based on economic nexus thresholds established by the 2018 South Dakota v. Wayfair ruling.
          </p>
          <div className="flex gap-6 text-xs text-brand-muted">
            <span>Updated Q1 2025</span>
            <span>All calculations are estimates</span>
          </div>
          <p className="text-xs text-brand-muted">
            This tool provides estimates only and does not constitute tax, legal, or financial advice. Recommendations are informational — we do not warrant any third-party service. Always consult a qualified tax professional.
          </p>
        </div>
      </div>
    </footer>
  );
}
