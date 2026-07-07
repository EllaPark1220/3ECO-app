import { describe, it, expect, vi, beforeEach } from "vitest";

const { getCurrentUserMock } = vi.hoisted(() => ({ getCurrentUserMock: vi.fn() }));
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({ get: () => "req-pref" })),
}));
vi.mock("@/lib/auth/session", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth/session")>();
  return { ...actual, getCurrentUser: getCurrentUserMock };
});

import { GET } from "./route";

const dbUser = {
  id: "u1",
  email: "a@b.com",
  nickname: "A",
  role: "LEARNER",
  accessibilityMode: true,
  mediaPreference: "TEXT",
  fontSize: "XL",
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => getCurrentUserMock.mockReset());

describe("GET /api/auth/preferences (FR-AUTH-005)", () => {
  it("Scenario 1: 정상 조회 → 200 + 3필드 값", async () => {
    getCurrentUserMock.mockResolvedValue(dbUser);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      accessibility_mode: true,
      media_preference: "TEXT",
      font_size: "XL",
    });
  });

  it("Scenario 2: 미인증 → 401 UNAUTHORIZED", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
    expect((await res.json()).error_code).toBe("UNAUTHORIZED");
  });

  it("Scenario 5+10: Cache-Control private 5분 + X-Request-Id", async () => {
    getCurrentUserMock.mockResolvedValue(dbUser);
    const res = await GET();
    expect(res.headers.get("Cache-Control")).toBe("private, max-age=300");
    expect(res.headers.get("X-Request-Id")).toBe("req-pref");
  });

  it("Scenario 7: 3필드만 노출(email·role·colorMode·createdAt·id 없음)", async () => {
    getCurrentUserMock.mockResolvedValue(dbUser);
    const body = await (await GET()).json();
    for (const k of ["email", "role", "colorMode", "createdAt", "id", "nickname"]) {
      expect(body).not.toHaveProperty(k);
    }
    expect(Object.keys(body)).toHaveLength(3);
  });
});
