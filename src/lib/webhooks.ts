import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export type WebhookEvent =
  | "conversation.created"
  | "conversation.updated"
  | "conversation.resolved"
  | "conversation.escalated"
  | "message.created";

export async function dispatchWebhooks(userId: string, event: WebhookEvent, payload: object) {
  const endpoints = await prisma.webhookEndpoint.findMany({
    where: { userId, isActive: true, events: { has: event } },
  });

  await Promise.allSettled(
    endpoints.map(async (endpoint) => {
      const body = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString() });
      const sig = crypto.createHmac("sha256", endpoint.secret).update(body).digest("hex");

      await fetch(endpoint.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Aurex-Signature": `sha256=${sig}`,
          "X-Aurex-Event": event,
        },
        body,
      });
    })
  );
}
