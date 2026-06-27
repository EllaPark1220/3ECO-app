// CT-API-004 — submitOx 계약 (Zod SSOT).
// 멱등: P2002 catch 시 LessonProgress 기존 상태로 동일 페이로드 200 재반환 (SRS §1.5.1.1 Option B).
// 금지: idempotency_key 등 별도 헤더(Option A 기각). 자연 멱등 키(user_id, lesson_id)만 사용.
import { z } from "zod";

export const OxAnswerSchema = z.object({
  question_order: z.number().int().min(1),
  answer: z.boolean(),
});
export type OxAnswer = z.infer<typeof OxAnswerSchema>;

export const OxSubmitRequestSchema = z.object({
  lesson_id: z.string().regex(/^L\d{3}$/, "lesson_id 포맷이 올바르지 않습니다 (L001~L133)"),
  answers: z.array(OxAnswerSchema).min(1, "answers 는 1개 이상이어야 합니다"),
});
export type OxSubmitRequest = z.infer<typeof OxSubmitRequestSchema>;

export const OxSubmitResponseSchema = z.object({
  passed: z.boolean(),
  stamp_earned: z.boolean(),
  // 오답 시 스크립트 앵커(예: "#anchor-3"). 통과 시 undefined
  scroll_to_section: z.string().optional(),
});
export type OxSubmitResponse = z.infer<typeof OxSubmitResponseSchema>;
