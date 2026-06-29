// seam 계약 검증 — 각 mock 이 lib/contracts(Zod) 계약을 만족하는지 보장.
// 백엔드 교체 시에도 이 테스트가 계약 경계를 지킨다.
import { describe, it, expect } from "vitest";
import { getLesson } from "../lesson";
import { getStampMap } from "../stamp";
import { submitOx } from "../ox";
import { saveProgress } from "../progress";
import { subscribe } from "../newsletter";
import { listKits, getKit } from "../teacher-kit";
import { submitSurvey } from "../survey";
import { TOTAL_LESSONS, LESSONS } from "../curriculum";
import { LessonResponseSchema } from "@/lib/contracts/lesson";
import { StampMapResponseSchema } from "@/lib/contracts/stamp";
import { OxSubmitResponseSchema } from "@/lib/contracts/ox";
import { SaveProgressResponseSchema } from "@/lib/contracts/progress";
import { NewsletterSubscribeResponseSchema } from "@/lib/contracts/newsletter";
import { SubmitSurveyResponseSchema } from "@/lib/contracts/survey";

describe("lib/data seam — 계약 충족", () => {
  it("커리큘럼은 133편이고 L001~L133 연속이다", () => {
    expect(TOTAL_LESSONS).toBe(133);
    expect(LESSONS[0].lessonId).toBe("L001");
    expect(LESSONS[LESSONS.length - 1].lessonId).toBe("L133");
  });

  it("getLesson 은 LessonResponse 계약을 만족한다(존재/미존재)", async () => {
    const ok = await getLesson("L001");
    expect(ok).not.toBeNull();
    expect(() => LessonResponseSchema.parse(ok)).not.toThrow();
    expect(await getLesson("L999")).toBeNull();
  });

  it("getStampMap 은 StampMapResponse 계약을 만족한다", async () => {
    const map = await getStampMap();
    expect(() => StampMapResponseSchema.parse(map)).not.toThrow();
    expect(map.total_lessons).toBe(133);
    const inModules = map.modules.reduce((a, m) => a + m.total_in_module, 0);
    expect(inModules).toBe(133);
  });

  it("submitOx 는 OxSubmitResponse 계약을 만족한다", async () => {
    const pass = await submitOx({
      lesson_id: "L001",
      answers: [
        { question_order: 1, answer: true },
        { question_order: 2, answer: true },
      ],
    });
    expect(() => OxSubmitResponseSchema.parse(pass)).not.toThrow();
    expect(pass.passed).toBe(true);
    const fail = await submitOx({
      lesson_id: "L001",
      answers: [{ question_order: 1, answer: false }],
    });
    expect(fail.passed).toBe(false);
    expect(fail.scroll_to_section).toBe("#anchor-1");
  });

  it("saveProgress 는 SaveProgressResponse 계약을 만족한다", async () => {
    const r = await saveProgress({ lesson_id: "L010", position_sec: 42 });
    expect(() => SaveProgressResponseSchema.parse(r)).not.toThrow();
    expect(r.saved_position_sec).toBe(42);
  });

  it("subscribe 는 NewsletterSubscribeResponse 계약을 만족한다", async () => {
    const r = await subscribe({
      email: "a@b.com",
      consent_terms: true,
      consent_marketing: true,
    });
    expect(() => NewsletterSubscribeResponseSchema.parse(r)).not.toThrow();
  });

  it("teacher-kit listKits/getKit 메타가 일관된다", async () => {
    const kits = await listKits(6);
    expect(kits).toHaveLength(6);
    const one = await getKit("L001");
    expect(one?.lesson_id).toBe("L001");
    expect(one?.license).toBe("CC BY-NC-SA 4.0");
  });

  it("submitSurvey 는 SubmitSurveyResponse 계약을 만족한다", async () => {
    const r = await submitSurvey({
      quarter: "Q2",
      year: 2026,
      less_fear_score: 4,
      confidence_score: 5,
    });
    expect(() => SubmitSurveyResponseSchema.parse(r)).not.toThrow();
    expect(r.is_anonymous).toBe(false);
  });
});
