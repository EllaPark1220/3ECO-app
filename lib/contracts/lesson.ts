// CT-API-002 — GET /api/lesson/{id} 계약 (Zod + 타입 단일 출처).
// 응답은 snake_case 강제(REST 관행). 민감 필드(oxQuestions.correctAnswer·내부 ID·createdAt) 미포함.
import { z } from "zod";

/** path param — lessonId 포맷 L001~L133 (grill-it T1) */
export const LessonIdParamSchema = z.object({
  lessonId: z
    .string()
    .regex(/^L\d{3}$/, "lessonId 포맷이 올바르지 않습니다 (L001~L133)"),
});
export type LessonIdParam = z.infer<typeof LessonIdParamSchema>;

/** Response DTO — 3매체 + 개정 메타 + Module */
export const LessonResponseSchema = z.object({
  lesson_id: z.string(),
  title: z.string(),
  youtube_video_id: z.string(), // 3매체 1
  script: z.string(), //           3매체 2
  pdf_kit_url: z.string(), //      3매체 3
  revision_last_updated: z.string(), // ISO date
  revision_notes: z.string().nullable(),
  module: z.object({
    module_id: z.string(), // M1~M5
    name: z.string(),
    order_index: z.number().int().min(1).max(5),
  }),
});
export type LessonResponse = z.infer<typeof LessonResponseSchema>;

/** ETag strong validator — `"L001-2026-04-25"` (lessonId-revision) */
export function makeLessonETag(lessonId: string, revisionLastUpdated: string): string {
  return `"${lessonId}-${revisionLastUpdated}"`;
}
