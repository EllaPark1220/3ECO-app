import { describe, it, expect } from "vitest";
import { SignUpRequestSchema, SignInRequestSchema } from "./auth";

const valid = { email: "alice@example.com", nickname: "Alice", password: "secure1234" };

describe("SignUpRequestSchema (FW-AUTH-002)", () => {
  it("정상 3필드 parse", () => {
    const r = SignUpRequestSchema.parse(valid);
    expect(r.email).toBe("alice@example.com");
    expect(r.nickname).toBe("Alice");
  });

  it.each(["card_number", "account_number", "phone", "real_name", "payment"])(
    "PII/결제 추가 필드 %s 거부 (strict)",
    (extra) => {
      expect(
        SignUpRequestSchema.safeParse({ ...valid, [extra]: "x" }).success,
      ).toBe(false);
    },
  );

  it("잘못된 이메일 형식 거부", () => {
    expect(
      SignUpRequestSchema.safeParse({ ...valid, email: "not-an-email" }).success,
    ).toBe(false);
  });

  it.each(["", "123", "1234567"])("8자 미만 비밀번호 %s 거부", (password) => {
    expect(SignUpRequestSchema.safeParse({ ...valid, password }).success).toBe(
      false,
    );
  });

  it.each(["a", "x".repeat(41)])("닉네임 길이 위반 거부", (nickname) => {
    expect(SignUpRequestSchema.safeParse({ ...valid, nickname }).success).toBe(
      false,
    );
  });
});

describe("SignInRequestSchema (FW-AUTH-003)", () => {
  it("정상 parse", () => {
    const r = SignInRequestSchema.parse({
      email: "alice@example.com",
      password: "x",
    });
    expect(r.email).toBe("alice@example.com");
  });

  it("잘못된 이메일 거부", () => {
    expect(
      SignInRequestSchema.safeParse({ email: "nope", password: "x" }).success,
    ).toBe(false);
  });

  it("빈 비밀번호 거부", () => {
    expect(
      SignInRequestSchema.safeParse({
        email: "alice@example.com",
        password: "",
      }).success,
    ).toBe(false);
  });
});
