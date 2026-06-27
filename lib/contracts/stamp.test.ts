import { describe, it, expect } from "vitest";
import { StampMapResponseSchema } from "./stamp";

const sample = {
  user_id: "11111111-1111-4111-8111-111111111111",
  total_lessons: 133,
  earned_count: 3,
  completion_pct: 2.3,
  modules: [
    {
      module_id: "M1",
      name: "화폐와 가치 기초",
      order_index: 1,
      lessons: [
        { lesson_id: "L001", title: "화폐의 정의", earned: true, earned_at: "2026-06-27T00:00:00Z" },
        { lesson_id: "L002", title: "가치 측정", earned: false, earned_at: null },
      ],
      earned_in_module: 1,
      total_in_module: 2,
    },
  ],
  last_earned_at: "2026-06-27T00:00:00Z",
};

describe("StampMapResponseSchema", () => {
  it("정상 응답 파싱", () => {
    expect(StampMapResponseSchema.parse(sample).earned_count).toBe(3);
  });

  it("user_id 비-UUID 거부", () => {
    expect(StampMapResponseSchema.safeParse({ ...sample, user_id: "nope" }).success).toBe(false);
  });

  it("completion_pct 100 초과 거부", () => {
    expect(StampMapResponseSchema.safeParse({ ...sample, completion_pct: 120 }).success).toBe(false);
  });

  it("미획득 lesson 의 earned_at 은 null 허용", () => {
    const m = StampMapResponseSchema.parse(sample).modules[0];
    expect(m.lessons[1].earned_at).toBeNull();
  });
});
