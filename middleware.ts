// CT-API-001 — 모든 요청에 request_id(UUID v4) 발급 + X-Request-Id 응답 헤더.
// Rate Limit 적용은 각 API 에서 enforceRateLimit() 호출 (lib/api/rate-limit.ts).
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const requestId = request.headers.get("X-Request-Id") ?? crypto.randomUUID();

  // 다운스트림(Server Action/Route Handler)이 동일 request_id 를 읽을 수 있도록 요청 헤더로 전파
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("X-Request-Id", requestId);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("X-Request-Id", requestId);
  return response;
}

export const config = {
  // 정적 자산 제외, API·페이지 요청에 적용
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
