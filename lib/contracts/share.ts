// CT-API-011 — 스탬프맵 공유 토큰 계약 (Zod SSOT). Could-Have(유기적 전파 KPI).
// 공유 URL: {BASE_URL}/stamp/shared/{uuid-v4-token}. 활성 토큰 최대 5개.
import { z } from "zod";

/** 발급 요청 — 입력 없음 (세션 userId) */
export const ShareStampMapRequestSchema = z.object({}).strict();
export type ShareStampMapRequest = z.infer<typeof ShareStampMapRequestSchema>;

/** 발급 응답 */
export const ShareStampMapResponseSchema = z.object({
  share_url: z.string().url(),
  token: z.string().uuid(),
  expires_at: z.string().datetime(),
  nickname: z.string(),
});
export type ShareStampMapResponse = z.infer<typeof ShareStampMapResponseSchema>;

/** 공유 페이지(익명 열람) 응답 — earned 여부만, 시각/개인정보 최소 */
export const SharedStampMapViewResponseSchema = z.object({
  nickname: z.string(),
  total_lessons: z.number().int(),
  earned_count: z.number().int(),
  modules: z.array(
    z.object({
      module_id: z.string(),
      name: z.string(),
      lessons: z.array(
        z.object({
          lesson_id: z.string(),
          title: z.string(),
          earned: z.boolean(),
        }),
      ),
    }),
  ),
  expires_at: z.string().datetime(),
});
export type SharedStampMapViewResponse = z.infer<typeof SharedStampMapViewResponseSchema>;
