import "@testing-library/jest-dom/vitest";

// Prisma Client 구성은 DATABASE_URL 을 요구 — 오프라인 단위 테스트용 더미(쿼리 미실행)
process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/test";
process.env.DIRECT_URL ??= process.env.DATABASE_URL;
