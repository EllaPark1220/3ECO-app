// FR-AUTH-001 — 현재 세션 사용자 조회 SSOT. Server 전용. React.cache 로 요청당 1회.
import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";
import type { ErrorCode } from "@/lib/contracts/error-codes";

export class AuthError extends Error {
  constructor(public readonly code: ErrorCode) {
    super(code);
    this.name = "AuthError";
  }
}

// 동일 요청 내 다중 호출 시 DB SELECT 1회만(React.cache). 요청 간 격리.
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  // getSession() 대신 getUser(): JWT 를 Auth 서버로 검증(쿠키 위조·만료 방어)
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null; // 미인증 — 정상 null

  const user = await prisma.user.findUnique({ where: { id: authUser.id } });
  if (!user) {
    // 세션은 있는데 public.User 없음 = auth↔public sync 깨짐(무결성 사고)
    // TODO(NF-OBS-001): Sentry 알림
    console.error(
      `[getCurrentUser] public.User 누락 — sync 깨짐 authUserId=${authUser.id}`,
    );
    throw new AuthError("INTERNAL_ERROR");
  }
  return user;
});

export async function getCurrentUserOrThrow(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("UNAUTHORIZED");
  return user;
}
