import crypto from "crypto";

const PAYMONGO_BASE = "https://api.paymongo.com/v1";
const SECRET_KEY = process.env.PAYMONGO_SECRET_KEY!;

function authHeader() {
  return "Basic " + Buffer.from(SECRET_KEY + ":").toString("base64");
}

export interface PayMongoPaymentLink {
  id: string;
  checkout_url: string;
  reference_number: string;
}

/**
 * Creates a PayMongo Payment Link for a subscription plan.
 * Amount is in centavos (PHP × 100).
 */
export async function createPayMongoPaymentLink(
  amountPHP: number,
  description: string,
  metadata: Record<string, string>
): Promise<PayMongoPaymentLink> {
  const res = await fetch(`${PAYMONGO_BASE}/links`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: amountPHP * 100, // centavos
          currency: "PHP",
          description,
          remarks: JSON.stringify(metadata),
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors?.[0]?.detail ?? "PayMongo error");
  }

  const json = await res.json();
  const attrs = json.data.attributes;
  return {
    id: json.data.id,
    checkout_url: attrs.checkout_url,
    reference_number: attrs.reference_number,
  };
}

/**
 * Verifies a PayMongo webhook signature.
 * Header: paymongo-signature  format: t=<ts>,te=<hmac>,li=<hmac>
 */
export function verifyPayMongoWebhook(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string
): boolean {
  try {
    const parts = Object.fromEntries(
      signatureHeader.split(",").map((p) => p.split("=") as [string, string])
    );
    const timestamp = parts["t"];
    const testHmac = parts["te"] ?? parts["li"];
    const payload = `${timestamp}.${rawBody}`;
    const computed = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");
    return computed === testHmac;
  } catch {
    return false;
  }
}

/**
 * Retrieves a payment link by ID to check its status.
 */
export async function getPayMongoLink(linkId: string) {
  const res = await fetch(`${PAYMONGO_BASE}/links/${linkId}`, {
    headers: { Authorization: authHeader() },
  });
  const json = await res.json();
  return json.data;
}
