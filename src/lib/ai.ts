import OpenAI from "openai";
import { getSetting } from "@/lib/settings";

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

async function getOpenAIClient() {
  const apiKey = await getSetting("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OpenAI API key not configured. Add it in Admin → Settings → API Keys.");
  return new OpenAI({ apiKey });
}

export async function runAgent(
  agentType: string,
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[]
) {
  const client = await getOpenAIClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt || AGENT_PROMPTS[agentType] },
      ...messages,
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0].message.content ?? "";
}
