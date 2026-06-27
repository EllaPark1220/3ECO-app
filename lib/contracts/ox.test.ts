import { describe, it, expect } from "vitest";
import { OxSubmitRequestSchema, OxSubmitResponseSchema } from "./ox";

describe("OxSubmitRequestSchema", () => {
  it("정상 제출 (5 answers)", () => {
    const r = OxSubmitRequestSchema.parse({
      lesson_id: "L001",
      answers: [1, 2, 3, 4, 5].map((n) => ({ question_order: n, answer: n % 2 === 0 })),
    });
    expect(r.answers).toHaveLength(5);
  });

  it("answers 빈 배열 거부 (Scenario 5)", () => {
    expect(OxSubmitRequestSchema.safeParse({ lesson_id: "L001", answers: [] }).success).toBe(false);
  });

  it("lesson_id 포맷 위반 거부 (Scenario 4)", () => {
    expect(
      OxSubmitRequestSchema.safeParse({ lesson_id: "INVALID", answers: [{ question_order: 1, answer: true }] }).success,
    ).toBe(false);
  });

  it("answer 비-boolean 거부", () => {
    expect(
      OxSubmitRequestSchema.safeParse({ lesson_id: "L001", answers: [{ question_order: 1, answer: "O" }] }).success,
    ).toBe(false);
  });
});

describe("OxSubmitResponseSchema", () => {
  it("통과 응답 (scroll_to_section 생략)", () => {
    const r = OxSubmitResponseSchema.parse({ passed: true, stamp_earned: true });
    expect(r.scroll_to_section).toBeUndefined();
  });

  it("오답 응답 (앵커 포함)", () => {
    const r = OxSubmitResponseSchema.parse({ passed: false, stamp_earned: false, scroll_to_section: "#anchor-3" });
    expect(r.scroll_to_section).toBe("#anchor-3");
  });
});
