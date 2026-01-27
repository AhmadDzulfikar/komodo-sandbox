import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`;
    return NextResponse.json({ ok: true, now: data[0]?.now ?? null });
  } catch (error) {
    console.error("Database health check failed:", error);
    return NextResponse.json(
      { ok: false, error: "Database connection failed" },
      { status: 500 }
    );
  }
}