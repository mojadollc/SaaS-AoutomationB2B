import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createXenditInvoice } from "@/lib/xendit";
import { PLAN_PRICES_PHP, type PlanKey } from "@/lib/plans";
import { z } from "zod";

const schema = z.object({ plan: z.enum(["STARTER", "PRO", "AGENCY"]) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const plan = parsed.data.plan as PlanKey;
  const amountPHP = PLAN_PRICES_PHP[plan];
  const externalId = `agentflow_${session.user.id}_${plan}_${Date.now()}`;

  const invoice = await createXenditInvoice(
    externalId,
    amountPHP,
    session.user.email!,
    `AgentFlow ${plan} Plan — Monthly Subscription`,
    { userId: session.user.id, plan }
  );

  return NextResponse.json({ url: invoice.invoice_url, invoiceId: invoice.id });
}
