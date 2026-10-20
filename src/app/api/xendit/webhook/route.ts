import { NextResponse } from "next/server";
import { verifyXenditWebhook } from "@/lib/xendit";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const callbackToken = req.headers.get("x-callback-token") ?? "";

  if (!verifyXenditWebhook(callbackToken)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const event = await req.json();

  // Xendit sends status PAID when invoice is settled
  if (event.status === "PAID" || event.status === "SETTLED") {
    const metadata: { userId?: string; plan?: string } = event.metadata ?? {};
    const { userId, plan } = metadata;

    if (!userId || !plan) return NextResponse.json({ received: true });

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: plan as any,
        xenditInvoiceId: event.id ?? null,
      },
    });
  }

  return NextResponse.json({ received: true });
}
