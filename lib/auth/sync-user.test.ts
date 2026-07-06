import { describe, it, expect, vi, beforeEach } from "vitest";

const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { user: { create: createMock } } }));

import { syncConfirmedUser } from "./sync-user";
import type { User } from "@supabase/supabase-js";

function authUser(over: Partial<User> = {}): User {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    email: "alice@example.com",
    user_metadata: { nickname: "Alice" },
    app_metadata: {},
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00Z",
    ...over,
  } as User;
}

beforeEach(() => {
  createMock.mockReset();
  createMock.mockResolvedValue({});
});

describe("syncConfirmedUser (FW-AUTH-004)", () => {
  it("신규 → create 호출(role LEARNER, 기본값 생략, nickname from metadata)", async () => {
    await syncConfirmedUser(authUser());
    expect(createMock).toHaveBeenCalledWith({
      data: {
        id: "00000000-0000-0000-0000-000000000001",
        email: "alice@example.com",
        nickname: "Alice",
        role: "LEARNER",
      },
    });
  });

  it("metadata nickname 없으면 email local part 로 폴백(40자 절단)", async () => {
    const longLocal = "x".repeat(50);
    await syncConfirmedUser(
      authUser({ email: `${longLocal}@example.com`, user_metadata: {} }),
    );
    const arg = createMock.mock.calls[0][0].data;
    expect(arg.nickname).toBe("x".repeat(40));
  });

  it("P2002 충돌 → 멱등 스킵(재던지지 않음)", async () => {
    createMock.mockRejectedValueOnce({ code: "P2002" });
    await expect(syncConfirmedUser(authUser())).resolves.toBeUndefined();
  });

  it("그 외 에러 → 재던짐", async () => {
    createMock.mockRejectedValueOnce({ code: "P1001", message: "db down" });
    await expect(syncConfirmedUser(authUser())).rejects.toMatchObject({
      code: "P1001",
    });
  });

  it("email 없는 auth user → 에러", async () => {
    await expect(
      syncConfirmedUser(authUser({ email: undefined })),
    ).rejects.toThrow();
    expect(createMock).not.toHaveBeenCalled();
  });
});
