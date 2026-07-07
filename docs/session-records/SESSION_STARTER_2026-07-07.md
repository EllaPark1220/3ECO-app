# 다음 세션 시작점 — 2026-07-07 종료 기준

> 이 문서 하나만 읽고 바로 이어서 시작할 수 있게 정리. 상세 이력은 [`SESSION_HISTORY_2026-07-07.md`](./SESSION_HISTORY_2026-07-07.md).

## 현재 상태 (한눈에)

- **인증 백엔드 뼈대 완성**: 회원가입 → 이메일 확인 콜백 → 로그인/로그아웃 → 세션 조회 → RBAC 가드까지 서버 로직·테스트 완비.
- **환경설정(FW/FR-AUTH-005)·카카오 OAuth(FW-AUTH-006) 추가 완료**: 환경설정 PATCH/GET(본인만·IDOR 차단, PR #229 머지) + 카카오 로그인(이메일/비번 병행·PII 최소·identity linking, PR #230 머지 대기).
- `User` 모델(+Role/MediaPreference/FontSize enum) staging DB 마이그레이션 적용됨.
- **테스트 185 green** · `npm run typecheck` 통과 · main=최신(오늘 PR #218~229 머지, #230 카카오 머지 대기).
- DB: staging Supabase 연결 정상. `DATABASE_URL` 에 **`pgbouncer=true` 적용됨**(필수 — 없으면 쓰기 42P05). `DIRECT_URL`=Session pooler(5432, pgbouncer 없이).
- 뼈대 실검증 완료(가입·확인·로그인·세션 지속·멱등 sync 모두 실 staging 에서 통과).

## 착수 전 체크 (매번)

1. `git checkout main && git pull` — 최신 반영.
2. dev 서버 재기동해 새 env 물리기: `npm run dev` → `GET /api/health/db` = `{ok:true}` · `GET /api/health/auth` = `{ok:true}`.
3. `npm test` green(185 기준) 확인.
4. 마이그레이션 필요 시: `node_modules/.bin/dotenvx run -f .env.local -- npx prisma migrate dev --name <x>` (Prisma CLI 는 `.env.local` 미로드). dev 서버 켜져 있으면 `prisma generate` 가 DLL 잠금으로 실패 → 서버 먼저 종료.

## 다음 착수점

### 다음: 에이전틱 워크플로우 전환 + 첫 대상 = `/auth/login`→`/login` 표기 통일(B)
- **에이전틱 전환**(사용자 의향)을 다음 단계로. 워크플로우 방향 정리·셋업 필요.
- **첫 실작업 대상**: 로그인 표준 경로 표기 불일치 정리. 결정 = **B(문서를 `/login` 으로 통일)**.
  - 근거: 실제 구현·통과 테스트가 `/login`(= 진실 소스). 멀쩡히 동작하는 라우트를 문서에 맞춰 옮기는 건 불필요한 위험 → **코드/라우트는 그대로**, 문서만 정정.
  - 범위: `/auth/login` 표기가 ~10개 task(TS-E2E-001/002/003/004/007, UI_NF-A11Y-001, UI_TS-A11Y-001, NF-STAGE-001, NF-SEC-005, UI_TS-E2E-009/010 등)에 퍼져 있음 → 전부 `/login` 으로 정정. 목록 산출: `grep -rn "/auth/login" tasks/`.
  - 코드 측은 이미 정합: 콜백은 `/login` 리다이렉트(FW-AUTH-006 에서 정정), 실존 라우트 `app/login/page.tsx`.

### 완료된 직전 작업 (참고)
- **FW-AUTH-005 + FR-AUTH-005** — 환경설정 PATCH/GET(본인만·IDOR 구조 차단, `requireUser`). **PR #229 머지 완료**. `colorMode` 는 계속 모델·응답 제외(다크모드 미확정).
- **FW-AUTH-006** — 카카오 OAuth(이메일/비번 병행·PII 최소·Supabase identity linking·sync 하드닝). **PR #230 머지 대기**.

## 미해결·후속 (선행 블록)

| 후속 | 선행 |
|------|------|
| rate limit 실동작·계정 잠금 | **IF-KV-001**(Upstash) |
| 감사 로그(signin_attempt·access_denied) | **CT-DB-009**(EventLog) |
| 에러·sync깨짐 알림 | **NF-OBS-001**(Sentry) |
| 데이터 레이어 방어선(RLS) | **CT-DB-011** |
| 비번 재설정·이메일 한국어 템플릿·실메일 | **FW-AUTH-004 슬라이스 B** / IF-RES-001 |
| 미들웨어 role 정적 매칭 | JWT role 클레임 도입 |
| 프로토타입 `/login` UI ↔ **이메일/비번** signIn/signUp 배선 (카카오 버튼은 FW-AUTH-006 에서 배선됨) | UI 태스크(미착수) |

## 작업 관행 (고정)

- `main` 직접 push 금지 → 브랜치 + PR, 머지는 사용자가 직접.
- 진행: diff 먼저 설명 → 사용자 확인 → 적용. 명세와 어긋나는 판단 지점은 적용 전에 먼저 보고.
- SoT: 코드와 함께 `tasks/*.md` ↔ GitHub 이슈 동기화(같은 PR/코멘트).
- 머지 전 `npm test` green 필수.
