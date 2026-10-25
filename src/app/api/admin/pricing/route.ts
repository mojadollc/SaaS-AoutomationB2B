import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const KEY = "PRICING_PLANS";

export async function GET() {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  if (!row) return NextResponse.json(null);
  return NextResponse.json(JSON.parse(row.value));
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const plans = await req.json();
  await prisma.setting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(plans) },
    create: { key: KEY, value: JSON.stringify(plans) },
  });
  return NextResponse.json({ ok: true });
}
