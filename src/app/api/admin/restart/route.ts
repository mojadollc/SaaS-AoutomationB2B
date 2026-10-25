import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { exec } from "child_process";

export async function POST() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return new Promise<NextResponse>((resolve) => {
    exec("pm2 restart aurex", (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ ok: false, error: stderr || error.message }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ ok: true, output: stdout }));
      }
    });
  });
}
