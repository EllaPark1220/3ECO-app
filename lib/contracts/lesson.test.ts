import { describe, it, expect } from "vitest";
import {
  LessonIdParamSchema,
  LessonResponseSchema,
  makeLessonETag,
} from "./lesson";

describe("LessonIdParamSchema", () => {
  it.each(["L001", "L050", "L133"])("정상 포맷 %s 통과", (lessonId) => {
    expect(LessonIdParamSchema.parse({ lessonId }).lessonId).toBe(lessonId);
  });

  it.each(["L1", "L1234", "X001", "l001", "L00"])("불량 포맷 %s 거부", (lessonId) => {
    expect(LessonIdParamSchema.safeParse({ lessonId }).success).toBe(false);
  });
});

describe("LessonResponseSchema", () => {
  it("3매체 + module 메타 파싱", () => {
    const ok = LessonResponseSchema.parse({
      lesson_id: "L001",
      title: "화폐의 정의",
      youtube_video_id: "abc123",
      script: "본문",
      pdf_kit_url: "/teacher-kit/L001.pdf",
      revision_last_updated: "2026-04-25",
      revision_notes: null,
      module: { module_id: "M1", name: "화폐와 가치 기초", order_index: 1 },
    });
    expect(ok.module.order_index).toBe(1);
  });

  it("민감 필드(correctAnswer 등)는 스키마에 없음", () => {
    expect("oxQuestions" in LessonResponseSchema.shape).toBe(false);
  });
});

describe("makeLessonETag", () => {
  it("strong validator 포맷", () => {
    expect(makeLessonETag("L001", "2026-04-25")).toBe('"L001-2026-04-25"');
  });
});
