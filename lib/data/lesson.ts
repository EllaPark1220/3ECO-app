// 레슨 데이터 seam — 화면(app/lesson/[id])과 백엔드 사이의 계약 경계.
// 입출력 타입 = lib/contracts/lesson (Zod SSOT). 현재는 커리큘럼 json 기반 mock.
//
// MOCK → Prisma 교체 레시피 (EPIC W14 / CT-DB-003 Lesson 3매체 NotNull, FR-LES-001):
//   getLesson 을 `prisma.lesson.findUnique({ where:{ lessonId } })` 로 교체하고,
//   youtube_video_id·script·pdf_kit_url 을 실제 컬럼에서 읽는다(3매체 NOT NULL).
//   응답은 LessonResponseSchema.parse 로 계약 검증을 유지한다(화면 변경 불필요).
import {
  type LessonResponse,
  LessonResponseSchema,
} from "@/lib/contracts/lesson";
import { getFlatLesson } from "./curriculum";

// 스모크용 실존 임베드 영상 — L001 한정 오버라이드(이어보기 검증용). 나머지 편은 기존
// placeholder 유지. 실제 영상은 CT-DB-003(3매체 컬럼)/W14 CMS 연동 시 DB 에서 읽어 교체.
const SMOKE_VIDEO_IDS: Record<string, string> = { L001: "aqz-KE-bpKQ" };

export async function getLesson(lessonId: string): Promise<LessonResponse | null> {
  const l = getFlatLesson(lessonId);
  if (!l) return null;
  const dto: LessonResponse = {
    lesson_id: l.lessonId,
    title: l.title,
    youtube_video_id: SMOKE_VIDEO_IDS[l.lessonId] ?? "5R0epUboFsk", // MOCK(그 외 편) — W14 교체
    script:
      `[${l.area}] ${l.title}\n\n` +
      `핵심 개념: ${l.concepts}\n\n` +
      `학습 목표\n1) ${l.objectives[0]}\n2) ${l.objectives[1]}\n\n` +
      `(데모 스크립트 — 실제 본문은 콘텐츠 CMS 연동 시 교체: W14 / CT-DB-003)`,
    pdf_kit_url: `/api/teacher/kit/${l.lessonId}`, // MOCK — W13 PDF 백엔드에서 실제 제공
    revision_last_updated: "2026-05-13",
    revision_notes: null,
    module: {
      module_id: l.moduleId,
      name: l.volumeTitle,
      order_index: l.volume,
    },
  };
  return LessonResponseSchema.parse(dto);
}
