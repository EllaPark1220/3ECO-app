import { describe, it, expect, vi, beforeEach } from "vitest";

const { getCurrentUserMock } = vi.hoisted(() => ({ getCurrentUserMock: vi.fn() }));
vi.mock("@/lib/auth/session", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth/session")>();
  return { ...actual, getCurrentUser: getCurrentUserMock };
});

import {
  requireUser,
  requireRole,
  requireRoleAny,
  requireSelfOrAdmin,
  withRoleGuard,
} from "./guards";
import { AuthError } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

type Role = "LEARNER" | "TEACHER" | "ADMIN";
function user(id: string, role: Role) {
  return {
    id,
    email: `${id}@b.com`,
    nickname: id,
    role,
    accessibilityMode: false,
    mediaPreference: "MIXED",
    fontSize: "S",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

beforeEach(() => {
  getCurrentUserMock.mockReset();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("requireUser / requireRole (FR-AUTH-002 / TS-UT-013)", () => {
  it("인증 → User 반환", async () => {
    getCurrentUserMock.mockResolvedValue(user("u1", "LEARNER"));
    expect((await requireUser()).id).toBe("u1");
  });

  it("미인증 → AuthError(UNAUTHORIZED)", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    await expect(requireUser()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("requireRole: 역할 일치 → 통과", async () => {
    getCurrentUserMock.mockResolvedValue(user("t1", "TEACHER"));
    expect((await requireRole("TEACHER")).id).toBe("t1");
  });

  it("TS-UT-013: LEARNER 가 TEACHER 전용(예: TeacherFeedback) → FORBIDDEN", async () => {
    getCurrentUserMock.mockResolvedValue(user("u1", "LEARNER"));
    await expect(requireRole("TEACHER")).rejects.toBeInstanceOf(AuthError);
    await expect(requireRole("TEACHER")).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});

describe("requireRoleAny / requireSelfOrAdmin", () => {
  it("requireRoleAny: 허용 집합에 포함 → 통과", async () => {
    getCurrentUserMock.mockResolvedValue(user("a1", "ADMIN"));
    expect((await requireRoleAny(["TEACHER", "ADMIN"])).role).toBe("ADMIN");
  });

  it("requireRoleAny: 미포함 → FORBIDDEN", async () => {
    getCurrentUserMock.mockResolvedValue(user("u1", "LEARNER"));
    await expect(requireRoleAny(["TEACHER", "ADMIN"])).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("requireSelfOrAdmin: 본인 → 통과", async () => {
    getCurrentUserMock.mockResolvedValue(user("u2", "LEARNER"));
    expect((await requireSelfOrAdmin("u2")).id).toBe("u2");
  });

  it("requireSelfOrAdmin: 타인 ADMIN → 통과", async () => {
    getCurrentUserMock.mockResolvedValue(user("a1", "ADMIN"));
    expect((await requireSelfOrAdmin("u2")).id).toBe("a1");
  });

  it("requireSelfOrAdmin: 타인 비ADMIN → FORBIDDEN", async () => {
    getCurrentUserMock.mockResolvedValue(user("u1", "LEARNER"));
    await expect(requireSelfOrAdmin("u2")).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});

describe("withRoleGuard (Route Handler 래퍼)", () => {
  const req = () => new NextRequest("http://localhost/admin/x");
  const handler = vi.fn(async () => NextResponse.json({ ok: true }));

  beforeEach(() => handler.mockClear());

  it("역할 일치 → handler 실행(200)", async () => {
    getCurrentUserMock.mockResolvedValue(user("a1", "ADMIN"));
    const res = await withRoleGuard("ADMIN", handler)(req());
    expect(res.status).toBe(200);
    expect(handler).toHaveBeenCalledOnce();
  });

  it("역할 불일치 → 403, handler 미실행", async () => {
    getCurrentUserMock.mockResolvedValue(user("t1", "TEACHER"));
    const res = await withRoleGuard("ADMIN", handler)(req());
    expect(res.status).toBe(403);
    expect(handler).not.toHaveBeenCalled();
  });

  it("미인증 → 401, handler 미실행", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const res = await withRoleGuard("ADMIN", handler)(req());
    expect(res.status).toBe(401);
    expect(handler).not.toHaveBeenCalled();
  });
});
