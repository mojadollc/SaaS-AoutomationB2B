import crypto from "crypto";
import { getSettings } from "@/lib/settings";

const PAYMONGO_BASE = "https://api.paymongo.com/v1";

async function authHeader(): Promise<string> {
  const { PAYMONGO_SECRET_KEY } = await getSettings(["PAYMONGO_SECRET_KEY"]);
  if (!PAYMONGO_SECRET_KEY) throw new Error("PayMongo secret key not configured. Go to Admin → Settings → API Keys to add it.");
  return "Basic " + Buffer.from(PAYMONGO_SECRET_KEY + ":").toString("base64");
}

export interface PayMongoPaymentLink {
  id: string;
  checkout_url: string;
  reference_number: string;
}

export async function createPayMongoPaymentLink(
  amountPHP: number,
  description: string,
  metadata: Record<string, string>
): Promise<PayMongoPaymentLink> {
  const res = await fetch(`${PAYMONGO_BASE}/links`, {
    method: "POST",
    headers: {
      Authorization: await authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: amountPHP * 100,
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

export async function verifyPayMongoWebhookAsync(
  rawBody: string,
  signatureHeader: string
): Promise<boolean> {
  const { PAYMONGO_WEBHOOK_SECRET } = await getSettings(["PAYMONGO_WEBHOOK_SECRET"]);
  if (!PAYMONGO_WEBHOOK_SECRET) return false;

  try {
    const parts = Object.fromEntries(
      signatureHeader.split(",").map((p) => p.split("=") as [string, string])
    );
    const timestamp = parts["t"];
    const testHmac = parts["te"] ?? parts["li"];
    const payload = `${timestamp}.${rawBody}`;
    const computed = crypto
      .createHmac("sha256", PAYMONGO_WEBHOOK_SECRET)
      .update(payload)
      .digest("hex");
    return computed === testHmac;
  } catch {
    return false;
  }
}

export async function getPayMongoLink(linkId: string) {
  const res = await fetch(`${PAYMONGO_BASE}/links/${linkId}`, {
    headers: { Authorization: await authHeader() },
  });
  return (await res.json()).data;
}
