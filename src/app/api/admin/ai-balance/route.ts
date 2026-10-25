import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

async function requireAdmin() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") return null;
  return session;
}

async function fetchOpenAIBalance(apiKey: string) {
  try {
    const res = await fetch("https://api.openai.com/v1/dashboard/billing/credit_grants", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) {
      // Try subscription endpoint for pay-as-you-go accounts
      const res2 = await fetch("https://api.openai.com/v1/dashboard/billing/subscription", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res2.ok) return { balance: null, error: `HTTP ${res.status}` };
      const data = await res2.json();
      return { balance: null, plan: data.plan?.title ?? "Pay-as-you-go", error: null };
    }
    const data = await res.json();
    const total = data.total_granted ?? 0;
    const used = data.total_used ?? 0;
    const remaining = data.total_available ?? (total - used);
    return { balance: remaining.toFixed(2), total: total.toFixed(2), used: used.toFixed(2), error: null };
  } catch (e: any) {
    return { balance: null, error: e.message };
  }
}

async function fetchGrokBalance(apiKey: string) {
  try {
    // xAI does not have a public balance/credits API endpoint yet
    // Verify the key is valid by hitting the models endpoint
    const res = await fetch("https://api.x.ai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return { balance: null, error: `HTTP ${res.status}` };
    return { balance: null, note: "Balance API not available for xAI. Check console.x.ai", error: null };
  } catch (e: any) {
    return { balance: null, error: e.message };
  }
}

async function fetchGeminiBalance(apiKey: string) {
  try {
    // Gemini is quota-based (free tier) — no credit balance API
    // Verify key by listing models
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return { balance: null, error: json?.error?.message ?? `HTTP ${res.status}` };
    }
    const data = await res.json();
    const count = data.models?.length ?? 0;
    return { balance: null, note: `Key valid · ${count} models available`, error: null };
  } catch (e: any) {
    return { balance: null, error: e.message };
  }
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const settings = await getSettings(["OPENAI_API_KEY", "GROK_API_KEY", "GEMINI_API_KEY"]);

  const [openai, grok, gemini] = await Promise.all([
    settings["OPENAI_API_KEY"] ? fetchOpenAIBalance(settings["OPENAI_API_KEY"]) : { balance: null, error: "No API key" },
    settings["GROK_API_KEY"]   ? fetchGrokBalance(settings["GROK_API_KEY"])     : { balance: null, error: "No API key" },
    settings["GEMINI_API_KEY"] ? fetchGeminiBalance(settings["GEMINI_API_KEY"]) : { balance: null, error: "No API key" },
  ]);

  return NextResponse.json({ openai, grok, gemini });
}
