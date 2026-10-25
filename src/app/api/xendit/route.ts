import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createXenditInvoice } from "@/lib/xendit";
import { isGatewayEnabled } from "@/lib/settings";
import { PLAN_PRICES_PHP, type PlanKey } from "@/lib/plans";
import { z } from "zod";

const schema = z.object({ plan: z.enum(["STARTER", "PRO", "AGENCY"]) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const enabled = await isGatewayEnabled("xendit");
  if (!enabled) return NextResponse.json({ error: "Xendit payments are currently disabled." }, { status: 403 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const plan = parsed.data.plan as PlanKey;
  const amountPHP = PLAN_PRICES_PHP[plan];
  const externalId = `agentflow_${session.user.id}_${plan}_${Date.now()}`;

  try {
    const invoice = await createXenditInvoice(
      externalId,
      amountPHP,
      session.user.email!,
      `AgentFlow ${plan} Plan — Monthly Subscription`,
      { userId: session.user.id, plan }
    );
    return NextResponse.json({ url: invoice.invoice_url, invoiceId: invoice.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Xendit error" }, { status: 500 });
  }
}
