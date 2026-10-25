import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/plans";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  type: z.enum(["CUSTOMER_SUPPORT", "LEAD_FOLLOWUP", "APPOINTMENT_BOOKING", "REPORT_GENERATOR"]),
  systemPrompt: z.string().optional().default(""),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agents = await prisma.agent.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { conversations: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(agents);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = (session.user as any).plan as keyof typeof PLAN_LIMITS;
  const maxAgents = PLAN_LIMITS[plan]?.agents ?? 1;

  if (maxAgents !== -1) {
    const count = await prisma.agent.count({ where: { userId: session.user.id } });
    if (count >= maxAgents)
      return NextResponse.json({ error: `Upgrade your plan to create more agents` }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const agent = await prisma.agent.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return NextResponse.json(agent, { status: 201 });
}
