import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runAgent, AGENT_PROMPTS } from "@/lib/ai";
import { extractAndCreateOrder } from "@/lib/orders";
import { z } from "zod";

const schema = z.object({
  agentId: z.string(),
  contact: z.string().min(1),
  message: z.string().min(1),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");

  const conversations = await prisma.conversation.findMany({
    where: { userId: session.user.id, ...(agentId ? { agentId } : {}) },
    include: { messages: { orderBy: { createdAt: "asc" } }, agent: true },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return NextResponse.json(conversations);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { agentId, contact, message } = parsed.data;

  const agent = await prisma.agent.findFirst({
    where: { id: agentId, userId: session.user.id, isActive: true },
  });
  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  const conversation = await prisma.conversation.create({
    data: {
      agentId,
      userId: session.user.id,
      contact,
      messages: { create: { role: "user", content: message } },
    },
    include: { messages: true },
  });

  let aiReply: string;
  try {
    aiReply = await runAgent(agent.type, agent.systemPrompt || AGENT_PROMPTS[agent.type], [
      { role: "user", content: message },
    ]);
  } catch (err: any) {
    const msg = err?.error?.message ?? err?.message ?? String(err);
    console.error("[runAgent error]", msg, err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const aiMessage = await prisma.message.create({
    data: { conversationId: conversation.id, role: "assistant", content: aiReply },
  });

  // Auto-create order if agent extracted one
  if (agent.type === "ORDER_TAKING") {
    await extractAndCreateOrder(aiReply, session.user.id, conversation.id, "web");
  }

  return NextResponse.json({ conversation, aiMessage }, { status: 201 });
}
