import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/apikeys";
import { prisma } from "@/lib/prisma";
import { runAgent, AGENT_PROMPTS } from "@/lib/ai";
import { z } from "zod";

// Zapier Action: send a message to an agent and get a reply
const actionSchema = z.object({
  agentId: z.string(),
  contact: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

  const user = await validateApiKey(apiKey);
  if (!user) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  const parsed = actionSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { agentId, contact, message } = parsed.data;

  const agent = await prisma.agent.findFirst({
    where: { id: agentId, userId: user.id, isActive: true },
  });
  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  const conversation = await prisma.conversation.create({
    data: {
      agentId,
      userId: user.id,
      contact,
      channel: "zapier",
      messages: { create: { role: "user", content: message } },
    },
    include: { messages: true },
  });

  const aiReply = await runAgent(
    agent.type,
    agent.systemPrompt || AGENT_PROMPTS[agent.type],
    [{ role: "user", content: message }]
  );

  await prisma.message.create({
    data: { conversationId: conversation.id, role: "assistant", content: aiReply },
  });

  // Zapier expects a flat object response
  return NextResponse.json({
    id: conversation.id,
    reply: aiReply,
    contact,
    agentName: agent.name,
    agentType: agent.type,
    createdAt: conversation.createdAt,
  });
}

// Zapier Trigger: returns recent conversations (Zapier polls this)
export async function GET(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

  const user = await validateApiKey(apiKey);
  if (!user) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");

  const conversations = await prisma.conversation.findMany({
    where: { userId: user.id, ...(agentId ? { agentId } : {}) },
    include: { agent: true, messages: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Zapier trigger format: array of flat objects with unique id
  return NextResponse.json(
    conversations.map((c) => ({
      id: c.id,
      contact: c.contact,
      status: c.status,
      channel: c.channel,
      agentName: c.agent.name,
      agentType: c.agent.type,
      lastMessage: c.messages[0]?.content ?? "",
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }))
  );
}
