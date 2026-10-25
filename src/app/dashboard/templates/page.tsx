"use client";
import { useState } from "react";
import { PROMPT_TEMPLATES, INDUSTRIES, type PromptTemplate } from "@/lib/templates";
import { Search, Bot, Copy, Check, Zap, X, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const AGENT_TYPE_LABELS: Record<string, string> = {
  CUSTOMER_SUPPORT: "Customer Support",
  LEAD_FOLLOWUP: "Lead Follow-Up",
  APPOINTMENT_BOOKING: "Appointment Booking",
  REPORT_GENERATOR: "Report Generator",
  ORDER_TAKING: "Order Taking",
};

const AGENT_TYPE_COLORS: Record<string, "blue" | "green" | "indigo" | "yellow" | "gray"> = {
  CUSTOMER_SUPPORT: "blue",
  LEAD_FOLLOWUP: "green",
  APPOINTMENT_BOOKING: "indigo",
  REPORT_GENERATOR: "yellow",
  ORDER_TAKING: "gray",
};

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");
  const [preview, setPreview] = useState<PromptTemplate | null>(null);
  const [copied, setCopied] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState<string | null>(null);

  const filtered = PROMPT_TEMPLATES.filter((t) => {
    const matchesIndustry = industry === "All" || t.industry === industry;
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.industry.toLowerCase().includes(search.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  function copyPrompt(prompt: string) {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function deployAsAgent(template: PromptTemplate) {
    setDeploying(true);
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: template.name,
        type: template.agentType === "ORDER_TAKING" ? "CUSTOMER_SUPPORT" : template.agentType,
        systemPrompt: template.prompt,
      }),
    });
    if (res.ok) {
      setDeployed(template.id);
      setTimeout(() => setDeployed(null), 3000);
    }
    setDeploying(false);
  }

  const grouped = INDUSTRIES.reduce<Record<string, PromptTemplate[]>>((acc, ind) => {
    const items = filtered.filter((t) => t.industry === ind);
    if (items.length > 0) acc[ind] = items;
    return acc;
  }, {});

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Agent Templates</h1>
        <p className="text-gray-500 text-sm mt-1">
          {PROMPT_TEMPLATES.length} ready-to-use prompts across {INDUSTRIES.length} industries. Deploy in one click.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...INDUSTRIES].map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustry(ind)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                industry === ind
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
              )}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-6">{filtered.length} templates found</p>

      {/* Grouped by industry */}
      {Object.entries(grouped).map(([ind, templates]) => (
        <div key={ind} className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{ind}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setPreview(template)}
              >
                <CardContent className="py-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{template.emoji}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{template.name}</p>
                        <Badge variant={AGENT_TYPE_COLORS[template.agentType] ?? "gray"} >
                          {AGENT_TYPE_LABELS[template.agentType] ?? template.agentType}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors mt-1" />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{template.description}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1 text-xs"
                      onClick={(e) => { e.stopPropagation(); setPreview(template); }}
                    >
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs gap-1"
                      loading={deploying && preview?.id === template.id}
                      onClick={(e) => { e.stopPropagation(); deployAsAgent(template); }}
                    >
                      {deployed === template.id ? (
                        <><Check className="w-3 h-3" /> Deployed!</>
                      ) : (
                        <><Zap className="w-3 h-3" /> Deploy</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No templates found</p>
          <p className="text-sm mt-1">Try a different search or industry filter</p>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{preview.emoji}</span>
                <div>
                  <h2 className="font-bold text-gray-900">{preview.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={AGENT_TYPE_COLORS[preview.agentType] ?? "gray"}>
                      {AGENT_TYPE_LABELS[preview.agentType] ?? preview.agentType}
                    </Badge>
                    <span className="text-xs text-gray-400">{preview.industry}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setPreview(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">{preview.description}</p>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">System Prompt</p>
                  <button
                    onClick={() => copyPrompt(preview.prompt)}
                    className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">
                  {preview.prompt}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => { copyPrompt(preview.prompt); }}
              >
                {copied ? <><Check className="w-4 h-4 mr-1" /> Copied!</> : <><Copy className="w-4 h-4 mr-1" /> Copy Prompt</>}
              </Button>
              <Button
                className="flex-1 gap-2"
                loading={deploying}
                onClick={() => deployAsAgent(preview)}
              >
                {deployed === preview.id ? (
                  <><Check className="w-4 h-4" /> Agent Created!</>
                ) : (
                  <><Zap className="w-4 h-4" /> Deploy as Agent</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
