// OX 퀴즈 제출 seam — 화면(app/lesson/[id])과 백엔드 사이의 계약 경계.
// 입출력 타입 = lib/contracts/ox (Zod SSOT). 현재는 통과 판정 mock.
//
// MOCK → Prisma 교체 레시피 (EPIC W11 / FW-OX-001, CT-DB-006 OxQuestion):
//   submitOx 를 실제 정답 채점 + Stamp upsert(자연 멱등 키 user_id+lesson_id)로 교체.
//   P2002 catch 시 기존 상태로 동일 페이로드 200 재반환(SRS §1.5.1.1 Option B).
import {
  type OxSubmitRequest,
  type OxSubmitResponse,
  OxSubmitResponseSchema,
} from "@/lib/contracts/ox";

const PASS_RATIO = 0.6;

export async function submitOx(
  req: OxSubmitRequest,
): Promise<OxSubmitResponse> {
  // MOCK 채점: 'true' 응답 비율로 통과 판정(실제 정답 비교 아님).
  const trueCount = req.answers.filter((a) => a.answer).length;
  const passed = trueCount >= Math.ceil(req.answers.length * PASS_RATIO);
  const firstWrong = req.answers.find((a) => !a.answer);
  const dto: OxSubmitResponse = {
    passed,
    stamp_earned: passed,
    scroll_to_section:
      passed || !firstWrong ? undefined : `#anchor-${firstWrong.question_order}`,
  };
  return OxSubmitResponseSchema.parse(dto);
}
