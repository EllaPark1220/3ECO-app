// CT-API-005 — GET /api/stamp/map 계약 (Zod SSOT). 사용자별 데이터(private 캐시).
import { z } from "zod";

export const StampMapLessonItemSchema = z.object({
  lesson_id: z.string(),
  title: z.string(),
  earned: z.boolean(),
  earned_at: z.string().nullable(), // 미획득 시 null
});
export type StampMapLessonItem = z.infer<typeof StampMapLessonItemSchema>;

export const StampMapModuleSchema = z.object({
  module_id: z.string(), // M1~M5
  name: z.string(),
  order_index: z.number().int().min(1).max(5),
  lessons: z.array(StampMapLessonItemSchema),
  earned_in_module: z.number().int().min(0),
  total_in_module: z.number().int().min(0),
});
export type StampMapModule = z.infer<typeof StampMapModuleSchema>;

export const StampMapResponseSchema = z.object({
  user_id: z.string().uuid(),
  total_lessons: z.number().int().min(0),
  earned_count: z.number().int().min(0),
  completion_pct: z.number().min(0).max(100),
  modules: z.array(StampMapModuleSchema),
  last_earned_at: z.string().nullable(),
});
export type StampMapResponse = z.infer<typeof StampMapResponseSchema>;
