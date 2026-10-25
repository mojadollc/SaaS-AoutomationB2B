import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Reply body required" }, { status: 400 });

  const reply = await prisma.ticketReply.create({
    data: { ticketId: id, userId: session.user.id!, body, isAdmin: true },
  });
  await prisma.ticket.update({ where: { id }, data: { status: "IN_PROGRESS", updatedAt: new Date() } });
  return NextResponse.json(reply, { status: 201 });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();

  const ticket = await prisma.ticket.update({ where: { id }, data: { status } });
  return NextResponse.json(ticket);
}
