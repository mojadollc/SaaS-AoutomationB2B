import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAgent, AGENT_PROMPTS } from "@/lib/ai";

// Meta webhook verification
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.MESSENGER_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (body.object !== "page") {
    return NextResponse.json({ error: "Not a page event" }, { status: 400 });
  }

  const agentId = process.env.MESSENGER_DEFAULT_AGENT_ID;
  if (!agentId) return NextResponse.json({ error: "No default agent configured" }, { status: 500 });

  const agent = await prisma.agent.findFirst({
    where: { id: agentId, isActive: true },
  });
  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  for (const entry of body.entry ?? []) {
    for (const event of entry.messaging ?? []) {
      if (!event.message?.text) continue;

      const senderId = event.sender.id as string;
      const messageText = event.message.text as string;
      const externalId = `messenger_${senderId}_${agentId}`;

      let conversation = await prisma.conversation.findUnique({
        where: { externalId },
        include: { messages: true },
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            agentId,
            userId: agent.userId,
            contact: `messenger:${senderId}`,
            channel: "messenger",
            externalId,
            messages: { create: { role: "user", content: messageText } },
          },
          include: { messages: true },
        });
      } else {
        await prisma.message.create({
          data: { conversationId: conversation.id, role: "user", content: messageText },
        });
      }

      const history = conversation.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      history.push({ role: "user", content: messageText });

      const aiReply = await runAgent(
        agent.type,
        agent.systemPrompt || AGENT_PROMPTS[agent.type],
        history
      );

      await prisma.message.create({
        data: { conversationId: conversation.id, role: "assistant", content: aiReply },
      });

      // Send reply back via Messenger Send API
      await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.MESSENGER_PAGE_ACCESS_TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: senderId },
          message: { text: aiReply },
        }),
      });
    }
  }

  return NextResponse.json({ status: "ok" });
}
