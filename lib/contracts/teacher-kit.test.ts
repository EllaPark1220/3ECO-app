import { describe, it, expect } from "vitest";
import {
  TeacherKitParamSchema,
  TeacherKitQuerySchema,
  makeTeacherKitETag,
  teacherKitContentDisposition,
} from "./teacher-kit";

describe("TeacherKitParamSchema / QuerySchema", () => {
  it("정상 lessonId", () => {
    expect(TeacherKitParamSchema.parse({ lessonId: "L133" }).lessonId).toBe("L133");
  });
  it("불량 lessonId 거부", () => {
    expect(TeacherKitParamSchema.safeParse({ lessonId: "L1" }).success).toBe(false);
  });
  it("rev 선택 — 생략 허용", () => {
    expect(TeacherKitQuerySchema.parse({}).rev).toBeUndefined();
    expect(TeacherKitQuerySchema.parse({ rev: "2026-04-01" }).rev).toBe("2026-04-01");
  });
});

describe("makeTeacherKitETag", () => {
  it("pdf 접미 strong validator", () => {
    expect(makeTeacherKitETag("L001", "2026-04-25")).toBe('"L001-2026-04-25-pdf"');
  });
});

describe("teacherKitContentDisposition (RFC 5987)", () => {
  it("ASCII fallback + UTF-8 percent-encoded filename*", () => {
    const cd = teacherKitContentDisposition("L001", "화폐의 정의");
    expect(cd).toContain('filename="L001_lesson.pdf"');
    expect(cd).toContain("filename*=UTF-8''");
    // 한글이 percent-encoding 되어 raw 비-ASCII 가 남지 않음
    expect(cd).toContain(encodeURIComponent("L001_화폐의 정의.pdf"));
  });
});
