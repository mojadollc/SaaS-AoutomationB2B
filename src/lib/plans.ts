export const PLAN_LIMITS = {
  FREE:    { agents: 1,  conversations: 50,   name: "Free" },
  STARTER: { agents: 3,  conversations: 500,  name: "Starter" },
  PRO:     { agents: 10, conversations: 5000, name: "Pro" },
  AGENCY:  { agents: -1, conversations: -1,   name: "Agency" },
};

export type PlanKey = keyof typeof PLAN_LIMITS;

/** Returns how many conversations the user has started this calendar month */
export async function getMonthlyConversationCount(userId: string, prisma: any): Promise<number> {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return prisma.conversation.count({
    where: { userId, createdAt: { gte: start } },
  });
}

/** Returns an error string if the user is over their plan limit, null if ok */
export async function checkConversationLimit(
  userId: string,
  plan: string,
  prisma: any
): Promise<string | null> {
  const limits = PLAN_LIMITS[plan as PlanKey] ?? PLAN_LIMITS.FREE;
  if (limits.conversations === -1) return null; // unlimited
  const count = await getMonthlyConversationCount(userId, prisma);
  if (count >= limits.conversations)
    return `You've reached your ${limits.conversations} conversations/month limit on the ${limits.name} plan. Please upgrade to continue.`;
  return null;
}

export const PLAN_FEATURES = {
  FREE:    ["1 AI Agent", "50 conversations/mo", "Email support"],
  STARTER: ["3 AI Agents", "500 conversations/mo", "Priority support", "Analytics"],
  PRO:     ["10 AI Agents", "5,000 conversations/mo", "Custom prompts", "Webhooks", "API access"],
  AGENCY:  ["Unlimited agents", "Unlimited conversations", "White-label", "Dedicated support", "Custom integrations"],
};

// USD prices (Stripe)
export const PLAN_PRICES_USD: Record<string, number> = {
  FREE: 0, STARTER: 29, PRO: 99, AGENCY: 299,
};

// PHP prices (PayMongo & Xendit) — approximate at ₱57/USD
export const PLAN_PRICES_PHP: Record<string, number> = {
  FREE: 0, STARTER: 1650, PRO: 5600, AGENCY: 16800,
};

export type PlanKey = "FREE" | "STARTER" | "PRO" | "AGENCY";
export const PAID_PLANS: PlanKey[] = ["STARTER", "PRO", "AGENCY"];
