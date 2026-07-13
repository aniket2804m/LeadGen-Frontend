import React, { useState, useMemo } from "react";
import { Check } from "lucide-react";

type Billing = "monthly" | "yearly";

interface PlanFeature {
  text: string;
}

interface Plan {
  name: string;
  price: number | null; // null => "Free"
  tagline: string;
  cta: string;
  ctaStyle: "outline" | "filled";
  features: PlanFeature[];
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    price: null,
    tagline: "Test the full lead generation platform on real searches.",
    cta: "Start free",
    ctaStyle: "outline",
    features: [
      { text: "20 leads per month" },
      { text: "2 AI lead scores included" },
      { text: "1 demo websites" },
      { text: "10 outreach emails" },
      { text: "Basic dashboard" },
      { text: "Email support" },
    ],
  },
  {
    name: "PLUS+",
    price: 1999,
    tagline: "For freelancers and small agencies filling a real pipeline.",
    cta: "Get started",
    ctaStyle: "filled",
    highlighted: true,
    features: [
      { text: "200 leads per month" },
      { text: "50 personalized demo websites" },
      { text: "150 outreach emails per month" },
      { text: "Scout AI assistant" },
      { text: "AI scoring and qualification" },
      { text: "Priority support" },
    ],
  },
  {
    name: "Scale",
    price: null,
    tagline: "For teams running client acquisition at scale.",
    cta: "Get started",
    ctaStyle: "outline",
    features: [
      { text: "Unlimited leads" },
      { text: "Unlimited demo websites" },
      { text: "Unlimited outreach emails" },
      { text: "Scout AI assistant" },
      { text: "Team seats (up to 5)" },
      { text: "White-label branding" },
      { text: "API access" },
      { text: "Dedicated support" },
    ],
  },
];

function formatINR(value: number): string {
  return "\u20B9" + value.toLocaleString("en-IN");
}

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  // ROI calculator state
  const [leadsPerMonth, setLeadsPerMonth] = useState(500);
  const [closeRate, setCloseRate] = useState(5);
  const [avgDealValue, setAvgDealValue] = useState(25000);

  const { newClients, monthlyRevenue, roiMultiple } = useMemo(() => {
    const clients = Math.round((leadsPerMonth * closeRate) / 100);
    const revenue = clients * avgDealValue;
    const planCost = 1999;
    const multiple = planCost > 0 ? revenue / planCost : 0;
    return {
      newClients: clients,
      monthlyRevenue: revenue,
      roiMultiple: multiple,
    };
  }, [leadsPerMonth, closeRate, avgDealValue]);

  const monthlyPrice = 1999;
  const yearlyMonthlyEquivalent = Math.round((monthlyPrice * 10) / 12); // "2 months free"
  const displayPrice = billing === "monthly" ? monthlyPrice : yearlyMonthlyEquivalent;

  return (
    <div className="min-h-screen w-full bg-[#F6F4FB] px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7C5CFC]">
            Pricing
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight text-[#1A1A2E]">
            Simple pricing. No surprises.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-[#6B6B7B]">
            Every plan runs on the same AI lead generation software. Upgrade
            when your pipeline demands it, not before.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                billing === "monthly"
                  ? "bg-[#7C5CFC] text-white shadow-sm"
                  : "text-[#6B6B7B] hover:text-[#1A1A2E]"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                billing === "yearly"
                  ? "bg-[#7C5CFC] text-white shadow-sm"
                  : "text-[#6B6B7B] hover:text-[#1A1A2E]"
              }`}
            >
              Yearly
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  billing === "yearly"
                    ? "bg-white/20 text-white"
                    : "bg-green-100 text-green-600"
                }`}
              >
                2 months free
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl bg-white p-6 sm:p-7 ${
                plan.highlighted
                  ? "border-2 border-[#7C5CFC] shadow-xl md:-mt-4 md:mb-4"
                  : "border border-black/5 shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#7C5CFC] px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                  Most popular
                </span>
              )}

              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#1A1A2E]">
                {plan.name}
              </h3>

              <div className="mt-3 flex items-baseline gap-1">
                {plan.price !== null ? (
                  <>
                    <span className="text-3xl font-bold text-[#1A1A2E]">
                      {formatINR(plan.name === "PLUS+" ? displayPrice : plan.price)}
                    </span>
                    <span className="text-sm text-[#9B9BAA]">/month</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-[#1A1A2E]">
                    {plan.name === "Starter" ? "Free" : "Custom"}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-[#6B6B7B]">{plan.tagline}</p>

              <button
                type="button"
                className={`mt-6 w-full rounded-full py-2.5 text-sm font-semibold transition-colors ${
                  plan.ctaStyle === "filled"
                    ? "bg-[#7C5CFC] text-white hover:bg-[#6b47f5]"
                    : "border border-black/10 text-[#1A1A2E] hover:bg-[#F6F4FB]"
                }`}
              >
                {plan.cta}
              </button>

              <ul className="mt-6 flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li
                    key={f.text}
                    className="flex items-start gap-2 text-sm text-[#4B4B5A]"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#7C5CFC]"
                      strokeWidth={3}
                    />
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ROI Calculator */}
        <div className="mt-10 rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <h3 className="text-lg font-bold text-[#1A1A2E]">
                What could PurnovaLead return for you?
              </h3>
              <p className="mt-2 text-sm text-[#6B6B7B]">
                Drag the sliders to estimate the monthly revenue a steady,
                AI-qualified pipeline could add to your business.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <SliderRow
                label="Leads per month"
                value={leadsPerMonth}
                display={leadsPerMonth.toLocaleString("en-IN")}
                min={10}
                max={2000}
                step={10}
                onChange={setLeadsPerMonth}
              />
              <SliderRow
                label="Close rate"
                value={closeRate}
                display={`${closeRate}%`}
                min={1}
                max={30}
                step={1}
                onChange={setCloseRate}
              />
              <SliderRow
                label="Average deal value"
                value={avgDealValue}
                display={formatINR(avgDealValue)}
                min={1000}
                max={200000}
                step={1000}
                onChange={setAvgDealValue}
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-black/5 pt-6 sm:grid-cols-3">
            <Stat value={newClients.toLocaleString("en-IN")} label="new clients / month" />
            <Stat value={formatINR(monthlyRevenue)} label="estimated monthly revenue" />
            <Stat value={`${roiMultiple.toFixed(0)}x`} label="return vs Pro plan cost" />
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[#9B9BAA]">
          Prices exclude applicable taxes. Cancel anytime, no lock-in. ROI figures are illustrative estimates.
        </p>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-[#4B4B5A]">{label}</span>
        <span className="font-semibold text-[#1A1A2E]">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#EDE9FE] accent-[#7C5CFC]"
      />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="text-2xl sm:text-3xl font-bold text-[#7C5CFC]">{value}</div>
      <div className="mt-1 text-xs text-[#9B9BAA]">{label}</div>
    </div>
  );
}