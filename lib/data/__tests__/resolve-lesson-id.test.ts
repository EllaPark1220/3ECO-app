import { describe, it, expect } from "vitest";
import { resolveLessonId, LESSONS, TOTAL_LESSONS } from "@/lib/data/curriculum";

// W11-T6 접근 ② — 라우트 파라미터 정규화 검증. 하드코딩 매핑표 없이 curriculum 파생 데이터로 확인.
describe("resolveLessonId() (W11-T6 / 접근 ②)", () => {
  it("L\\d{3} 정규 포맷 — 존재하면 그대로 반환", () => {
    expect(resolveLessonId("L001")).toBe("L001");
    expect(resolveLessonId("L133")).toBe("L133");
  });

  it("존재하지 않는 L\\d{3} → null (L134 는 133편 초과)", () => {
    expect(resolveLessonId("L134")).toBeNull();
    expect(resolveLessonId("L000")).toBeNull();
  });

  it("vol-ep → 권 경계 매핑(각 권 첫/끝 편)", () => {
    // 권별 실제 편수(1권27·2권25·3권25·4권31·5권25) 누적 경계
    expect(resolveLessonId("1-1")).toBe("L001");
    expect(resolveLessonId("1-27")).toBe("L027");
    expect(resolveLessonId("2-1")).toBe("L028");
    expect(resolveLessonId("2-25")).toBe("L052");
    expect(resolveLessonId("3-1")).toBe("L053");
    expect(resolveLessonId("3-25")).toBe("L077");
    expect(resolveLessonId("4-1")).toBe("L078");
    expect(resolveLessonId("4-31")).toBe("L108");
    expect(resolveLessonId("5-1")).toBe("L109");
    expect(resolveLessonId("5-25")).toBe("L133");
  });

  it("vol-ep 전수 왕복 — 모든 133편이 vol-ep→lessonId 로 정확히 복원", () => {
    for (const l of LESSONS) {
      expect(resolveLessonId(`${l.volume}-${l.episodeInVolume}`)).toBe(l.lessonId);
    }
    expect(TOTAL_LESSONS).toBe(133);
  });

  it("범위 밖 vol-ep → null", () => {
    expect(resolveLessonId("1-28")).toBeNull(); // 1권은 27편까지
    expect(resolveLessonId("6-1")).toBeNull(); //  6권 없음
    expect(resolveLessonId("2-26")).toBeNull(); // 2권은 25편까지
  });

  it("형식 불명 → null", () => {
    expect(resolveLessonId("")).toBeNull();
    expect(resolveLessonId("abc")).toBeNull();
    expect(resolveLessonId("L1")).toBeNull();
    expect(resolveLessonId("1-")).toBeNull();
    expect(resolveLessonId("-1")).toBeNull();
  });
});
