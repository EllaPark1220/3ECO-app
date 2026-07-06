// FR-AUTH-002 — RBAC 가드(애플리케이션 레이어). RLS(CT-DB-011)와 함께 defense-in-depth 앞단.
// role 은 서버에서만 검증(클라 쿠키/localStorage 금지). getCurrentUser(React.cache)로 요청당 1회.
import "server-only";
import type { NextRequest } from "next/server";
import type { Role, User } from "@prisma/client";
import { getCurrentUser, AuthError } from "@/lib/auth/session";
import { makeErrorResponse } from "@/lib/api/error";

/** 인증된 사용자만(역할 무관). 미인증 → UNAUTHORIZED(401) */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("UNAUTHORIZED");
  return user;
}

/** 특정 역할 강제. 불일치 → FORBIDDEN(403) */
export async function requireRole(role: Role): Promise<User> {
  const user = await requireUser();
  if (user.role !== role) {
    // TODO(CT-DB-009): EventLog auth.access_denied(userId, requiredRole)
    console.warn(`[rbac] 거부 user=${user.id} role=${user.role} 필요=${role}`);
    throw new AuthError("FORBIDDEN");
  }
  return user;
}

/** 역할 OR 조건 */
export async function requireRoleAny(roles: Role[]): Promise<User> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    console.warn(
      `[rbac] 거부 user=${user.id} role=${user.role} 허용=${roles.join(",")}`,
    );
    throw new AuthError("FORBIDDEN");
  }
  return user;
}

/** 본인 또는 ADMIN 만 */
export async function requireSelfOrAdmin(userId: string): Promise<User> {
  const user = await requireUser();
  if (user.id !== userId && user.role !== "ADMIN") {
    console.warn(`[rbac] 거부 user=${user.id} 대상=${userId}`);
    throw new AuthError("FORBIDDEN");
  }
  return user;
}

/** Route Handler 고차 래퍼 — 역할 검증 후 handler 실행, AuthError→표준 에러 응답 */
export function withRoleGuard<T extends unknown[]>(
  role: Role,
  handler: (req: NextRequest, ...rest: T) => Promise<Response> | Response,
) {
  return async (req: NextRequest, ...rest: T): Promise<Response> => {
    const requestId = req.headers.get("X-Request-Id") ?? crypto.randomUUID();
    try {
      await requireRole(role);
      return await handler(req, ...rest);
    } catch (e) {
      const code = e instanceof AuthError ? e.code : "INTERNAL_ERROR";
      return makeErrorResponse(code, requestId);
    }
  };
}
