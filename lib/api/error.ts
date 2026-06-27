// CT-API-001 — 에러 응답 빌더. 모든 API 가 공유.
import { NextResponse } from "next/server";
import { ERROR_CODES, type ErrorCode } from "@/lib/contracts/error-codes";
import type { ErrorResponse } from "@/lib/contracts/api";

/** 순수 빌더 — NextResponse 의존 없이 본문/상태를 만든다 (테스트 용이) */
export function buildError(
  code: ErrorCode,
  requestId: string,
  details?: Record<string, unknown>,
): { status: number; body: ErrorResponse } {
  const { http, message } = ERROR_CODES[code];
  const body: ErrorResponse = { error_code: code, message, request_id: requestId };
  if (details) body.details = details;
  return { status: http, body };
}

/** Route Handler 용 NextResponse 래퍼 (X-Request-Id 헤더 포함) */
export function makeErrorResponse(
  code: ErrorCode,
  requestId: string,
  details?: Record<string, unknown>,
): NextResponse {
  const { status, body } = buildError(code, requestId, details);
  return NextResponse.json(body, {
    status,
    headers: { "X-Request-Id": requestId },
  });
}
