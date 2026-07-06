// FW-AUTH-001 — Auth 헬스체크. 서버 클라이언트 생성 + 세션 조회 무오류 확인.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clientEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.getSession();
    if (error) throw error;
    return NextResponse.json({
      ok: true,
      supabase_url_present: Boolean(clientEnv.NEXT_PUBLIC_SUPABASE_URL),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error_code: "AUTH_UNAVAILABLE" },
      { status: 503 },
    );
  }
}
