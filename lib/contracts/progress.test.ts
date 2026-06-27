import { describe, it, expect } from "vitest";
import {
  SaveProgressRequestSchema,
  SaveProgressResponseSchema,
} from "./progress";

describe("SaveProgressRequestSchema", () => {
  it("정상 요청", () => {
    const r = SaveProgressRequestSchema.parse({ lesson_id: "L001", position_sec: 45 });
    expect(r.position_sec).toBe(45);
  });

  it.each([-1, 36001, 1.5])("범위/정수 위반 %s 거부", (position_sec) => {
    expect(
      SaveProgressRequestSchema.safeParse({ lesson_id: "L001", position_sec }).success,
    ).toBe(false);
  });

  it("불량 lesson_id 거부", () => {
    expect(
      SaveProgressRequestSchema.safeParse({ lesson_id: "x", position_sec: 0 }).success,
    ).toBe(false);
  });
});

describe("SaveProgressResponseSchema", () => {
  it("ok=true 리터럴 강제", () => {
    expect(
      SaveProgressResponseSchema.safeParse({
        ok: false,
        lesson_id: "L001",
        saved_position_sec: 1,
        saved_at: "2026-06-27T00:00:00Z",
        is_first_save: true,
      }).success,
    ).toBe(false);
  });
});
