import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID!;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;

// Field IDs from the NexusCheck Leads table
const FIELDS = {
  email: "fld9z0Otpz5ooxP1e",
  name: "fldwg7KTQqVwhcKXw",
  company: "fldMLmBmhA5dJagdG",
  website: "fldSo9vo7RTLneHNa",
  phone: "fldILA4zpScKJEB9s",
  nexusStates: "fld3dTWigoDtrikxf",
  revenueRange: "fldMEgvAP2E7R7oAp",
  recommendedPartner: "fldGnR47T8NzSXViL",
  status: "fldam2Z9IiStSJQqi",
  submittedAt: "fld03S9Q7c8cfWdsF",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, company, website, phone, nexusStates, revenueRange, recommendedPartner } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    const fields: Record<string, unknown> = {
      [FIELDS.email]: email,
      [FIELDS.name]: name,
      [FIELDS.status]: "New",
      [FIELDS.submittedAt]: new Date().toISOString(),
    };

    if (company) fields[FIELDS.company] = company;
    if (website) fields[FIELDS.website] = website;
    if (phone) fields[FIELDS.phone] = phone;
    if (nexusStates) fields[FIELDS.nexusStates] = nexusStates;
    if (revenueRange) fields[FIELDS.revenueRange] = revenueRange;
    if (recommendedPartner) fields[FIELDS.recommendedPartner] = recommendedPartner;

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: [{ fields }] }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Airtable error:", err);
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Lead submission error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
