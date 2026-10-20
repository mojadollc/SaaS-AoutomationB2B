"use client";
import { useEffect, useState } from "react";
import { Bot, Plus, Trash2, ToggleLeft, ToggleRight, MessageSquare, Sparkles, X, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PROMPT_TEMPLATES, INDUSTRIES, type PromptTemplate } from "@/lib/templates";

const AGENT_TYPES = [
  { value: "CUSTOMER_SUPPORT", label: "Customer Support", desc: "Handles FAQs and complaints" },
  { value: "LEAD_FOLLOWUP", label: "Lead Follow-Up", desc: "Re-engages and qualifies leads" },
  { value: "APPOINTMENT_BOOKING", label: "Appointment Booking", desc: "Books and manages appointments" },
  { value: "REPORT_GENERATOR", label: "Report Generator", desc: "Generates business reports" },
  { value: "ORDER_TAKING", label: "Order Taking", desc: "Takes orders conversationally" },
];

type Agent = {
  id: string;
  name: string;
  type: string;
  systemPrompt: string;
  isActive: boolean;
  _count: { conversations: number };
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [form, setForm] = useState({ name: "", type: "CUSTOMER_SUPPORT", systemPrompt: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0]);
  const [templateSearch, setTemplateSearch] = useState("");

  async function fetchAgents() {
    const res = await fetch("/api/agents");
    if (res.ok) setAgents(await res.json());
  }

  useEffect(() => { fetchAgents(); }, []);

  async function createAgent(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ name: "", type: "CUSTOMER_SUPPORT", systemPrompt: "" });
      fetchAgents();
    } else {
      const data = await res.json();
      setError(data.error);
    }
    setLoading(false);
  }

  function applyTemplate(template: PromptTemplate) {
    setForm({
      name: template.name,
      type: template.agentType,
      systemPrompt: template.prompt,
    });
    setShowTemplates(false);
    setShowForm(true);
  }

  async function toggleAgent(id: string, isActive: boolean) {
    await fetch(`/api/agents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchAgents();
  }

  async function deleteAgent(id: string) {
    if (!confirm("Delete this agent? All conversations will be lost.")) return;
    await fetch(`/api/agents/${id}`, { method: "DELETE" });
    fetchAgents();
  }

  const typeLabel = (type: string) => AGENT_TYPES.find((t) => t.value === type)?.label ?? type;

  const filteredTemplates = PROMPT_TEMPLATES.filter((t) => {
    const matchesIndustry = t.industry === selectedIndustry;
    const matchesSearch =
      templateSearch === "" ||
      t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(templateSearch.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  const searchResults = templateSearch
    ? PROMPT_TEMPLATES.filter(
        (t) =>
          t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
          t.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
          t.industry.toLowerCase().includes(templateSearch.toLowerCase())
      )
    : null;

  const displayedTemplates = searchResults ?? filteredTemplates;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Agents</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage your automation agents</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowTemplates(true)} className="gap-2">
            <Sparkles className="w-4 h-4" /> Use Template
          </Button>
          <Button onClick={() => { setShowForm(true); setShowTemplates(false); }} className="gap-2">
            <Plus className="w-4 h-4" /> New Agent
          </Button>
        </div>
      </div>

      {/* Template Browser Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" /> Ready-Made Agent Templates
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {PROMPT_TEMPLATES.length} templates across {INDUSTRIES.length} industries — click any to load it instantly
                </p>
              </div>
              <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  placeholder="Search templates (e.g. hotel, booking, support...)"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Industry sidebar — hidden when searching */}
              {!templateSearch && (
                <div className="w-48 border-r border-gray-100 overflow-y-auto py-3 shrink-0">
                  {INDUSTRIES.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => setSelectedIndustry(industry)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        selectedIndustry === industry
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              )}

              {/* Templates grid */}
              <div className="flex-1 overflow-y-auto p-5">
                {templateSearch && (
                  <p className="text-xs text-gray-400 mb-4">
                    {displayedTemplates.length} result{displayedTemplates.length !== 1 ? "s" : ""} for "{templateSearch}"
                  </p>
                )}
                <div className="grid sm:grid-cols-2 gap-3">
                  {displayedTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => applyTemplate(template)}
                      className="text-left p-4 border border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0">{template.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900 text-sm group-hover:text-indigo-700">
                              {template.name}
                            </p>
                            {templateSearch && (
                              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                {template.industry}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{template.description}</p>
                          <span className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                            {AGENT_TYPES.find((t) => t.value === template.agentType)?.label ?? template.agentType}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {displayedTemplates.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No templates found for "{templateSearch}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Create New Agent</h2>
              <button
                type="button"
                onClick={() => setShowTemplates(true)}
                className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" /> Browse templates
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
            <form onSubmit={createAgent} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Hotel Reservations Bot"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agent Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {AGENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    System Prompt <span className="text-gray-400 font-normal">(optional — leave blank for default)</span>
                  </label>
                  {form.systemPrompt && (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Template loaded
                    </span>
                  )}
                </div>
                <textarea
                  value={form.systemPrompt}
                  onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  placeholder="Leave blank to use the default prompt, or click 'Browse templates' to load a ready-made one..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  You can edit the template prompt to match your specific business details.
                </p>
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={loading}>Create Agent</Button>
                <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setForm({ name: "", type: "CUSTOMER_SUPPORT", systemPrompt: "" }); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Agents Grid */}
      {agents.length === 0 && !showForm ? (
        <div className="text-center py-20 text-gray-400">
          <Bot className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No agents yet</p>
          <p className="text-sm mt-1 mb-6">Create your first AI agent to start automating</p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="secondary" onClick={() => setShowTemplates(true)} className="gap-2">
              <Sparkles className="w-4 h-4" /> Browse Templates
            </Button>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Start from Scratch
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardContent className="py-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Bot className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{agent.name}</p>
                      <p className="text-xs text-gray-500">{typeLabel(agent.type)}</p>
                    </div>
                  </div>
                  <Badge variant={agent.isActive ? "green" : "gray"}>
                    {agent.isActive ? "Active" : "Paused"}
                  </Badge>
                </div>

                {agent.systemPrompt && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{agent.systemPrompt}</p>
                )}

                <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                  <MessageSquare className="w-3 h-3" />
                  {agent._count.conversations} conversations
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAgent(agent.id, agent.isActive)}
                    className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900"
                  >
                    {agent.isActive
                      ? <ToggleRight className="w-4 h-4 text-green-500" />
                      : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                    {agent.isActive ? "Pause" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteAgent(agent.id)}
                    className="ml-auto flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
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
