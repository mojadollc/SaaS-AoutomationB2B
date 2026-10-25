import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/apikeys";
import { checkTrialAccess } from "@/lib/plans";
import { z } from "zod";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, key: true, lastUsed: true, createdAt: true },
  });

  return NextResponse.json(keys);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = z.object({ name: z.string().min(1) }).parse(await req.json());

  const plan = (session.user as any).plan ?? "FREE";
  const trialError = await checkTrialAccess(plan, session.user.id, prisma);
  if (trialError) return NextResponse.json({ error: trialError }, { status: 403 });

  const apiKey = await prisma.apiKey.create({
    data: { userId: session.user.id, name, key: generateApiKey() },
  });

  return NextResponse.json(apiKey, { status: 201 });
}
