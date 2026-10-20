import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { z } from "zod";

const schema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const endpoints = await prisma.webhookEndpoint.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(endpoints);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const endpoint = await prisma.webhookEndpoint.create({
    data: {
      userId: session.user.id,
      url: parsed.data.url,
      events: parsed.data.events,
      secret: crypto.randomBytes(24).toString("hex"),
    },
  });

  return NextResponse.json(endpoint, { status: 201 });
}
