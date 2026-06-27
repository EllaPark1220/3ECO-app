import { describe, it, expect } from "vitest";
import { buildError } from "./error";

describe("buildError", () => {
  it("표준 에러 본문 + 상태 (Scenario 2)", () => {
    const { status, body } = buildError("INVALID_LESSON_ID", "req-1");
    expect(status).toBe(400);
    expect(body.error_code).toBe("INVALID_LESSON_ID");
    expect(body.message).toBe("lesson_id 포맷이 올바르지 않습니다.");
    expect(body.request_id).toBe("req-1");
    expect(body.details).toBeUndefined();
  });

  it("details 전달 (Scenario 6 — Zod issues)", () => {
    const details = { issues: [{ path: ["email"], message: "invalid" }] };
    const { body } = buildError("INVALID_EMAIL", "req-2", details);
    expect(body.details).toEqual(details);
  });

  it("rate limit 코드 → 429", () => {
    expect(buildError("RATE_LIMIT_EXCEEDED", "r").status).toBe(429);
  });
});
