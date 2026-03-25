"use client";

import { useState } from "react";
import Link from "next/link";

const FEATURES_FREE = [
  "3 infographics per month",
  "Standard PDF export",
  "5 AI-extracted insights",
  "Basic illustration styles",
  "Email support",
];

const FEATURES_PRO = [
  "Unlimited infographics",
  "High-res PDF + PNG export",
  "5 AI-extracted insights",
  "Premium illustration styles",
  "Custom brand colours",
  "Priority processing",
  "Priority email support",
];

const FEATURES_ENTERPRISE = [
  "Everything in Pro",
  "Custom volume limits",
  "SSO / SAML login",
  "Dedicated account manager",
  "SLA guarantee",
  "Custom integrations",
  "Invoice billing",
];

const COMPARISON_ROWS = [
  { feature: "Infographics per month", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "AI insights per infographic", free: "5", pro: "5", enterprise: "5" },
  { feature: "PDF export", free: "✓", pro: "✓", enterprise: "✓" },
  { feature: "PNG export", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "High-resolution output", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "Premium illustration styles", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "Custom brand colours", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "Priority processing", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "SSO / SAML", free: "—", pro: "—", enterprise: "✓" },
  { feature: "Dedicated account manager", free: "—", pro: "—", enterprise: "✓" },
  { feature: "Custom integrations", free: "—", pro: "—", enterprise: "✓" },
  { feature: "SLA guarantee", free: "—", pro: "—", enterprise: "✓" },
];

