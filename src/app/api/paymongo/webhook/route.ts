import { NextResponse } from "next/server";
import { verifyPayMongoWebhookAsync } from "@/lib/paymongo";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get("paymongo-signature") ?? "";

  const valid = await verifyPayMongoWebhookAsync(rawBody, sigHeader);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const eventType: string = event.data?.attributes?.type ?? "";

  if (eventType === "payment.paid" || eventType === "link.payment.paid") {
    const payment = event.data?.attributes?.data ?? event.data?.attributes;
    const remarks: string = payment?.attributes?.remarks ?? "{}";

    let metadata: { userId?: string; plan?: string } = {};
    try { metadata = JSON.parse(remarks); } catch { /* ignore */ }

    const { userId, plan } = metadata;
    if (!userId || !plan) return NextResponse.json({ received: true });

    await prisma.user.update({
      where: { id: userId },
      data: { plan: plan as any, paymongoLinkId: payment?.id ?? null },
    });
  }

  return NextResponse.json({ received: true });
}
