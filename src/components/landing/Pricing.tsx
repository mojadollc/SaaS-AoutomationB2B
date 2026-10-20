"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    priceUSD: 0, pricePHP: 0,
    agents: 1, convos: 50,
    features: ["1 AI Agent", "50 conversations/mo", "Web widget", "Email support"],
    cta: "Get Started Free",
    href: "/register",
    highlight: false,
    ctaStyle: "bg-gray-900 text-white hover:bg-gray-800",
  },
  {
    name: "Starter",
    priceUSD: 29, pricePHP: 1650,
    agents: 3, convos: 500,
    features: ["3 AI Agents", "500 conversations/mo", "All channels", "Priority support", "Analytics"],
    cta: "Start Free Trial",
    href: "/register?plan=STARTER",
    highlight: false,
    ctaStyle: "bg-gray-900 text-white hover:bg-gray-800",
  },
  {
    name: "Pro",
    priceUSD: 99, pricePHP: 5600,
    agents: 10, convos: 5000,
    features: ["10 AI Agents", "5,000 conversations/mo", "All channels", "Custom prompts", "Webhooks", "API access", "Order management"],
    cta: "Start Free Trial",
    href: "/register?plan=PRO",
    highlight: true,
    ctaStyle: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90",
  },
  {
    name: "Agency",
    priceUSD: 299, pricePHP: 16800,
    agents: -1, convos: -1,
    features: ["Unlimited agents", "Unlimited conversations", "White-label", "Dedicated support", "Custom integrations", "SLA guarantee"],
    cta: "Contact Sales",
    href: "/register?plan=AGENCY",
    highlight: false,
    ctaStyle: "bg-gray-900 text-white hover:bg-gray-800",
  },
];

export default function Pricing() {
  const [currency, setCurrency] = useState<"USD" | "PHP">("USD");

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            💰 Simple Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Start Free,{" "}
            <span className="gradient-text">Scale as You Grow</span>
          </h2>
          <p className="text-xl text-gray-500 mb-8">No hidden fees. Cancel anytime.</p>

          {/* Currency toggle */}
          <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
            {(["USD", "PHP"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currency === c ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {c === "USD" ? "🇺🇸 USD" : "🇵🇭 PHP"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 flex flex-col ${
                plan.highlight
                  ? "bg-gradient-to-b from-indigo-600 to-violet-700 text-white shadow-2xl shadow-indigo-200 scale-105"
                  : "bg-white border-2 border-gray-100 shadow-sm"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                  <Zap className="w-3 h-3" /> Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-bold text-xl mb-3 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-black ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                    {currency === "USD" ? `$${plan.priceUSD}` : `₱${plan.pricePHP.toLocaleString()}`}
                  </span>
                  <span className={`text-sm mb-1.5 ${plan.highlight ? "text-white/70" : "text-gray-400"}`}>/mo</span>
                </div>
                {plan.priceUSD > 0 && (
                  <p className={`text-xs mt-1 ${plan.highlight ? "text-white/60" : "text-gray-400"}`}>
                    {currency === "USD" ? `≈ ₱${plan.pricePHP.toLocaleString()} PHP` : `≈ $${plan.priceUSD} USD`}
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-white/80" : "text-green-500"}`} />
                    <span className={`text-sm ${plan.highlight ? "text-white/90" : "text-gray-600"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full text-center font-bold py-3 rounded-xl transition-all text-sm ${
                  plan.highlight
                    ? "bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg"
                    : plan.ctaStyle
                } block`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 mb-4">🇵🇭 Philippine users — pay via GCash, Maya, cards, and bank transfer</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            {["💳 Visa / Mastercard", "📱 GCash", "🟢 Maya", "🏦 Bank Transfer", "🏪 Over-the-Counter"].map((m) => (
              <span key={m} className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
