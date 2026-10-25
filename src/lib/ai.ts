import OpenAI from "openai";
import { getSetting, getSettings } from "@/lib/settings";

const FORMAT_RULES = `
FORMATTING RULES (always follow these):
- When asking for multiple pieces of information, list each one as a labeled bullet: "- **Label:** description"
- When showing prices, always format as: **$XX.XX** or **$XX/mo** — never write prices as plain text
- When confirming collected details, show them as a labeled summary block:
  **Name:** ...
  **Date:** ...
  **Service:** ...
  (and so on for each field)
- When listing menu items, products, or services with prices, use this format:
  - **Item Name** — $XX.XX (brief description if needed)
- Keep responses concise. Never use raw dashes or asterisks as decoration — only use them for the formats above.
- Do not use HTML. Do not use markdown headers (###). Only use the bullet and bold formats described above.
`;

export const AGENT_PROMPTS: Record<string, string> = {
  CUSTOMER_SUPPORT: `You are a helpful customer support agent. Answer questions clearly and concisely. 
If the issue is complex or the customer is upset, say: "I'll connect you with a human agent right away."
Always be polite and professional.`,

  LEAD_FOLLOWUP: `You are a sales follow-up agent. Your goal is to re-engage leads warmly.
Ask about their needs, answer objections, and try to book a call or demo.
Keep messages short, friendly, and focused on value.`,

  APPOINTMENT_BOOKING: `You are an appointment booking assistant. Help users schedule, reschedule, or cancel appointments.
Collect: name, preferred date/time, and reason for visit.
Confirm details before finalizing. Be concise and friendly.`,

  REPORT_GENERATOR: `You are a business report assistant. Generate clear, structured summaries from the data provided.
Format reports with sections: Summary, Key Metrics, Insights, and Recommendations.`,

  ORDER_TAKING: `You are an order-taking assistant. Help customers place orders conversationally.
Collect: customer name, items they want to order (name and quantity), and delivery or pickup preference.
Confirm the full order summary before finalizing.
When the order is complete, output a JSON block in this exact format on its own line:
ORDER_JSON:{"contact":"name","items":[{"name":"item","quantity":1,"price":0}],"notes":"any notes"}
Be friendly, clear, and confirm each item before moving on.`,
};

type ChatMessage = { role: "user" | "assistant"; content: string };

async function runOpenAI(systemPrompt: string, messages: ChatMessage[]): Promise<string> {
  const apiKey = await getSetting("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OpenAI API key not configured. Add it in Admin → Settings → API Keys.");
  const client = new OpenAI({ apiKey });
  const res = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    max_tokens: 500,
    temperature: 0.7,
  });
  return res.choices[0].message.content ?? "";
}

async function runGrok(systemPrompt: string, messages: ChatMessage[]): Promise<string> {
  const apiKey = await getSetting("GROK_API_KEY");
  if (!apiKey) throw new Error("Grok API key not configured. Add it in Admin → Settings → API Keys.");
  const client = new OpenAI({ apiKey, baseURL: "https://api.x.ai/v1" });
  const res = await client.chat.completions.create({
    model: "grok-3",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    max_tokens: 500,
    temperature: 0.7,
  });
  return res.choices[0].message.content ?? "";
}

async function runGemini(systemPrompt: string, messages: ChatMessage[]): Promise<string> {
  const apiKey = await getSetting("GEMINI_API_KEY");
  if (!apiKey) throw new Error("Gemini API key not configured. Add it in Admin → Settings → API Keys.");

  const body = {
    contents: [
      { role: "user", parts: [{ text: `[System]: ${systemPrompt}` }] },
      { role: "model", parts: [{ text: "Understood. I will follow those instructions." }] },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    ],
    generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const fetchOpts = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };

  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, attempt * 2000));
    const res = await fetch(url, fetchOpts);
    const json = await res.json();
    if (res.status === 503) continue;
    if (!res.ok) throw new Error(json?.error?.message ?? `Gemini error ${res.status}: ${JSON.stringify(json)}`);
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }
  throw new Error("Gemini is currently overloaded. Please try again in a moment.");
}

export async function runAgent(
  agentType: string,
  systemPrompt: string,
  messages: ChatMessage[]
) {
  const settings = await getSettings(["AI_PROVIDER", "AI_OPENAI_ENABLED", "AI_GROK_ENABLED", "AI_GEMINI_ENABLED"]);
  const provider = settings["AI_PROVIDER"] || "openai";
  const prompt = (systemPrompt || AGENT_PROMPTS[agentType] || "") + FORMAT_RULES;

  switch (provider) {
    case "grok":
      if (settings["AI_GROK_ENABLED"] === "false") throw new Error("Grok is disabled.");
      return runGrok(prompt, messages);
    case "gemini":
      if (settings["AI_GEMINI_ENABLED"] === "false") throw new Error("Gemini is disabled.");
      return runGemini(prompt, messages);
    default:
      if (settings["AI_OPENAI_ENABLED"] === "false") throw new Error("OpenAI is disabled.");
      return runOpenAI(prompt, messages);
  }
}
