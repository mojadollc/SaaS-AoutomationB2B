import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createPayMongoWebhook,
  listPayMongoWebhooks,
} from "@/lib/paymongo";
import { getSetting } from "@/lib/settings";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return null;
  return session;
}

const PAYMONGO_EVENTS = [
  "payment.paid",
  "payment.failed",
  "link.payment.paid",
  "checkout_session.payment.paid",
  "checkout_session.payment.failed",
];

// GET — list all webhooks registered on PayMongo account
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const webhooks = await listPayMongoWebhooks();
    const savedSecret = await getSetting("PAYMONGO_WEBHOOK_SECRET");
    return NextResponse.json({ webhooks, savedSecret: !!savedSecret });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — create a new webhook on PayMongo and auto-save the secret_key to DB
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const schema = z.object({
    url: z.string().url("Must be a valid HTTPS URL"),
    events: z.array(z.string()).min(1).default(PAYMONGO_EVENTS),
  });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  try {
    const webhook = await createPayMongoWebhook(parsed.data.url, parsed.data.events);

    // Auto-save the webhook secret_key to DB so verification works immediately
    if (webhook.secret_key) {
      await prisma.setting.upsert({
        where: { key: "PAYMONGO_WEBHOOK_SECRET" },
        update: { value: webhook.secret_key },
        create: { key: "PAYMONGO_WEBHOOK_SECRET", value: webhook.secret_key },
      });
    }

    return NextResponse.json({ webhook, secretSaved: !!webhook.secret_key });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
