"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

type Plan = {
  key: string;
  name: string;
  priceUSD: number;
  pricePHP: number;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  highlight: boolean;
};

const DEFAULT_PLANS: Plan[] = [
  {
    key: "FREE", name: "Free",
    priceUSD: 0, pricePHP: 0,
    desc: "Perfect for trying out Aurex.",
    features: ["1 AI Agent", "30 conversations/mo", "Web widget", "Email support"],
    cta: "Get Started Free", href: "/register", highlight: false,
  },
  {
    key: "STARTER", name: "Starter",
    priceUSD: 29, pricePHP: 1650,
    desc: "For small businesses getting started.",
    features: ["3 AI Agents", "500 conversations/mo", "All channels", "Priority support", "Analytics"],
    cta: "Start Free Trial", href: "/register?plan=STARTER", highlight: false,
  },
  {
    key: "PRO", name: "Pro",
    priceUSD: 99, pricePHP: 5600,
    desc: "For growing businesses that need more.",
    features: ["10 AI Agents", "5,000 conversations/mo", "All channels", "Custom prompts", "Webhooks", "API access"],
    cta: "Start Free Trial", href: "/register?plan=PRO", highlight: true,
  },
  {
    key: "AGENCY", name: "Agency",
    priceUSD: 299, pricePHP: 16800,
    desc: "For agencies managing multiple clients.",
    features: ["Unlimited agents", "Unlimited conversations", "White-label", "Dedicated support", "Custom integrations"],
    cta: "Contact Sales", href: "/register?plan=AGENCY", highlight: false,
  },
];

export default function Pricing() {
  const [currency, setCurrency] = useState<"USD" | "PHP">("USD");
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setPlans(data); })
      .catch(() => {});
  }, []);

  return (
    <section id="pricing" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-[0.3em] mb-4">Pricing</p>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1] tracking-tighter">
              Start free.<br />
              <span className="gradient-text">Scale as you grow.</span>
            </h2>
          </div>
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1 self-start md:self-auto">
            {(["USD", "PHP"] as const).map((c) => (
              <button key={c} onClick={() => setCurrency(c)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currency === c ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}>
                {c === "USD" ? "🇺🇸 USD" : "🇵🇭 PHP"}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div key={plan.key}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 ${
                plan.highlight
                  ? "bg-[#0a0a0a] text-white shadow-2xl shadow-black/20 scale-[1.02]"
                  : "bg-[#faf8f3] border border-[#e8c97a]/20 hover:border-[#c9a84c]/40"
              }`}>

              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0a] text-xs font-bold px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`font-bold text-lg mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs mb-6 ${plan.highlight ? "text-white/40" : "text-gray-400"}`}>
                  {plan.desc}
                </p>
                <div className="flex items-end gap-1">
                  <span className={`text-5xl font-black tracking-tighter ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                    {currency === "USD" ? `$${plan.priceUSD}` : `₱${plan.pricePHP.toLocaleString()}`}
                  </span>
                  <span className={`text-sm mb-2 ${plan.highlight ? "text-white/30" : "text-gray-400"}`}>/mo</span>
                </div>
                {plan.priceUSD > 0 && (
                  <p className={`text-xs mt-1 ${plan.highlight ? "text-white/20" : "text-gray-300"}`}>
                    {currency === "USD" ? `≈ ₱${plan.pricePHP.toLocaleString()}` : `≈ $${plan.priceUSD}`}
                  </p>
                )}
              </div>

              <div className={`h-px mb-6 ${plan.highlight ? "bg-white/10" : "bg-[#e8c97a]/30"}`} />

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      plan.highlight ? "bg-[#c9a84c]/20" : "bg-[#c9a84c]/10"
                    }`}>
                      <Check className="w-2.5 h-2.5 text-[#c9a84c]" />
                    </div>
                    <span className={`text-sm ${plan.highlight ? "text-white/70" : "text-gray-600"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}
                className={`w-full text-center font-bold py-3.5 rounded-xl transition-all text-sm block ${
                  plan.highlight
                    ? "bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0a] hover:opacity-90"
                    : plan.key === "FREE"
                    ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    : "bg-[#0a0a0a] text-white hover:bg-gray-800"
                }`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-300 mb-4">🇵🇭 Philippine users — pay via GCash, Maya, cards, and bank transfer</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["💳 Visa / Mastercard", "📱 GCash", "🟢 Maya", "🏦 Bank Transfer", "🏪 Over-the-Counter"].map((m) => (
              <span key={m} className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