const FAQS = [
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes. You can cancel at any time from your account settings. Your plan remains active until the end of the current billing period and you won't be charged again.",
  },
  {
    q: "What happens to my infographics if I downgrade?",
    a: "All previously generated infographics are retained. You'll simply be limited to the new plan's monthly quota going forward.",
  },
  {
    q: "Is there a free trial for the Pro plan?",
    a: "The Free plan lets you try the core experience with up to 3 infographics per month — no credit card required. Upgrade to Pro whenever you're ready.",
  },
  {
    q: "What counts as one infographic?",
    a: "Each URL you submit counts as one infographic, regardless of how many times you download the resulting PDF.",
  },
  {
    q: "Do you offer academic or non-profit discounts?",
    a: "Yes — reach out at the Enterprise contact link and we'll work out a custom arrangement.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept all major credit and debit cards. Enterprise customers may also pay by invoice.",
  },
];

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 text-accent"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TableCheck({ value }: { value: string }) {
  if (value === "✓") {
    return (
      <span className="flex justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    );
  }
  if (value === "—") {
    return <span className="block text-center text-text-muted/40">—</span>;
  }
  return <span className="block text-center text-sm text-foreground/80">{value}</span>;
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const proMonthly = 12;
  const proAnnual = 8;
  const proPrice = annual ? proAnnual : proMonthly;
  const proBilled = annual ? `Billed $${proAnnual * 12}/yr` : "Billed monthly";

  return (
    <div className="noise-overlay min-h-screen flex flex-col">
      {/* Atmospheric background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/[0.07] blur-[120px] animate-glow-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-fuchsia-500/[0.05] blur-[100px] animate-glow-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-violet-500/[0.04] blur-[80px] animate-glow-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide text-foreground/70">
            infographic<span className="text-accent">gen</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium text-text-muted hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/signin" className="text-sm font-medium text-accent hover:text-accent-hot transition-colors">
            Sign in
          </Link>
          <Link href="/signup" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 transition-all">
            Sign up
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 px-6 pb-24">

        {/* Hero */}
        <div className="text-center pt-16 pb-12 max-w-2xl mx-auto animate-float-up">
          <h1
            className="text-5xl sm:text-6xl leading-[1.08] tracking-tight mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Simple,{" "}
            <span className="italic bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              transparent
            </span>
            <br />
            pricing
          </h1>
          <p className="text-text-muted text-lg leading-relaxed max-w-md mx-auto">
            Start free. Upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        {/* Billing toggle */}
        <div
          className="flex items-center justify-center gap-3 mb-14 animate-float-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className={`text-sm font-medium transition-colors ${!annual ? "text-foreground" : "text-text-muted"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
              annual ? "bg-gradient-to-r from-purple-600 to-fuchsia-600" : "bg-white/[0.1]"
            }`}
            aria-label="Toggle annual billing"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                annual ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${annual ? "text-foreground" : "text-text-muted"}`}>
            Annual
          </span>
          {annual && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              Save 33 %
            </span>
          )}
        </div>

        {/* Pricing cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-float-up"
          style={{ animationDelay: "0.2s" }}
        >

          {/* Free */}
          <div className="relative rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-xl p-8 shadow-2xl shadow-purple-950/20 flex flex-col">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
            <div className="relative flex-1 flex flex-col">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/[0.06] text-text-muted border border-white/[0.06] mb-4">
                  Free
                </span>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-bold text-foreground tracking-tight">$0</span>
                  <span className="text-text-muted text-sm">/mo</span>
                </div>
                <p className="text-text-muted text-sm">Forever free — no credit card needed.</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {FEATURES_FREE.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="block text-center px-6 py-3 rounded-xl text-sm font-semibold text-foreground/80 border border-white/[0.08] hover:border-white/[0.18] hover:text-foreground transition-all"
              >
                Get started free
              </Link>
            </div>
          </div>

          {/* Pro — most popular */}
          <div className="relative rounded-2xl border border-fuchsia-500/30 bg-surface/80 backdrop-blur-xl p-8 shadow-2xl shadow-fuchsia-950/30 flex flex-col">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-fuchsia-500/[0.06] to-transparent pointer-events-none" />
            {/* Most popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/40 whitespace-nowrap">
                Most popular
              </span>
            </div>
            <div className="relative flex-1 flex flex-col">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 mb-4">
                  Pro
                </span>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-bold text-foreground tracking-tight">${proPrice}</span>
                  <span className="text-text-muted text-sm">/mo</span>
                </div>
                <p className="text-text-muted text-sm">{proBilled}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {FEATURES_PRO.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="block text-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-[0.97]"
              >
                Start Pro
              </Link>
            </div>
          </div>

          {/* Enterprise */}
          <div className="relative rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-xl p-8 shadow-2xl shadow-purple-950/20 flex flex-col">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
            <div className="relative flex-1 flex flex-col">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/[0.06] text-text-muted border border-white/[0.06] mb-4">
                  Enterprise
                </span>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-bold text-foreground tracking-tight">Custom</span>
                </div>
                <p className="text-text-muted text-sm">Tailored to your team&apos;s needs.</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {FEATURES_ENTERPRISE.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="block text-center px-6 py-3 rounded-xl text-sm font-semibold text-foreground/80 border border-white/[0.08] hover:border-white/[0.18] hover:text-foreground transition-all"
              >
                Contact sales
              </a>
            </div>
          </div>

        </div>

        {/* Feature comparison table */}
        <div
          className="max-w-5xl mx-auto mt-24 animate-float-up"
          style={{ animationDelay: "0.3s" }}
        >
          <h2
            className="text-3xl sm:text-4xl text-center tracking-tight mb-10"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Full feature{" "}
            <span className="italic bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              comparison
            </span>
          </h2>

          <div className="relative rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-xl shadow-2xl shadow-purple-950/20 overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
            <table className="relative w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-6 py-4 text-text-muted font-medium">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-foreground/70">Free</th>
                  <th className="px-6 py-4 text-center font-semibold text-fuchsia-300">Pro</th>
                  <th className="px-6 py-4 text-center font-semibold text-foreground/70">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-white/[0.04] last:border-0 ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}
                  >
                    <td className="px-6 py-3.5 text-foreground/80">{row.feature}</td>
                    <td className="px-6 py-3.5"><TableCheck value={row.free} /></td>
                    <td className="px-6 py-3.5"><TableCheck value={row.pro} /></td>
                    <td className="px-6 py-3.5"><TableCheck value={row.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div
          id="contact"
          className="max-w-2xl mx-auto mt-24 animate-float-up"
          style={{ animationDelay: "0.35s" }}
        >
          <h2
            className="text-3xl sm:text-4xl text-center tracking-tight mb-10"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Frequently asked{" "}
            <span className="italic bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              questions
            </span>
          </h2>

          <div className="space-y-3">
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="relative rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-xl overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="relative w-full flex items-center justify-between px-6 py-5 text-left gap-4 cursor-pointer"
                  >
                    <span className="text-sm font-medium text-foreground/90">{item.q}</span>
                    <span className={`flex-shrink-0 text-text-muted transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`relative overflow-hidden transition-all duration-300 ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <p className="px-6 pb-5 text-sm text-text-muted leading-relaxed">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <p className="text-text-muted text-sm mb-4">Still have questions? We&apos;re happy to help.</p>
            <a
              href="mailto:hello@infographicgen.ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-foreground/80 border border-white/[0.08] hover:border-white/[0.18] hover:text-foreground transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              hello@infographicgen.ai
            </a>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-6">
        <p className="text-xs text-text-muted/40">
          Powered by Claude &middot; Kie.ai &middot; Puppeteer
        </p>
      </footer>
    </div>
  );
}
