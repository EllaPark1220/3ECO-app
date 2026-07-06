// FW-AUTH-002 — 회원가입 입력 계약(단일 출처). strict: 정의된 3필드 외 전부 거부(PII 구조적 차단).
import { z } from "zod";

export const SignUpRequestSchema = z
  .object({
    email: z.string().email("이메일 형식이 올바르지 않습니다"),
    nickname: z
      .string()
      .min(2, "닉네임은 2자 이상이어야 합니다")
      .max(40, "닉네임은 40자 이하여야 합니다"),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
  })
  .strict(); // card_number·account_number 등 추가 필드 → parse 실패(PII 구조적 거부)

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;

// 성공 응답 — 계정 존재 여부 비노출(이메일 열거 방지). 신규/기존 무관 동일 형태.
export interface SignUpResponse {
  ok: true;
  requires_email_confirmation: true;
}
