// 스탬프 맵 데이터 seam — 화면(app/stamp-map)과 백엔드 사이의 계약 경계.
// 입출력 타입 = lib/contracts/stamp (Zod SSOT). 현재는 커리큘럼 + mock 획득셋 기반.
//
// MOCK → Prisma 교체 레시피 (EPIC W11 / CT-DB-005 Stamp Idempotency, FR-STAMP-001):
//   MOCK_EARNED 을 `prisma.stamp.findMany({ where:{ userId } })` 결과로 교체.
//   모듈별 집계는 동일 파생 로직을 재사용한다(화면 변경 불필요).
import {
  type StampMapResponse,
  StampMapResponseSchema,
} from "@/lib/contracts/stamp";
import { LESSONS, MODULES, TOTAL_LESSONS } from "./curriculum";

const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000";
const MOCK_EARNED = new Set(["L001", "L002", "L003", "L004"]); // 4/133 (프로토타입과 동일)
const MOCK_EARNED_AT = "2026-05-10T09:00:00.000Z";

export async function getStampMap(
  userId: string = MOCK_USER_ID,
): Promise<StampMapResponse> {
  const modules = MODULES.map((m) => {
    const lessons = LESSONS.filter((l) => l.moduleId === m.module_id).map(
      (l) => {
        const earned = MOCK_EARNED.has(l.lessonId);
        return {
          lesson_id: l.lessonId,
          title: l.title,
          earned,
          earned_at: earned ? MOCK_EARNED_AT : null,
        };
      },
    );
    const earnedInModule = lessons.filter((x) => x.earned).length;
    return {
      module_id: m.module_id,
      name: m.name,
      order_index: m.order_index,
      lessons,
      earned_in_module: earnedInModule,
      total_in_module: lessons.length,
    };
  });

  const earnedCount = MOCK_EARNED.size;
  const dto: StampMapResponse = {
    user_id: userId,
    total_lessons: TOTAL_LESSONS,
    earned_count: earnedCount,
    completion_pct:
      TOTAL_LESSONS > 0
        ? Math.round((earnedCount / TOTAL_LESSONS) * 1000) / 10
        : 0,
    modules,
    last_earned_at: earnedCount > 0 ? MOCK_EARNED_AT : null,
  };
  return StampMapResponseSchema.parse(dto);
}
