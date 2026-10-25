"use client";
import { useState } from "react";
import { Copy, Check, BookOpen, Zap, MessageSquare, Bot, Key, Webhook } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://aurex.payroo.xyz";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="relative group">
      <pre className="bg-gray-900 text-gray-100 text-xs rounded-lg p-4 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function Badge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-green-100 text-green-700",
    POST: "bg-blue-100 text-blue-700",
    DELETE: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${colors[method] ?? "bg-gray-100 text-gray-700"}`}>
      {method}
    </span>
  );
}

const sections = [
  {
    id: "authentication",
    icon: Key,
    title: "Authentication",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          All API requests require an API key passed in the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-indigo-700">x-api-key</code> header.
          Generate your key from the <a href="/dashboard/keys" className="text-indigo-600 hover:underline">API Keys</a> page.
        </p>
        <CodeBlock code={`curl ${BASE}/api/webhook/inbound \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello"}'`} />
      </div>
    ),
  },
  {
    id: "inbound-webhook",
    icon: Webhook,
    title: "Inbound Webhook",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Send messages into Aurex from any external system — Zapier, Make, your own backend, etc.
        </p>
        <div className="flex items-center gap-2">
          <Badge method="POST" />
          <code className="text-xs font-mono text-gray-700">/api/webhook/inbound</code>
        </div>
        <p className="text-xs font-semibold text-gray-500 uppercase">Request Body</p>
        <CodeBlock code={`{
  "message": "What is my order status?",
  "userId": "user_123",          // optional — ties to a conversation
  "agentId": "agent_abc",        // optional — route to specific agent
  "metadata": {                  // optional — any extra context
    "orderId": "ORD-999"
  }
}`} />
        <p className="text-xs font-semibold text-gray-500 uppercase">Response</p>
        <CodeBlock code={`{
  "reply": "Your order ORD-999 is currently being shipped.",
  "conversationId": "conv_xyz",
  "agentId": "agent_abc"
}`} />
      </div>
    ),
  },
  {
    id: "agents",
    icon: Bot,
    title: "Agents",
    content: (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge method="GET" />
            <code className="text-xs font-mono text-gray-700">/api/agents</code>
          </div>
          <p className="text-sm text-gray-600">List all agents in your workspace.</p>
          <CodeBlock code={`curl ${BASE}/api/agents \\
  -H "x-api-key: YOUR_API_KEY"`} />
          <CodeBlock code={`[
  {
    "id": "agent_abc",
    "name": "Support Bot",
    "description": "Handles customer support queries",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]`} />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge method="POST" />
            <code className="text-xs font-mono text-gray-700">/api/agents</code>
          </div>
          <p className="text-sm text-gray-600">Create a new agent.</p>
          <CodeBlock code={`{
  "name": "Sales Bot",
  "description": "Handles product inquiries and upsells",
  "prompt": "You are a helpful sales assistant for Aurex..."
}`} />
        </div>
      </div>
    ),
  },
  {
    id: "conversations",
    icon: MessageSquare,
    title: "Conversations",
    content: (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge method="GET" />
            <code className="text-xs font-mono text-gray-700">/api/conversations</code>
          </div>
          <p className="text-sm text-gray-600">Retrieve all conversations. Supports pagination.</p>
          <CodeBlock code={`curl "${BASE}/api/conversations?page=1&limit=20" \\
  -H "x-api-key: YOUR_API_KEY"`} />
          <CodeBlock code={`{
  "data": [
    {
      "id": "conv_xyz",
      "userId": "user_123",
      "agentId": "agent_abc",
      "lastMessage": "Thank you!",
      "updatedAt": "2024-06-01T12:00:00Z"
    }
  ],
  "total": 42,
  "page": 1
}`} />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge method="GET" />
            <code className="text-xs font-mono text-gray-700">/api/conversations/:id/messages</code>
          </div>
          <p className="text-sm text-gray-600">Get all messages in a conversation.</p>
          <CodeBlock code={`curl ${BASE}/api/conversations/conv_xyz/messages \\
  -H "x-api-key: YOUR_API_KEY"`} />
        </div>
      </div>
    ),
  },
  {
    id: "zapier",
    icon: Zap,
    title: "Zapier Integration",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Connect Aurex to 6,000+ apps via Zapier using the inbound webhook.
        </p>
        <ol className="space-y-3 text-sm text-gray-600 list-decimal list-inside">
          <li>In Zapier, create a new Zap and choose <strong>Webhooks by Zapier</strong> as the action.</li>
          <li>Set the method to <strong>POST</strong> and the URL to:
            <CodeBlock code={`${BASE}/api/webhook/inbound`} />
          </li>
          <li>Add a header: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-indigo-700">x-api-key</code> → your API key.</li>
          <li>Map your Zapier trigger data to the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-indigo-700">message</code> and optional <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-indigo-700">userId</code> fields.</li>
          <li>Test and activate your Zap.</li>
        </ol>
      </div>
    ),
  },
];

export default function DocsPage() {
  const [active, setActive] = useState("authentication");

  const current = sections.find((s) => s.id === active)!;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">API Docs</h1>
        <p className="text-gray-500 text-sm mt-1">
          Everything you need to integrate Aurex into your stack.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <aside className="w-48 shrink-0">
          <nav className="space-y-1 sticky top-8">
            {sections.map(({ id, icon: Icon, title }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  active === id
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <current.icon className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-900">{current.title}</h2>
              </div>
            </CardHeader>
            <CardContent className="pt-0">{current.content}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
