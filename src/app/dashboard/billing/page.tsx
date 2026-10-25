"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Zap, CreditCard, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

type PricingPlan = {
  key: string; name: string; priceUSD: number; pricePHP: number;
  desc: string; features: string[]; cta: string; href: string; highlight: boolean;
};

const DEFAULT_PLANS: PricingPlan[] = [
  { key: "FREE",    name: "Free",    priceUSD: 0,   pricePHP: 0,     desc: "", features: ["1 AI Agent", "50 conversations/mo", "Email support"],                                     cta: "", href: "", highlight: false },
  { key: "STARTER", name: "Starter", priceUSD: 29,  pricePHP: 1650,  desc: "", features: ["3 AI Agents", "500 conversations/mo", "Priority support", "Analytics"],                  cta: "", href: "", highlight: false },
  { key: "PRO",     name: "Pro",     priceUSD: 99,  pricePHP: 5600,  desc: "", features: ["10 AI Agents", "5,000 conversations/mo", "Custom prompts", "Webhooks", "API access"],    cta: "", href: "", highlight: true  },
  { key: "AGENCY",  name: "Agency",  priceUSD: 299, pricePHP: 16800, desc: "", features: ["Unlimited agents", "Unlimited conversations", "White-label", "Dedicated support"],       cta: "", href: "", highlight: false },
];

type Currency = "USD" | "PHP";
type PaymentMethod = "stripe" | "paymongo" | "xendit";

const PAYMENT_METHODS = [
  { id: "stripe" as PaymentMethod,   label: "Stripe",   logo: "💳", desc: "Credit / Debit Card",                        currencies: ["USD"] },
  { id: "paymongo" as PaymentMethod, label: "PayMongo", logo: "🇵🇭", desc: "GCash · Maya · Cards · OTC",                currencies: ["PHP"] },
  { id: "xendit" as PaymentMethod,   label: "Xendit",   logo: "⚡", desc: "GCash · Maya · Cards · Bank Transfer",       currencies: ["PHP"] },
];

const planBadgeColors: Record<string, string> = {
  FREE:    "bg-gray-100 text-gray-600",
  STARTER: "bg-blue-100 text-blue-700",
  PRO:     "bg-amber-100 text-amber-700",
  AGENCY:  "bg-purple-100 text-purple-700",
};

