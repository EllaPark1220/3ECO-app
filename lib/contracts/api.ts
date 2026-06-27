// CT-API-001 — 모든 Server Action·Route Handler 공통 응답 계약 (단일 출처)
// SRS §6.1. 응답 포맷 분기 금지.

/** 성공 응답: 엔드포인트별 페이로드를 그대로 반환 */
export type SuccessResponse<T> = T;

/** 실패 응답 (공통 포맷) */
export interface ErrorResponse {
  error_code: string;
  message: string;
  request_id: string;
  details?: Record<string, unknown>;
}
