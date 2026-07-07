import { describe, it, expect, vi, beforeEach } from "vitest";

const { createMock, findUniqueMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  findUniqueMock: vi.fn(),
}));
vi.mock("@/lib/db", () => ({
  prisma: { user: { create: createMock, findUnique: findUniqueMock } },
}));

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
  createMock.mockReset().mockResolvedValue({});
  findUniqueMock
    .mockReset()
    .mockResolvedValue({ id: "00000000-0000-0000-0000-000000000001" });
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

  it("P2002 + 같은 id 존재 → 멱등 스킵(재던지지 않음)", async () => {
    createMock.mockRejectedValueOnce({ code: "P2002" });
    // findUnique 기본값: 같은 id 존재
    await expect(syncConfirmedUser(authUser())).resolves.toBeUndefined();
  });

  it("카카오 — nickname 키 없고 name 만 있으면 name 사용", async () => {
    await syncConfirmedUser(authUser({ user_metadata: { name: "카카오유저" } }));
    expect(createMock.mock.calls[0][0].data.nickname).toBe("카카오유저");
  });

  it("카카오 — preferred_username 폴백", async () => {
    await syncConfirmedUser(
      authUser({ user_metadata: { preferred_username: "kko" } }),
    );
    expect(createMock.mock.calls[0][0].data.nickname).toBe("kko");
  });

  it("nickname 과 name 동시 → nickname 우선", async () => {
    await syncConfirmedUser(
      authUser({ user_metadata: { nickname: "Nick", name: "Name" } }),
    );
    expect(createMock.mock.calls[0][0].data.nickname).toBe("Nick");
  });

  it("PII 화이트리스트 — 생일·성별 등 추가 필드는 저장 0(id·email·nickname·role 만)", async () => {
    await syncConfirmedUser(
      authUser({
        user_metadata: {
          nickname: "K",
          birthday: "0101",
          gender: "male",
          phone: "010",
        },
      }),
    );
    expect(Object.keys(createMock.mock.calls[0][0].data).sort()).toEqual(
      ["email", "id", "nickname", "role"].sort(),
    );
  });

  it("하드닝 — P2002 인데 같은 id 없음(이메일을 다른 계정이 선점) → 재던짐", async () => {
    createMock.mockRejectedValueOnce({ code: "P2002" });
    findUniqueMock.mockResolvedValueOnce(null); // linking 미작동 상황
    await expect(syncConfirmedUser(authUser())).rejects.toThrow(/선점|linking/);
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
