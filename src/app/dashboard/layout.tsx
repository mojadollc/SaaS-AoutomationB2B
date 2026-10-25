import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { LayoutDashboard, MessageSquare, Bot, CreditCard, LogOut, Plug, Key, ShoppingCart, Package, Shield, LayoutTemplate, BookOpen, TicketIcon, AlertTriangle, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getTrialDaysLeft, isTrialExpired, TRIAL_DAYS } from "@/lib/plans";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/agents", icon: Bot, label: "Agents" },
  { href: "/dashboard/conversations", icon: MessageSquare, label: "Conversations" },
  { href: "/dashboard/templates", icon: LayoutTemplate, label: "Templates" },
  { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/integrations", icon: Plug, label: "Integrations" },
  { href: "/dashboard/keys", icon: Key, label: "API Keys" },
  { href: "/dashboard/docs", icon: BookOpen, label: "API Docs" },
  { href: "/dashboard/support", icon: TicketIcon, label: "Support" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  const isAdmin = (session.user as any)?.role === "ADMIN";
  const plan = (session.user as any)?.plan ?? "FREE";

  // Fetch trial info for FREE users
  let trialDaysLeft: number | null = null;
  let trialExpired = false;
  if (plan === "FREE") {
    const user = await prisma.user.findUnique({ where: { id: session.user.id! }, select: { createdAt: true } });
    if (user) {
      trialDaysLeft = getTrialDaysLeft(user.createdAt);
      trialExpired = isTrialExpired(plan, user.createdAt);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100">
          <Link href="/" className="font-bold text-amber-600">
            Aurex
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">AI Agentsflow</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
            <span className="inline-block mt-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              {plan === "FREE" ? `Trial` : plan}
            </span>
            {plan === "FREE" && trialDaysLeft !== null && (
              <span className={`inline-block mt-1 ml-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                trialExpired ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
              }`}>
                {trialExpired ? "Expired" : `${trialDaysLeft}d left`}
              </span>
            )}
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
            >
              <Shield className="w-4 h-4" /> Admin Panel
            </Link>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Trial banner */}
        {plan === "FREE" && trialDaysLeft !== null && (
          trialExpired ? (
            <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">Your {TRIAL_DAYS}-day free trial has expired. Upgrade to continue using Aurex.</span>
              </div>
              <Link href="/dashboard/billing" className="shrink-0 bg-white text-red-600 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-red-50 transition-colors">
                Upgrade Now
              </Link>
            </div>
          ) : (
            <div className="bg-amber-500 text-white px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">
                  {trialDaysLeft <= 1
                    ? "Your free trial expires today!"
                    : `Free trial: ${trialDaysLeft} day${trialDaysLeft !== 1 ? "s" : ""} remaining.`}
                  {" "}Upgrade to keep full access.
                </span>
              </div>
              <Link href="/dashboard/billing" className="shrink-0 bg-white text-amber-600 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-amber-50 transition-colors">
                Upgrade
              </Link>
            </div>
          )
        )}
        {children}
      </main>
    </div>
  );
}
