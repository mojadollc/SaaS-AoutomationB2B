import { auth } from "@/lib/auth";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Bot, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [agentCount, totalConvos, openConvos, resolvedConvos] = await Promise.all([
    prisma.agent.count({ where: { userId } }),
    prisma.conversation.count({ where: { userId } }),
    prisma.conversation.count({ where: { userId, status: "OPEN" } }),
    prisma.conversation.count({ where: { userId, status: "RESOLVED" } }),
  ]);

  const recentConvos = await prisma.conversation.findMany({
    where: { userId },
    include: { agent: true, messages: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Active Agents", value: agentCount, icon: Bot, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Conversations", value: totalConvos, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Open", value: openConvos, icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Resolved", value: resolvedConvos, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  ];

  const statusColor: Record<string, "yellow" | "green" | "red"> = {
    OPEN: "yellow", RESOLVED: "green", ESCALATED: "red",
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {session!.user?.name}</p>
        </div>
        <Link href="/dashboard/agents">
          <Button>+ New Agent</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Conversations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Conversations</h2>
            <Link href="/dashboard/conversations" className="text-sm text-indigo-600 hover:underline">View all</Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentConvos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet. Create an agent to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentConvos.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/dashboard/conversations?id=${conv.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-semibold text-indigo-700">
                      {conv.contact[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{conv.contact}</p>
                      <p className="text-xs text-gray-500">{conv.agent.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-400 hidden md:block">
                      {conv.messages[0]?.content.slice(0, 40)}...
                    </p>
                    <Badge variant={statusColor[conv.status]}>{conv.status}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
