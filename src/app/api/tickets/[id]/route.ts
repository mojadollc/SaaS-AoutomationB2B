import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Reply body required" }, { status: 400 });

  const ticket = await prisma.ticket.findFirst({ where: { id, userId: session.user.id } });
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const reply = await prisma.ticketReply.create({
    data: { ticketId: id, userId: session.user.id, body, isAdmin: false },
  });
  await prisma.ticket.update({ where: { id }, data: { status: "OPEN", updatedAt: new Date() } });
  return NextResponse.json(reply, { status: 201 });
}
