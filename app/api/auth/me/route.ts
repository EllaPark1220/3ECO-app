// FR-AUTH-001 — 현재 사용자 정보(선택적 노출). 본인만. colorMode 는 모델 제외분.
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getCurrentUser, AuthError } from "@/lib/auth/session";
import { makeErrorResponse } from "@/lib/api/error";

export const dynamic = "force-dynamic";

export async function GET() {
  const requestId =
    (await headers()).get("X-Request-Id") ?? crypto.randomUUID();
  try {
    const user = await getCurrentUser();
    if (!user) return makeErrorResponse("UNAUTHORIZED", requestId);
    return NextResponse.json({
      id: user.id,
      email: user.email, // 본인만 조회(세션 기반)
      nickname: user.nickname,
      role: user.role,
      accessibilityMode: user.accessibilityMode,
      mediaPreference: user.mediaPreference,
      fontSize: user.fontSize,
    });
  } catch (e) {
    const code = e instanceof AuthError ? e.code : "INTERNAL_ERROR";
    return makeErrorResponse(code, requestId);
  }
}
