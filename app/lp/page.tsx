"use client";

import { useState, useMemo } from "react";
import { US_STATES, NO_TAX_STATES } from "@/lib/nexus/types";
import { checkBulkNexus } from "@/lib/nexus/checker";
import { trackEvent, events } from "@/lib/analytics";
import { AFFILIATE_PARTNERS, getRecommendation } from "@/lib/affiliates";
import LeadCaptureForm from "@/components/LeadCaptureForm";

export default function LandingPage() {
  const [totalRevenue, setTotalRevenue] = useState("");
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<{
    nexusCount: number;
    revenueRange: string;
    recommendation: (typeof AFFILIATE_PARTNERS)[number];
  } | null>(null);

  const toggleState = (abbr: string) => {
    if (NO_TAX_STATES.has(abbr)) return;
    setSelectedStates((prev) => {
      const next = new Set(prev);
      if (next.has(abbr)) next.delete(abbr);
      else next.add(abbr);
      return next;
    });
  };

  const canSubmit = useMemo(
    () => totalRevenue && parseFloat(totalRevenue) > 0 && selectedStates.size > 0,
    [totalRevenue, selectedStates]
  );

  const handleCheck = () => {
    const rev = parseFloat(totalRevenue) || 0;
    const perState = rev / (selectedStates.size || 1);
    const salesByState: Record<string, { totalSales: number; totalTransactions: number }> = {};
    selectedStates.forEach((abbr) => {
      salesByState[abbr] = { totalSales: perState, totalTransactions: 200 };
    });

    const res = checkBulkNexus({ salesByState });
    const nexusCount = res.summary.totalNexusStates;

    trackEvent("calculator_completed", { nexus_count: nexusCount, revenue_range: rev < 100000 ? "under_100k" : rev < 500000 ? "100k_500k" : rev < 1000000 ? "500k_1m" : "over_1m" });

    const revenueRange =
      rev < 100000 ? "Under $100k" :
      rev < 500000 ? "$100k–$500k" :
      rev < 1000000 ? "$500k–$1M" : "Over $1M";

    setResults({
      nexusCount,
      revenueRange,
      recommendation: getRecommendation(nexusCount),
    });
  };

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Minimal header — no nav links */}
      <div className="border-b border-brand-muted/30 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-dark">
              <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-brand-dark">NexusCheck</span>
          </div>
          <span className="text-xs text-brand-muted">Free. No signup required.</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {!results ? (
          <>
            {/* Hero */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-semibold leading-tight text-brand-dark sm:text-4xl">
                Do You Owe Sales Tax in States You Don&apos;t Know About?
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base text-primary-500">
                Since the Wayfair ruling, online sellers can owe tax in states with zero physical presence. Check your exposure in 30 seconds — free.
              </p>
            </div>

            {/* Inline Calculator */}
            <div className="rounded-xl border border-brand-muted/30 bg-white p-6 sm:p-8">
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-brand-dark">
                    Total annual online revenue (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-brand-muted">$</span>
                    <input
                      type="number"
                      value={totalRevenue}
                      onChange={(e) => setTotalRevenue(e.target.value)}
                      placeholder="500,000"
                      className="w-full rounded-lg border border-brand-muted/40 bg-brand-bg py-3 pl-8 pr-4 font-mono text-lg text-brand-text outline-none transition focus:border-brand-olive focus:ring-2 focus:ring-brand-olive/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-brand-dark">
                    Where do you sell? ({selectedStates.size} selected)
                  </label>
                  <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-11">
                    {US_STATES.map(({ abbr }) => {
                      const isNoTax = NO_TAX_STATES.has(abbr);
                      const isSelected = selectedStates.has(abbr);
                      return (
                        <button
                          key={abbr}
                          onClick={() => toggleState(abbr)}
                          disabled={isNoTax}
                          className={`rounded-md border px-1 py-2 text-xs font-medium transition ${
                            isNoTax
                              ? "cursor-not-allowed border-brand-muted/20 bg-brand-bg text-brand-muted/60"
                              : isSelected
                              ? "border-brand-olive bg-primary-100 text-brand-dark"
                              : "border-brand-muted/30 bg-white text-primary-500 hover:border-brand-olive/40 hover:bg-primary-50"
                          }`}
                        >
                          {abbr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleCheck}
                  disabled={!canSubmit}
                  className="w-full rounded-lg bg-accent py-4 text-base font-medium text-brand-dark transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Check My Nexus Exposure →
                </button>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-brand-muted">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Data stays in your browser
              </span>
              <span>Takes 30 seconds</span>
              <span>All 50 states covered</span>
            </div>
          </>
        ) : (
          <>
            {/* Results */}
            <div className={`rounded-xl border p-6 sm:p-8 ${
              results.nexusCount === 0
                ? "border-emerald-200 bg-emerald-50"
                : results.nexusCount <= 3
                ? "border-warning-500/20 bg-warning-50"
                : "border-danger-500/20 bg-danger-50"
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-2xl font-semibold sm:text-3xl ${
                    results.nexusCount === 0 ? "text-emerald-700" :
                    results.nexusCount <= 3 ? "text-warning-700" : "text-danger-600"
                  }`}>
                    {results.nexusCount === 0
                      ? "You're in the Clear"
                      : `You Have Nexus in ${results.nexusCount} State${results.nexusCount > 1 ? "s" : ""}`}
                  </h2>
                  <p className="mt-1 text-primary-500">
                    {results.nexusCount === 0
                      ? "Based on your input, you don't currently trigger economic nexus thresholds."
                      : `You may need to register and collect sales tax in ${results.nexusCount > 1 ? "these states" : "this state"}. Non-compliance can result in penalties up to $50K per state.`}
                  </p>
                </div>
                <div className={`text-4xl font-semibold ${
                  results.nexusCount === 0 ? "text-emerald-700" :
                  results.nexusCount <= 3 ? "text-warning-700" : "text-danger-600"
                }`}>
                  {results.nexusCount}
                </div>
              </div>
            </div>

            {/* Lead Form — immediately visible */}
            {results.nexusCount > 0 && (
              <div className="mt-8">
                <LeadCaptureForm
                  nexusCount={results.nexusCount}
                  revenueRange={results.revenueRange}
                  recommendedPartner={results.recommendation.name}
                  selectedPartner={null}
                />
              </div>
            )}

            {/* Comparison Table */}
            {results.nexusCount > 0 && (
              <div className="mt-8 overflow-x-auto rounded-xl border border-brand-muted/30 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-muted/30">
                      <th className="p-4 text-left font-medium text-brand-dark">Feature</th>
                      {AFFILIATE_PARTNERS.map((p) => (
                        <th key={p.id} className="p-4 text-center font-medium text-brand-dark">
                          {p.name}
                          {p.id === results.recommendation.id && (
                            <span className="ml-1 inline-block rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-medium">
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
                      { label: "Pricing", values: AFFILIATE_PARTNERS.map(p => p.price) },
                    ].map((row) => (
                      <tr key={row.label}>
                        <td className="p-4 font-medium text-brand-dark">{row.label}</td>
                        {row.values.map((v, i) => (
                          <td key={i} className="p-4 text-center text-primary-500">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Run Again */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setResults(null)}
                className="text-sm font-medium text-brand-olive transition hover:text-brand-dark"
              >
                ← Run another check
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
