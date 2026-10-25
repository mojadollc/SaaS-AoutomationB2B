import { getSettings, getSetting } from "@/lib/settings";

const XENDIT_BASE = "https://api.xendit.co";

async function authHeader(): Promise<string> {
  const { XENDIT_SECRET_KEY } = await getSettings(["XENDIT_SECRET_KEY"]);
  if (!XENDIT_SECRET_KEY) throw new Error("Xendit secret key not configured. Go to Admin → Settings → API Keys to add it.");
  return "Basic " + Buffer.from(XENDIT_SECRET_KEY + ":").toString("base64");
}

export interface XenditInvoice {
  id: string;
  invoice_url: string;
  external_id: string;
  status: string;
}

export async function createXenditInvoice(
  externalId: string,
  amountPHP: number,
  payerEmail: string,
  description: string,
  metadata: Record<string, string>
): Promise<XenditInvoice> {
  const appUrl = await getSetting("NEXTAUTH_URL");

  const res = await fetch(`${XENDIT_BASE}/v2/invoices`, {
    method: "POST",
    headers: {
      Authorization: await authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      external_id: externalId,
      amount: amountPHP,
      currency: "PHP",
      payer_email: payerEmail,
      description,
      success_redirect_url: `${appUrl}/dashboard?upgraded=true`,
      failure_redirect_url: `${appUrl}/dashboard/billing`,
      metadata,
      payment_methods: ["GCASH", "PAYMAYA", "CREDIT_CARD", "OTC", "ONLINE_BANKING"],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Xendit error");
  }

  const json = await res.json();
  return {
    id: json.id,
    invoice_url: json.invoice_url,
    external_id: json.external_id,
    status: json.status,
  };
}

export async function verifyXenditWebhookAsync(callbackToken: string): Promise<boolean> {
  const { XENDIT_WEBHOOK_TOKEN } = await getSettings(["XENDIT_WEBHOOK_TOKEN"]);
  return !!XENDIT_WEBHOOK_TOKEN && callbackToken === XENDIT_WEBHOOK_TOKEN;
}

export async function getXenditInvoice(invoiceId: string) {
  const res = await fetch(`${XENDIT_BASE}/v2/invoices/${invoiceId}`, {
    headers: { Authorization: await authHeader() },
  });
  return res.json();
}
