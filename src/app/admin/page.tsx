import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, Bot, MessageSquare, ShoppingCart, Key, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
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
      take: 8,
      select: { id: true, name: true, email: true, plan: true, createdAt: true },
    }),
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { total: true },
    }),
    prisma.conversation.groupBy({ by: ["channel"], _count: true }),
  ]);

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-900/30" },
    { label: "Total Agents", value: totalAgents, icon: Bot, color: "text-indigo-400", bg: "bg-indigo-900/30" },
    { label: "Conversations", value: totalConversations, icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-900/30" },
    { label: "Orders", value: totalOrders, icon: ShoppingCart, color: "text-yellow-400", bg: "bg-yellow-900/30" },
    { label: "API Keys", value: totalApiKeys, icon: Key, color: "text-green-400", bg: "bg-green-900/30" },
    { label: "Order Revenue", value: `$${(orderRevenue._sum.total ?? 0).toFixed(2)}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-900/30" },
  ];

  const planColors: Record<string, string> = {
    FREE: "bg-gray-700 text-gray-300",
    STARTER: "bg-blue-900 text-blue-300",
    PRO: "bg-indigo-900 text-indigo-300",
    AGENCY: "bg-purple-900 text-purple-300",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time stats across all users</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${bg} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Users by plan */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="font-semibold text-white mb-4">Users by Plan</h2>
          <div className="space-y-3">
            {usersByPlan.map((p) => (
              <div key={p.plan} className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${planColors[p.plan] ?? "bg-gray-700 text-gray-300"}`}>
                  {p.plan}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${Math.min((p._count / totalUsers) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-white w-6 text-right">{p._count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversations by channel */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="font-semibold text-white mb-4">Conversations by Channel</h2>
          <div className="space-y-3">
            {conversationsByChannel.map((c) => (
              <div key={c.channel} className="flex items-center justify-between">
                <span className="text-sm text-gray-300 capitalize">{c.channel}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.min((c._count / totalConversations) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-white w-6 text-right">{c._count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent signups */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 lg:col-span-2">
          <h2 className="font-semibold text-white mb-4">Recent Signups</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 text-left border-b border-gray-800">
                <th className="pb-3">User</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {recentUsers.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 text-white font-medium">{u.name ?? "—"}</td>
                  <td className="py-3 text-gray-400">{u.email}</td>
                  <td className="py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planColors[u.plan] ?? ""}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 text-right text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
