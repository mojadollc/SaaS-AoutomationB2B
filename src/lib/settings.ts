import { prisma } from "@/lib/prisma";

/**
 * Gets a setting value at runtime.
 * DB value takes priority over process.env — so keys saved in admin settings
 * are always used, even without restarting the server.
 */
export async function getSetting(key: string): Promise<string> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    if (row?.value && row.value.trim() !== "") return row.value;
  } catch {
    // DB not available — fall back to env
  }
  return process.env[key] ?? "";
}

/**
 * Gets multiple settings at once (single DB query).
 */
export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  try {
    const rows = await prisma.setting.findMany({ where: { key: { in: keys } } });
    const dbMap: Record<string, string> = {};
    rows.forEach((r) => { if (r.value?.trim()) dbMap[r.key] = r.value; });

    for (const key of keys) {
      result[key] = dbMap[key] ?? process.env[key] ?? "";
    }
  } catch {
    for (const key of keys) {
      result[key] = process.env[key] ?? "";
    }
  }

  return result;
}

/**
 * Checks if a payment gateway is enabled.
 * Defaults to true if not explicitly set to "false".
 */
export async function isGatewayEnabled(gateway: "stripe" | "paymongo" | "xendit"): Promise<boolean> {
  const key = `PAYMENT_${gateway.toUpperCase()}_ENABLED`;
  const val = await getSetting(key);
  return val !== "false";
}
