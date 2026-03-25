"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { US_STATES, NO_TAX_STATES } from "@/lib/nexus/types";
import { NEXUS_THRESHOLDS } from "@/lib/nexus/thresholds";
import { checkBulkNexus } from "@/lib/nexus/checker";
import { events } from "@/lib/analytics";

type Mode = "quick" | "detailed";

interface StateData {
  sales: string;
  transactions: string;
}

export default function CalculatorPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("quick");
  const [totalRevenue, setTotalRevenue] = useState("");
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set());
  const [stateData, setStateData] = useState<Record<string, StateData>>({});
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  useEffect(() => {
    if (!hasTrackedStart) {
      events.calculatorStarted();
      setHasTrackedStart(true);
    }
  }, [hasTrackedStart]);

  const toggleState = (abbr: string) => {
    if (NO_TAX_STATES.has(abbr)) return;
    setSelectedStates((prev) => {
      const next = new Set(prev);
      if (next.has(abbr)) next.delete(abbr);
      else next.add(abbr);
      return next;
    });
  };

  const updateStateData = (abbr: string, field: keyof StateData, value: string) => {
    setStateData((prev) => ({
      ...prev,
      [abbr]: { ...prev[abbr], [field]: value },
    }));
  };

  const canSubmit = useMemo(() => {
    if (mode === "quick") {
      return totalRevenue && parseFloat(totalRevenue) > 0 && selectedStates.size > 0;
    }
    return Object.values(stateData).some((d) => parseFloat(d.sales || "0") > 0);
  }, [mode, totalRevenue, selectedStates, stateData]);

  const handleSubmit = () => {
    let salesByState: Record<string, { totalSales: number; totalTransactions: number }> = {};

    if (mode === "quick") {
      const rev = parseFloat(totalRevenue) || 0;
      const perState = rev / (selectedStates.size || 1);
      selectedStates.forEach((abbr) => {
        salesByState[abbr] = { totalSales: perState, totalTransactions: 200 };
      });
    } else {
      Object.entries(stateData).forEach(([abbr, data]) => {
        const sales = parseFloat(data.sales || "0");
        if (sales > 0) {
          salesByState[abbr] = {
            totalSales: sales,
            totalTransactions: parseInt(data.transactions || "0", 10),
          };
        }
      });
    }

    const results = checkBulkNexus({ salesByState });
    const totalRev = Object.values(salesByState).reduce((sum, s) => sum + s.totalSales, 0);
    events.calculatorCompleted(results.summary.totalNexusStates, totalRev);

    sessionStorage.setItem("nexusResults", JSON.stringify(results));
    sessionStorage.setItem("nexusTotalRevenue", String(totalRev));
    router.push("/results");
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-brand-dark sm:text-4xl">
            Check Your Nexus Exposure
          </h1>
          <p className="mt-2 text-primary-500">
            Enter your sales data and we&apos;ll check each state&apos;s economic nexus thresholds.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mx-auto mb-8 flex max-w-md overflow-hidden rounded-lg border border-brand-muted/40 bg-white p-1">
          <button
            onClick={() => setMode("quick")}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition ${
              mode === "quick"
                ? "bg-brand-dark text-primary-50"
                : "text-primary-500 hover:text-brand-dark"
            }`}
          >
            Quick Estimate
          </button>
          <button
            onClick={() => setMode("detailed")}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition ${
              mode === "detailed"
                ? "bg-brand-dark text-primary-50"
                : "text-primary-500 hover:text-brand-dark"
            }`}
          >
            Detailed Entry
          </button>
        </div>

        <div className="rounded-xl border border-brand-muted/30 bg-white p-6 sm:p-8">
          {mode === "quick" ? (
            <QuickMode
              totalRevenue={totalRevenue}
              setTotalRevenue={setTotalRevenue}
              selectedStates={selectedStates}
              toggleState={toggleState}
            />
          ) : (
            <DetailedMode stateData={stateData} updateStateData={updateStateData} />
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 text-base font-medium text-brand-dark transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-30"
            >
              Check My Nexus Exposure
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-brand-muted">
          All calculations happen in your browser. Nothing is sent to a server.
        </p>
      </main>
    </>
  );
}

