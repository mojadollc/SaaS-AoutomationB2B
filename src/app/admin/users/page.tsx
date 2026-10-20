"use client";
import { useEffect, useState } from "react";
import { Search, Trash2, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  plan: string;
  createdAt: string;
  _count: { agents: number; conversations: number; orders: number; apiKeys: number };
};

const PLANS = ["FREE", "STARTER", "PRO", "AGENCY"];
const ROLES = ["USER", "ADMIN"];

const planColors: Record<string, string> = {
  FREE: "bg-gray-800 text-gray-300",
  STARTER: "bg-blue-900 text-blue-300",
  PRO: "bg-indigo-900 text-indigo-300",
  AGENCY: "bg-purple-900 text-purple-300",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchUsers() {
    const params = new URLSearchParams({ search, page: String(page) });
    const res = await fetch(`/api/admin/users?${params}`);
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
      setTotalPages(data.pages);
    }
  }

  useEffect(() => { fetchUsers(); }, [search, page]);

  async function updateUser(id: string, data: { plan?: string; role?: string }) {
    setUpdating(id);
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await fetchUsers();
    setUpdating(null);
  }

  async function deleteUser(id: string, email: string) {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    fetchUsers();
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-gray-400 text-sm mt-1">Manage all platform users, plans, and roles</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 text-left border-b border-gray-800">
              <th className="px-6 py-4">User</th>
              <th className="px-4 py-4">Plan</th>
              <th className="px-4 py-4">Role</th>
              <th className="px-4 py-4 text-center">Agents</th>
              <th className="px-4 py-4 text-center">Convos</th>
              <th className="px-4 py-4 text-center">Orders</th>
              <th className="px-4 py-4 text-center">Keys</th>
              <th className="px-4 py-4 text-right">Joined</th>
              <th className="px-4 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{user.name ?? "—"}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </td>
                <td className="px-4 py-4">
                  <select
                    value={user.plan}
                    disabled={updating === user.id}
                    onChange={(e) => updateUser(user.id, { plan: e.target.value })}
                    className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <select
                    value={user.role}
                    disabled={updating === user.id}
                    onChange={(e) => updateUser(user.id, { role: e.target.value })}
                    className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-4 py-4 text-center text-gray-300">{user._count.agents}</td>
                <td className="px-4 py-4 text-center text-gray-300">{user._count.conversations}</td>
                <td className="px-4 py-4 text-center text-gray-300">{user._count.orders}</td>
                <td className="px-4 py-4 text-center text-gray-300">{user._count.apiKeys}</td>
                <td className="px-4 py-4 text-right text-xs text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => deleteUser(user.id, user.email)}
                    className="p-1.5 hover:bg-red-900/40 rounded-lg text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
            <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
