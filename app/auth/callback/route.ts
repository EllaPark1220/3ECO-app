// FW-AUTH-004 — 인증 콜백. 확인된 계정만 public.User 등록.
//  - 이메일 확인/비번재설정: token_hash + verifyOtp (Supabase SSR 권장). PKCE code_verifier
//    쿠키 의존·메일 클라이언트 링크 프리페치로 인한 일회용 code 소비(=confirm_failed) 취약성을 회피.
//  - OAuth(카카오): code + exchangeCodeForSession.
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { syncConfirmedUser } from "@/lib/auth/sync-user";
import { safeInternalPath } from "@/lib/auth/redirect";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const oauthError = searchParams.get("error");
  const next = safeInternalPath(searchParams.get("next"));

  // OAuth provider 거부/취소(카카오 동의 취소 등) — code 없이 error 파라미터로 복귀(세션 미발급)
  if (oauthError) {
    console.error(`[auth/callback] oauth 거부 error=${oauthError}`);
    return NextResponse.redirect(`${origin}/login?error=oauth_canceled`);
  }

  const supabase = await createClient();

  // 이메일 확인(token_hash) 우선, OAuth(code) 차선. 둘 다 없으면 잘못된 진입.
  const result =
    tokenHash && type
      ? await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
      : code
        ? await supabase.auth.exchangeCodeForSession(code)
        : null;

  if (!result) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }
  if (result.error) {
    // 만료·재사용 등 — 존재/원인 비노출 일반 코드
    return NextResponse.redirect(`${origin}/login?error=confirm_failed`);
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
      return NextResponse.redirect(`${origin}/login?error=sync_failed`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
