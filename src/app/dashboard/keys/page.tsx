"use client";
import { useEffect, useState } from "react";
import { Key, Plus, Trash2, Copy, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  lastUsed: string | null;
  createdAt: string;
};

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function fetchKeys() {
    const res = await fetch("/api/keys");
    if (res.ok) setKeys(await res.json());
  }

  useEffect(() => { fetchKeys(); }, []);

  async function createKey(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setName("");
      fetchKeys();
    }
    setLoading(false);
  }

  async function deleteKey(id: string) {
    if (!confirm("Revoke this API key? Any integrations using it will stop working.")) return;
    await fetch(`/api/keys/${id}`, { method: "DELETE" });
    fetchKeys();
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
        <p className="text-gray-500 text-sm mt-1">
          Use these keys to connect external systems to AgentFlow via the inbound webhook or Zapier.
        </p>
      </div>

      {/* Endpoint reference */}
      <Card className="mb-6 bg-gray-50 border-gray-200">
        <CardContent className="py-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Inbound Webhook Endpoint</p>
          <code className="text-sm text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg block">
            POST {process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/webhook/inbound
          </code>
          <p className="text-xs text-gray-400 mt-2">
            Pass your API key in the <span className="font-mono">x-api-key</span> header.
          </p>
        </CardContent>
      </Card>

      {/* Create key form */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Create New API Key</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={createKey} className="flex gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Zapier Integration"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button type="submit" loading={loading} className="gap-2">
              <Plus className="w-4 h-4" /> Generate Key
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Keys list */}
      {keys.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Key className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No API keys yet. Create one to connect external systems.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((k) => (
            <Card key={k.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Key className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{k.name}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{k.key.slice(0, 20)}...</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {k.lastUsed ? `Last used ${new Date(k.lastUsed).toLocaleDateString()}` : "Never used"} ·{" "}
                      Created {new Date(k.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyKey(k.key)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                    title="Copy key"
                  >
                    {copied === k.key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteKey(k.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-400"
                    title="Revoke key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
