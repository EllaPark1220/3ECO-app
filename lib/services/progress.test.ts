import { describe, it, expect, vi, beforeEach } from "vitest";

// prisma·session 모킹(실제 DB·supabase 미로드). auth 테스트(actions.test.ts)와 동일 스타일.
const { findUniqueMock, upsertMock, getCurrentUserMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
  upsertMock: vi.fn(),
  getCurrentUserMock: vi.fn(),
}));
vi.mock("@/lib/db", () => ({
  prisma: {
    lessonProgress: { findUnique: findUniqueMock, upsert: upsertMock },
  },
}));
vi.mock("@/lib/auth/session", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth/session")>();
  return { ...actual, getCurrentUser: getCurrentUserMock };
});

import {
  saveProgressCore,
  getResumePosition,
  getViewerProgress,
} from "./progress";
import { AuthError } from "@/lib/auth/session";

const savedRow = {
  id: "p1",
  userId: "u1",
  lessonId: "L001",
  lastPositionSec: 120,
  oxCompleted: false,
  stampEarned: false,
  createdAt: new Date("2026-07-07T00:00:00.000Z"),
  updatedAt: new Date("2026-07-07T00:05:00.000Z"),
};

beforeEach(() => {
  findUniqueMock.mockReset();
  upsertMock.mockReset().mockResolvedValue(savedRow);
  getCurrentUserMock.mockReset();
});

describe("saveProgressCore() (CT-API-003 / 결정3)", () => {
  it("신규(create) → is_first_save:true + 리치 응답 5필드", async () => {
    findUniqueMock.mockResolvedValueOnce(null); // 사전 조회: 없음
    const res = await saveProgressCore("u1", { lesson_id: "L001", position_sec: 120 });
    expect(res).toEqual({
      ok: true,
      lesson_id: "L001",
      saved_position_sec: 120,
      saved_at: "2026-07-07T00:05:00.000Z",
      is_first_save: true,
    });
  });

  it("기존(update) → is_first_save:false", async () => {
    findUniqueMock.mockResolvedValueOnce({ id: "p1" }); // 사전 조회: 존재
    const res = await saveProgressCore("u1", { lesson_id: "L001", position_sec: 120 });
    expect(res).toMatchObject({ ok: true, is_first_save: false });
  });

  it("upsert where 는 세션 userId 로 고정(create/update 모두 lastPositionSec 만)", async () => {
    findUniqueMock.mockResolvedValueOnce(null);
    await saveProgressCore("u1", { lesson_id: "L001", position_sec: 120 });
    expect(upsertMock).toHaveBeenCalledWith({
      where: { userId_lessonId: { userId: "u1", lessonId: "L001" } },
      create: { userId: "u1", lessonId: "L001", lastPositionSec: 120 },
      update: { lastPositionSec: 120 },
    });
  });

  it("IDOR — 입력의 user_id 는 무시(where 는 항상 세션 userId)", async () => {
    findUniqueMock.mockResolvedValueOnce(null);
    // strict 스키마가 user_id 를 거부 → 400. upsert 미호출로 위조 write 0건.
    const res = await saveProgressCore("u1", {
      lesson_id: "L001",
      position_sec: 120,
      user_id: "attacker",
    });
    expect(res).toMatchObject({ error_code: "INVALID_INPUT" });
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it("검증 실패 — 불량 lesson_id → 400 INVALID_LESSON_ID, upsert 미호출", async () => {
    const res = await saveProgressCore("u1", { lesson_id: "bad", position_sec: 0 });
    expect(res).toMatchObject({ error_code: "INVALID_LESSON_ID" });
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it("검증 실패 — 범위 밖 position_sec → 400 INVALID_POSITION, upsert 미호출", async () => {
    const res = await saveProgressCore("u1", { lesson_id: "L001", position_sec: -1 });
    expect(res).toMatchObject({ error_code: "INVALID_POSITION" });
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it("ErrorResponse 는 공통 포맷(request_id 포함)", async () => {
    const res = await saveProgressCore("u1", { lesson_id: "bad", position_sec: 0 });
    expect(res).toHaveProperty("request_id");
    expect(res).toHaveProperty("message");
  });
});

describe("getResumePosition() (결정6 — graceful)", () => {
  it("익명(getCurrentUser null) → 0 반환(throw 안 함), DB 조회 안 함", async () => {
    getCurrentUserMock.mockResolvedValueOnce(null);
    await expect(getResumePosition("L001")).resolves.toBe(0);
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("기존 진척 있음 → lastPositionSec 반환(where 세션 userId 고정)", async () => {
    getCurrentUserMock.mockResolvedValueOnce({ id: "u1" });
    findUniqueMock.mockResolvedValueOnce({ lastPositionSec: 200 });
    await expect(getResumePosition("L001")).resolves.toBe(200);
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { userId_lessonId: { userId: "u1", lessonId: "L001" } },
      select: { lastPositionSec: true },
    });
  });

  it("진척 없음 → 0", async () => {
    getCurrentUserMock.mockResolvedValueOnce({ id: "u1" });
    findUniqueMock.mockResolvedValueOnce(null);
    await expect(getResumePosition("L001")).resolves.toBe(0);
  });
});

describe("getViewerProgress() (공개 시청 — 절대 throw 안 함, 익명 degrade)", () => {
  it("익명(getCurrentUser null) → {0, false}, DB 조회 안 함", async () => {
    getCurrentUserMock.mockResolvedValueOnce(null);
    await expect(getViewerProgress("L001")).resolves.toEqual({
      initialPositionSec: 0,
      sessionActive: false,
    });
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("로그인 + 진척 있음 → {position, true}", async () => {
    getCurrentUserMock.mockResolvedValueOnce({ id: "u1" });
    findUniqueMock.mockResolvedValueOnce({ lastPositionSec: 200 });
    await expect(getViewerProgress("L001")).resolves.toEqual({
      initialPositionSec: 200,
      sessionActive: true,
    });
  });

  it("로그인 + 진척 없음 → {0, true}", async () => {
    getCurrentUserMock.mockResolvedValueOnce({ id: "u1" });
    findUniqueMock.mockResolvedValueOnce(null);
    await expect(getViewerProgress("L001")).resolves.toEqual({
      initialPositionSec: 0,
      sessionActive: true,
    });
  });

  it("broken-sync(getCurrentUser AuthError throw) → 익명 degrade {0, false} (500 방지)", async () => {
    getCurrentUserMock.mockRejectedValueOnce(new AuthError("INTERNAL_ERROR"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(getViewerProgress("L001")).resolves.toEqual({
      initialPositionSec: 0,
      sessionActive: false,
    });
    expect(spy).toHaveBeenCalled(); // anomaly 로깅
    spy.mockRestore();
  });

  it("DB 조회 실패(findUnique throw) → 익명 degrade {0, false}", async () => {
    getCurrentUserMock.mockResolvedValueOnce({ id: "u1" });
    findUniqueMock.mockRejectedValueOnce(new Error("db down"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(getViewerProgress("L001")).resolves.toEqual({
      initialPositionSec: 0,
      sessionActive: false,
    });
    spy.mockRestore();
  });
});
