"use client";
import { useEffect, useState, useRef } from "react";
import { Plus, TicketIcon, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type Reply = { id: string; body: string; isAdmin: boolean; createdAt: string };
type Ticket = {
  id: string; subject: string; body: string;
  status: string; priority: string;
  createdAt: string; updatedAt: string;
  replies: Reply[];
};

const STATUS_COLOR: Record<string, string> = {
  OPEN: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-100 text-gray-500",
};

const PRIORITY_COLOR: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-500",
  NORMAL: "bg-blue-50 text-blue-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-red-100 text-red-600",
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ subject: "", body: "", priority: "NORMAL" });
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function fetchTickets() {
    const res = await fetch("/api/tickets");
    if (res.ok) {
      const data = await res.json();
      setTickets(data);
      if (selected) {
        const updated = data.find((t: Ticket) => t.id === selected.id);
        if (updated) setSelected(updated);
      }
    }
  }

  useEffect(() => { fetchTickets(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selected?.replies]);

  async function submitTicket(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const ticket = await res.json();
      setShowNew(false);
      setForm({ subject: "", body: "", priority: "NORMAL" });
      await fetchTickets();
      setSelected(ticket);
    }
    setSubmitting(false);
    submittingRef.current = false;
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !reply.trim() || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    const res = await fetch(`/api/tickets/${selected.id}`, {
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

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h1 className="font-semibold text-gray-900">Support Tickets</h1>
          <button onClick={() => setShowNew(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {tickets.length === 0 ? (
            <div className="text-center py-12 text-gray-400 px-4">
              <TicketIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No tickets yet</p>
              <button onClick={() => setShowNew(true)} className="mt-3 text-xs text-indigo-600 hover:underline">
                Submit your first ticket
              </button>
            </div>
          ) : (
            tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selected?.id === t.id ? "bg-indigo-50" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate flex-1 mr-2">{t.subject}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLOR[t.status]}`}>
                    {t.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLOR[t.priority]}`}>
                    {t.priority}
                  </span>
                  <p className="text-xs text-gray-400">{new Date(t.updatedAt).toLocaleDateString()}</p>
                </div>
                {t.replies.length > 0 && (
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {t.replies[t.replies.length - 1].body}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selected ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{selected.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[selected.status]}`}>
                      {selected.status.replace("_", " ")}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${PRIORITY_COLOR[selected.priority]}`}>
                      {selected.priority}
                    </span>
                    <span className="text-xs text-gray-400">#{selected.id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Original message */}
              <div className="flex justify-end">
                <div className="max-w-lg bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm">
                  <p className="font-medium text-indigo-200 text-xs mb-1">You · {new Date(selected.createdAt).toLocaleString()}</p>
                  <p className="whitespace-pre-wrap">{selected.body}</p>
                </div>
              </div>

              {/* Replies */}
              {selected.replies.map((r) => (
                <div key={r.id} className={`flex ${r.isAdmin ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm ${
                    r.isAdmin
                      ? "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                      : "bg-indigo-600 text-white rounded-br-sm"
                  }`}>
                    <p className={`text-xs font-medium mb-1 ${r.isAdmin ? "text-gray-400" : "text-indigo-200"}`}>
                      {r.isAdmin ? "Support Team" : "You"} · {new Date(r.createdAt).toLocaleString()}
                    </p>
                    <p className="whitespace-pre-wrap">{r.body}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Reply box */}
            {selected.status !== "CLOSED" && selected.status !== "RESOLVED" ? (
              <form onSubmit={sendReply} className="bg-white border-t border-gray-200 p-4 flex gap-3">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type a reply..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Button type="submit" loading={submitting} className="gap-2">
                  <Send className="w-4 h-4" /> Send
                </Button>
              </form>
            ) : (
              <div className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-400">
                This ticket is {selected.status.toLowerCase()}. <button onClick={() => setShowNew(true)} className="text-indigo-600 hover:underline">Open a new ticket</button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <TicketIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="mb-3">Select a ticket or submit a new one</p>
              <Button onClick={() => setShowNew(true)}>
                <Plus className="w-4 h-4 mr-2" /> New Ticket
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Submit a Support Ticket</h2>
            <form onSubmit={submitTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  required
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={submitting}>Submit Ticket</Button>
                <Button type="button" variant="secondary" onClick={() => setShowNew(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
