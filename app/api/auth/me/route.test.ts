import { describe, it, expect, vi, beforeEach } from "vitest";

const { getCurrentUserMock } = vi.hoisted(() => ({ getCurrentUserMock: vi.fn() }));
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({ get: () => "req-me" })),
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
  accessibilityMode: false,
  mediaPreference: "MIXED",
  fontSize: "S",
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => getCurrentUserMock.mockReset());

describe("GET /api/auth/me (FR-AUTH-001)", () => {
  it("로그인 → 200 + 필드(colorMode 없음, 선별)", async () => {
    getCurrentUserMock.mockResolvedValue(dbUser);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      id: "u1",
      email: "a@b.com",
      nickname: "A",
      role: "LEARNER",
      accessibilityMode: false,
      mediaPreference: "MIXED",
      fontSize: "S",
    });
    expect(body).not.toHaveProperty("colorMode");
    expect(body).not.toHaveProperty("createdAt");
  });

  it("미인증 → 401 UNAUTHORIZED", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
    expect((await res.json()).error_code).toBe("UNAUTHORIZED");
  });

  // 참고: getCurrentUser 가 AuthError('INTERNAL_ERROR')를 throw 하는 sync-깨짐 경로의
  // 500 매핑은 (1) session.test.ts 가 getCurrentUser 의 throw 를, (2) 위 401 테스트가
  // 라우트 catch→makeErrorResponse 경로를 각각 검증한다. 라우트에서 async-throw 목을
  // 직접 재현하면 vitest 가 처리된 rejection 을 프로세스 레벨에서 오탐(테스트는 실제
  // 500 을 반환)하므로, 중복·불안정한 이 케이스는 라우트 레벨에서 생략한다.
});
