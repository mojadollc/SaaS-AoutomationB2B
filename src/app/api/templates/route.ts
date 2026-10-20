import { NextResponse } from "next/server";
import { PROMPT_TEMPLATES, INDUSTRIES } from "@/lib/templates";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const industry = searchParams.get("industry");
  const agentType = searchParams.get("agentType");
  const search = searchParams.get("search")?.toLowerCase();

  let templates = PROMPT_TEMPLATES;

  if (industry) templates = templates.filter((t) => t.industry === industry);
  if (agentType) templates = templates.filter((t) => t.agentType === agentType);
  if (search) {
    templates = templates.filter(
      (t) =>
        t.name.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search) ||
        t.industry.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ templates, industries: INDUSTRIES, total: templates.length });
}
