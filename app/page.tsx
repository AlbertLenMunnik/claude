import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="mb-5 text-sm font-medium tracking-wide text-primary-500 uppercase">
              Free. No signup required.
            </p>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-brand-dark sm:text-5xl">
              Do You Owe Sales Tax in States You Don&apos;t Know About?
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-500">
              Since the 2018 Wayfair ruling, online sellers can owe sales tax in states where they have zero physical presence. Check your exposure across all 50 states in 30 seconds.
            </p>

            <div className="mt-10">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 text-base font-medium text-brand-dark transition hover:bg-accent-dark"
              >
                Check My Nexus Exposure
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-brand-muted">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Your data never leaves your browser
              </span>
              <span className="hidden sm:inline text-brand-muted/40">|</span>
              <span className="hidden sm:inline">Takes 30 seconds</span>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-t border-brand-muted/30 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-semibold text-brand-dark sm:text-3xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-primary-500">
              Three steps to understand your sales tax obligations.
            </p>

            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Enter Your Sales Data",
                  desc: "Input your annual revenue and number of transactions for each state where you sell.",
                },
                {
                  step: "02",
                  title: "We Check Every State",
                  desc: "Your data is compared against each state\u2019s economic nexus thresholds from the Wayfair decision.",
                },
                {
                  step: "03",
                  title: "Get Your Results",
                  desc: "See exactly which states you have nexus in, and get guidance on becoming compliant.",
                },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border border-brand-muted/30 bg-white p-8">
                  <div className="mb-4 text-xs font-medium tracking-widest text-brand-olive uppercase">
                    Step {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-brand-dark">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-t border-brand-muted/30 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-4">
              {[
                { value: "50", label: "States + DC covered" },
                { value: "30s", label: "Average check time" },
                { value: "100%", label: "Client-side privacy" },
                { value: "Free", label: "No signup required" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-semibold text-brand-dark">{stat.value}</div>
                  <div className="mt-1 text-sm text-brand-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-brand-muted/30 bg-brand-dark py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-semibold text-primary-50 sm:text-3xl">
              Don&apos;t Wait for a Penalty Notice
            </h2>
            <p className="mt-4 text-base text-primary-300">
              Find out where you have sales tax obligations before it becomes a problem.
            </p>
            <Link
              href="/calculator"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 text-base font-medium text-brand-dark transition hover:bg-accent-dark"
            >
              Check My Nexus Exposure
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
