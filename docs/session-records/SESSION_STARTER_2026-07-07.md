# 다음 세션 시작점 — 2026-07-07 종료 기준

> 이 문서 하나만 읽고 바로 이어서 시작할 수 있게 정리. 상세 이력은 [`SESSION_HISTORY_2026-07-07.md`](./SESSION_HISTORY_2026-07-07.md).

## 현재 상태 (한눈에)

- **인증 백엔드 뼈대 완성**: 회원가입 → 이메일 확인 콜백 → 로그인/로그아웃 → 세션 조회 → RBAC 가드까지 서버 로직·테스트 완비.
- `User` 모델(+Role/MediaPreference/FontSize enum) staging DB 마이그레이션 적용됨.
- **테스트 162 green** · `npm run typecheck` 통과 · **main=`7155bf4`** (오늘 PR #218~226 전부 머지).
- DB: staging Supabase 연결 정상. `DATABASE_URL` 에 **`pgbouncer=true` 적용됨**(필수 — 없으면 쓰기 42P05). `DIRECT_URL`=Session pooler(5432, pgbouncer 없이).
- 뼈대 실검증 완료(가입·확인·로그인·세션 지속·멱등 sync 모두 실 staging 에서 통과).

## 착수 전 체크 (매번)

1. `git checkout main && git pull` — 최신 반영.
2. dev 서버 재기동해 새 env 물리기: `npm run dev` → `GET /api/health/db` = `{ok:true}` · `GET /api/health/auth` = `{ok:true}`.
3. `npm test` green(162 기준) 확인.
4. 마이그레이션 필요 시: `node_modules/.bin/dotenvx run -f .env.local -- npx prisma migrate dev --name <x>` (Prisma CLI 는 `.env.local` 미로드). dev 서버 켜져 있으면 `prisma generate` 가 DLL 잠금으로 실패 → 서버 먼저 종료.

## 다음 착수점 (권장 순서)

### 1) FW-AUTH-005 + FR-AUTH-005 — 사용자 환경설정 (다음 바로 시작)
- **FW-AUTH-005** — 환경설정 PATCH Server Action: `accessibilityMode`·`mediaPreference`·`fontSize` 업데이트. 선행조건 충족됨(본인 인증에 `requireUser`/`getCurrentUserOrThrow` 재사용). Zod 로 입력 검증, 본인만.
- **FR-AUTH-005** — 환경설정 GET(`/api/auth/preferences` 또는 `/api/auth/me` 재사용 검토). 짝으로 함께.
- 재사용 자산: `lib/auth/session.ts`(getCurrentUserOrThrow), `lib/auth/guards.ts`(requireUser), `lib/contracts` 패턴, `makeErrorResponse`.
- 주의: `colorMode` 는 여전히 모델에 없음(다크모드 미확정) — 환경설정에도 넣지 말 것.

### 2) FW-AUTH-006 — Kakao OAuth (T3 CORE)
- 이메일/비번과 **병행**. 외부 등록(Kakao Developers) 사용자 숙제는 `docs/SETUP_IF-SUP-001_Kakao.md` 참고. 코드로는 Supabase Kakao provider + 콜백 라우트(FW-AUTH-004 의 `/auth/callback` 재사용/확장).

### 3) 에이전틱 전환 (사용자 의향)
- 위 인증 마무리 후 논의 예정. 별도 방향 정리 필요.

## 미해결·후속 (선행 블록)

| 후속 | 선행 |
|------|------|
| rate limit 실동작·계정 잠금 | **IF-KV-001**(Upstash) |
| 감사 로그(signin_attempt·access_denied) | **CT-DB-009**(EventLog) |
| 에러·sync깨짐 알림 | **NF-OBS-001**(Sentry) |
| 데이터 레이어 방어선(RLS) | **CT-DB-011** |
| 비번 재설정·이메일 한국어 템플릿·실메일 | **FW-AUTH-004 슬라이스 B** / IF-RES-001 |
| 미들웨어 role 정적 매칭 | JWT role 클레임 도입 |
| 프로토타입 `/login` UI ↔ signIn/signUp 배선 | UI 태스크(미착수) |

## 작업 관행 (고정)

- `main` 직접 push 금지 → 브랜치 + PR, 머지는 사용자가 직접.
- 진행: diff 먼저 설명 → 사용자 확인 → 적용. 명세와 어긋나는 판단 지점은 적용 전에 먼저 보고.
- SoT: 코드와 함께 `tasks/*.md` ↔ GitHub 이슈 동기화(같은 PR/코멘트).
- 머지 전 `npm test` green 필수.
