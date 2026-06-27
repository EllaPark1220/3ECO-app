import { describe, it, expect } from "vitest";
import { SubmitSurveyRequestSchema } from "./survey";

const base = { quarter: "Q1" as const, year: 2026, less_fear_score: 5, confidence_score: 4 };

describe("SubmitSurveyRequestSchema", () => {
  it("정상 (로그인 모드, anonymous_token 없음)", () => {
    expect(SubmitSurveyRequestSchema.parse(base).less_fear_score).toBe(5);
  });

  it("익명 모드 (anonymous_token UUID)", () => {
    const r = SubmitSurveyRequestSchema.parse({ ...base, anonymous_token: "11111111-1111-4111-8111-111111111111" });
    expect(r.anonymous_token).toBeTruthy();
  });

  it.each([0, 6, 2.5])("score 범위/정수 위반 %s 거부", (less_fear_score) => {
    expect(SubmitSurveyRequestSchema.safeParse({ ...base, less_fear_score }).success).toBe(false);
  });

  it("잘못된 quarter 거부", () => {
    expect(SubmitSurveyRequestSchema.safeParse({ ...base, quarter: "Q5" }).success).toBe(false);
  });

  it("free_response 2000자 초과 거부", () => {
    expect(SubmitSurveyRequestSchema.safeParse({ ...base, free_response: "a".repeat(2001) }).success).toBe(false);
  });

  it("year 범위 위반 거부", () => {
    expect(SubmitSurveyRequestSchema.safeParse({ ...base, year: 2025 }).success).toBe(false);
  });
});
