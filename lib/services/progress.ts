// CT-API-003 / W11 — 학습 진척(재생 위치) 저장·재개 코어. Server 전용.
// 결정3(저장 코어)·결정6(재개 조회)·결정8(IDOR). OX·Stamp·Module 은 건드리지 않는다
// (oxCompleted/stampEarned 는 컬럼만 존재, 이 코어는 lastPositionSec 만 write).
import "server-only";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { buildError } from "@/lib/api/error";
import {
  SaveProgressRequestSchema,
  type SaveProgressResponse,
} from "@/lib/contracts/progress";
import type { ErrorResponse } from "@/lib/contracts/api";
import type { ErrorCode } from "@/lib/contracts/error-codes";

/**
 * 진척 저장 코어 — 검증 → upsert(항상) → 리치 응답.
 * userId 는 항상 호출자(세션)에서 주입. 요청 입력의 user_id 는 스키마 strict 로 거부(IDOR).
 * 서버 throttle 없음: 매 호출 upsert + @updatedAt 매번 갱신(다기기 LWW).
 * requestId 는 에러 응답의 request_id 로만 쓰인다(성공 응답엔 없음). 미지정 시 자체 생성 —
 * 호출자(SA·Route)가 헤더 X-Request-Id 를 넘겨 추적 일관성을 확보한다.
 */
export async function saveProgressCore(
  userId: string,
  input: unknown,
  requestId: string = crypto.randomUUID(),
): Promise<SaveProgressResponse | ErrorResponse> {
  // 검증 — strict 스키마가 정의 외 키(위조 user_id)까지 구조적으로 거부(결정8)
  const parsed = SaveProgressRequestSchema.safeParse(input);
  if (!parsed.success) {
    const paths = parsed.error.issues.flatMap((i) => i.path.map(String));
    const code: ErrorCode = paths.includes("lesson_id")
      ? "INVALID_LESSON_ID"
      : paths.includes("position_sec")
        ? "INVALID_POSITION"
        : "INVALID_INPUT"; // 정의 외 키(user_id 등) 및 기타
    return buildError(code, requestId).body;
  }
  const { lesson_id, position_sec } = parsed.data;

  // is_first_save 판정: 사전 존재 조회(결정3 — findUnique 존재여부). null → create.
  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId: lesson_id } },
    select: { id: true },
  });
  const isFirstSave = existing === null;

  // 항상 upsert. create/update 모두 lastPositionSec 만(ox/stamp 미변경).
  const saved = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId: lesson_id } },
    create: { userId, lessonId: lesson_id, lastPositionSec: position_sec },
    update: { lastPositionSec: position_sec },
  });

  // TODO(CT-DB-009): EventLog progress.saved(userId, lesson_id, position_sec) 발행.
  // TODO(CT-DB-009): 위치 역행/과대 점프 등 anomaly 계측(progress.anomaly). 이 웨이브에선 스텁.

  return {
    ok: true,
    lesson_id: saved.lessonId,
    saved_position_sec: saved.lastPositionSec,
    saved_at: saved.updatedAt.toISOString(),
    is_first_save: isFirstSave,
  };
}

/**
 * 재개 위치 조회(결정6). 헬퍼 제공까지만 — 레슨 페이지 RSC 주입/UI 는 스코프 밖.
 * 익명(getCurrentUser null)은 throw 하지 않고 0 을 반환(graceful). userId 는 세션에서만.
 */
export async function getResumePosition(lessonId: string): Promise<number> {
  const user = await getCurrentUser();
  if (!user) return 0; // 익명 — 저장된 진척 없음, 재개 위치 0

  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    select: { lastPositionSec: true },
  });
  return progress?.lastPositionSec ?? 0;
}

/**
 * 공개 시청 표면용 뷰어 컨텍스트 — **절대 throw 하지 않는다**(W11-T7: 레슨 시청은 비로그인 공개).
 * getCurrentUser 는 auth↔public sync 깨짐 시 AuthError 를 던지는 가드용 헬퍼라, 이를 그대로
 * 렌더 경로에 쓰면 세션/DB 이상이 공개 페이지를 500 으로 무너뜨린다. 여기서는 어떤 실패든
 * 익명 뷰로 degrade 한다: { initialPositionSec: 0, sessionActive: false }.
 * (쓰기 경로는 계속 strict requireUser 로 401 — 이 완화는 읽기·공개 시청 전용.)
 */
export async function getViewerProgress(
  lessonId: string,
): Promise<{ initialPositionSec: number; sessionActive: boolean }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { initialPositionSec: 0, sessionActive: false }; // 익명 — 정상
    const progress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      select: { lastPositionSec: true },
    });
    return {
      initialPositionSec: progress?.lastPositionSec ?? 0,
      sessionActive: true,
    };
  } catch (e) {
    // 세션 해석/진척 조회 실패(broken-sync AuthError·일시적 DB 오류 등). 시청은 공개이므로
    // 페이지를 죽이지 않고 익명 뷰로 degrade + 이상 신호만 남긴다.
    // TODO(CT-DB-009): EventLog progress.anomaly / auth.sync_broken 발행.
    console.error(
      `[getViewerProgress] 세션/진척 읽기 실패 — 익명 뷰로 degrade lesson=${lessonId}`,
      e,
    );
    return { initialPositionSec: 0, sessionActive: false };
  }
}
