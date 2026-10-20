import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export function generateApiKey(): string {
  return "af_" + crypto.randomBytes(32).toString("hex");
}

export async function validateApiKey(key: string) {
  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
    include: { user: true },
  });
  if (!apiKey) return null;

  await prisma.apiKey.update({ where: { id: apiKey.id }, data: { lastUsed: new Date() } });
  return apiKey.user;
}
