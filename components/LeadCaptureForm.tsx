"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface LeadCaptureFormProps {
  nexusCount: number;
  revenueRange: string;
  recommendedPartner: string;
  selectedPartner?: string | null;
}

export default function LeadCaptureForm({
  nexusCount, revenueRange, recommendedPartner, selectedPartner,
}: LeadCaptureFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    name: "",
    company: "",
    phone: "",
  });

  const effectivePartner = selectedPartner || recommendedPartner;

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          nexusStates: nexusCount,
          revenueRange,
          recommendedPartner: effectivePartner,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setSubmitted(true);
      trackEvent("lead_captured", { partner: effectivePartner, nexus_count: nexusCount });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-medium text-emerald-800">We&apos;ll be in touch shortly.</p>
        <p className="mt-1 text-sm text-emerald-600">
          A compliance specialist will reach out to help you get set up.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-brand-muted/30 bg-white p-6">
      <h3 className="text-lg font-semibold text-brand-dark">
        {selectedPartner
          ? `Get Connected with ${selectedPartner}`
          : "Want Help Getting Compliant?"}
      </h3>
      <p className="mt-1 text-sm text-primary-500">
        Leave your details and we&apos;ll connect you with the right solution for your business.
      </p>

      {selectedPartner && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-brand-muted/30 bg-primary-50 px-3 py-1.5 text-sm">
          <span className="text-primary-500">Interested in:</span>
          <span className="font-medium text-brand-dark">{selectedPartner}</span>
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-dark">
            Name <span className="text-danger-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Jane Smith"
            className="w-full rounded-lg border border-brand-muted/40 bg-brand-bg px-3 py-2.5 text-sm text-brand-text outline-none transition focus:border-brand-olive focus:ring-2 focus:ring-brand-olive/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-dark">
            Email <span className="text-danger-500">*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="jane@company.com"
            className="w-full rounded-lg border border-brand-muted/40 bg-brand-bg px-3 py-2.5 text-sm text-brand-text outline-none transition focus:border-brand-olive focus:ring-2 focus:ring-brand-olive/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-dark">
            Company
          </label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Acme Inc."
            className="w-full rounded-lg border border-brand-muted/40 bg-brand-bg px-3 py-2.5 text-sm text-brand-text outline-none transition focus:border-brand-olive focus:ring-2 focus:ring-brand-olive/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-dark">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full rounded-lg border border-brand-muted/40 bg-brand-bg px-3 py-2.5 text-sm text-brand-text outline-none transition focus:border-brand-olive focus:ring-2 focus:ring-brand-olive/20"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-danger-600">{error}</p>
      )}

      <div className="mt-5 flex items-center justify-between">
        <button
          type="submit"
          disabled={submitting || !form.email || !form.name}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-brand-dark transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-30"
        >
          {submitting ? "Submitting..." : "Get Connected"}
          {!submitting && (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          )}
        </button>
        <p className="text-xs text-brand-muted">No spam. We respect your privacy.</p>
      </div>
    </form>
  );
}
