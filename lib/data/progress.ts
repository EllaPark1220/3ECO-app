// 학습 위치 저장 seam — 화면(app/lesson/[id])과 백엔드 사이의 계약 경계.
// 입출력 타입 = lib/contracts/progress (Zod SSOT). 현재는 echo mock.
//
// MOCK → Prisma 교체 레시피 (EPIC W11 / FW-PROG-001, CT-DB-004 LessonProgress):
//   saveProgress 를 `prisma.lessonProgress.upsert(...)` 로 교체(Last-Write-Wins).
//   is_first_save 는 create vs update 로 판정. Server Action + sendBeacon 두 경로 공유.
import {
  type SaveProgressRequest,
  type SaveProgressResponse,
  SaveProgressResponseSchema,
} from "@/lib/contracts/progress";

const seen = new Set<string>(); // MOCK: 프로세스 메모리 — 영속화 아님

export async function saveProgress(
  req: SaveProgressRequest,
  now: string = "2026-05-13T00:00:00.000Z",
): Promise<SaveProgressResponse> {
  const isFirst = !seen.has(req.lesson_id);
  seen.add(req.lesson_id);
  const dto: SaveProgressResponse = {
    ok: true,
    lesson_id: req.lesson_id,
    saved_position_sec: req.position_sec,
    saved_at: now,
    is_first_save: isFirst,
  };
  return SaveProgressResponseSchema.parse(dto);
}
