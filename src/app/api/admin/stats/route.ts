import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalUsers,
    totalAgents,
    totalConversations,
    totalOrders,
    totalApiKeys,
    usersByPlan,
    recentUsers,
    orderRevenue,
    conversationsByChannel,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.agent.count(),
    prisma.conversation.count(),
    prisma.order.count(),
    prisma.apiKey.count(),
    prisma.user.groupBy({ by: ["plan"], _count: true }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, plan: true, createdAt: true },
    }),
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { total: true },
    }),
    prisma.conversation.groupBy({ by: ["channel"], _count: true }),
  ]);

  return NextResponse.json({
    totalUsers,
    totalAgents,
    totalConversations,
    totalOrders,
    totalApiKeys,
    totalRevenue: orderRevenue._sum.total ?? 0,
    usersByPlan,
    recentUsers,
    conversationsByChannel,
  });
}
