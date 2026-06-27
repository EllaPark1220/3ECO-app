import { describe, it, expect } from "vitest";
import { ERROR_CODES, type ErrorCode } from "./error-codes";

describe("ERROR_CODES", () => {
  const entries = Object.entries(ERROR_CODES) as [ErrorCode, { http: number; message: string }][];

  it("정의된 코드 29종 (CT-API-001 22 + 008 설문 4 + 011 공유 3)", () => {
    expect(entries.length).toBe(29);
  });

  it("설문 에러코드 매핑 (CT-API-008)", () => {
    expect(ERROR_CODES.SURVEY_ALREADY_SUBMITTED.http).toBe(409);
    expect(ERROR_CODES.INVALID_QUARTER.http).toBe(400);
  });

  it("모든 코드는 유효한 HTTP 상태 + 비어있지 않은 한국어 메시지", () => {
    for (const [, def] of entries) {
      expect(def.http).toBeGreaterThanOrEqual(400);
      expect(def.http).toBeLessThan(600);
      expect(def.message.length).toBeGreaterThan(0);
    }
  });

  it("핵심 코드의 상태 매핑", () => {
    expect(ERROR_CODES.UNAUTHORIZED.http).toBe(401);
    expect(ERROR_CODES.FORBIDDEN.http).toBe(403);
    expect(ERROR_CODES.RATE_LIMIT_EXCEEDED.http).toBe(429);
    expect(ERROR_CODES.EMAIL_ALREADY_EXISTS.http).toBe(409);
    expect(ERROR_CODES.INTERNAL_ERROR.http).toBe(500);
  });
});
