import { NextResponse } from "next/server";
import { getEnabledGateways } from "@/lib/payments";

export async function GET() {
  const gateways = await getEnabledGateways();
  return NextResponse.json(gateways);
}