function QuickMode({
  totalRevenue,
  setTotalRevenue,
  selectedStates,
  toggleState,
}: {
  totalRevenue: string;
  setTotalRevenue: (v: string) => void;
  selectedStates: Set<string>;
  toggleState: (abbr: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <label className="mb-2 block text-sm font-medium text-brand-dark">
          Total annual online revenue (USD)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted font-mono">$</span>
          <input
            type="number"
            value={totalRevenue}
            onChange={(e) => setTotalRevenue(e.target.value)}
            placeholder="500,000"
            className="w-full rounded-lg border border-brand-muted/40 bg-brand-bg py-3 pl-8 pr-4 font-mono text-lg text-brand-text outline-none transition focus:border-brand-olive focus:ring-2 focus:ring-brand-olive/20"
          />
        </div>
        <p className="mt-1.5 text-xs text-brand-muted">
          We&apos;ll estimate an even distribution across the states you select below.
        </p>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-brand-dark">
          Select states where you sell ({selectedStates.size} selected)
        </label>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-9 md:grid-cols-11">
          {US_STATES.map(({ abbr }) => {
            const isNoTax = NO_TAX_STATES.has(abbr);
            const isSelected = selectedStates.has(abbr);
            return (
              <button
                key={abbr}
                onClick={() => toggleState(abbr)}
                disabled={isNoTax}
                className={`rounded-md border px-2 py-2 text-xs font-medium transition ${
                  isNoTax
                    ? "cursor-not-allowed border-brand-muted/20 bg-brand-bg text-brand-muted/60"
                    : isSelected
                    ? "border-brand-olive bg-primary-100 text-brand-dark"
                    : "border-brand-muted/30 bg-white text-primary-500 hover:border-brand-olive/40 hover:bg-primary-50"
                }`}
                title={isNoTax ? `${abbr} has no sales tax` : undefined}
              >
                {abbr}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-brand-muted">
          Greyed out states have no sales tax (AK, DE, MT, NH, OR)
        </p>
      </div>
    </div>
  );
}

function DetailedMode({
  stateData,
  updateStateData,
}: {
  stateData: Record<string, StateData>;
  updateStateData: (abbr: string, field: keyof StateData, value: string) => void;
}) {
  const taxableStates = US_STATES.filter(({ abbr }) => !NO_TAX_STATES.has(abbr));

  return (
    <div>
      <p className="mb-4 text-sm text-primary-500">
        Enter your annual sales and transaction count for each state where you have customers.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-muted/30 text-left">
              <th className="pb-3 pr-4 font-medium text-brand-dark">State</th>
              <th className="pb-3 pr-4 font-medium text-brand-dark">Annual Sales ($)</th>
              <th className="pb-3 pr-4 font-medium text-brand-dark">Transactions</th>
              <th className="pb-3 font-medium text-brand-dark">Threshold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-muted/20">
            {taxableStates.map(({ abbr, name }) => {
              const threshold = NEXUS_THRESHOLDS[abbr];
              return (
                <tr key={abbr}>
                  <td className="py-2.5 pr-4">
                    <span className="font-medium text-brand-dark">{abbr}</span>{" "}
                    <span className="text-primary-500">{name}</span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <input
                      type="number"
                      value={stateData[abbr]?.sales || ""}
                      onChange={(e) => updateStateData(abbr, "sales", e.target.value)}
                      placeholder="0"
                      className="w-28 rounded-md border border-brand-muted/40 bg-brand-bg px-3 py-1.5 font-mono text-sm outline-none transition focus:border-brand-olive focus:ring-1 focus:ring-brand-olive/20"
                    />
                  </td>
                  <td className="py-2.5 pr-4">
                    <input
                      type="number"
                      value={stateData[abbr]?.transactions || ""}
                      onChange={(e) => updateStateData(abbr, "transactions", e.target.value)}
                      placeholder="0"
                      className="w-20 rounded-md border border-brand-muted/40 bg-brand-bg px-3 py-1.5 font-mono text-sm outline-none transition focus:border-brand-olive focus:ring-1 focus:ring-brand-olive/20"
                    />
                  </td>
                  <td className="py-2.5 font-mono text-xs text-brand-muted">
                    ${threshold.salesThreshold.toLocaleString()}
                    {threshold.transactionThreshold && ` ${threshold.thresholdLogic} ${threshold.transactionThreshold} txns`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
