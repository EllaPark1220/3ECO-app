import { describe, it, expect, vi, beforeEach } from "vitest";

// 실제 server.ts(server-only)·next/headers 를 로드하지 않도록 모킹
const { signUpMock, signInMock, signOutMock, oauthMock, getReqIdMock } =
  vi.hoisted(() => ({
    signUpMock: vi.fn(),
    signInMock: vi.fn(),
    signOutMock: vi.fn(),
    oauthMock: vi.fn(),
    getReqIdMock: vi.fn(() => "req-test"),
  }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      signUp: signUpMock,
      signInWithPassword: signInMock,
      signOut: signOutMock,
      signInWithOAuth: oauthMock,
    },
  })),
}));
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({ get: getReqIdMock })),
}));
const { redirectMock } = vi.hoisted(() => ({ redirectMock: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

const { requireUserMock, prismaUpdateMock, revalidateMock } = vi.hoisted(() => ({
  requireUserMock: vi.fn(),
  prismaUpdateMock: vi.fn(),
  revalidateMock: vi.fn(),
}));
vi.mock("@/lib/auth/guards", () => ({ requireUser: requireUserMock }));
vi.mock("@/lib/db", () => ({ prisma: { user: { update: prismaUpdateMock } } }));
vi.mock("next/cache", () => ({ revalidatePath: revalidateMock }));

import {
  signUp,
  signIn,
  signOut,
  updateUserPreferences,
  signInWithKakao,
} from "./actions";
import { AuthError } from "@/lib/auth/session";
import { ERROR_CODES } from "@/lib/contracts/error-codes";

const valid = { email: "alice@example.com", nickname: "Alice", password: "secure1234" };

function fd(obj: Record<string, string>): FormData {
  const f = new FormData();
  Object.entries(obj).forEach(([k, v]) => f.append(k, v));
  return f;
}

beforeEach(() => {
  signUpMock.mockReset();
  // 신규 이메일: Supabase 가 identities 있는 user 를 에러 없이 반환
  signUpMock.mockResolvedValue({
    data: { user: { id: "u1", identities: [{ id: "i1" }] } },
    error: null,
  });
});

describe("signUp() (FW-AUTH-002 / TS-UT-001)", () => {
  it("정상 가입 — 균일 성공 응답 + nickname 을 user_metadata 로 전달", async () => {
    const res = await signUp(fd(valid));
    expect(res).toEqual({ ok: true, requires_email_confirmation: true });
    expect(signUpMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "alice@example.com",
        password: "secure1234",
        options: expect.objectContaining({ data: { nickname: "Alice" } }),
      }),
    );
  });

  it("PII/결제 추가 필드 → INVALID_INPUT, auth.signUp 미호출", async () => {
    const res = await signUp(fd({ ...valid, card_number: "1234-5678" }));
    expect(res).toMatchObject({ error_code: "INVALID_INPUT" });
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("잘못된 이메일 → INVALID_EMAIL, 미호출", async () => {
    const res = await signUp(fd({ ...valid, email: "not-an-email" }));
    expect(res).toMatchObject({ error_code: "INVALID_EMAIL" });
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("짧은 비밀번호 → PASSWORD_TOO_SHORT, 미호출", async () => {
    const res = await signUp(fd({ ...valid, password: "123" }));
    expect(res).toMatchObject({ error_code: "PASSWORD_TOO_SHORT" });
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("이메일 열거 방지 — 기존 이메일(obfuscated user)도 신규와 동일 응답", async () => {
    // Supabase: 기존 이메일은 에러 없이 identities:[] 반환
    signUpMock.mockResolvedValueOnce({
      data: { user: { id: "obf", identities: [] } },
      error: null,
    });
    const res = await signUp(fd(valid));
    expect(res).toEqual({ ok: true, requires_email_confirmation: true });
  });

  it("인프라 오류 → INTERNAL_ERROR (EMAIL_ALREADY_EXISTS 등 존재 비노출)", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    signUpMock.mockResolvedValueOnce({
      data: {},
      error: { message: "network down" },
    });
    const res = await signUp(fd(valid));
    expect(res).toMatchObject({ error_code: "INTERNAL_ERROR" });
    expect(res).not.toMatchObject({ error_code: "EMAIL_ALREADY_EXISTS" });
    spy.mockRestore();
  });

  it("오류 로그 이메일 마스킹 — 평문 노출 0건", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    signUpMock.mockResolvedValueOnce({ data: {}, error: { message: "boom" } });
    await signUp(fd(valid));
    const logged = spy.mock.calls.map((c) => c.join(" ")).join("\n");
    expect(logged).not.toContain("alice@example.com");
    expect(logged).toContain("a***@e***");
    spy.mockRestore();
  });
});

const login = { email: "alice@example.com", password: "secure1234" };

describe("signIn() / signOut() (FW-AUTH-003 / TS-UT-002)", () => {
  beforeEach(() => {
    signInMock.mockReset().mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    signOutMock.mockReset().mockResolvedValue({ error: null });
  });

  it("정상 로그인 → {ok:true, redirect_to} + signInWithPassword 호출", async () => {
    const res = await signIn(fd({ ...login, to: "/lessons" }));
    expect(res).toEqual({ ok: true, redirect_to: "/lessons" });
    expect(signInMock).toHaveBeenCalledWith({
      email: "alice@example.com",
      password: "secure1234",
    });
  });

  it("열거 방지 — 틀린 비번과 미가입 이메일이 동일 INVALID_CREDENTIALS(코드·메시지)", async () => {
    signInMock.mockResolvedValueOnce({ data: {}, error: { code: "invalid_credentials", status: 400 } });
    const wrongPw = await signIn(fd(login));
    signInMock.mockResolvedValueOnce({ data: {}, error: { code: "invalid_credentials", status: 400 } });
    const noUser = await signIn(fd({ email: "nobody@example.com", password: "whatever" }));
    expect(wrongPw).toMatchObject({ error_code: "INVALID_CREDENTIALS" });
    expect(noUser).toMatchObject({ error_code: "INVALID_CREDENTIALS" });
    expect((wrongPw as { message: string }).message).toBe(
      (noUser as { message: string }).message,
    );
    expect((wrongPw as { message: string }).message).toBe(
      ERROR_CODES.INVALID_CREDENTIALS.message,
    );
  });

  it("미확인(email_not_confirmed) → EMAIL_NOT_CONFIRMED (비번-게이트 예외)", async () => {
    signInMock.mockResolvedValueOnce({ data: {}, error: { code: "email_not_confirmed", status: 400 } });
    const res = await signIn(fd(login));
    expect(res).toMatchObject({ error_code: "EMAIL_NOT_CONFIRMED" });
  });

  it("Supabase 429 → RATE_LIMIT_EXCEEDED", async () => {
    signInMock.mockResolvedValueOnce({ data: {}, error: { code: "over_request_rate_limit", status: 429 } });
    const res = await signIn(fd(login));
    expect(res).toMatchObject({ error_code: "RATE_LIMIT_EXCEEDED" });
  });

  it("오픈 리다이렉트 to=//evil.com → 내부 기본값", async () => {
    const res = await signIn(fd({ ...login, to: "//evil.com" }));
    expect(res).toEqual({ ok: true, redirect_to: "/lessons" });
  });

  it("검증 실패(빈 입력) → INVALID_CREDENTIALS, signInWithPassword 미호출", async () => {
    const res = await signIn(fd({ email: "", password: "" }));
    expect(res).toMatchObject({ error_code: "INVALID_CREDENTIALS" });
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("실패 로그 이메일 마스킹 — 평문 0건", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    signInMock.mockResolvedValueOnce({ data: {}, error: { code: "invalid_credentials" } });
    await signIn(fd(login));
    const logged = spy.mock.calls.map((c) => c.join(" ")).join("\n");
    expect(logged).not.toContain("alice@example.com");
    expect(logged).toContain("a***@e***");
    spy.mockRestore();
  });

  it("signOut() → auth.signOut 호출 + {ok:true}", async () => {
    const res = await signOut();
    expect(signOutMock).toHaveBeenCalledOnce();
    expect(res).toEqual({ ok: true });
  });
});

describe("updateUserPreferences() (FW-AUTH-005)", () => {
  const u1 = { id: "u1" };
  beforeEach(() => {
    requireUserMock.mockReset().mockResolvedValue(u1);
    prismaUpdateMock.mockReset().mockResolvedValue({ id: "u1" });
    revalidateMock.mockReset();
  });

  it("Scenario 1: 3필드 동시 변경 → updated_fields 3종 + where=세션 userId", async () => {
    const res = await updateUserPreferences({
      accessibility_mode: true,
      media_preference: "TEXT",
      font_size: "XL",
    });
    expect(res).toEqual({
      ok: true,
      updated_fields: ["accessibility_mode", "media_preference", "font_size"],
    });
    expect(prismaUpdateMock).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { accessibilityMode: true, mediaPreference: "TEXT", fontSize: "XL" },
    });
  });

  it("Scenario 2: Partial(font_size 만) → 그 필드만 UPDATE", async () => {
    const res = await updateUserPreferences({ font_size: "XL" });
    expect(res).toEqual({ ok: true, updated_fields: ["font_size"] });
    expect(prismaUpdateMock).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { fontSize: "XL" },
    });
  });

  it("Scenario 3: 빈 객체 → 400 EMPTY_UPDATE, UPDATE 미호출", async () => {
    const res = await updateUserPreferences({});
    expect(res).toMatchObject({ error_code: "EMPTY_UPDATE" });
    expect(prismaUpdateMock).not.toHaveBeenCalled();
  });

  it("Scenario 4: 잘못된 media_preference → 400 INVALID_MEDIA_PREFERENCE, 미호출", async () => {
    const res = await updateUserPreferences({ media_preference: "INVALID" });
    expect(res).toMatchObject({ error_code: "INVALID_MEDIA_PREFERENCE" });
    expect(prismaUpdateMock).not.toHaveBeenCalled();
  });

  it("Scenario 5: 미인증 → 401 UNAUTHORIZED, UPDATE 미호출", async () => {
    requireUserMock.mockRejectedValueOnce(new AuthError("UNAUTHORIZED"));
    const res = await updateUserPreferences({ font_size: "XL" });
    expect(res).toMatchObject({ error_code: "UNAUTHORIZED" });
    expect(prismaUpdateMock).not.toHaveBeenCalled();
  });

  it("Scenario 6: 위조 user_id → 400 INVALID_INPUT, u2/u1 변경 0건(strict 차단)", async () => {
    const res = await updateUserPreferences({ user_id: "u2", font_size: "XL" });
    expect(res).toMatchObject({ error_code: "INVALID_INPUT" });
    expect(prismaUpdateMock).not.toHaveBeenCalled();
  });

  it("잘못된 font_size 값 → 400 INVALID_INPUT, 미호출", async () => {
    const res = await updateUserPreferences({ font_size: "ZZ" });
    expect(res).toMatchObject({ error_code: "INVALID_INPUT" });
    expect(prismaUpdateMock).not.toHaveBeenCalled();
  });

  it("DB 오류 → 500 INTERNAL_ERROR", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    prismaUpdateMock.mockRejectedValueOnce(new Error("db down"));
    const res = await updateUserPreferences({ font_size: "XL" });
    expect(res).toMatchObject({ error_code: "INTERNAL_ERROR" });
    spy.mockRestore();
  });

  it("성공 시 RSC revalidate 호출(즉시 반영)", async () => {
    await updateUserPreferences({ font_size: "XL" });
    expect(revalidateMock).toHaveBeenCalled();
  });
});

describe("signInWithKakao() (FW-AUTH-006)", () => {
  beforeEach(() => {
    oauthMock.mockReset().mockResolvedValue({
      data: { url: "https://kauth.kakao.com/oauth/authorize?x=1" },
      error: null,
    });
    redirectMock.mockReset();
  });

  it("정상 → kakao provider + scope 2종 + /auth/callback redirectTo, 인가 URL 로 redirect", async () => {
    await signInWithKakao("/stamp-map");
    expect(oauthMock).toHaveBeenCalledWith({
      provider: "kakao",
      options: {
        redirectTo: expect.stringContaining("/auth/callback?next=%2Fstamp-map"),
        scopes: "account_email profile_nickname",
      },
    });
    expect(redirectMock).toHaveBeenCalledWith(
      "https://kauth.kakao.com/oauth/authorize?x=1",
    );
  });

  it("오픈 리다이렉트 next=//evil.com → 내부 기본값(/lessons)으로 차단", async () => {
    await signInWithKakao("//evil.com");
    expect(oauthMock).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          redirectTo: expect.stringContaining("next=%2Flessons"),
        }),
      }),
    );
  });

  it("OAuth 오류 → INTERNAL_ERROR, redirect 미호출", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    oauthMock.mockResolvedValueOnce({ data: {}, error: { message: "kakao down" } });
    const res = await signInWithKakao();
    expect(res).toMatchObject({ error_code: "INTERNAL_ERROR" });
    expect(redirectMock).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("url 없음 → INTERNAL_ERROR", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    oauthMock.mockResolvedValueOnce({ data: { url: null }, error: null });
    const res = await signInWithKakao();
    expect(res).toMatchObject({ error_code: "INTERNAL_ERROR" });
    spy.mockRestore();
  });
});
