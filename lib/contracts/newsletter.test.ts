import { describe, it, expect } from "vitest";
import {
  NewsletterSubscribeRequestSchema,
  NewsletterConfirmQuerySchema,
} from "./newsletter";

describe("NewsletterSubscribeRequestSchema", () => {
  it("정상 + email 소문자/trim transform", () => {
    const r = NewsletterSubscribeRequestSchema.parse({
      email: "  USER@Example.COM ",
      consent_terms: true,
      consent_marketing: true,
    });
    expect(r.email).toBe("user@example.com");
  });

  it("이메일 형식 위반 거부", () => {
    expect(
      NewsletterSubscribeRequestSchema.safeParse({ email: "nope", consent_terms: true, consent_marketing: true }).success,
    ).toBe(false);
  });

  it("약관 미동의 거부", () => {
    expect(
      NewsletterSubscribeRequestSchema.safeParse({ email: "a@b.com", consent_terms: false, consent_marketing: true }).success,
    ).toBe(false);
  });

  it("마케팅 미동의 거부 (정통법)", () => {
    expect(
      NewsletterSubscribeRequestSchema.safeParse({ email: "a@b.com", consent_terms: true, consent_marketing: false }).success,
    ).toBe(false);
  });
});

describe("NewsletterConfirmQuerySchema", () => {
  it("token UUID 강제", () => {
    expect(NewsletterConfirmQuerySchema.safeParse({ token: "not-uuid" }).success).toBe(false);
    expect(NewsletterConfirmQuerySchema.safeParse({ token: "11111111-1111-4111-8111-111111111111" }).success).toBe(true);
  });
});
