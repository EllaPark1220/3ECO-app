import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  verifyCronAuth,
  WarmupResponseSchema,
  SupabasePingResponseSchema,
  PgDumpResponseSchema,
} from "./cron";

describe("verifyCronAuth", () => {
  const prev = process.env.CRON_SECRET;
  beforeEach(() => {
    process.env.CRON_SECRET = "s3cr3t";
  });
  afterEach(() => {
    if (prev === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = prev;
  });

  it("일치 Bearer → true", () => {
    const req = new Request("https://x/api/cron/warmup", {
      headers: { Authorization: "Bearer s3cr3t" },
    });
    expect(verifyCronAuth(req)).toBe(true);
  });

  it("불일치/누락 → false", () => {
    expect(verifyCronAuth(new Request("https://x", { headers: { Authorization: "Bearer wrong" } }))).toBe(false);
    expect(verifyCronAuth(new Request("https://x"))).toBe(false);
  });

  it("CRON_SECRET 미설정 → false", () => {
    delete process.env.CRON_SECRET;
    expect(verifyCronAuth(new Request("https://x", { headers: { Authorization: "Bearer s3cr3t" } }))).toBe(false);
  });
});

describe("Cron 응답 스키마", () => {
  it("warmup", () => {
    expect(
      WarmupResponseSchema.parse({
        ok: true,
        success_count: 2,
        total: 3,
        duration_ms: 120,
        targets: [{ name: "supabase_db", success: true, duration_ms: 40 }],
      }).total,
    ).toBe(3);
  });
  it("supabase-ping", () => {
    expect(
      SupabasePingResponseSchema.parse({ ok: true, db_alive: true, last_query_at: "2026-06-27T00:00:00Z", response_time_ms: 12 }).db_alive,
    ).toBe(true);
  });
  it("pg-dump (backup_id uuid)", () => {
    expect(
      PgDumpResponseSchema.safeParse({
        ok: true,
        backup_id: "not-uuid",
        storage_url: "backups/x.sql.gz",
        backup_size_bytes: 1,
        backup_created_at: "2026-06-27",
        duration_ms: 1,
        table_count: 9,
      }).success,
    ).toBe(false);
  });
});
