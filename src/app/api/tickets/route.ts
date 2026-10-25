import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tickets = await prisma.ticket.findMany({
    where: { userId: session.user.id },
    include: { replies: { orderBy: { createdAt: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subject, body, priority } = await req.json();
  if (!subject?.trim() || !body?.trim())
    return NextResponse.json({ error: "Subject and body are required" }, { status: 400 });

  const ticket = await prisma.ticket.create({
    data: { userId: session.user.id, subject, body, priority: priority ?? "NORMAL" },
    include: { replies: true },
  });
  return NextResponse.json(ticket, { status: 201 });
}
