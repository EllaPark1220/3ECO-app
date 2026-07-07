import { describe, it, expect, vi, beforeEach } from "vitest";

// getCurrentUser·saveProgressCore 모킹. sendBeacon 대상 POST.
const { getCurrentUserMock, saveCoreMock } = vi.hoisted(() => ({
  getCurrentUserMock: vi.fn(),
  saveCoreMock: vi.fn(),
}));
vi.mock("@/lib/auth/session", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth/session")>();
  return { ...actual, getCurrentUser: getCurrentUserMock };
});
vi.mock("@/lib/services/progress", () => ({ saveProgressCore: saveCoreMock }));

import { POST } from "./route";

function req(body: string, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/progress/sync", {
    method: "POST",
    body,
    headers,
  });
}

beforeEach(() => {
  getCurrentUserMock.mockReset();
  saveCoreMock.mockReset();
});

describe("POST /api/progress/sync (결정5 — sendBeacon)", () => {
  it("정상 — 로그인 사용자, body 파싱 후 core 위임 → 200 + 리치 JSON + X-Request-Id", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "u1" });
    const rich = {
      ok: true,
      lesson_id: "L001",
      saved_position_sec: 42,
      saved_at: "2026-07-07T00:00:00.000Z",
      is_first_save: false,
    };
    saveCoreMock.mockResolvedValue(rich);

    const res = await POST(
      req(JSON.stringify({ lesson_id: "L001", position_sec: 42 }), {
        "X-Request-Id": "beacon-1",
      }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(rich);
    expect(res.headers.get("X-Request-Id")).toBe("beacon-1");
    expect(saveCoreMock).toHaveBeenCalledWith(
      "u1",
      { lesson_id: "L001", position_sec: 42 },
      "beacon-1",
    );
  });

  it("비로그인 → 401 UNAUTHORIZED, core 미호출", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const res = await POST(req(JSON.stringify({ lesson_id: "L001", position_sec: 1 })));
    expect(res.status).toBe(401);
    expect((await res.json()).error_code).toBe("UNAUTHORIZED");
    expect(saveCoreMock).not.toHaveBeenCalled();
  });

  it("잘못된 body(비 JSON) → 400 INVALID_INPUT, core 미호출", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "u1" });
    const res = await POST(req("not-json{"));
    expect(res.status).toBe(400);
    expect((await res.json()).error_code).toBe("INVALID_INPUT");
    expect(saveCoreMock).not.toHaveBeenCalled();
  });

  it("검증 실패(불량 lesson_id) → core 가 400 매핑 → 상태코드 400", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "u1" });
    saveCoreMock.mockResolvedValue({
      error_code: "INVALID_LESSON_ID",
      message: "x",
      request_id: "r",
    });
    const res = await POST(req(JSON.stringify({ lesson_id: "bad", position_sec: 0 })));
    expect(res.status).toBe(400);
    expect((await res.json()).error_code).toBe("INVALID_LESSON_ID");
  });
});
