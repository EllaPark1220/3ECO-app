// CT-API-003 — saveProgress 계약 (Zod + 타입 SSOT).
// 호출 경로 2종: Server Action(saveProgress) + Route Handler(POST /api/progress/sync, sendBeacon).
import { z } from "zod";

export const SaveProgressRequestSchema = z.object({
  lesson_id: z.string().regex(/^L\d{3}$/, "lesson_id 포맷이 올바르지 않습니다"),
  position_sec: z.number().int().min(0).max(36000), // 최대 10시간 안전 한도
});
export type SaveProgressRequest = z.infer<typeof SaveProgressRequestSchema>;

export const SaveProgressResponseSchema = z.object({
  ok: z.literal(true),
  lesson_id: z.string(),
  saved_position_sec: z.number().int(), // 서버 정정 가능
  saved_at: z.string(), //                ISO datetime
  is_first_save: z.boolean(), //          create vs update
});
export type SaveProgressResponse = z.infer<typeof SaveProgressResponseSchema>;
