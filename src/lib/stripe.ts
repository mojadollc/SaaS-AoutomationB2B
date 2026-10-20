import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    agents: 1,
    conversations: 50,
    features: ["1 AI Agent", "50 conversations/mo", "Email support"],
  },
  STARTER: {
    name: "Starter",
    price: 29,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    agents: 3,
    conversations: 500,
    features: ["3 AI Agents", "500 conversations/mo", "Priority support", "Analytics"],
  },
  PRO: {
    name: "Pro",
    price: 99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    agents: 10,
    conversations: 5000,
    features: ["10 AI Agents", "5,000 conversations/mo", "Custom prompts", "Webhooks", "API access"],
  },
  AGENCY: {
    name: "Agency",
    price: 299,
    priceId: process.env.STRIPE_AGENCY_PRICE_ID,
    agents: -1,
    conversations: -1,
    features: ["Unlimited agents", "Unlimited conversations", "White-label", "Dedicated support", "Custom integrations"],
  },
};

export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  customerId?: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    customer_email: customerId ? undefined : email,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    metadata: { userId },
  });
  return session;
}

export async function createPortalSession(customerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
  });
}
