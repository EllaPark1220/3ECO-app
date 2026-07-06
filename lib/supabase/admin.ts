// FW-AUTH-001 — 관리자 클라이언트(SERVICE_ROLE_KEY). 서버 전용, 클라이언트 import 금지.
import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { clientEnv } from "@/lib/env";

// SERVICE_ROLE_KEY 는 이 서버 전용 모듈에서만 참조 → 클라이언트 번들 미포함(Scenario 3)
const { SUPABASE_SERVICE_ROLE_KEY } = z
  .object({ SUPABASE_SERVICE_ROLE_KEY: z.string().min(1) })
  .parse({ SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY });

export function createAdminClient() {
  return createSupabaseClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
