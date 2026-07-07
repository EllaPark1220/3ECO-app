"use server";
// W11 / 결정4 — 진척 저장 Server Action. requireUser() 로 인증(비로그인 → 401) 후
// saveProgressCore(user.id, input) 위임. userId 는 세션에서만(IDOR). 검증 실패 매핑은 core 담당.
import { headers } from "next/headers";
import { requireUser } from "@/lib/auth/guards";
import { AuthError } from "@/lib/auth/session";
import { saveProgressCore } from "@/lib/services/progress";
import { buildError } from "@/lib/api/error";
import type { SaveProgressResponse } from "@/lib/contracts/progress";
import type { ErrorResponse } from "@/lib/contracts/api";

export async function saveProgress(
  input: unknown,
): Promise<SaveProgressResponse | ErrorResponse> {
  const requestId =
    (await headers()).get("X-Request-Id") ?? crypto.randomUUID();

  // 인증 먼저 — 미인증은 검증보다 우선해 401(write 0건)
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    const code = e instanceof AuthError ? e.code : "INTERNAL_ERROR";
    return buildError(code, requestId).body;
  }

  return saveProgressCore(user.id, input, requestId);
}
