"use client";
import { useEffect, useState } from "react";
import { Key, Trash2, Search } from "lucide-react";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  lastUsed: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string; plan: string };
};

const planColors: Record<string, string> = {
  FREE: "bg-gray-800 text-gray-300",
  STARTER: "bg-blue-900 text-blue-300",
  PRO: "bg-indigo-900 text-indigo-300",
  AGENCY: "bg-purple-900 text-purple-300",
};

export default function AdminKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [search, setSearch] = useState("");

  async function fetchKeys() {
    const res = await fetch("/api/admin/keys");
    if (res.ok) setKeys(await res.json());
  }

  useEffect(() => { fetchKeys(); }, []);

  async function revokeKey(id: string) {
    if (!confirm("Revoke this API key?")) return;
    await fetch("/api/admin/keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchKeys();
  }

  const filtered = keys.filter(
    (k) =>
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">API Keys</h1>
        <p className="text-gray-400 text-sm mt-1">All API keys across all users — revoke any key instantly</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by key name or user email..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 text-left border-b border-gray-800">
              <th className="px-6 py-4">Key Name</th>
              <th className="px-4 py-4">User</th>
              <th className="px-4 py-4">Plan</th>
              <th className="px-4 py-4">Key Preview</th>
              <th className="px-4 py-4">Last Used</th>
              <th className="px-4 py-4 text-right">Created</th>
              <th className="px-4 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.map((k) => (
              <tr key={k.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="font-medium text-white">{k.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-gray-300">{k.user.name ?? "—"}</p>
                  <p className="text-xs text-gray-500">{k.user.email}</p>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planColors[k.user.plan] ?? ""}`}>
                    {k.user.plan}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <code className="text-xs text-gray-400 font-mono">{k.key.slice(0, 18)}...</code>
                </td>
                <td className="px-4 py-4 text-xs text-gray-400">
                  {k.lastUsed ? new Date(k.lastUsed).toLocaleDateString() : "Never"}
                </td>
                <td className="px-4 py-4 text-right text-xs text-gray-400">
                  {new Date(k.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => revokeKey(k.id)}
                    className="p-1.5 hover:bg-red-900/40 rounded-lg text-red-500"
                    title="Revoke key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Key className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No API keys found</p>
          </div>
        )}
      </div>
    </div>
  );
}
