"use client";
import { useState } from "react";
import { CheckCircle, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

const PLANS = [
  {
    key: "FREE",
    name: "Free",
    price: 0,
    agents: 1,
    convos: 50,
    features: ["1 AI Agent", "50 conversations/mo", "Email support"],
  },
  {
    key: "STARTER",
    name: "Starter",
    price: 29,
    agents: 3,
    convos: 500,
    features: ["3 AI Agents", "500 conversations/mo", "Priority support", "Analytics"],
  },
  {
    key: "PRO",
    name: "Pro",
    price: 99,
    agents: 10,
    convos: 5000,
    features: ["10 AI Agents", "5,000 conversations/mo", "Custom prompts", "Webhooks", "API access"],
    highlight: true,
  },
  {
    key: "AGENCY",
    name: "Agency",
    price: 299,
    agents: -1,
    convos: -1,
    features: ["Unlimited agents", "Unlimited conversations", "White-label", "Dedicated support"],
  },
];

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(planKey: string) {
    if (planKey === "FREE") return;
    setLoading(planKey);
    const res = await fetch("/api/stripe", {
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
                <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
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
                variant={plan.highlight ? "primary" : "secondary"}
                className="w-full"
                disabled={plan.key === "FREE"}
                loading={loading === plan.key}
                onClick={() => handleUpgrade(plan.key)}
              >
                {plan.key === "FREE" ? "Current Free Plan" : `Upgrade to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
