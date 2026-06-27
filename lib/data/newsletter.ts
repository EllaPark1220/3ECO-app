// 뉴스레터 구독 seam — 화면(app/page 랜딩)과 백엔드 사이의 계약 경계.
// 입출력 타입 = lib/contracts/newsletter (Zod SSOT). 현재는 pending mock.
//
// MOCK → 실연동 교체 레시피 (EPIC W02 / FW-NL-001, IF-RES-001 Resend):
//   subscribe 를 더블 옵트인(토큰 발급 + Resend 확인 메일)으로 교체.
//   요청은 NewsletterSubscribeRequestSchema 로 검증(정규화·정통법 동의 포함).
import {
  type NewsletterSubscribeRequest,
  type NewsletterSubscribeResponse,
  NewsletterSubscribeResponseSchema,
} from "@/lib/contracts/newsletter";

export async function subscribe(
  _req: NewsletterSubscribeRequest,
  expiresAt: string = "2026-05-14T00:00:00.000Z",
): Promise<NewsletterSubscribeResponse> {
  const dto: NewsletterSubscribeResponse = {
    ok: true,
    status: "pending_confirmation",
    confirmation_email_sent: false, // MOCK — Resend 미연동
    expires_at: expiresAt,
  };
  return NewsletterSubscribeResponseSchema.parse(dto);
}
