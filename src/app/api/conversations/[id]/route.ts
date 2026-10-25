import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runAgent, AGENT_PROMPTS } from "@/lib/ai";
import { z } from "zod";

const schema = z.object({ message: z.string().min(1) });

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId: session.user.id },
    include: { messages: { orderBy: { createdAt: "asc" } }, agent: true },
  });

  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(conversation);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const conversation = await prisma.conversation.findFirst({
    where: { id, userId: session.user.id },
    include: { messages: { orderBy: { createdAt: "asc" } }, agent: true },
  });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.message.create({
    data: { conversationId: id, role: "user", content: parsed.data.message },
  });

  const history = conversation.messages.map((m: { role: string; content: string }) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));
  history.push({ role: "user", content: parsed.data.message });

  const aiReply = await runAgent(
    conversation.agent.type,
    conversation.agent.systemPrompt || AGENT_PROMPTS[conversation.agent.type],
    history
  );

  const aiMessage = await prisma.message.create({
    data: { conversationId: id, role: "assistant", content: aiReply },
  });

  await prisma.conversation.update({ where: { id }, data: { updatedAt: new Date() } });

  return NextResponse.json(aiMessage);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  const updated = await prisma.conversation.updateMany({
    where: { id, userId: session.user.id },
    data: { status },
  });

  return NextResponse.json(updated);
}
