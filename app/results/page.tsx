"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { BulkNexusResult } from "@/lib/nexus/types";
import { AFFILIATE_PARTNERS, getRecommendation } from "@/lib/affiliates";
import { events } from "@/lib/analytics";
import LeadCaptureForm from "@/components/LeadCaptureForm";

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<BulkNexusResult | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const affiliateRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const leadFormRef = useRef<HTMLDivElement>(null);

  const handlePartnerClick = (partnerName: string) => {
    setSelectedPartner(partnerName);
    events.affiliateCardClick(partnerName);
    setTimeout(() => {
      leadFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("nexusResults");
    const rev = sessionStorage.getItem("nexusTotalRevenue");
    if (!stored) {
      router.push("/calculator");
      return;
    }
    const parsed = JSON.parse(stored) as BulkNexusResult;
    setResults(parsed);
    setTotalRevenue(parseFloat(rev || "0"));
    events.resultsViewed(parsed.summary.totalNexusStates);
  }, [router]);

  useEffect(() => {
    if (!affiliateRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { events.affiliateSectionVisible(); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(affiliateRef.current);
    return () => obs.disconnect();
  }, [results]);

  useEffect(() => {
    if (!comparisonRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { events.comparisonTableViewed(); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(comparisonRef.current);
    return () => obs.disconnect();
  }, [results]);

  if (!results) {
    return (
      <>
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center">
          <div className="text-brand-muted">Loading results...</div>
        </main>
      </>
    );
  }

  const { nexusStates, nonNexusStates, summary } = results;
  const nexusCount = summary.totalNexusStates;
  const recommendation = getRecommendation(nexusCount);

  const revenueRange =
    totalRevenue < 100000 ? "Under $100k" :
    totalRevenue < 500000 ? "$100k\u2013$500k" :
    totalRevenue < 1000000 ? "$500k\u2013$1M" : "Over $1M";

  const severityBg =
    nexusCount === 0 ? "bg-emerald-50 border-emerald-200" :
    nexusCount <= 3 ? "bg-warning-50 border-warning-500/20" :
    "bg-danger-50 border-danger-500/20";
  const severityText =
    nexusCount === 0 ? "text-emerald-700" :
    nexusCount <= 3 ? "text-warning-700" :
    "text-danger-600";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Summary Banner */}
        <div className={`rounded-xl border p-6 sm:p-8 ${severityBg}`}>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className={`text-2xl font-semibold sm:text-3xl ${severityText}`}>
                {nexusCount === 0
                  ? "You\u2019re in the Clear"
                  : `You Have Nexus in ${nexusCount} State${nexusCount > 1 ? "s" : ""}`}
              </h1>
              <p className="mt-1 text-primary-500">
                {nexusCount === 0
                  ? "Based on your input, you don\u2019t currently meet economic nexus thresholds in any state."
                  : `You may be required to register, collect, and remit sales tax in ${nexusCount > 1 ? "these states" : "this state"}.`}
              </p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-semibold ${severityText}`}>
                {nexusCount}
              </div>
              <div className="text-xs font-medium text-brand-muted">states</div>
            </div>
          </div>
        </div>

        {/* Nexus States */}
        {nexusCount > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-brand-dark">
              States Where You Have Nexus
            </h2>
            <div className="space-y-3">
              {nexusStates.map((state) => (
                <div
                  key={state.abbreviation}
                  className="flex items-center justify-between rounded-lg border border-brand-muted/30 bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-danger-50 font-mono text-sm font-medium text-danger-600">
                      {state.abbreviation}
                    </div>
                    <div>
                      <div className="font-medium text-brand-dark">{state.state}</div>
                      <div className="text-xs text-brand-muted">
                        {state.nexusType === "economic" ? "Economic nexus" :
                         state.nexusType === "physical" ? "Physical nexus" : "Economic + Physical nexus"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm text-primary-500">
                      Threshold: ${state.salesThreshold.toLocaleString()}
                      {state.transactionThreshold && (
                        <span className="text-brand-muted"> {state.thresholdLogic} {state.transactionThreshold} txns</span>
                      )}
                    </div>
                    <div className="text-xs text-brand-muted">
                      {state.lookbackPeriod === "calendar_year" ? "Calendar year" : "Rolling 12 months"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendation */}
        {nexusCount > 0 && (
          <section ref={affiliateRef} className="mt-10">
            <div className="rounded-xl border border-brand-muted/30 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-brand-dark">
                What to Do Next
              </h2>
              <p className="mt-2 text-sm text-primary-500">
                {nexusCount <= 3
                  ? "With nexus in a few states, automated compliance software can handle calculation and filing efficiently."
                  : nexusCount <= 7
                  ? `With nexus in ${nexusCount} states, multi-state automation helps you stay compliant without overwhelming your team.`
                  : `With nexus in ${nexusCount} states, a fully managed service will save the most time and reduce compliance risk.`}
              </p>
              <div className="mt-6 rounded-lg border border-brand-muted/20 bg-brand-bg p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded-md bg-primary-100 px-2 py-0.5 text-xs font-medium text-brand-dark">
                      Suggested
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-brand-dark">{recommendation.name}</h3>
                    <p className="mt-1 text-sm text-primary-500">{recommendation.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {recommendation.features.map((f) => (
                        <span key={f} className="rounded-full border border-brand-muted/30 px-3 py-1 text-xs font-medium text-primary-500">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <div className="text-sm font-medium text-brand-olive">{recommendation.price}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => handlePartnerClick(recommendation.name)}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-brand-dark transition hover:bg-accent-dark"
                  >
                    Get Connected with {recommendation.name}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Lead Capture Form */}
        {nexusCount > 0 && (
          <section ref={leadFormRef} className="mt-10">
            <LeadCaptureForm
              nexusCount={nexusCount}
              revenueRange={revenueRange}
              recommendedPartner={recommendation.name}
              selectedPartner={selectedPartner}
            />
          </section>
        )}

        {/* Comparison Table */}
        {nexusCount > 0 && (
          <section ref={comparisonRef} className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-brand-dark">
              Compare Solutions
            </h2>
            <div className="overflow-x-auto rounded-xl border border-brand-muted/30 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-muted/30">
                    <th className="p-4 text-left font-medium text-brand-dark">Feature</th>
                    {AFFILIATE_PARTNERS.map((p) => (
                      <th key={p.id} className="p-4 text-center font-medium text-brand-dark">
                        {p.name}
                        {p.id === recommendation.id && (
                          <span className="ml-1 inline-block rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-medium text-brand-dark">
                            Suggested
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-muted/20">
                  {[
                    { label: "Auto-calculation", values: ["Yes", "Yes", "Yes"] },
                    { label: "Auto-filing", values: ["Included", "Add-on", "Included (managed)"] },
                    { label: "Registration help", values: ["Included", "Add-on", "Included"] },
                    { label: "Best for", values: ["SMB, fast setup", "5+ states, enterprise", "Hands-off sellers"] },
                    { label: "Pricing", values: AFFILIATE_PARTNERS.map(p => p.price) },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="p-4 font-medium text-brand-dark">{row.label}</td>
                      {row.values.map((v, i) => (
                        <td key={i} className="p-4 text-center text-primary-500">{v}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-4"></td>
                    {AFFILIATE_PARTNERS.map((p) => (
                      <td key={p.id} className="p-4 text-center">
                        <button
                          onClick={() => handlePartnerClick(p.name)}
                          className={`inline-block rounded-lg px-4 py-2 text-sm font-medium transition ${
                            p.id === recommendation.id
                              ? "bg-accent text-brand-dark hover:bg-accent-dark"
                              : "border border-brand-muted/30 text-brand-dark hover:border-brand-olive hover:bg-primary-50"
                          }`}
                        >
                          Get Connected
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Safe States */}
        {nonNexusStates.length > 0 && (
          <section className="mt-10">
            <details className="group">
              <summary className="flex cursor-pointer items-center gap-2 text-lg font-medium text-brand-dark">
                <svg className="h-5 w-5 transition group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                States Where You&apos;re Below Threshold ({nonNexusStates.filter(s => s.hasSalesTax).length})
              </summary>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {nonNexusStates
                  .filter((s) => s.hasSalesTax)
                  .map((state) => (
                    <div
                      key={state.abbreviation}
                      className="rounded-md border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-center"
                    >
                      <span className="font-mono text-sm font-medium text-emerald-700">{state.abbreviation}</span>
                      <span className="ml-1.5 text-xs text-primary-500">{state.state}</span>
                    </div>
                  ))}
              </div>
            </details>
          </section>
        )}

        {/* Check Again */}
        <div className="mt-12 text-center">
          <Link
            href="/calculator"
            className="text-sm font-medium text-brand-olive transition hover:text-brand-dark"
          >
            &larr; Run another check
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
