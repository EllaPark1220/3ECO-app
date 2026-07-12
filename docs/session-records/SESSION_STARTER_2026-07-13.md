# 다음 세션 시작점 — 2026-07-13 종료 기준

> 이 문서 하나만 읽고 바로 이어서 시작할 수 있게 정리. 상세 이력은 [`SESSION_HISTORY_2026-07-13.md`](./SESSION_HISTORY_2026-07-13.md).
> (이전: [`SESSION_STARTER_2026-07-07.md`](./SESSION_STARTER_2026-07-07.md) — 인증 뼈대 완성 기준. 본 문서가 최신.)

## 현재 상태 (한눈에)

- **인증 전체 완결**: 가입·이메일 확인 콜백(token_hash)·로그인/아웃·세션·RBAC 가드·**카카오 OAuth**·환경설정 PATCH/GET. prod 실계정으로 동작 확인.
- **prod 배포 라이브**: `goyoeco.com`(Vercel `3-eco-app`). **RLS**(CT-DB-011) 적용. `goyo-economy` 중복 repo **연결 해제 완료**.
- **W11 학습 진척 완결**: 재생 위치 10초 저장(`saveProgress`/`/api/progress/sync`) + **이어보기 복원**(RSC `getViewerProgress` 주입 → `seekTo`) 실측 통과. L001 시청 영상 = 실 E001(`oLPoeKtsvXc`).
- 테스트 **225 green** · `npm run typecheck` 통과 · main=`792f719`(오늘 #238~#242 머지).
- DB: prod Supabase(ap-northeast-2 pooler) 정상. `DATABASE_URL` 에 **`pgbouncer=true` 필수**. `DIRECT_URL`=Session pooler(raw 쿼리·스크립트용). auth↔public.User 정합 **3=3**(orphan 백필 완료).

## 착수 전 체크 (매번)

1. `git checkout main && git pull`.
2. dev 서버 재기동: `npm run dev` → `GET /api/health/db` = `{ok:true}`.
3. `npm test` green(225 기준) 확인.
4. 마이그레이션 필요 시: `node_modules/.bin/dotenvx run -f .env.local -- npx prisma migrate dev --name <x>` (Prisma CLI 는 `.env.local` 미로드). dev 서버 켜져 있으면 `prisma generate` 가 DLL 잠금 실패 → 서버 먼저 종료.

## 다음 착수 후보

- **헤더 세션 배선** — nav 의 `<Link href="/login">` 정적 하드코딩. 로그인 후 UI(닉네임/로그아웃) 미구현. 세션 읽어 조건부 렌더(공개 페이지이므로 `getViewerProgress` 류 graceful 패턴 재사용).
- **FR-LES-003 편별 콘텐츠 배선** — 헤더/브레드크럼/본문이 "1권 1편"·mock 고정. `getLesson` seam 을 편별 실데이터로.
- **CT-DB-003 (3매체 컬럼)** — `Lesson.youtubeVideoId`·script·pdf 실컬럼 도입. 현재는 `lib/data/lesson.ts` seam 하드코딩 MOCK + `SMOKE_VIDEO_IDS`(L001 오버라이드). 컬럼 도입 시 seam→Prisma 교체.
- **FW-PROG-003** — IndexedDB 오프라인 큐(401/네트워크 실패 폴백). **FW-PROG-004** 다기기 LWW 배너.
- **카카오 이메일 필수동의** — 비즈앱 검수(이메일 스코프).
- **Preview env 정리** — preview 배포 다수 Error 상태 정리.

## 반복 함정 (고정 — 재발 시 빠른 진단)

- **auth↔public.User orphan → `getCurrentUser` throw**: `public.User` 는 이메일 확인 콜백 `syncConfirmedUser` 만 생성(signUp·트리거 아님). auth 있는데 public.User 없으면 `getCurrentUser` 가 `AuthError` throw → **로그인 계정만 500, 익명 200** 패턴. 공개 표면은 `getCurrentUser` 직접 쓰지 말고 `getViewerProgress`(throw 흡수) 사용. 진단: `/api/health/db` + `.env.production.local` DIRECT_URL 로 `auth.users`(confirmed) vs `public.User` count 대조.
- **`Lesson` 에 videoId 컬럼 없음** — videoId 는 DB 가 아니라 `lib/data/lesson.ts` seam 에서 옴. "시드 videoId" 라는 전제로 DB UPDATE 하려 하지 말 것. 실컬럼은 CT-DB-003.
- **pgbouncer**: `DATABASE_URL` 에 `?pgbouncer=true` 없으면 Prisma named prepared statement 가 42P05. `SELECT 1` 헬스체크는 raw 라 못 잡음.
- **`vercel logs` 스트림 불안정**(ECONNRESET) — 과거 런타임 스택 확보 어려움. 증거 기반 배제(health·직접 DB probe)로 진단.

## 작업 관행 (고정)

- `main` 직접 push 금지 → 브랜치 + PR, 머지는 사용자가 직접.
- 진행: diff 먼저 설명 → 사용자 확인 → 적용. 명세와 어긋나는 판단 지점은 적용 전에 먼저 보고.
- SoT: 코드와 함께 `tasks/*.md` ↔ GitHub 이슈 동기화. 머지 전 `npm test` green 필수 + `playboard-integrity` GO.
