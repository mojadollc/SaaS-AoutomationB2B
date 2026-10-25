import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { Shield, LayoutDashboard, Users, ShoppingCart, Key, LogOut, Settings } from "lucide-react";
import AdminThemeProvider from "@/components/admin/ThemeProvider";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/orders", icon: ShoppingCart, label: "All Orders" },
  { href: "/admin/keys", icon: Key, label: "API Keys" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") redirect("/dashboard");

  return (
    <AdminThemeProvider>
      <div className="min-h-screen bg-gray-950 flex">
        <aside
          className="w-64 flex flex-col border-r border-white/5"
          style={{ background: "var(--admin-sidebar-bg, #111111)" }}
        >
          <div className="px-6 py-5 border-b border-white/5">
            <div className="font-bold text-white text-base">Aurex</div>
            <div className="text-xs text-gray-500 mt-0.5">AI Agentsflow</div>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-400 font-semibold">Admin Panel</span>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                style={{ ["--hover-bg" as any]: "var(--admin-primary, #c9a84c)" }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-white/5 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> Back to Dashboard
            </Link>
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </Link>
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top navbar */}
          <header
            className="h-14 flex items-center justify-between px-6 border-b border-white/5 shrink-0"
            style={{ background: "var(--admin-navbar-bg, #1a1a1a)" }}
          >
            <span className="text-sm font-semibold text-white/60">Admin Panel</span>
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "var(--admin-primary, #c9a84c)" }}
              />
              <span className="text-xs text-white/30">Live</span>
              <Link
                href="/admin/settings"
                className="p-1.5 rounded-lg text-white/30 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-gray-950">{children}</main>
        </div>
      </div>
    </AdminThemeProvider>
  );
}
