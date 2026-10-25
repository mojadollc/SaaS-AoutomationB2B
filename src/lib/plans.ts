export const PLAN_LIMITS = {
  FREE:    { agents: 1,  conversations: 20,   name: "Free" },
  STARTER: { agents: 3,  conversations: 500,  name: "Starter" },
  PRO:     { agents: 10, conversations: 5000, name: "Pro" },
  AGENCY:  { agents: -1, conversations: -1,   name: "Agency" },
};

export type PlanKey = keyof typeof PLAN_LIMITS;

export const TRIAL_DAYS = 7;

/** Returns days remaining in trial (negative = expired). Only applies to FREE plan. */
export function getTrialDaysLeft(createdAt: Date): number {
  const expiry = new Date(createdAt);
  expiry.setDate(expiry.getDate() + TRIAL_DAYS);
  return Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function isTrialExpired(plan: string, createdAt: Date): boolean {
  if (plan !== "FREE") return false;
  return getTrialDaysLeft(createdAt) <= 0;
}

/**
 * Returns an error string if the FREE trial has expired, null if access is allowed.
 */
export async function checkTrialAccess(
  plan: string,
  userId: string,
  prisma: any
): Promise<string | null> {
  if (plan !== "FREE") return null;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true } });
  if (!user) return null;
  if (isTrialExpired(plan, user.createdAt))
    return "Your 7-day free trial has expired. Please upgrade to the Starter plan to continue.";
  return null;
}

/** Returns how many conversations the user has started this calendar month */
export async function getMonthlyConversationCount(userId: string, prisma: any): Promise<number> {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return prisma.conversation.count({
    where: { userId, createdAt: { gte: start } },
  });
}

/**
 * Reads the conversation limit for a plan from DB pricing (admin-configurable),
 * falls back to PLAN_LIMITS if not set.
 */
async function getConversationLimit(plan: string, prisma: any): Promise<{ limit: number; planName: string }> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "PRICING_PLANS" } });
    if (row) {
      const plans: Array<{ key: string; name: string; priceUSD: number; features: string[] }> = JSON.parse(row.value);
      const found = plans.find((p) => p.key === plan);
      if (found) {
        // Extract conversation count from features array e.g. "20 conversations/mo"
        const feat = found.features.find((f: string) => f.toLowerCase().includes("conversation"));
        if (feat) {
          const match = feat.match(/([\d,]+)/);
          if (match) {
            const limit = parseInt(match[1].replace(/,/g, ""), 10);
            if (!isNaN(limit)) return { limit, planName: found.name };
          }
          if (feat.toLowerCase().includes("unlimited")) return { limit: -1, planName: found.name };
        }
      }
    }
  } catch { /* fall through to defaults */ }
  const defaults = PLAN_LIMITS[plan as PlanKey] ?? PLAN_LIMITS.FREE;
  return { limit: defaults.conversations, planName: defaults.name };
}

/** Returns an error string if the user is over their plan limit, null if ok */
export async function checkConversationLimit(
  userId: string,
  plan: string,
  prisma: any
): Promise<string | null> {
  const { limit, planName } = await getConversationLimit(plan, prisma);
  if (limit === -1) return null;
  const count = await getMonthlyConversationCount(userId, prisma);
  if (count >= limit)
    return `You've reached your ${limit} conversations/month limit on the ${planName} plan. Please upgrade to continue.`;
  return null;
}

export const PLAN_FEATURES = {
  FREE:    ["1 AI Agent", "20 conversations/mo", "Email support"],
  STARTER: ["3 AI Agents", "500 conversations/mo", "Priority support", "Analytics"],
  PRO:     ["10 AI Agents", "5,000 conversations/mo", "Custom prompts", "Webhooks", "API access"],
  AGENCY:  ["Unlimited agents", "Unlimited conversations", "White-label", "Dedicated support", "Custom integrations"],
};

// USD prices (Stripe)
export const PLAN_PRICES_USD: Record<string, number> = {
  FREE: 0, STARTER: 29, PRO: 99, AGENCY: 299,
};

// PHP prices (PayMongo & Xendit)
export const PLAN_PRICES_PHP: Record<string, number> = {
  FREE: 0, STARTER: 1650, PRO: 5600, AGENCY: 16800,
};

export const PAID_PLANS: PlanKey[] = ["STARTER", "PRO", "AGENCY"];
