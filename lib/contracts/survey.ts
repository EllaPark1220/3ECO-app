// CT-API-008 — submitSurvey 계약 (Zod SSOT). 분기당 1회(INV-09)는 본체(FW-SUR-001) DB UNIQUE.
// 익명 모드: anonymous_token(UUID) + (quarter, year). 로그인 모드: 세션 user_id + (quarter, year).
import { z } from "zod";

export const QuarterSchema = z.enum(["Q1", "Q2", "Q3", "Q4"]);
export type Quarter = z.infer<typeof QuarterSchema>;

export const SubmitSurveyRequestSchema = z.object({
  quarter: QuarterSchema,
  year: z.number().int().min(2026).max(2030),
  less_fear_score: z.number().int().min(1).max(5), // Likert (5='덜 두렵다')
  confidence_score: z.number().int().min(1).max(5),
  free_response: z.string().max(2000).optional().nullable(),
  anonymous_token: z.string().uuid().optional(),
});
export type SubmitSurveyRequest = z.infer<typeof SubmitSurveyRequestSchema>;

export const SubmitSurveyResponseSchema = z.object({
  ok: z.literal(true),
  survey_id: z.string().uuid(),
  quarter: QuarterSchema,
  year: z.number().int(),
  is_anonymous: z.boolean(),
  submitted_at: z.string(),
});
export type SubmitSurveyResponse = z.infer<typeof SubmitSurveyResponseSchema>;
