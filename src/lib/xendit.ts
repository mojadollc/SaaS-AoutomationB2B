const XENDIT_BASE = "https://api.xendit.co";
const SECRET_KEY = process.env.XENDIT_SECRET_KEY!;

function authHeader() {
  return "Basic " + Buffer.from(SECRET_KEY + ":").toString("base64");
}

export interface XenditInvoice {
  id: string;
  invoice_url: string;
  external_id: string;
  status: string;
}

/**
 * Creates a Xendit Invoice for a subscription plan.
 */
export async function createXenditInvoice(
  externalId: string,
  amountPHP: number,
  payerEmail: string,
  description: string,
  metadata: Record<string, string>
): Promise<XenditInvoice> {
  const res = await fetch(`${XENDIT_BASE}/v2/invoices`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      external_id: externalId,
      amount: amountPHP,
      currency: "PHP",
      payer_email: payerEmail,
      description,
      success_redirect_url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=true`,
      failure_redirect_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
      metadata,
      // Accept GCash, Maya, cards, OTC, bank transfer
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

/**
 * Verifies a Xendit webhook using the callback token.
 * Xendit sends x-callback-token header — compare against env var.
 */
export function verifyXenditWebhook(callbackToken: string): boolean {
  return callbackToken === process.env.XENDIT_WEBHOOK_TOKEN;
}

/**
 * Retrieves a Xendit invoice by ID.
 */
export async function getXenditInvoice(invoiceId: string) {
  const res = await fetch(`${XENDIT_BASE}/v2/invoices/${invoiceId}`, {
    headers: { Authorization: authHeader() },
  });
  return res.json();
}
