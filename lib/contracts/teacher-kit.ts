// CT-API-006 — GET /api/teacher/kit/{id} 계약. binary(PDF) 응답이라 body Zod 미적용.
// 익명 다운로드 허용(CC BY-NC-SA 4.0). 구버전 ?rev → 301 to latest. 교사 모드 경량(grill-it T2).
import { z } from "zod";

export const TeacherKitParamSchema = z.object({
  lessonId: z.string().regex(/^L\d{3}$/, "lessonId 포맷이 올바르지 않습니다 (L001~L133)"),
});
export type TeacherKitParam = z.infer<typeof TeacherKitParamSchema>;

export const TeacherKitQuerySchema = z.object({
  rev: z.string().optional(), // 구버전 revision (예: 2026-04-01)
});
export type TeacherKitQuery = z.infer<typeof TeacherKitQuerySchema>;

export type TeacherKitCacheStatus = "HIT" | "MISS" | "REGENERATED";

/** ETag — `"L001-2026-04-25-pdf"` */
export function makeTeacherKitETag(lessonId: string, revisionLastUpdated: string): string {
  return `"${lessonId}-${revisionLastUpdated}-pdf"`;
}

/**
 * RFC 5987 Content-Disposition (한글 파일명).
 * `inline; filename="L001_lesson.pdf"; filename*=UTF-8''<percent-encoded>`
 */
export function teacherKitContentDisposition(lessonId: string, koreanTitle: string): string {
  const asciiFallback = `${lessonId}_lesson.pdf`;
  const utf8Name = `${lessonId}_${koreanTitle}.pdf`;
  const encoded = encodeURIComponent(utf8Name);
  return `inline; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}
