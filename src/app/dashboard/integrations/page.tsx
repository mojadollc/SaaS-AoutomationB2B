"use client";
import { useState, useEffect } from "react";
import { ExternalLink, Copy, Check, Webhook, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const BASE = typeof window !== "undefined" ? window.location.origin : "";

const INTEGRATIONS = [
  {
    id: "zapier",
    name: "Zapier",
    logo: "⚡",
    description: "Connect AgentFlow to 5,000+ apps. Use your API key to trigger agents from any Zap.",
    steps: [
      'In Zapier, create a new Zap and choose "Webhooks by Zapier" as the action.',
      "Set method to POST and URL to the endpoint below.",
      'Add header: x-api-key → your API key.',
      'Body: { "agentId": "...", "contact": "...", "message": "..." }',
    ],
    endpoint: `${BASE}/api/integrations/zapier`,
    docs: "https://zapier.com/apps/webhook/integrations",
  },
  {
    id: "slack",
    name: "Slack",
    logo: "💬",
    description: "Add a /agentflow slash command to your Slack workspace.",
    steps: [
      "Go to api.slack.com/apps and create a new app.",
      "Add a Slash Command: /agentflow pointing to the endpoint below.",
      "Add SLACK_SIGNING_SECRET to your .env from the app credentials.",
      "Use: /agentflow <agentId> <your message>",
    ],
    endpoint: `${BASE}/api/integrations/slack`,
    docs: "https://api.slack.com/interactivity/slash-commands",
  },
  {
    id: "whatsapp",
    name: "WhatsApp (Twilio)",
    logo: "📱",
    description: "Auto-reply to WhatsApp messages using Twilio's WhatsApp Business API.",
    steps: [
      "Create a Twilio account and enable WhatsApp Sandbox or Business API.",
      "Set the webhook URL in Twilio console to the endpoint below.",
      "Add TWILIO_AUTH_TOKEN and WHATSAPP_DEFAULT_AGENT_ID to your .env.",
      "Messages sent to your WhatsApp number will be handled by the agent.",
    ],
    endpoint: `${BASE}/api/integrations/whatsapp`,
    docs: "https://www.twilio.com/docs/whatsapp",
  },
  {
    id: "messenger",
    name: "Facebook Messenger",
    logo: "📘",
    description: "Auto-reply to Facebook Page messages using the Meta Messenger API.",
    steps: [
      "Go to developers.facebook.com and create an app with Messenger product.",
      "Set the webhook URL to the endpoint below with verify token from your .env.",
      "Add MESSENGER_VERIFY_TOKEN, MESSENGER_PAGE_ACCESS_TOKEN, and MESSENGER_DEFAULT_AGENT_ID to .env.",
      "Subscribe to 'messages' webhook events.",
    ],
    endpoint: `${BASE}/api/integrations/messenger`,
    docs: "https://developers.facebook.com/docs/messenger-platform",
  },
  {
    id: "widget",
    name: "Embeddable Chat Widget",
    logo: "🪟",
    description: "Embed a chat widget on any website with a single script tag.",
    steps: [
      "Copy your Agent ID from the Agents page.",
      "Add the script tag below to your website's HTML before </body>.",
      "The widget will appear as a chat bubble on your site.",
      "Conversations appear in your AgentFlow dashboard automatically.",
    ],
    endpoint: `${BASE}/api/widget`,
    docs: null,
  },
];

const WEBHOOK_EVENTS = [
  "conversation.created",
  "conversation.updated",
  "conversation.resolved",
  "conversation.escalated",
  "message.created",
];

export default function IntegrationsPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);
  const [webhookForm, setWebhookForm] = useState({ url: "", events: [] as string[] });
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [savingWebhook, setSavingWebhook] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");

  useEffect(() => {
    fetch("/api/agents").then((r) => r.json()).then(setAgents);
    fetch("/api/webhooks").then((r) => r.json()).then(setWebhooks);
  }, []);

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  async function saveWebhook(e: React.FormEvent) {
    e.preventDefault();
    setSavingWebhook(true);
    const res = await fetch("/api/webhooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookForm),
    });
    if (res.ok) {
      const data = await res.json();
      setWebhooks((prev) => [data, ...prev]);
      setWebhookForm({ url: "", events: [] });
    }
    setSavingWebhook(false);
  }

  async function deleteWebhook(id: string) {
    await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
  }

  function toggleEvent(event: string) {
    setWebhookForm((prev) => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter((e) => e !== event)
        : [...prev.events, event],
    }));
  }

  const widgetSnippet = selectedAgent
    ? `<script src="${BASE}/api/widget?agentId=${selectedAgent}" async></script>`
    : `<script src="${BASE}/api/widget?agentId=YOUR_AGENT_ID" async></script>`;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-500 text-sm mt-1">
          Connect AgentFlow to your existing tools and platforms.
        </p>
      </div>

      {/* Integration cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {INTEGRATIONS.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.logo}</span>
                  <h2 className="font-semibold text-gray-900">{integration.name}</h2>
                </div>
                {integration.docs && (
                  <a
                    href={integration.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 flex items-center gap-1 hover:underline"
                  >
                    Docs <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{integration.description}</p>
            </CardHeader>
            <CardContent>
              <ol className="space-y-1.5 mb-4">
                {integration.steps.map((step, i) => (
                  <li key={i} className="text-xs text-gray-600 flex gap-2">
                    <span className="text-indigo-500 font-semibold shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>

              {integration.id === "widget" ? (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Select Agent</label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Choose an agent...</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                    <code className="text-xs text-indigo-700 flex-1 truncate">{widgetSnippet}</code>
                    <button onClick={() => copy(widgetSnippet, "widget")} className="shrink-0 text-gray-400 hover:text-gray-700">
                      {copied === "widget" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                  <code className="text-xs text-indigo-700 flex-1 truncate">{integration.endpoint}</code>
                  <button
                    onClick={() => copy(integration.endpoint, integration.id)}
                    className="shrink-0 text-gray-400 hover:text-gray-700"
                  >
                    {copied === integration.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Outbound Webhooks */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Webhook className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Outbound Webhooks</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          AgentFlow will POST to your URL when events happen. Use this to sync with HubSpot, Salesforce, or any custom system.
        </p>

        <Card className="mb-6">
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Add Webhook Endpoint</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveWebhook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
                <input
                  value={webhookForm.url}
                  onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
                  required
                  type="url"
                  placeholder="https://your-system.com/webhook"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Events to subscribe</label>
                <div className="flex flex-wrap gap-2">
                  {WEBHOOK_EVENTS.map((event) => (
                    <button
                      key={event}
                      type="button"
                      onClick={() => toggleEvent(event)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        webhookForm.events.includes(event)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                      }`}
                    >
                      {event}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" loading={savingWebhook} className="gap-2">
                <Zap className="w-4 h-4" /> Add Webhook
              </Button>
            </form>
          </CardContent>
        </Card>

        {webhooks.length > 0 && (
          <div className="space-y-3">
            {webhooks.map((w) => (
              <Card key={w.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{w.url}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{w.events.join(", ")}</p>
                    <p className="text-xs font-mono text-gray-300 mt-0.5">Secret: {w.secret.slice(0, 16)}...</p>
                  </div>
                  <button
                    onClick={() => deleteWebhook(w.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
