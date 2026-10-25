import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_KEYS = [
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "OPENAI_API_KEY",
  "GROK_API_KEY",
  "GEMINI_API_KEY",
  "AI_PROVIDER",
  "AI_OPENAI_ENABLED",
  "AI_GROK_ENABLED",
  "AI_GEMINI_ENABLED",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_STARTER_PRICE_ID",
  "STRIPE_PRO_PRICE_ID",
  "STRIPE_AGENCY_PRICE_ID",
  "PAYMONGO_SECRET_KEY",
  "PAYMONGO_PUBLIC_KEY",
  "PAYMONGO_WEBHOOK_SECRET",
  "XENDIT_SECRET_KEY",
  "XENDIT_WEBHOOK_TOKEN",
  "SLACK_SIGNING_SECRET",
  "TWILIO_AUTH_TOKEN",
  "WHATSAPP_DEFAULT_AGENT_ID",
  "MESSENGER_VERIFY_TOKEN",
  "MESSENGER_PAGE_ACCESS_TOKEN",
  "MESSENGER_DEFAULT_AGENT_ID",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "RESEND_API_KEY",
  "FROM_EMAIL",
  "PAYMENT_STRIPE_ENABLED",
  "PAYMENT_PAYMONGO_ENABLED",
  "PAYMENT_XENDIT_ENABLED",
];

async function requireAdmin() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await prisma.setting.findMany({ where: { key: { in: ALLOWED_KEYS } } });
  const saved: Record<string, string> = {};
  rows.forEach((r: { key: string; value: string }) => { saved[r.key] = r.value; });

  // Merge with process.env as fallback
  const result: Record<string, string> = {};
  for (const key of ALLOWED_KEYS) {
    result[key] = saved[key] ?? process.env[key] ?? "";
  }
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body: Record<string, string> = await req.json();

  const ops = Object.entries(body)
    .filter(([key, value]) => ALLOWED_KEYS.includes(key) && value && value.trim() !== "")
    .map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: value.trim() },
        create: { key, value: value.trim() },
      })
    );

  await Promise.all(ops);
  return NextResponse.json({ ok: true });
}
