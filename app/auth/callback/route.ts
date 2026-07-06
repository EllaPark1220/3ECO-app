// FW-AUTH-004 — 이메일 확인 콜백. 코드→세션 교환 후 확인된 계정만 public.User 등록.
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncConfirmedUser } from "@/lib/auth/sync-user";
import { safeInternalPath } from "@/lib/auth/redirect";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = safeInternalPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // 만료·재사용 등 — 존재/원인 비노출 일반 코드
    return NextResponse.redirect(`${origin}/auth/login?error=confirm_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    try {
      await syncConfirmedUser(user);
    } catch (e) {
      // TODO(NF-OBS-001): Sentry 알림. 지금은 graceful 리다이렉트.
      console.error(`[auth/callback] syncConfirmedUser 실패 user=${user.id}`, e);
      return NextResponse.redirect(`${origin}/auth/login?error=sync_failed`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
