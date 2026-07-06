// FW-AUTH-001 — 환경 변수 빌드시점 검증(fail-fast). 클라이언트 안전 변수만 여기서 파싱.
import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

// 모듈 로드 시 즉시 검증 — 누락 시 빌드/첫 평가에서 명시적 에러
export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
