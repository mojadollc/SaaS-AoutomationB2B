import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  enablePayMongoWebhook,
  disablePayMongoWebhook,
  updatePayMongoWebhook,
  getPayMongoWebhook,
} from "@/lib/paymongo";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return null;
  return session;
}

// GET — retrieve a single webhook
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  try {
    const webhook = await getPayMongoWebhook(id);
    return NextResponse.json(webhook);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH — enable or disable a webhook, or update its URL/events
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const body = await req.json();

  try {
    let webhook;

    if (body.action === "enable") {
      webhook = await enablePayMongoWebhook(id);
    } else if (body.action === "disable") {
      webhook = await disablePayMongoWebhook(id);
    } else if (body.url && body.events) {
      const schema = z.object({
        url: z.string().url(),
        events: z.array(z.string()).min(1),
      });
      const parsed = schema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      webhook = await updatePayMongoWebhook(id, parsed.data.url, parsed.data.events);

      // If the update returns a new secret_key, save it
      if (webhook.secret_key) {
        await prisma.setting.upsert({
          where: { key: "PAYMONGO_WEBHOOK_SECRET" },
          update: { value: webhook.secret_key },
          create: { key: "PAYMONGO_WEBHOOK_SECRET", value: webhook.secret_key },
        });
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(webhook);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
