// CT-API-001 request_id(UUID v4) 발급 + FW-AUTH-001 Supabase 세션 자동 갱신 (병합).
// Rate Limit 적용은 각 API 에서 enforceRateLimit() 호출 (lib/api/rate-limit.ts).
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { clientEnv } from "@/lib/env";

export async function middleware(request: NextRequest) {
  const requestId = request.headers.get("X-Request-Id") ?? crypto.randomUUID();

  // 다운스트림(Server Action/Route Handler)이 동일 request_id 를 읽을 수 있도록 요청 헤더로 전파
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("X-Request-Id", requestId);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 세션 만료 임박 시 갱신(Scenario 4). getUser() 가 리프레시를 트리거.
  await supabase.auth.getUser();

  response.headers.set("X-Request-Id", requestId);
  return response;
}

export const config = {
  // 정적 자산 제외, API·페이지 요청에 적용
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
