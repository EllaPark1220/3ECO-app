import "@testing-library/jest-dom/vitest";

// Prisma Client 구성은 DATABASE_URL 을 요구 — 오프라인 단위 테스트용 더미(쿼리 미실행)
process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/test";
process.env.DIRECT_URL ??= process.env.DATABASE_URL;

// lib/env.ts 의 빌드시점 zod 검증(FW-AUTH-001)을 위해 더미 Supabase env 주입
// — 서버 모듈(supabase/server 등)이 단위 테스트에서 로드될 수 있게. 실제 호출은 모킹.
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";
