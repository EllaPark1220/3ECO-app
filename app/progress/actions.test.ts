import { describe, it, expect, vi, beforeEach } from "vitest";

// requireUser·saveProgressCore·next/headers 모킹(actions.test.ts 스타일).
const { requireUserMock, saveCoreMock } = vi.hoisted(() => ({
  requireUserMock: vi.fn(),
  saveCoreMock: vi.fn(),
}));
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({ get: () => "req-prog" })),
}));
vi.mock("@/lib/auth/guards", () => ({ requireUser: requireUserMock }));
vi.mock("@/lib/services/progress", () => ({ saveProgressCore: saveCoreMock }));

import { saveProgress } from "./actions";
import { AuthError } from "@/lib/auth/session";

beforeEach(() => {
  requireUserMock.mockReset();
  saveCoreMock.mockReset();
});

describe("saveProgress() Server Action (결정4)", () => {
  it("정상 — requireUser 후 세션 userId 로 core 위임, 리치 응답 반환", async () => {
    requireUserMock.mockResolvedValue({ id: "u1" });
    const rich = {
      ok: true,
      lesson_id: "L001",
      saved_position_sec: 30,
      saved_at: "2026-07-07T00:00:00.000Z",
      is_first_save: true,
    };
    saveCoreMock.mockResolvedValue(rich);

    const res = await saveProgress({ lesson_id: "L001", position_sec: 30 });
    expect(res).toEqual(rich);
    expect(saveCoreMock).toHaveBeenCalledWith(
      "u1",
      { lesson_id: "L001", position_sec: 30 },
      "req-prog",
    );
  });

  it("비로그인 → 401 UNAUTHORIZED, core 미호출", async () => {
    requireUserMock.mockRejectedValueOnce(new AuthError("UNAUTHORIZED"));
    const res = await saveProgress({ lesson_id: "L001", position_sec: 30 });
    expect(res).toMatchObject({ error_code: "UNAUTHORIZED" });
    expect(saveCoreMock).not.toHaveBeenCalled();
  });

  it("검증 오류는 core 가 그대로 반환(위임만)", async () => {
    requireUserMock.mockResolvedValue({ id: "u1" });
    saveCoreMock.mockResolvedValue({
      error_code: "INVALID_LESSON_ID",
      message: "x",
      request_id: "req-prog",
    });
    const res = await saveProgress({ lesson_id: "bad", position_sec: 0 });
    expect(res).toMatchObject({ error_code: "INVALID_LESSON_ID" });
  });
});
