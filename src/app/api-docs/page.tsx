"use client";
import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

type Endpoint = {
  method: Method;
  path: string;
  description: string;
  auth: boolean;
  body?: Record<string, string>;
  response: string;
  example?: string;
};

type Section = {
  id: string;
  title: string;
  description: string;
  endpoints: Endpoint[];
};

const BASE_URL = "https://yourdomain.com";

const METHOD_COLORS: Record<Method, string> = {
  GET: "bg-blue-100 text-blue-700",
  POST: "bg-green-100 text-green-700",
  PATCH: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
};

const SECTIONS: Section[] = [
  {
    id: "authentication",
    title: "Authentication",
    description: "Aurex uses API keys for programmatic access. Include your key in the x-api-key header on every request.",
    endpoints: [
      {
        method: "POST",
        path: "/api/register",
        description: "Create a new user account.",
        auth: false,
        body: {
          name: "string — Full name",
          email: "string — Email address",
          password: "string — Min 6 characters",
        },
        response: `{ "id": "clx...", "email": "user@example.com", "name": "Jane Smith" }`,
      },
    ],
  },
  {
    id: "agents",
    title: "Agents",
    description: "Create and manage AI agents. Each agent has a type and an optional custom system prompt.",
    endpoints: [
      {
        method: "GET",
        path: "/api/agents",
        description: "List all agents for the authenticated user.",
        auth: true,
        response: `[
  {
    "id": "clx...",
    "name": "Hotel Support Bot",
    "type": "CUSTOMER_SUPPORT",
    "systemPrompt": "You are a hotel concierge...",
    "isActive": true,
    "_count": { "conversations": 42 }
  }
]`,
      },
      {
        method: "POST",
        path: "/api/agents",
        description: "Create a new agent. Plan limits apply.",
        auth: true,
        body: {
          name: "string — Agent display name",
          type: "CUSTOMER_SUPPORT | LEAD_FOLLOWUP | APPOINTMENT_BOOKING | REPORT_GENERATOR",
          systemPrompt: "string? — Custom instructions (optional)",
        },
        response: `{
  "id": "clx...",
  "name": "Hotel Support Bot",
  "type": "CUSTOMER_SUPPORT",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z"
}`,
      },
      {
        method: "PATCH",
        path: "/api/agents/:id",
        description: "Update an agent's name, prompt, or active status.",
        auth: true,
        body: {
          name: "string? — New name",
          systemPrompt: "string? — New prompt",
          isActive: "boolean? — Enable or pause",
        },
        response: `{ "id": "clx...", "name": "Updated Name", "isActive": false }`,
      },
      {
        method: "DELETE",
        path: "/api/agents/:id",
        description: "Delete an agent and all its conversations.",
        auth: true,
        response: `{ "success": true }`,
      },
    ],
  },
  {
    id: "conversations",
    title: "Conversations",
    description: "Start and continue AI-powered conversations. Each message triggers a GPT-4o response.",
    endpoints: [
      {
        method: "GET",
        path: "/api/conversations",
        description: "List conversations. Filter by agent using ?agentId=",
        auth: true,
        response: `[
  {
    "id": "clx...",
    "contact": "John Doe",
    "status": "OPEN",
    "agent": { "id": "clx...", "name": "Support Bot" },
    "messages": [
      { "role": "user", "content": "Hi, I need help" },
      { "role": "assistant", "content": "Hello! How can I help?" }
    ]
  }
]`,
      },
      {
        method: "POST",
        path: "/api/conversations",
        description: "Start a new conversation. Returns the AI's first reply.",
        auth: true,
        body: {
          agentId: "string — ID of the agent to use",
          contact: "string — Customer name or identifier",
          message: "string — First message from the customer",
        },
        response: `{
  "conversation": { "id": "clx...", "contact": "John", "status": "OPEN" },
  "aiMessage": { "role": "assistant", "content": "Hello John! How can I help?" }
}`,
        example: `curl -X POST ${BASE_URL}/api/conversations \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{"agentId":"clx...","contact":"John","message":"Hi, I need help"}'`,
      },
      {
        method: "POST",
        path: "/api/conversations/:id",
        description: "Send a message to an existing conversation.",
        auth: true,
        body: {
          message: "string — Message content",
        },
        response: `{ "id": "clx...", "role": "assistant", "content": "Here is my reply..." }`,
      },
      {
        method: "PATCH",
        path: "/api/conversations/:id",
        description: "Update conversation status.",
        auth: true,
        body: {
          status: "OPEN | RESOLVED | ESCALATED",
        },
        response: `{ "count": 1 }`,
      },
    ],
  },
  {
    id: "widget",
    title: "Embeddable Widget",
    description: "Embed a chat widget on any website with a single script tag.",
    endpoints: [
      {
        method: "GET",
        path: "/api/widget?agentId=:id",
        description: "Returns the embeddable JavaScript widget for a given agent.",
        auth: false,
        response: `// JavaScript widget bundle`,
        example: `<!-- Add before </body> on your website -->
<script
  src="${BASE_URL}/api/widget?agentId=YOUR_AGENT_ID"
  async
></script>`,
      },
    ],
  },
  {
    id: "webhooks",
    title: "Webhooks",
    description: "Receive real-time event notifications when conversations are created, updated, or resolved.",
    endpoints: [
      {
        method: "GET",
        path: "/api/webhooks",
        description: "List all configured webhook endpoints.",
        auth: true,
        response: `[
  {
    "id": "clx...",
    "url": "https://your-system.com/webhook",
    "events": ["conversation.created", "message.created"],
    "secret": "whsec_..."
  }
]`,
      },
      {
        method: "POST",
        path: "/api/webhooks",
        description: "Register a new webhook endpoint.",
        auth: true,
        body: {
          url: "string — Your endpoint URL",
          events: "string[] — Events to subscribe to",
        },
        response: `{ "id": "clx...", "url": "...", "secret": "whsec_..." }`,
        example: `// Webhook payload example
{
  "event": "conversation.created",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "data": {
    "id": "clx...",
    "contact": "John Doe",
    "agentId": "clx...",
    "status": "OPEN"
  }
}`,
      },
      {
        method: "DELETE",
        path: "/api/webhooks/:id",
        description: "Remove a webhook endpoint.",
        auth: true,
        response: `{ "success": true }`,
      },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect Aurex to external platforms using these webhook endpoints.",
    endpoints: [
      {
        method: "POST",
        path: "/api/integrations/zapier",
        description: "Trigger an agent from a Zapier workflow.",
        auth: false,
        body: {
          agentId: "string — Agent to use",
          contact: "string — Contact identifier",
          message: "string — Message to process",
        },
        response: `{ "reply": "AI response text" }`,
        example: `// Required header
x-api-key: YOUR_API_KEY`,
      },
      {
        method: "POST",
        path: "/api/integrations/whatsapp",
        description: "Twilio WhatsApp webhook. Set this as your Twilio webhook URL.",
        auth: false,
        response: `// TwiML response with AI reply`,
        example: `// Set in Twilio Console:
// Webhook URL: ${BASE_URL}/api/integrations/whatsapp
// Required .env:
TWILIO_AUTH_TOKEN=your_token
WHATSAPP_DEFAULT_AGENT_ID=clx...`,
      },
      {
        method: "POST",
        path: "/api/integrations/messenger",
        description: "Facebook Messenger webhook for auto-replies.",
        auth: false,
        response: `{ "status": "ok" }`,
        example: `// Required .env:
MESSENGER_VERIFY_TOKEN=your_token
MESSENGER_PAGE_ACCESS_TOKEN=your_token
MESSENGER_DEFAULT_AGENT_ID=clx...`,
      },
      {
        method: "POST",
        path: "/api/integrations/slack",
        description: "Slack slash command handler. Use /Aurex in your workspace.",
        auth: false,
        body: {
          text: "string — agentId + message",
        },
        response: `{ "text": "AI reply" }`,
      },
    ],
  },
];

const EVENTS = [
  { name: "conversation.created", desc: "A new conversation was started" },
  { name: "conversation.updated", desc: "Conversation status changed" },
  { name: "conversation.resolved", desc: "Conversation marked as resolved" },
  { name: "conversation.escalated", desc: "Conversation escalated to human" },
  { name: "message.created", desc: "A new message was sent or received" },
];

export default function ApiDocsPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ authentication: true, agents: true });
  const [copied, setCopied] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("authentication");

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function toggleSection(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center font-bold text-indigo-600">
          Aurex
          <span className="text-gray-400 font-normal text-sm ml-1">/ API Docs</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/keys" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
            Get API Key <ExternalLink className="w-3 h-3" />
          </Link>
          <Link href="/dashboard" className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 px-4 hidden lg:block">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Reference</p>
          <nav className="space-y-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSection(s.id);
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  activeSection === s.id
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {s.title}
              </button>
            ))}
            <button
              onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              Webhook Events
            </button>
            <button
              onClick={() => document.getElementById("errors")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              Error Codes
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-8 px-6 max-w-4xl">
          {/* Intro */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">API Reference</h1>
            <p className="text-gray-500 leading-relaxed">
              The Aurex API lets you integrate AI agents into any application, website, or workflow.
              All endpoints return JSON. Authentication uses API keys passed via the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-indigo-700">x-api-key</code> header.
            </p>
            <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-indigo-800 mb-1">Base URL</p>
              <div className="flex items-center gap-2">
                <code className="text-sm text-indigo-700 flex-1">{BASE_URL}</code>
                <button onClick={() => copy(BASE_URL, "base")} className="text-indigo-400 hover:text-indigo-700">
                  {copied === "base" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <div className="mb-10 bg-gray-900 rounded-2xl p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Start</p>
            <pre className="text-sm text-green-400 whitespace-pre-wrap leading-relaxed">{`# 1. Get your API key from Dashboard → API Keys

# 2. Start a conversation
curl -X POST ${BASE_URL}/api/conversations \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "agentId": "YOUR_AGENT_ID",
    "contact": "John Doe",
    "message": "Hi, I need help booking an appointment"
  }'

# 3. Response
{
  "conversation": { "id": "clx...", "status": "OPEN" },
  "aiMessage": { "role": "assistant", "content": "Hello John! I'd be happy to help you book an appointment..." }
}`}</pre>
          </div>

          {/* Sections */}
          {SECTIONS.map((section) => (
            <div key={section.id} id={section.id} className="mb-12">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between mb-4 group"
              >
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {section.title}
                </h2>
                {openSections[section.id]
                  ? <ChevronDown className="w-5 h-5 text-gray-400" />
                  : <ChevronRight className="w-5 h-5 text-gray-400" />}
              </button>
              <p className="text-sm text-gray-500 mb-6">{section.description}</p>

              {openSections[section.id] !== false && (
                <div className="space-y-6">
                  {section.endpoints.map((ep, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      {/* Endpoint Header */}
                      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                        <span className={cn("text-xs font-bold px-2.5 py-1 rounded-md font-mono", METHOD_COLORS[ep.method])}>
                          {ep.method}
                        </span>
                        <code className="text-sm font-mono text-gray-800 flex-1">{ep.path}</code>
                        {ep.auth && (
                          <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">
                            🔑 Auth required
                          </span>
                        )}
                      </div>

                      <div className="px-5 py-4 space-y-4">
                        <p className="text-sm text-gray-600">{ep.description}</p>

                        {/* Request Body */}
                        {ep.body && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Request Body</p>
                            <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-100">
                              {Object.entries(ep.body).map(([key, val]) => (
                                <div key={key} className="flex items-start gap-3 px-4 py-2.5">
                                  <code className="text-xs font-mono text-indigo-700 shrink-0 mt-0.5">{key}</code>
                                  <span className="text-xs text-gray-500">{val}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Response */}
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Response</p>
                          <div className="relative">
                            <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-xs overflow-x-auto leading-relaxed">
                              {ep.response}
                            </pre>
                            <button
                              onClick={() => copy(ep.response, `res-${section.id}-${i}`)}
                              className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                            >
                              {copied === `res-${section.id}-${i}`
                                ? <Check className="w-3 h-3 text-green-400" />
                                : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {/* Example */}
                        {ep.example && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Example</p>
                            <div className="relative">
                              <pre className="bg-gray-900 text-blue-300 rounded-lg p-4 text-xs overflow-x-auto leading-relaxed">
                                {ep.example}
                              </pre>
                              <button
                                onClick={() => copy(ep.example!, `ex-${section.id}-${i}`)}
                                className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                              >
                                {copied === `ex-${section.id}-${i}`
                                  ? <Check className="w-3 h-3 text-green-400" />
                                  : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Webhook Events */}
          <div id="events" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Webhook Events</h2>
            <p className="text-sm text-gray-500 mb-6">
              Subscribe to these events when registering a webhook endpoint. Aurex signs each payload with your webhook secret using HMAC-SHA256.
            </p>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {EVENTS.map((ev) => (
                <div key={ev.name} className="flex items-center gap-4 px-5 py-3">
                  <code className="text-xs font-mono text-indigo-700 w-52 shrink-0">{ev.name}</code>
                  <span className="text-sm text-gray-500">{ev.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-900 rounded-xl p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Verifying Webhook Signatures</p>
              <pre className="text-xs text-green-400 leading-relaxed whitespace-pre-wrap">{`// Node.js example
import crypto from "crypto";

function verifyWebhook(payload: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`}</pre>
            </div>
          </div>

          {/* Error Codes */}
          <div id="errors" className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Error Codes</h2>
            <p className="text-sm text-gray-500 mb-6">
              All errors return a JSON object with an <code className="bg-gray-100 px-1 rounded text-sm">error</code> field describing the issue.
            </p>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {[
                { code: "400", label: "Bad Request", desc: "Invalid or missing request parameters" },
                { code: "401", label: "Unauthorized", desc: "Missing or invalid authentication" },
                { code: "403", label: "Forbidden", desc: "Plan limit reached or insufficient permissions" },
                { code: "404", label: "Not Found", desc: "Resource does not exist or belongs to another user" },
                { code: "409", label: "Conflict", desc: "Resource already exists (e.g. duplicate email)" },
                { code: "429", label: "Too Many Requests", desc: "Rate limit exceeded — retry after 60 seconds" },
                { code: "500", label: "Server Error", desc: "Unexpected server error — contact support" },
              ].map((err) => (
                <div key={err.code} className="flex items-center gap-4 px-5 py-3">
                  <span className={cn(
                    "text-xs font-bold font-mono px-2 py-0.5 rounded w-12 text-center shrink-0",
                    err.code.startsWith("4") ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {err.code}
                  </span>
                  <span className="text-sm font-medium text-gray-800 w-36 shrink-0">{err.label}</span>
                  <span className="text-sm text-gray-500">{err.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-900 rounded-xl p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Error Response Format</p>
              <pre className="text-xs text-red-400 leading-relaxed">{`{
  "error": "Upgrade your plan to create more agents"
}`}</pre>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="mb-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-yellow-900 mb-3">Rate Limits</h2>
            <div className="space-y-2 text-sm text-yellow-800">
              <div className="flex justify-between"><span>Free plan</span><span className="font-mono">60 requests / minute</span></div>
              <div className="flex justify-between"><span>Starter plan</span><span className="font-mono">300 requests / minute</span></div>
              <div className="flex justify-between"><span>Pro plan</span><span className="font-mono">1,000 requests / minute</span></div>
              <div className="flex justify-between"><span>Agency plan</span><span className="font-mono">Unlimited</span></div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
            <p>Need help? <a href="mailto:support@Aurex.io" className="text-indigo-600 hover:underline">support@Aurex.io</a></p>
            <p className="mt-1">© 2025 Aurex. All rights reserved.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
