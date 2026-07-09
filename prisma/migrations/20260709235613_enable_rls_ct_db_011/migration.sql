-- CT-DB-011 · Row Level Security
-- 노출면: PostgREST(anon/authenticated, 공개 anon 키) 경로. Supabase "RLS Disabled" CRITICAL 대응.
-- 우리 서버 경로는 RLS 우회(구조적):
--   - Prisma 접속 role = postgres (테이블 owner + rolbypassrls=true) → RLS 자동 우회
--   - service_role = BYPASSRLS
--   → FORCE ROW LEVEL SECURITY 는 쓰지 않음(그걸 켜면 owner 까지 정책 복종 → Prisma 깨짐).
-- 매핑: public."User".id = auth.users.id (sync-user.ts) → auth.uid() 직접 사용.
-- 캐스트: id/userId 는 Prisma String = text 컬럼, auth.uid() 는 uuid → (select auth.uid())::text 필수.
-- 쓰기 정책 없음(의도): User/LessonProgress 쓰기는 서버(Prisma + requireUser) 전담 → 공개 API 쓰기 문 미개방.

-- Lesson: 공개 읽기(콘텐츠)
ALTER TABLE "Lesson" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_select_public" ON "Lesson"
  FOR SELECT TO anon, authenticated
  USING (true);

-- User: 본인 행만 읽기
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_select_self" ON "User"
  FOR SELECT TO authenticated
  USING ((select auth.uid())::text = id);

-- LessonProgress: 본인 진척만 읽기
ALTER TABLE "LessonProgress" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_select_self" ON "LessonProgress"
  FOR SELECT TO authenticated
  USING ((select auth.uid())::text = "userId");

-- _prisma_migrations: 공개 API 전면 차단(정책 0개 → anon/authenticated deny-all)
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
