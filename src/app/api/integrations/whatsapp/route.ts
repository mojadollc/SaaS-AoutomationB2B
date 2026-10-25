import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAgent, AGENT_PROMPTS } from "@/lib/ai";
import crypto from "crypto";

function verifyTwilioSignature(req: Request, body: string): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const url = process.env.NEXTAUTH_URL + "/api/integrations/whatsapp";
  if (!authToken) return false;

  const twilioSig = req.headers.get("x-twilio-signature") ?? "";
  const params = new URLSearchParams(body);
  const sortedParams = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => k + v)
    .join("");

  // SHA1 is required by Twilio's signature verification spec — cannot be changed
  const computed = crypto
    .createHmac("sha1", authToken)
    .update(url + sortedParams)
    .digest("base64");

  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(twilioSig));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  if (process.env.NODE_ENV === "production" && !verifyTwilioSignature(req, rawBody)) {
    return new Response("Forbidden", { status: 403 });
  }

  const params = new URLSearchParams(rawBody);
  const from = params.get("From") ?? ""; // e.g. whatsapp:+1234567890
  const body = params.get("Body") ?? "";
  const agentId = process.env.WHATSAPP_DEFAULT_AGENT_ID;

  if (!agentId) return new Response("No default agent configured", { status: 500 });

  const agent = await prisma.agent.findFirst({
    where: { id: agentId, isActive: true },
  });
  if (!agent) return new Response("Agent not found", { status: 404 });

  const externalId = `whatsapp_${from}_${agentId}`;

  let conversation = await prisma.conversation.findUnique({
    where: { externalId },
    include: { messages: true },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        agentId,
        userId: agent.userId,
        contact: from,
        channel: "whatsapp",
        externalId,
        messages: { create: { role: "user", content: body } },
      },
      include: { messages: true },
    });
  } else {
    await prisma.message.create({
      data: { conversationId: conversation.id, role: "user", content: body },
    });
  }

  const history = conversation.messages.map((m: { role: string; content: string }) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));
  history.push({ role: "user", content: body });

  const aiReply = await runAgent(
    agent.type,
    agent.systemPrompt || AGENT_PROMPTS[agent.type],
    history
  );

  await prisma.message.create({
    data: { conversationId: conversation.id, role: "assistant", content: aiReply },
  });

  // Twilio expects TwiML XML response
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${aiReply}</Message>
</Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
