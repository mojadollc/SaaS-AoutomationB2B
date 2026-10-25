import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const ALLOWED_KEYS = [
  "DATABASE_URL", "NEXTAUTH_URL", "NEXTAUTH_SECRET", "NEXT_PUBLIC_APP_URL",
  "OPENAI_API_KEY",
  "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_STARTER_PRICE_ID", "STRIPE_PRO_PRICE_ID", "STRIPE_AGENCY_PRICE_ID",
  "PAYMONGO_SECRET_KEY", "PAYMONGO_PUBLIC_KEY", "PAYMONGO_WEBHOOK_SECRET",
  "XENDIT_SECRET_KEY", "XENDIT_WEBHOOK_TOKEN",
  "SLACK_SIGNING_SECRET",
  "TWILIO_AUTH_TOKEN", "WHATSAPP_DEFAULT_AGENT_ID",
  "MESSENGER_VERIFY_TOKEN", "MESSENGER_PAGE_ACCESS_TOKEN", "MESSENGER_DEFAULT_AGENT_ID",
  "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET",
  "RESEND_API_KEY", "FROM_EMAIL",
];

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const result: Record<string, string> = {};
  for (const key of ALLOWED_KEYS) {
    result[key] = process.env[key] ?? "";
  }
  return NextResponse.json(result);
}
