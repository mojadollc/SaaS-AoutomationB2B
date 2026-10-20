import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const PLAN_MAP: Record<string, string> = {
    [process.env.STRIPE_STARTER_PRICE_ID!]: "STARTER",
    [process.env.STRIPE_PRO_PRICE_ID!]: "PRO",
    [process.env.STRIPE_AGENCY_PRICE_ID!]: "AGENCY",
  };

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = subscription.items.data[0].price.id;
      const plan = PLAN_MAP[priceId] ?? "FREE";

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: plan as any,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { plan: "FREE", stripeSubscriptionId: null },
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0].price.id;
      const plan = PLAN_MAP[priceId] ?? "FREE";

      await prisma.user.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { plan: plan as any },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
