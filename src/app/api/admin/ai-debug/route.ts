import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const settings = await getSettings([
    "AI_PROVIDER",
    "AI_OPENAI_ENABLED",
    "AI_GROK_ENABLED",
    "AI_GEMINI_ENABLED",
    "OPENAI_API_KEY",
    "GROK_API_KEY",
    "GEMINI_API_KEY",
  ]);

  const mask = (v: string) => v ? v.slice(0, 10) + "..." : "(empty)";

  return NextResponse.json({
    AI_PROVIDER: settings["AI_PROVIDER"] || "(not set — defaults to openai)",
    AI_OPENAI_ENABLED: settings["AI_OPENAI_ENABLED"] || "(not set — defaults to true)",
    AI_GROK_ENABLED: settings["AI_GROK_ENABLED"] || "(not set — defaults to true)",
    AI_GEMINI_ENABLED: settings["AI_GEMINI_ENABLED"] || "(not set — defaults to true)",
    OPENAI_API_KEY: mask(settings["OPENAI_API_KEY"]),
    GROK_API_KEY: mask(settings["GROK_API_KEY"]),
    GEMINI_API_KEY: mask(settings["GEMINI_API_KEY"]),
  });
}
