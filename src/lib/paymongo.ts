import crypto from "crypto";
import { getSettings } from "@/lib/settings";

const PAYMONGO_BASE = "https://api.paymongo.com/v1";

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getKeys() {
  return getSettings(["PAYMONGO_SECRET_KEY", "PAYMONGO_PUBLIC_KEY", "PAYMONGO_WEBHOOK_SECRET"]);
}

async function authHeader(): Promise<string> {
  const { PAYMONGO_SECRET_KEY } = await getKeys();
  if (!PAYMONGO_SECRET_KEY)
    throw new Error("PayMongo secret key not configured. Go to Admin → Settings → API Keys.");
  return "Basic " + Buffer.from(PAYMONGO_SECRET_KEY + ":").toString("base64");
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PayMongoPaymentLink {
  id: string;
  checkout_url: string;
  reference_number: string;
}

export interface PayMongoWebhook {
  id: string;
  url: string;
  events: string[];
  secret_key: string;
  status: "enabled" | "disabled";
  created_at: number;
  updated_at: number;
}

// ─── Payment Links ────────────────────────────────────────────────────────────

/**
 * Creates a PayMongo Payment Link.
 * Amount is in PHP — we convert to centavos (×100) internally.
 * metadata is stored in `remarks` as JSON string so we can read it in the webhook.
 */
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
    throw new Error(err.errors?.[0]?.detail ?? "PayMongo: failed to create payment link");
  }

  const json = await res.json();
  const attrs = json.data.attributes;
  return {
    id: json.data.id,
    checkout_url: attrs.checkout_url,
    reference_number: attrs.reference_number,
  };
}

export async function getPayMongoLink(linkId: string) {
  const res = await fetch(`${PAYMONGO_BASE}/links/${linkId}`, {
    headers: { Authorization: await authHeader() },
  });
  return (await res.json()).data;
}

// ─── Webhooks ─────────────────────────────────────────────────────────────────

/**
 * Creates a webhook on PayMongo.
 * Per docs: POST /v1/webhooks
 * Returns the webhook object including secret_key — save this as PAYMONGO_WEBHOOK_SECRET.
 *
 * Supported events:
 *   payment.paid, payment.failed,
 *   link.payment.paid,
 *   checkout_session.payment.paid, checkout_session.payment.failed
 */
export async function createPayMongoWebhook(url: string, events: string[]): Promise<PayMongoWebhook> {
  const res = await fetch(`${PAYMONGO_BASE}/webhooks`, {
    method: "POST",
    headers: {
      Authorization: await authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        attributes: { url, events },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors?.[0]?.detail ?? "PayMongo: failed to create webhook");
  }

  const json = await res.json();
  return normalizeWebhook(json.data);
}

/**
 * Lists all webhooks registered on your PayMongo account.
 * Per docs: GET /v1/webhooks
 */
export async function listPayMongoWebhooks(): Promise<PayMongoWebhook[]> {
  const res = await fetch(`${PAYMONGO_BASE}/webhooks`, {
    headers: { Authorization: await authHeader() },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors?.[0]?.detail ?? "PayMongo: failed to list webhooks");
  }

  const json = await res.json();
  return (json.data ?? []).map(normalizeWebhook);
}

/**
 * Retrieves a single webhook by ID.
 * Per docs: GET /v1/webhooks/{id}
 */
export async function getPayMongoWebhook(webhookId: string): Promise<PayMongoWebhook> {
  const res = await fetch(`${PAYMONGO_BASE}/webhooks/${webhookId}`, {
    headers: { Authorization: await authHeader() },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors?.[0]?.detail ?? "PayMongo: webhook not found");
  }

  const json = await res.json();
  return normalizeWebhook(json.data);
}

/**
 * Enables a disabled webhook.
 * Per docs: POST /v1/webhooks/{id}/enable
 */
export async function enablePayMongoWebhook(webhookId: string): Promise<PayMongoWebhook> {
  const res = await fetch(`${PAYMONGO_BASE}/webhooks/${webhookId}/enable`, {
    method: "POST",
    headers: { Authorization: await authHeader() },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors?.[0]?.detail ?? "PayMongo: failed to enable webhook");
  }

  return normalizeWebhook((await res.json()).data);
}

/**
 * Disables an enabled webhook.
 * Per docs: POST /v1/webhooks/{id}/disable
 */
export async function disablePayMongoWebhook(webhookId: string): Promise<PayMongoWebhook> {
  const res = await fetch(`${PAYMONGO_BASE}/webhooks/${webhookId}/disable`, {
    method: "POST",
    headers: { Authorization: await authHeader() },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors?.[0]?.detail ?? "PayMongo: failed to disable webhook");
  }

  return normalizeWebhook((await res.json()).data);
}

/**
 * Updates a webhook's URL and/or events.
 * Per docs: PUT /v1/webhooks/{id}
 */
export async function updatePayMongoWebhook(
  webhookId: string,
  url: string,
  events: string[]
): Promise<PayMongoWebhook> {
  const res = await fetch(`${PAYMONGO_BASE}/webhooks/${webhookId}`, {
    method: "PUT",
    headers: {
      Authorization: await authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        attributes: { url, events },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors?.[0]?.detail ?? "PayMongo: failed to update webhook");
  }

  return normalizeWebhook((await res.json()).data);
}

// ─── Signature Verification ───────────────────────────────────────────────────

/**
 * Verifies a PayMongo webhook signature per official docs.
 *
 * Header: paymongo-signature
 * Format: t=<unix_timestamp>,te=<test_hmac>,li=<live_hmac>
 *
 * Algorithm:
 *   1. Extract timestamp (t) and HMAC (te for test, li for live)
 *   2. Construct payload: "<timestamp>.<rawBody>"
 *   3. HMAC-SHA256 the payload using the webhook secret_key
 *   4. Compare computed hex with the header value
 */
export async function verifyPayMongoWebhookAsync(
  rawBody: string,
  signatureHeader: string
): Promise<boolean> {
  const { PAYMONGO_WEBHOOK_SECRET } = await getKeys();
  if (!PAYMONGO_WEBHOOK_SECRET) return false;

  try {
    // Parse header: t=...,te=...,li=...
    const parts: Record<string, string> = {};
    signatureHeader.split(",").forEach((part) => {
      const idx = part.indexOf("=");
      if (idx !== -1) {
        parts[part.slice(0, idx)] = part.slice(idx + 1);
      }
    });

    const timestamp = parts["t"];
    if (!timestamp) return false;

    // Use live HMAC (li) in production, test HMAC (te) in test mode
    const hmac = parts["li"] ?? parts["te"];
    if (!hmac) return false;

    // Reject requests older than 5 minutes (replay attack protection)
    const age = Math.abs(Date.now() / 1000 - Number(timestamp));
    if (age > 300) return false;

    // Construct signed payload
    const payload = `${timestamp}.${rawBody}`;

    const computed = crypto
      .createHmac("sha256", PAYMONGO_WEBHOOK_SECRET)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(computed, "hex"),
      Buffer.from(hmac, "hex")
    );
  } catch {
    return false;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeWebhook(data: any): PayMongoWebhook {
  const attrs = data.attributes ?? {};
  return {
    id: data.id,
    url: attrs.url,
    events: attrs.events ?? [],
    secret_key: attrs.secret_key ?? "",
    status: attrs.status ?? "enabled",
    created_at: attrs.created_at ?? 0,
    updated_at: attrs.updated_at ?? 0,
  };
}
