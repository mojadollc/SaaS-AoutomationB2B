import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession, createPortalSession, PLANS } from "@/lib/stripe";
import { isPaymentEnabled } from "@/lib/payments";
import { z } from "zod";

const schema = z.object({ plan: z.enum(["STARTER", "PRO", "AGENCY"]) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!(await isPaymentEnabled("STRIPE")))
    return NextResponse.json({ error: "Stripe payments are currently disabled" }, { status: 503 });

  const body = await req.json();

  if (body.portal) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.stripeCustomerId)
      return NextResponse.json({ error: "No billing account" }, { status: 400 });
    const portalSession = await createPortalSession(user.stripeCustomerId);
    return NextResponse.json({ url: portalSession.url });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const priceId = PLANS[parsed.data.plan].priceId;
  if (!priceId) return NextResponse.json({ error: "Price not configured" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const checkoutSession = await createCheckoutSession(
    session.user.id,
    session.user.email!,
    priceId,
    user?.stripeCustomerId ?? undefined
  );

  return NextResponse.json({ url: checkoutSession.url });
}
