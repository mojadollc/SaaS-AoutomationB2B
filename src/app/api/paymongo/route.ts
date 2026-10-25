import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPayMongoPaymentLink } from "@/lib/paymongo";
import { PLAN_PRICES_PHP, PAID_PLANS, type PlanKey } from "@/lib/plans";
import { isPaymentEnabled } from "@/lib/payments";
import { z } from "zod";

const schema = z.object({ plan: z.enum(["STARTER", "PRO", "AGENCY"]) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!(await isPaymentEnabled("PAYMONGO")))
    return NextResponse.json({ error: "PayMongo payments are currently disabled" }, { status: 503 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const plan = parsed.data.plan as PlanKey;
  const amountPHP = PLAN_PRICES_PHP[plan];

  const link = await createPayMongoPaymentLink(
    amountPHP,
    `Aurex ${plan} Plan — Monthly Subscription`,
    { userId: session.user.id, plan }
  );

  return NextResponse.json({ url: link.checkout_url, linkId: link.id });
}
