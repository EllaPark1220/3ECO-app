"use server";
// FW-AUTH-002 — 회원가입. 이메일·닉네임·비번만(PII 최소). 열거 공격 방지: 계정 존재 비노출.
// 경계: auth.users 생성 + nickname 을 user_metadata 에 보관까지. public.User INSERT 는
//       이메일 확인 콜백(FW-AUTH-004)이 담당. 가입 즉시 세션 미발급(확인 후 로그인).
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { SignUpRequestSchema, type SignUpResponse } from "@/lib/contracts/auth";
import { ERROR_CODES, type ErrorCode } from "@/lib/contracts/error-codes";
import type { ErrorResponse } from "@/lib/contracts/api";

function maskEmail(email: string): string {
  const [u, d] = email.split("@");
  return `${u?.[0] ?? ""}***@${d?.[0] ?? ""}***`;
}

function err(code: ErrorCode, requestId: string): ErrorResponse {
  return {
    error_code: code,
    message: ERROR_CODES[code].message,
    request_id: requestId,
  };
}

export async function signUp(
  formData: FormData,
): Promise<SignUpResponse | ErrorResponse> {
  const requestId =
    (await headers()).get("X-Request-Id") ?? crypto.randomUUID();

  // FormData 전체를 strict 스키마로 검증 → 정의된 3필드 외(card_number 등)는 parse 실패(PII 구조적 거부)
  const parsed = SignUpRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const paths = parsed.error.issues.map((i) => i.path[0]);
    const code: ErrorCode = paths.includes("email")
      ? "INVALID_EMAIL"
      : paths.includes("password")
        ? "PASSWORD_TOO_SHORT"
        : "INVALID_INPUT"; // 닉네임·추가필드 → 필드명 비노출 일반 코드
    return err(code, requestId);
  }
  const { email, nickname, password } = parsed.data;

  // TODO(IF-KV-001): enforceRateLimit(ip, "auth") — Upstash 프로비저닝 후 활성화.
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname }, // public.User 생성 시 콜백(FW-AUTH-004)이 사용
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/auth/callback`,
    },
  });

  // 열거 방지: 기존 이메일은 Supabase 가 에러 없이 obfuscated user 를 반환 → 신규와 균일 성공.
  // 진짜 인프라 오류만 일반 코드로(존재 여부 비노출). 로그는 이메일 마스킹(평문 0건).
  if (error) {
    console.error(
      `[signUp] ${maskEmail(email)} req=${requestId}: ${error.message}`,
    );
    return err("INTERNAL_ERROR", requestId);
  }
  return { ok: true, requires_email_confirmation: true };
}