export default function BillingPage() {
  const searchParams = useSearchParams();
  const [currency, setCurrency] = useState<Currency>("USD");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>("FREE");
  const [showSuccess, setShowSuccess] = useState(false);
  const [gatewayError, setGatewayError] = useState("");
  const [enabledGateways, setEnabledGateways] = useState({ stripe: true, paymongo: true, xendit: true });
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PLANS);

  useEffect(() => {
    fetch("/api/user/me").then((r) => r.json()).then((u) => {
      if (u?.plan) setCurrentPlan(u.plan);
    });
    fetch("/api/payments").then((r) => r.json()).then((g) => {
      setEnabledGateways(g);
      const first = PAYMENT_METHODS.find((m) => g[m.id]);
      if (first) { setPaymentMethod(first.id); setCurrency(first.currencies[0] as Currency); }
    }).catch(() => {});
    fetch("/api/admin/pricing").then((r) => r.ok ? r.json() : null).then((data) => {
      if (data) setPlans(data);
    }).catch(() => {});
    if (searchParams.get("upgraded") === "true") {
      setShowSuccess(true);
      window.history.replaceState({}, "", "/dashboard/billing");
    }
  }, [searchParams]);

  function handleCurrencyChange(c: Currency) {
    setCurrency(c);
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
    if (planKey === "FREE" || planKey === currentPlan) return;
    setLoading(planKey);
    setGatewayError("");

    const endpoint =
      paymentMethod === "paymongo" ? "/api/paymongo" :
      paymentMethod === "xendit"   ? "/api/xendit" :
      "/api/stripe";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setGatewayError(data.error ?? "Payment gateway error. Please check API keys in Admin → Settings.");
      }
    } catch {
      setGatewayError("Could not connect to payment gateway. Please try again.");
    }
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
    const plan = plans.find((p) => p.key === planKey);
    if (!plan) return "";
    if (planKey === "FREE") return currency === "USD" ? "$0" : "₱0";
    if (currency === "USD") return `$${plan.priceUSD}`;
    return `₱${plan.pricePHP.toLocaleString()}`;
  }

  function getAltPrice(planKey: string) {
    const plan = plans.find((p) => p.key === planKey);
    if (!plan || planKey === "FREE") return null;
    return currency === "PHP"
      ? `≈ $${plan.priceUSD} USD`
      : `≈ ₱${plan.pricePHP.toLocaleString()} PHP`;
  }

  function getButtonLabel(planKey: string) {
    if (planKey === currentPlan) return "Current Plan";
    if (planKey === "FREE") return "Downgrade to Free";
    const via = paymentMethod === "stripe" ? "Stripe" : paymentMethod === "paymongo" ? "PayMongo" : "Xendit";
    const planIndex = plans.findIndex((p) => p.key === planKey);
    const currentIndex = plans.findIndex((p) => p.key === currentPlan);
    return planIndex > currentIndex ? `Upgrade via ${via}` : `Switch via ${via}`;
  }

  return (
    <div className="p-8">
      {/* Error banner */}
      {gatewayError && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
          <span className="text-red-500 shrink-0">⚠️</span>
          <p className="text-sm text-red-700 flex-1">{gatewayError}</p>
          <button onClick={() => setGatewayError("")} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Success banner */}
      {showSuccess && (
        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">Plan upgraded successfully!</p>
            <p className="text-xs text-green-600 mt-0.5">Your account has been updated to the <strong>{currentPlan}</strong> plan.</p>
          </div>
          <button onClick={() => setShowSuccess(false)} className="text-green-400 hover:text-green-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 text-sm">Current plan:</p>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${planBadgeColors[currentPlan]}`}>
              {currentPlan}
            </span>
          </div>
        </div>
        {currentPlan !== "FREE" && (
          <Button variant="secondary" onClick={handlePortal} loading={loading === "portal"}>
            Manage Billing
          </Button>
        )}
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
                currency === c ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {c === "USD" ? "🇺🇸 USD" : "🇵🇭 PHP"}
            </button>
          ))}
        </div>
      </div>

      {/* Payment method selector */}
      {!enabledGateways.stripe && !enabledGateways.paymongo && !enabledGateways.xendit ? (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
          ⚠️ No payment methods are currently enabled. Please contact support.
        </div>
      ) : (
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700 mb-3">Pay with:</p>
        <div className="flex flex-wrap gap-3">
          {PAYMENT_METHODS.filter((m) => enabledGateways[m.id]).map((method) => {
            const compatible = method.currencies.includes(currency);
            return (
              <button
                key={method.id}
                onClick={() => handlePaymentMethodChange(method.id)}
                disabled={!compatible}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                  paymentMethod === method.id
                    ? "border-amber-500 bg-amber-50"
                    : compatible
                    ? "border-gray-200 hover:border-amber-300 bg-white"
                    : "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                }`}
              >
                <span className="text-2xl">{method.logo}</span>
                <div>
                  <p className={`text-sm font-semibold ${paymentMethod === method.id ? "text-amber-700" : "text-gray-900"}`}>
                    {method.label}
                  </p>
                  <p className="text-xs text-gray-500">{method.desc}</p>
                </div>
                {paymentMethod === method.id && <CheckCircle className="w-4 h-4 text-amber-500 ml-1 shrink-0" />}
              </button>
            );
          })}
        </div>
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
      )}

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = plan.key === currentPlan;
          return (
            <Card
              key={plan.key}
              className={
                isCurrentPlan
                  ? "border-green-400 border-2 ring-2 ring-green-100"
                  : plan.highlight
                  ? "border-amber-500 border-2 bg-gradient-to-b from-amber-50 to-yellow-50"
                  : ""
              }
            >
              <CardHeader>
                {isCurrentPlan && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-green-600 mb-2">
                    <CheckCircle className="w-3 h-3" /> Your Current Plan
                  </div>
                )}
                {!isCurrentPlan && plan.highlight && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 mb-2">
                    <Zap className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <h3 className="font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-1">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(plan.key)}</span>
                  <span className="text-gray-500 text-sm">/mo</span>
                </div>
                {getAltPrice(plan.key) && (
                  <p className="text-xs text-gray-400 mt-0.5">{getAltPrice(plan.key)}</p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={isCurrentPlan ? "secondary" : plan.highlight ? "primary" : "secondary"}
                  className="w-full"
                  disabled={isCurrentPlan || plan.key === "FREE"}
                  loading={loading === plan.key}
                  onClick={() => handleUpgrade(plan.key)}
                >
                  {getButtonLabel(plan.key)}
                </Button>
              </CardContent>
            </Card>
          );
        })}
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
