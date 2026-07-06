import { describe, it, expect, vi, beforeEach } from "vitest";

const { getUserMock, findUniqueMock } = vi.hoisted(() => ({
  getUserMock: vi.fn(),
  findUniqueMock: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ auth: { getUser: getUserMock } })),
}));
vi.mock("@/lib/db", () => ({
  prisma: { user: { findUnique: findUniqueMock } },
}));

import { getCurrentUser, getCurrentUserOrThrow, AuthError } from "./session";

const dbUser = {
  id: "u1",
  email: "a@b.com",
  nickname: "A",
  role: "LEARNER",
  accessibilityMode: false,
  mediaPreference: "MIXED",
  fontSize: "S",
};

beforeEach(() => {
  getUserMock.mockReset().mockResolvedValue({ data: { user: { id: "u1" } } });
  findUniqueMock.mockReset().mockResolvedValue(dbUser);
});

describe("getCurrentUser (FR-AUTH-001)", () => {
  it("세션 + public.User → User 반환", async () => {
    const u = await getCurrentUser();
    expect(u).toMatchObject({ id: "u1", role: "LEARNER" });
    expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: "u1" } });
  });

  it("세션 없음 → null (조회 없음)", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null } });
    expect(await getCurrentUser()).toBeNull();
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("세션 있는데 public.User 없음 → AuthError(INTERNAL_ERROR) + 로그", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    getUserMock.mockResolvedValue({ data: { user: { id: "u404" } } });
    findUniqueMock.mockResolvedValue(null);
    const err = await getCurrentUser().catch((e) => e);
    expect(err).toBeInstanceOf(AuthError);
    expect(err).toMatchObject({ code: "INTERNAL_ERROR" });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("getCurrentUserOrThrow", () => {
  it("null → AuthError(UNAUTHORIZED)", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });
    await expect(getCurrentUserOrThrow()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("있으면 User 반환", async () => {
    const u = await getCurrentUserOrThrow();
    expect(u.id).toBe("u1");
  });
});
