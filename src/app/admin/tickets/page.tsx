"use client";
import { useEffect, useState, useRef } from "react";
import { TicketIcon, Send, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

type Reply = { id: string; body: string; isAdmin: boolean; createdAt: string };
type Ticket = {
  id: string; subject: string; body: string;
  status: string; priority: string; createdAt: string; updatedAt: string;
  replies: Reply[];
  user: { id: string; name: string | null; email: string };
};

const STATUS_COLOR: Record<string, string> = {
  OPEN: "bg-yellow-500/20 text-yellow-400",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400",
  RESOLVED: "bg-green-500/20 text-green-400",
  CLOSED: "bg-gray-500/20 text-gray-400",
};

const PRIORITY_COLOR: Record<string, string> = {
  LOW: "bg-gray-700 text-gray-400",
  NORMAL: "bg-blue-900 text-blue-300",
  HIGH: "bg-orange-900 text-orange-300",
  URGENT: "bg-red-900 text-red-300",
};

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const submittingRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function fetchTickets() {
    setLoading(true);
    const res = await fetch("/api/admin/tickets");
    if (res.ok) {
      const data = await res.json();
      setTickets(data);
      if (selected) {
        const updated = data.find((t: Ticket) => t.id === selected.id);
        if (updated) setSelected(updated);
      }
    }
    setLoading(false);
  }

  useEffect(() => { fetchTickets(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selected?.replies]);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !reply.trim() || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    const res = await fetch(`/api/admin/tickets/${selected.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply }),
    });
    if (res.ok) {
      setReply("");
      await fetchTickets();
    }
    setSubmitting(false);
    submittingRef.current = false;
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchTickets();
  }

  const filtered = filter === "ALL" ? tickets : tickets.filter((t) => t.status === filter);
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: tickets.filter((t) => t.status === s).length }), {} as Record<string, number>);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/5 bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h1 className="font-semibold text-white">Support Tickets</h1>
          <button onClick={fetchTickets} className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="px-3 py-2 flex gap-1 flex-wrap border-b border-white/5">
          {["ALL", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter === s ? "bg-amber-500/20 text-amber-400" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {s.replace("_", " ")} {s !== "ALL" && counts[s] > 0 && <span className="ml-1 opacity-60">{counts[s]}</span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-600 px-4">
              <TicketIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No tickets</p>
            </div>
          ) : (
            filtered.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors ${selected?.id === t.id ? "bg-gray-800" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-white truncate flex-1 mr-2">{t.subject}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLOR[t.status]}`}>
                    {t.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLOR[t.priority]}`}>
                    {t.priority}
                  </span>
                  <p className="text-xs text-gray-500 truncate">{t.user.name ?? t.user.email}</p>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{new Date(t.updatedAt).toLocaleDateString()}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col bg-gray-950">
        {selected ? (
          <>
            {/* Header */}
            <div className="bg-gray-900 border-b border-white/5 px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{selected.subject}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[selected.status]}`}>
                      {selected.status.replace("_", " ")}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${PRIORITY_COLOR[selected.priority]}`}>
                      {selected.priority}
                    </span>
                    <span className="text-xs text-gray-500">
                      {selected.user.name ?? selected.user.email} · #{selected.id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
                {/* Status changer */}
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 shrink-0"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>

            {/* Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Original */}
              <div className="flex justify-end">
                <div className="max-w-lg bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm">
                  <p className="text-indigo-300 text-xs font-medium mb-1">
                    {selected.user.name ?? selected.user.email} · {new Date(selected.createdAt).toLocaleString()}
                  </p>
                  <p className="whitespace-pre-wrap">{selected.body}</p>
                </div>
              </div>

              {selected.replies.map((r) => (
                <div key={r.id} className={`flex ${r.isAdmin ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm ${
                    r.isAdmin
                      ? "bg-gray-800 border border-white/10 text-gray-100 rounded-bl-sm"
                      : "bg-indigo-600 text-white rounded-br-sm"
                  }`}>
                    <p className={`text-xs font-medium mb-1 ${r.isAdmin ? "text-amber-400" : "text-indigo-300"}`}>
                      {r.isAdmin ? "Support Team (Admin)" : (selected.user.name ?? selected.user.email)} · {new Date(r.createdAt).toLocaleString()}
                    </p>
                    <p className="whitespace-pre-wrap">{r.body}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Reply */}
            {selected.status !== "CLOSED" ? (
              <form onSubmit={sendReply} className="bg-gray-900 border-t border-white/5 p-4 flex gap-3">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply to the customer..."
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Button type="submit" loading={submitting} className="gap-2">
                  <Send className="w-4 h-4" /> Reply
                </Button>
              </form>
            ) : (
              <div className="bg-gray-900 border-t border-white/5 p-4 text-center text-sm text-gray-500">
                Ticket is closed.
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            <div className="text-center">
              <TicketIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Select a ticket to view and reply</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
