"use client";
import { useState } from "react";
import { CheckCircle, Zap, CreditCard } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PLAN_PRICES_USD, PLAN_PRICES_PHP, PLAN_FEATURES } from "@/lib/plans";

const PLANS = [
  { key: "FREE",    name: "Free",    highlight: false },
  { key: "STARTER", name: "Starter", highlight: false },
  { key: "PRO",     name: "Pro",     highlight: true  },
  { key: "AGENCY",  name: "Agency",  highlight: false },
];

type Currency = "USD" | "PHP";
type PaymentMethod = "stripe" | "paymongo" | "xendit";

const PAYMENT_METHODS = [
  {
    id: "stripe" as PaymentMethod,
    label: "Stripe",
    logo: "💳",
    desc: "Credit / Debit Card",
    currencies: ["USD"],
  },
  {
    id: "paymongo" as PaymentMethod,
    label: "PayMongo",
    logo: "🇵🇭",
    desc: "GCash · Maya · Cards · OTC",
    currencies: ["PHP"],
  },
  {
    id: "xendit" as PaymentMethod,
    label: "Xendit",
    logo: "⚡",
    desc: "GCash · Maya · Cards · Bank Transfer",
    currencies: ["PHP"],
  },
];

export default function BillingPage() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [loading, setLoading] = useState<string | null>(null);

  function handleCurrencyChange(c: Currency) {
    setCurrency(c);
    // Auto-select a compatible payment method
    if (c === "PHP" && paymentMethod === "stripe") setPaymentMethod("paymongo");
    if (c === "USD") setPaymentMethod("stripe");
  }

  function handlePaymentMethodChange(pm: PaymentMethod) {
    setPaymentMethod(pm);
    const method = PAYMENT_METHODS.find((m) => m.id === pm);
    if (method && !method.currencies.includes(currency)) {
      setCurrency(method.currencies[0] as Currency);
    }
  }

  async function handleUpgrade(planKey: string) {
    if (planKey === "FREE") return;
    setLoading(planKey);

    let endpoint = "/api/stripe";
    if (paymentMethod === "paymongo") endpoint = "/api/paymongo";
    if (paymentMethod === "xendit") endpoint = "/api/xendit";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planKey }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(null);
  }

  async function handlePortal() {
    setLoading("portal");
    const res = await fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portal: true }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(null);
  }

  function formatPrice(planKey: string) {
    if (planKey === "FREE") return currency === "USD" ? "$0" : "₱0";
    if (currency === "USD") return `$${PLAN_PRICES_USD[planKey]}`;
    return `₱${PLAN_PRICES_PHP[planKey].toLocaleString()}`;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your subscription</p>
        </div>
        <Button variant="secondary" onClick={handlePortal} loading={loading === "portal"}>
          Manage Billing
        </Button>
      </div>

      {/* Currency toggle */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-medium text-gray-700">Currency:</span>
        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
          {(["USD", "PHP"] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => handleCurrencyChange(c)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currency === c
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {c === "USD" ? "🇺🇸 USD" : "🇵🇭 PHP"}
            </button>
          ))}
        </div>
      </div>

      {/* Payment method selector */}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700 mb-3">Pay with:</p>
        <div className="flex flex-wrap gap-3">
          {PAYMENT_METHODS.map((method) => {
            const compatible = method.currencies.includes(currency);
            return (
              <button
                key={method.id}
                onClick={() => handlePaymentMethodChange(method.id)}
                disabled={!compatible}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                  paymentMethod === method.id
                    ? "border-indigo-500 bg-indigo-50"
                    : compatible
                    ? "border-gray-200 hover:border-indigo-300 bg-white"
                    : "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                }`}
              >
                <span className="text-2xl">{method.logo}</span>
                <div>
                  <p className={`text-sm font-semibold ${paymentMethod === method.id ? "text-indigo-700" : "text-gray-900"}`}>
                    {method.label}
                  </p>
                  <p className="text-xs text-gray-500">{method.desc}</p>
                </div>
                {paymentMethod === method.id && (
                  <CheckCircle className="w-4 h-4 text-indigo-500 ml-1 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Payment method info banners */}
        {paymentMethod === "paymongo" && (
          <div className="mt-3 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-700">
            <span className="text-base shrink-0">🇵🇭</span>
            <span>PayMongo supports <strong>GCash, Maya, credit/debit cards, and over-the-counter</strong> payments in Philippine Peso.</span>
          </div>
        )}
        {paymentMethod === "xendit" && (
          <div className="mt-3 flex items-start gap-2 bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-3 text-sm text-yellow-800">
            <span className="text-base shrink-0">⚡</span>
            <span>Xendit supports <strong>GCash, Maya, credit/debit cards, online banking, and bank transfers</strong> in Philippine Peso.</span>
          </div>
        )}
        {paymentMethod === "stripe" && (
          <div className="mt-3 flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600">
            <CreditCard className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Stripe accepts all major <strong>credit and debit cards</strong> worldwide in USD.</span>
          </div>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => (
          <Card key={plan.key} className={plan.highlight ? "border-indigo-500 border-2" : ""}>
            <CardHeader>
              {plan.highlight && (
                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 mb-2">
                  <Zap className="w-3 h-3" /> Most Popular
                </div>
              )}
              <h3 className="font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-1">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(plan.key)}</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
              {plan.key !== "FREE" && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {currency === "PHP"
                    ? `≈ $${PLAN_PRICES_USD[plan.key]} USD`
                    : `≈ ₱${PLAN_PRICES_PHP[plan.key].toLocaleString()} PHP`}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {(PLAN_FEATURES[plan.key as keyof typeof PLAN_FEATURES] ?? []).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlight ? "primary" : "secondary"}
                className="w-full"
                disabled={plan.key === "FREE"}
                loading={loading === plan.key}
                onClick={() => handleUpgrade(plan.key)}
              >
                {plan.key === "FREE"
                  ? "Current Free Plan"
                  : `Upgrade via ${paymentMethod === "stripe" ? "Stripe" : paymentMethod === "paymongo" ? "PayMongo" : "Xendit"}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accepted payment logos */}
      <div className="mt-10 pt-8 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center mb-4">Accepted payment methods</p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">💳 Visa / Mastercard</span>
          <span className="flex items-center gap-1.5">📱 GCash</span>
          <span className="flex items-center gap-1.5">🟢 Maya</span>
          <span className="flex items-center gap-1.5">🏦 Online Banking</span>
          <span className="flex items-center gap-1.5">🏪 Over-the-Counter</span>
          <span className="flex items-center gap-1.5">🔄 Bank Transfer</span>
        </div>
      </div>
    </div>
  );
}
