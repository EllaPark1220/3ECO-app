// 분기 설문 제출 seam — 화면(스탬프 10개 트리거)과 백엔드 사이의 계약 경계.
// 입출력 타입 = lib/contracts/survey (Zod SSOT). 현재는 mock.
//
// MOCK → Prisma 교체 레시피 (EPIC W11 / FW-SUR-001, CT-DB-008 SurveyResponse):
//   submitSurvey 를 분기당 1회 UNIQUE(user_id|anonymous_token, quarter, year) upsert 로 교체.
import {
  type SubmitSurveyRequest,
  type SubmitSurveyResponse,
  SubmitSurveyResponseSchema,
} from "@/lib/contracts/survey";

const MOCK_SURVEY_ID = "11111111-1111-4111-8111-111111111111"; // v4 형식 mock

export async function submitSurvey(
  req: SubmitSurveyRequest,
  submittedAt: string = "2026-05-13T00:00:00.000Z",
): Promise<SubmitSurveyResponse> {
  const dto: SubmitSurveyResponse = {
    ok: true,
    survey_id: MOCK_SURVEY_ID,
    quarter: req.quarter,
    year: req.year,
    is_anonymous: Boolean(req.anonymous_token),
    submitted_at: submittedAt,
  };
  return SubmitSurveyResponseSchema.parse(dto);
}
