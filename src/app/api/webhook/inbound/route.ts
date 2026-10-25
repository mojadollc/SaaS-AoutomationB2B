import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/apikeys";
import { prisma } from "@/lib/prisma";
import { runAgent, AGENT_PROMPTS } from "@/lib/ai";
import { dispatchWebhooks } from "@/lib/webhooks";
import { z } from "zod";

const schema = z.object({
  agentId: z.string(),
  contact: z.string().min(1),
  message: z.string().min(1),
  channel: z.string().default("api"),
  externalId: z.string().optional(),
});

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

  const user = await validateApiKey(apiKey);
  if (!user) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { agentId, contact, message, channel, externalId } = parsed.data;

  const agent = await prisma.agent.findFirst({
    where: { id: agentId, userId: user.id, isActive: true },
  });
  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  let conversation = externalId
    ? await prisma.conversation.findUnique({ where: { externalId }, include: { messages: true } })
    : null;

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        agentId,
        userId: user.id,
        contact,
        channel,
        externalId,
        messages: { create: { role: "user", content: message } },
      },
      include: { messages: true },
    });
    await dispatchWebhooks(user.id, "conversation.created", conversation);
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

  const aiMessage = await prisma.message.create({
    data: { conversationId: conversation.id, role: "assistant", content: aiReply },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  await dispatchWebhooks(user.id, "message.created", {
    conversationId: conversation.id,
    message: aiMessage,
  });

  return NextResponse.json({ reply: aiReply, conversationId: conversation.id });
}
