import { NextResponse } from "next/server";
import { verifyPayMongoWebhookAsync } from "@/lib/paymongo";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get("paymongo-signature") ?? "";

  // Verify signature using secret_key from DB (auto-saved when webhook was created)
  const valid = await verifyPayMongoWebhookAsync(rawBody, sigHeader);
  if (!valid) {
    console.error("[PayMongo Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType: string = event.data?.attributes?.type ?? "";
  console.log("[PayMongo Webhook] Event:", eventType.replace(/[\r\n]/g, ""));

  // ── payment.paid ──────────────────────────────────────────────────────────
  // Fired when a direct payment is paid
  if (eventType === "payment.paid") {
    const payment = event.data?.attributes?.data;
    await handlePaymentPaid(payment);
  }

  // ── link.payment.paid ─────────────────────────────────────────────────────
  // Fired when a Payment Link is paid — this is what we use for subscriptions
  if (eventType === "link.payment.paid") {
    const payment = event.data?.attributes?.data;
    await handlePaymentPaid(payment);
  }

  // ── checkout_session.payment.paid ─────────────────────────────────────────
  // Fired when a Checkout Session payment succeeds
  if (eventType === "checkout_session.payment.paid") {
    const session = event.data?.attributes?.data;
    const metadata = session?.attributes?.metadata ?? {};
    await upgradePlan(metadata?.userId, metadata?.plan, session?.id);
  }

  // ── payment.failed ────────────────────────────────────────────────────────
  if (eventType === "payment.failed" || eventType === "checkout_session.payment.failed") {
    console.log("[PayMongo Webhook] Payment failed for event:", eventType.replace(/[\r\n]/g, ""));
    // Could send a notification email here in the future
  }

  return NextResponse.json({ received: true });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function handlePaymentPaid(payment: any) {
  if (!payment) return;

  // metadata is stored in remarks as JSON string
  const remarks: string = payment?.attributes?.remarks ?? "{}";
  let metadata: { userId?: string; plan?: string } = {};
  try {
    metadata = JSON.parse(remarks);
  } catch {
    return;
  }

  await upgradePlan(metadata.userId, metadata.plan, payment?.id);
}

async function upgradePlan(userId?: string, plan?: string, paymentId?: string) {
  if (!userId || !plan) return;

  const validPlans = ["STARTER", "PRO", "AGENCY"];
  if (!validPlans.includes(plan)) return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: plan as any,
      paymongoLinkId: paymentId ?? null,
    },
  });

  console.log(`[PayMongo Webhook] Upgraded user ${userId.replace(/[\r\n]/g, "")} to ${plan.replace(/[\r\n]/g, "")}`);
}
