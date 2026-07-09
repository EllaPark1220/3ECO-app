import { describe, it, expect, vi, beforeEach } from "vitest";

const { exchangeMock, verifyOtpMock, getUserMock, syncMock } = vi.hoisted(() => ({
  exchangeMock: vi.fn(),
  verifyOtpMock: vi.fn(),
  getUserMock: vi.fn(),
  syncMock: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      exchangeCodeForSession: exchangeMock,
      verifyOtp: verifyOtpMock,
      getUser: getUserMock,
    },
  })),
}));
vi.mock("@/lib/auth/sync-user", () => ({ syncConfirmedUser: syncMock }));

import { GET } from "./route";
import { NextRequest } from "next/server";

const ORIGIN = "http://localhost:3000";
function req(qs: string): NextRequest {
  return new NextRequest(`${ORIGIN}/auth/callback${qs}`);
}
function location(res: Response): string {
  return res.headers.get("location") ?? "";
}

beforeEach(() => {
  exchangeMock.mockReset().mockResolvedValue({ error: null });
  verifyOtpMock.mockReset().mockResolvedValue({ error: null });
  getUserMock
    .mockReset()
    .mockResolvedValue({ data: { user: { id: "u1", email: "a@b.com" } } });
  syncMock.mockReset().mockResolvedValue(undefined);
});

describe("GET /auth/callback (FW-AUTH-004)", () => {
  it("정상 code(OAuth) → 교환 + sync + next 리다이렉트", async () => {
    const res = await GET(req("?code=abc&next=/lessons"));
    expect(exchangeMock).toHaveBeenCalledWith("abc");
    expect(verifyOtpMock).not.toHaveBeenCalled();
    expect(syncMock).toHaveBeenCalledOnce();
    expect(location(res)).toBe(`${ORIGIN}/lessons`);
  });

  it("정상 token_hash(이메일 확인) → verifyOtp + sync + next 리다이렉트", async () => {
    const res = await GET(req("?token_hash=xyz&type=email&next=/stamp-map"));
    expect(verifyOtpMock).toHaveBeenCalledWith({
      type: "email",
      token_hash: "xyz",
    });
    expect(exchangeMock).not.toHaveBeenCalled();
    expect(syncMock).toHaveBeenCalledOnce();
    expect(location(res)).toBe(`${ORIGIN}/stamp-map`);
  });

  it("token_hash 만료·재사용 → confirm_failed, sync 미호출", async () => {
    verifyOtpMock.mockResolvedValueOnce({ error: { message: "expired" } });
    const res = await GET(req("?token_hash=stale&type=email"));
    expect(syncMock).not.toHaveBeenCalled();
    expect(location(res)).toBe(`${ORIGIN}/login?error=confirm_failed`);
  });

  it("code·token_hash 둘 다 없음 → missing_code, 교환·verifyOtp 미호출", async () => {
    const res = await GET(req(""));
    expect(exchangeMock).not.toHaveBeenCalled();
    expect(verifyOtpMock).not.toHaveBeenCalled();
    expect(location(res)).toBe(`${ORIGIN}/login?error=missing_code`);
  });

  it("교환 에러(만료·재사용) → confirm_failed, sync 미호출", async () => {
    exchangeMock.mockResolvedValueOnce({ error: { message: "expired" } });
    const res = await GET(req("?code=stale"));
    expect(syncMock).not.toHaveBeenCalled();
    expect(location(res)).toBe(`${ORIGIN}/login?error=confirm_failed`);
  });

  it("OAuth 거부(error 파라미터) → /login?error=oauth_canceled, 교환 미호출", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await GET(req("?error=access_denied&error_description=denied"));
    expect(exchangeMock).not.toHaveBeenCalled();
    expect(location(res)).toBe(`${ORIGIN}/login?error=oauth_canceled`);
    spy.mockRestore();
  });

  it("오픈 리다이렉트 next=//evil.com → 내부 기본값(/)으로 차단", async () => {
    const res = await GET(req("?code=abc&next=//evil.com"));
    expect(location(res)).toBe(`${ORIGIN}/`);
  });

  it("sync 실패 → sync_failed graceful 리다이렉트", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    syncMock.mockRejectedValueOnce(new Error("db down"));
    const res = await GET(req("?code=abc"));
    expect(location(res)).toBe(`${ORIGIN}/login?error=sync_failed`);
    spy.mockRestore();
  });
});
