import { describe, it, expect } from "vitest";
import { safeInternalPath } from "./redirect";

describe("safeInternalPath (FW-AUTH-004 오픈 리다이렉트 가드)", () => {
  it.each(["/lessons", "/", "/a/b?x=1", "/auth/reset-password"])(
    "내부 경로 %s 허용",
    (p) => {
      expect(safeInternalPath(p)).toBe(p);
    },
  );

  it.each([
    "//evil.com",
    "/\\evil.com",
    "https://evil.com",
    "http://evil.com",
    "javascript:alert(1)",
    "evil.com",
    "",
    null,
    undefined,
    " /lessons",
    "/lessons ",
  ])("외부/불량 %s → 기본값으로 차단", (p) => {
    expect(safeInternalPath(p as string | null)).toBe("/lessons");
  });

  it("제어문자(개행·탭) 포함 경로 차단", () => {
    expect(safeInternalPath("/a\nb")).toBe("/lessons");
    expect(safeInternalPath("/a\tb")).toBe("/lessons");
  });

  it("커스텀 fallback 적용", () => {
    expect(safeInternalPath("//evil", "/")).toBe("/");
  });
});
