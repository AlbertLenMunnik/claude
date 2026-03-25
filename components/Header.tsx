import Link from "next/link";

function Logo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="140" height="32" viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="roundedSquare">
          <rect x="10" y="20" width="80" height="80" rx="14" ry="14" />
        </clipPath>
      </defs>
      <rect x="10" y="20" width="80" height="80" rx="14" ry="14" fill="#3F4426" />
      <g clipPath="url(#roundedSquare)">
        <rect x="54" y="20" width="36" height="80" fill="#BFD85A" />
      </g>
      <path d="M30 61 L46 76 L74 47" fill="none" stroke="#F4F5F0" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <text x="110" y="73" fontFamily="Inter, Arial, sans-serif" fontSize="36" fontWeight="500" fill="#2C2F1F">NexusCheck</text>
    </svg>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-muted/40 bg-brand-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          <Link href="/#how-it-works" className="text-sm font-medium text-primary-700 transition hover:text-brand-dark">
            How It Works
          </Link>
          <Link
            href="/calculator"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-brand-dark transition hover:bg-accent-dark"
          >
            Check Nexus
          </Link>
        </nav>

        <Link
          href="/calculator"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-brand-dark transition hover:bg-accent-dark sm:hidden"
        >
          Check Now
        </Link>
      </div>
    </header>
  );
}
