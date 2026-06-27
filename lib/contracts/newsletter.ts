// CT-API-009 — 뉴스레터 구독 계약 (Zod SSOT). 더블 옵트인 + 정통법 동의.
import { z } from "zod";

const consentTrue = (message: string) =>
  z.boolean().refine((v) => v === true, { message });

export const NewsletterSubscribeRequestSchema = z.object({
  // 정규화(trim+lowercase) 후 검증 — 공백 패딩 입력 허용 (D5)
  email: z
    .string()
    .transform((s) => s.trim().toLowerCase())
    .pipe(
      z
        .string()
        .email("이메일 형식이 올바르지 않습니다")
        .max(254, "이메일은 254자 이하여야 합니다"), // RFC 5321
    ),
  consent_terms: consentTrue("약관 동의가 필요합니다"),
  consent_marketing: consentTrue("광고성 정보 수신 동의가 필요합니다 (정통법)"),
});
export type NewsletterSubscribeRequest = z.infer<typeof NewsletterSubscribeRequestSchema>;

export const NewsletterSubscribeResponseSchema = z.object({
  ok: z.literal(true),
  status: z.literal("pending_confirmation"),
  confirmation_email_sent: z.boolean(),
  expires_at: z.string(), // 토큰 24시간 유효
});
export type NewsletterSubscribeResponse = z.infer<typeof NewsletterSubscribeResponseSchema>;

export const NewsletterConfirmQuerySchema = z.object({
  token: z.string().uuid(),
});
export type NewsletterConfirmQuery = z.infer<typeof NewsletterConfirmQuerySchema>;

export const NewsletterConfirmResponseSchema = z.object({
  ok: z.literal(true),
  status: z.literal("subscribed"),
  confirmed_at: z.string(),
});
export type NewsletterConfirmResponse = z.infer<typeof NewsletterConfirmResponseSchema>;
