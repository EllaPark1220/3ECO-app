// FR-AUTH-005 — 환경설정 조회(FW-AUTH-005 의 Read 짝). 3필드 화이트리스트.
// colorMode 는 모델 제외분(다크모드 연기) → 응답에도 미포함. 본인만(세션 기반, user_id 미허용).
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getCurrentUser, AuthError } from "@/lib/auth/session";
import { makeErrorResponse } from "@/lib/api/error";
import type { UserPreferencesResponse } from "@/lib/contracts/user";

export const dynamic = "force-dynamic";

export async function GET() {
  const requestId =
    (await headers()).get("X-Request-Id") ?? crypto.randomUUID();
  try {
    const user = await getCurrentUser();
    if (!user) return makeErrorResponse("UNAUTHORIZED", requestId);

    const body: UserPreferencesResponse = {
      accessibility_mode: user.accessibilityMode,
      media_preference: user.mediaPreference,
      font_size: user.fontSize,
    };
    return NextResponse.json(body, {
      headers: {
        // 사용자별 데이터 → 5분 사적 캐시(Edge/공유 캐시 미사용). PATCH 후 SWR mutate 로 무효화.
        "Cache-Control": "private, max-age=300",
        "X-Request-Id": requestId,
      },
    });
  } catch (e) {
    const code = e instanceof AuthError ? e.code : "INTERNAL_ERROR";
    return makeErrorResponse(code, requestId);
  }
}
