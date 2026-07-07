// W11 / 결정5 — 진척 저장 Route Handler(POST, sendBeacon 대상).
// sendBeacon 은 언로드 시 text/JSON 를 보낼 수 있어 req.text() 후 JSON.parse(try/catch).
// getCurrentUser() 로 인증(null → 401). userId 는 세션에서만(IDOR). 리치 JSON + X-Request-Id.
import { NextResponse } from "next/server";
import { getCurrentUser, AuthError } from "@/lib/auth/session";
import { makeErrorResponse } from "@/lib/api/error";
import { saveProgressCore } from "@/lib/services/progress";
import { ERROR_CODES, type ErrorCode } from "@/lib/contracts/error-codes";

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const requestId = req.headers.get("X-Request-Id") ?? crypto.randomUUID();

  // sendBeacon body 파싱 — text 로 받아 JSON.parse. 비 JSON → 400.
  let input: unknown;
  try {
    const raw = await req.text();
    input = raw ? JSON.parse(raw) : {};
  } catch {
    return makeErrorResponse("INVALID_INPUT", requestId);
  }

  // 인증 — 세션에서만 userId 확보. null → 401.
  let user;
  try {
    user = await getCurrentUser();
  } catch (e) {
    const code = e instanceof AuthError ? e.code : "INTERNAL_ERROR";
    return makeErrorResponse(code, requestId);
  }
  if (!user) return makeErrorResponse("UNAUTHORIZED", requestId);

  const result = await saveProgressCore(user.id, input, requestId);
  const status =
    "ok" in result ? 200 : ERROR_CODES[result.error_code as ErrorCode].http;

  return NextResponse.json(result, {
    status,
    headers: { "X-Request-Id": requestId },
  });
}
