import { prisma } from "@/lib/prisma";

export async function isPaymentEnabled(gateway: "STRIPE" | "PAYMONGO" | "XENDIT"): Promise<boolean> {
  const key = `PAYMENT_${gateway}_ENABLED`;
  const row = await prisma.setting.findUnique({ where: { key } });
  // Default to enabled if not explicitly set to "false"
  return row?.value !== "false";
}

export async function getEnabledGateways(): Promise<{ stripe: boolean; paymongo: boolean; xendit: boolean }> {
  const rows = await prisma.setting.findMany({
    where: { key: { in: ["PAYMENT_STRIPE_ENABLED", "PAYMENT_PAYMONGO_ENABLED", "PAYMENT_XENDIT_ENABLED"] } },
  });
  const map: Record<string, string> = {};
  rows.forEach((r: { key: string; value: string }) => { map[r.key] = r.value; });
  return {
    stripe:   map["PAYMENT_STRIPE_ENABLED"]   !== "false",
    paymongo: map["PAYMENT_PAYMONGO_ENABLED"] !== "false",
    xendit:   map["PAYMENT_XENDIT_ENABLED"]   !== "false",
  };
}
