import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAgent, AGENT_PROMPTS } from "@/lib/ai";
import { z } from "zod";

const schema = z.object({
  contact: z.string().min(1),
  message: z.string().min(1),
  sessionId: z.string().min(1),
});

export async function POST(req: Request, { params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;

  const agent = await prisma.agent.findFirst({
    where: { id: agentId, isActive: true },
  });
  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { contact, message, sessionId } = parsed.data;
  const externalId = `widget_${agentId}_${sessionId}`;

  let conversation = await prisma.conversation.findUnique({
    where: { externalId },
    include: { messages: true },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        agentId,
        userId: agent.userId,
        contact,
        channel: "widget",
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

  return NextResponse.json({ reply: aiReply, conversationId: conversation.id });
}

// Returns agent info for the widget to display
export async function GET(_: Request, { params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;

  const agent = await prisma.agent.findFirst({
    where: { id: agentId, isActive: true },
    select: { id: true, name: true, type: true },
  });

  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  return NextResponse.json(agent);
}
