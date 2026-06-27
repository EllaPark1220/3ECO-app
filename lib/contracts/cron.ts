// CT-API-010 — Cron 엔드포인트 3종 계약 + 공통 Bearer 인증.
import { z } from "zod";

/** 공통 인증: Authorization: Bearer <CRON_SECRET> */
export function verifyCronAuth(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("Authorization") === `Bearer ${secret}`;
}

/** Cron 1 — POST /api/cron/warmup (IF-CRON-001) */
export const WarmupResponseSchema = z.object({
  ok: z.literal(true),
  success_count: z.number().int().min(0),
  total: z.number().int().min(0),
  duration_ms: z.number().int(),
  targets: z.array(
    z.object({
      name: z.string(), // 'supabase_db' | 'pdf_route' | 'lesson_route'
      success: z.boolean(),
      duration_ms: z.number().int(),
    }),
  ),
});
export type WarmupResponse = z.infer<typeof WarmupResponseSchema>;

/** Cron 2 — POST /api/cron/supabase-ping (IF-CRON-002, 주 1회 pause 방지) */
export const SupabasePingResponseSchema = z.object({
  ok: z.literal(true),
  db_alive: z.boolean(),
  last_query_at: z.string(),
  response_time_ms: z.number().int(),
});
export type SupabasePingResponse = z.infer<typeof SupabasePingResponseSchema>;

/** Cron 3 — POST /api/cron/pg-dump (IF-CRON-003, 일 1회 RPO 24h) */
export const PgDumpResponseSchema = z.object({
  ok: z.literal(true),
  backup_id: z.string().uuid(),
  storage_url: z.string(),
  backup_size_bytes: z.number().int(),
  backup_created_at: z.string(),
  duration_ms: z.number().int(),
  table_count: z.number().int(),
});
export type PgDumpResponse = z.infer<typeof PgDumpResponseSchema>;
