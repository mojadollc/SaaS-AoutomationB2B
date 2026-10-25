import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAgent, AGENT_PROMPTS } from "@/lib/ai";
import crypto from "crypto";

function verifySlackSignature(req: Request, body: string): boolean {
  const secret = process.env.SLACK_SIGNING_SECRET;
  if (!secret) return false;

  const timestamp = req.headers.get("x-slack-request-timestamp") ?? "";
  const slackSig = req.headers.get("x-slack-signature") ?? "";

  // Reject requests older than 5 minutes
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const sigBase = `v0:${timestamp}:${body}`;
  const computed = "v0=" + crypto.createHmac("sha256", secret).update(sigBase).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(slackSig));
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  if (!verifySlackSignature(req, rawBody)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const params = new URLSearchParams(rawBody);
  const text = params.get("text") ?? "";
  const userId = params.get("user_id") ?? "";
  const userName = params.get("user_name") ?? "slack_user";

  // Format: /Aurex <agentId> <message>
  const [agentId, ...rest] = text.trim().split(" ");
  const message = rest.join(" ");

  if (!agentId || !message) {
    return NextResponse.json({
      response_type: "ephemeral",
      text: "Usage: `/Aurex <agentId> <your message>`",
    });
  }

  const agent = await prisma.agent.findFirst({
    where: { id: agentId, isActive: true },
  });

  if (!agent) {
    return NextResponse.json({
      response_type: "ephemeral",
      text: `Agent \`${agentId}\` not found or inactive.`,
    });
  }

  const externalId = `slack_${userId}_${agentId}`;

  let conversation = await prisma.conversation.findUnique({
    where: { externalId },
    include: { messages: true },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        agentId,
        userId: agent.userId,
        contact: `@${userName}`,
        channel: "slack",
        externalId,
        messages: { create: { role: "user", content: message } },
      },
      include: { messages: true },
    });
  } else {
    await prisma.message.create({
      data: { conversationId: conversation.id, role: "user", content: message },
    });
  }

  const history = conversation.messages.map((m: { role: string; content: string }) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));
  history.push({ role: "user", content: message });

  const aiReply = await runAgent(
    agent.type,
    agent.systemPrompt || AGENT_PROMPTS[agent.type],
    history
  );

  await prisma.message.create({
    data: { conversationId: conversation.id, role: "assistant", content: aiReply },
  });

  return NextResponse.json({
    response_type: "in_channel",
    text: `*${agent.name}:* ${aiReply}`,
  });
}
