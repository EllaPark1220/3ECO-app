// CT-DB-001 — DB 헬스체크. Prisma $queryRaw 로 SELECT 1 검증.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, provider: "postgresql" });
  } catch {
    return NextResponse.json(
      { ok: false, error_code: "STORAGE_UNAVAILABLE" },
      { status: 503 },
    );
  }
}
