"use client";
import { useEffect, useState, useRef } from "react";
import { Send, Plus, MessageSquare, CheckCircle, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type Message = { id: string; role: string; content: string; createdAt: string };
type Agent = { id: string; name: string; type: string };
type Conversation = {
  id: string;
  contact: string;
  status: string;
  agent: Agent;
  messages: Message[];
  updatedAt: string;
};

const statusColor: Record<string, "yellow" | "green" | "red"> = {
  OPEN: "yellow", RESOLVED: "green", ESCALATED: "red",
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ agentId: "", contact: "", message: "" });
  const bottomRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);

  async function fetchConversations() {
    const res = await fetch("/api/conversations");
    if (res.ok) {
      const data = await res.json();
      setConversations(data);
      if (selected) {
        const updated = data.find((c: Conversation) => c.id === selected.id);
        if (updated) setSelected(updated);
      }
    }
  }

  useEffect(() => {
    fetchConversations();
    fetch("/api/agents").then((r) => r.json()).then(setAgents);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !message.trim() || submittingRef.current) return;
    submittingRef.current = true;
    setSending(true);

    const res = await fetch(`/api/conversations/${selected.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (res.ok) {
      setMessage("");
      await fetchConversations();
    }
    setSending(false);
    submittingRef.current = false;
  }

  async function startConversation(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSending(true);
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newForm),
    });
    if (res.ok) {
      const data = await res.json();
      setShowNew(false);
      setNewForm({ agentId: "", contact: "", message: "" });
      await fetchConversations();
      setSelected(data.conversation);
    }
    setSending(false);
    submittingRef.current = false;
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchConversations();
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h1 className="font-semibold text-gray-900">Conversations</h1>
          <button onClick={() => setShowNew(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {conversations.length === 0 ? (
            <div className="text-center py-12 text-gray-400 px-4">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelected(conv)}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors",
                  selected?.id === conv.id && "bg-indigo-50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{conv.contact}</p>
                  <Badge variant={statusColor[conv.status]}>{conv.status}</Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{conv.agent.name}</p>
                {conv.messages[conv.messages.length - 1] && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {conv.messages[conv.messages.length - 1].content}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selected ? (
          <>
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{selected.contact}</p>
                <p className="text-xs text-gray-500">{selected.agent.name}</p>
              </div>
              <div className="flex items-center gap-2">
                {selected.status === "OPEN" && (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => updateStatus(selected.id, "RESOLVED")} className="gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Resolve
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => updateStatus(selected.id, "ESCALATED")} className="gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Escalate
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selected.messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-md px-4 py-2.5 rounded-2xl text-sm",
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {selected.status === "OPEN" && (
              <form onSubmit={sendMessage} className="bg-white border-t border-gray-200 p-4 flex gap-3">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Button type="submit" loading={sending} className="gap-2">
                  <Send className="w-4 h-4" /> Send
                </Button>
              </form>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Select a conversation to view</p>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Start New Conversation</h2>
            <form onSubmit={startConversation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
                <select
                  value={newForm.agentId}
                  onChange={(e) => setNewForm({ ...newForm, agentId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select an agent...</option>
                  {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name / Email</label>
                <input
                  value={newForm.contact}
                  onChange={(e) => setNewForm({ ...newForm, contact: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Message</label>
                <textarea
                  value={newForm.message}
                  onChange={(e) => setNewForm({ ...newForm, message: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Hi, I need help with..."
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={sending}>Start Conversation</Button>
                <Button type="button" variant="secondary" onClick={() => setShowNew(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
