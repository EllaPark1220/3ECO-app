import { describe, it, expect } from "vitest";
import {
  ShareStampMapRequestSchema,
  ShareStampMapResponseSchema,
} from "./share";

describe("ShareStampMapRequestSchema", () => {
  it("빈 객체 허용, 추가 키 거부(strict)", () => {
    expect(ShareStampMapRequestSchema.safeParse({}).success).toBe(true);
    expect(ShareStampMapRequestSchema.safeParse({ userId: "x" }).success).toBe(false);
  });
});

describe("ShareStampMapResponseSchema", () => {
  const valid = {
    share_url: "https://app.example.com/stamp/shared/11111111-1111-4111-8111-111111111111",
    token: "11111111-1111-4111-8111-111111111111",
    expires_at: "2026-07-01T00:00:00Z",
    nickname: "지훈",
  };

  it("정상 parse (Scenario 1)", () => {
    expect(ShareStampMapResponseSchema.parse(valid).token).toBe(valid.token);
  });

  it("잘못된 URL 거부 (Scenario 2)", () => {
    expect(ShareStampMapResponseSchema.safeParse({ ...valid, share_url: "not-a-url" }).success).toBe(false);
  });

  it("token 비-UUID 거부", () => {
    expect(ShareStampMapResponseSchema.safeParse({ ...valid, token: "nope" }).success).toBe(false);
  });
});
