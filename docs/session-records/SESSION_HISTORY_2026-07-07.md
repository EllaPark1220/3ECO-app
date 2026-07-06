# 세션 기록 — 2026-07-07 (인증 백엔드 뼈대 완성)

> 브랜치들: `migrate/playboard-from-prototype` → 이후 기능별 브랜치 다수 · 작성: Ella + Claude
> 시작 상태: main 에 프로토타입 UI + CT-DB-001(Prisma init)만 있고 DB 모델·인증 백엔드 없음, 테스트 86.
> 종료 상태: **인증 백엔드 뼈대 완성**(가입·확인·로그인/아웃·세션조회·RBAC 가드), User 모델 마이그레이션 적용, **테스트 162 green**, main=`7155bf4`.

이 세션은 "실제로 도는 인증 뼈대"를 목표로, DB 연결 확립부터 RBAC 가드까지 한 줄로 이었다. 작업 타입별로 정리한다.

---

## A. DB 연결 확립 (staging Supabase) — 다단계 디버깅

`/api/health/db` 초록불(`{ok:true}`)을 착수 게이트로 삼고 4단계로 풀었다.

1. **프로젝트 일시정지** — Supabase Free 가 비활성으로 pause → Resume (그 자체론 에러 안 바뀜, 원인 아님).
2. **풀러 클러스터 불일치** (`tenant/user ... not found`) — `DATABASE_URL`=Transaction pooler(6543), `DIRECT_URL`=Session pooler(5432)로 재복사. ap-northeast-2 의 `aws-0`/`aws-1` 클러스터 구분이 핵심.
3. **비밀번호 인증 실패** — 비밀번호의 특수문자 **percent-encoding** 필요.
4. **부수 발견** — `DIRECT_URL` 직접호스트(`db.<ref>.supabase.co`)가 **IPv6 전용**이라 이 Windows 에서 실패 → Session pooler 로 회피.

→ 게이트 통과: `{ok:true, provider:"postgresql"}`.

### 🐛 pgbouncer 잠복 버그 (뼈대 검증 중 발견 → **PR #224**)
- `prisma.user.create`(= FW-AUTH-004 콜백의 `syncConfirmedUser`)가 `prepared statement "s0" already exists`(Postgres **42P05**)로 실패.
- 원인: `DATABASE_URL`(트랜잭션 풀러 6543)에 **`?pgbouncer=true`** 가 없어 Prisma named prepared statement 가 풀러에서 충돌. `SELECT 1` 헬스체크는 raw 라 통과해 놓치기 쉬웠음.
- 조치: `.env.local` 의 `DATABASE_URL` 에 `?pgbouncer=true` 추가(사용자) + `.env.example` 문서화 + Vercel 배포 env 동일 적용 명시(**#224**). 재검증 결과 42P05 사라지고 멱등 create·로그인·세션까지 전부 통과.

---

## B. 데이터 모델 — CT-DB-002 (User)

- **PR #218** — `User` 모델 + `Role`(LEARNER/TEACHER/ADMIN) · `MediaPreference`(VIDEO/TEXT/MIXED) · `FontSize`(XS/S/L/XL, default S) enum. email UNIQUE + role·createdAt 인덱스. 마이그레이션 `20260706113416_add_user_model` staging 적용.
- **핵심 결정 — `colorMode` 제외**: 명세(CT-DB-002 task)엔 `ColorMode` enum·컬럼이 있으나 **SRS §6.2.2 USER 엔터티·클래스 다이어그램에 근거 부재** + 다크 모드가 `PROJECT_DECISIONS §4.4`에서 "낮은 우선순위·launch 시점 결정"으로 명시 연기 → 제외. 다크모드 확정 시 **FR-AUTH-003** 에서 별도 마이그레이션으로 추가.
- **PR #219** — 위 편차를 태스크 파일·이슈 #13 에 반영(SoT 정합). 흔적 삭제가 아니라 "제외+이관" 기록으로 추적성 유지.

---

## C. 인증 백엔드 (FW-AUTH-001~004 진행분)

### FW-AUTH-001 — Supabase SSR 인프라 (**PR #220**)
- `lib/supabase/{client,server,admin}.ts` 3종 분리(`server-only` 격리, SERVICE_ROLE_KEY 클라 번들 미포함) + `lib/env.ts`(zod fail-fast) + `middleware.ts` 세션 자동 갱신을 CT-API-001 request_id 로직과 **병합** + `/api/health/auth`.
- SoT 정합: 명세의 "외부 OAuth 전면 비활성"을 **Kakao 예외(T3 CORE)** 로 갱신(이슈 #54).

### FW-AUTH-002 — 회원가입 Server Action (**PR #221**)
- `SignUpRequestSchema`(Zod **strict**, email·nickname·password 3필드만) → 추가 필드(card_number 등) 구조적 거부(PII 최소).
- **핵심 결정 — 이메일 열거 방지**: 신규/기존 이메일 **균일 응답** `{ok:true, requires_email_confirmation:true}`. `EMAIL_ALREADY_EXISTS` 가입 경로 미사용(Supabase 가 기존 이메일에 obfuscated user 반환). 진짜 인프라 오류만 `INTERNAL_ERROR`. → 명세 Scenario 3 개정.
- **핵심 결정 — 동기화 경계**: 본 액션은 `auth.users` 생성 + nickname 을 `user_metadata` 에 보관까지. `public.User` INSERT 는 **FW-AUTH-004 콜백**(확인된 계정만) 담당.

### FW-AUTH-004 슬라이스 A — 이메일 확인 콜백 (**PR #222**)
- `app/auth/callback/route.ts` — 코드→세션 교환 후 확인된 계정만 `public.User` 등록.
- `lib/auth/sync-user.ts` — **P2002 멱등**(이미 있으면 스킵, 쓰기 0, 경쟁 안전; 명세의 upsert 대신). role=LEARNER, 나머지 CT-DB-002 기본값, nickname 폴백(40자 절단).
- `lib/auth/redirect.ts` — `safeInternalPath()` **오픈 리다이렉트 가드**(내부 경로만 허용, `//`·`/\`·절대URL·제어문자 거부).
- 인프라: vitest 에 `server-only` 빈 스텁 alias 추가(서버 모듈 단위 테스트용).
- 후속(슬라이스 B): 비번 재설정·이메일 한국어 템플릿·EventLog(CT-DB-009)·rate limit(IF-KV-001)·Sentry(NF-OBS-001).

### FW-AUTH-003 — 로그인/로그아웃 Server Action (**PR #223**)
- `signIn()` + `signOut()`. 성공 시 Supabase SSR 이 세션 쿠키(HttpOnly·Secure·SameSite=Lax·Path=/) 자동 설정.
- **핵심 결정 — 열거 방지 일관**: 틀린 비번·미가입·검증 실패 → **모두 `INVALID_CREDENTIALS`(코드·메시지 동일)**. `to` 는 `safeInternalPath` 재사용.
- **예외 — `EMAIL_NOT_CONFIRMED` 유지**: Supabase 는 **비밀번호가 맞을 때만** 이 코드를 반환 → 비번을 이미 아는 경우에만 노출 = 열거 위험 없음 + 미확인 사용자 안내. `getUser` 검증 기반, DB 존재 조회 없음.

---

## D. 인증 read 레이어 (FR-AUTH-001/002)

### FR-AUTH-001 — getCurrentUser() 세션 헬퍼 (**PR #225**)
- `lib/auth/session.ts` — `getCurrentUser`(React.cache, 요청당 DB 1회) + `getCurrentUserOrThrow` + `AuthError`.
- **핵심 결정 — `getUser()` 사용**(명세 예시의 `getSession()` 대신): 서버에서 쿠키를 무검증 신뢰 금지, JWT 를 Auth 서버로 재검증(보안). 관문 헬퍼라 필수.
- 계약: 미인증 → `null`, **세션 있는데 public.User 없음(sync 깨짐) → `AuthError('INTERNAL_ERROR')` throw + 로그**(null 로 삼키지 않음).
- `/api/auth/me` — 본인 정보 선별 반환(colorMode 제외 일관). 인프라: vitest.setup 에 더미 Supabase env 주입(서버 모듈 로드용).

### FR-AUTH-002 — RBAC 가드 (**PR #226**)
- `lib/auth/guards.ts` — `requireUser`·`requireRole`·`requireRoleAny`·`requireSelfOrAdmin` + `withRoleGuard`(Route Handler 래퍼). 401(UNAUTHORIZED) vs 403(FORBIDDEN) 분리.
- **핵심 결정 — 애플리케이션 레이어 가드**: 입구에서 추측성으로 거르는 대신 각 기능 실행 지점에서 `getCurrentUser()`로 실제 role 재검증(서버 작업 재검증 원칙). `getCurrentUser`(React.cache)라 요청당 1회.
- **미들웨어 정적 role 매칭 보류**: role 이 JWT 가 아닌 `public.User` 에 있어 Edge 미들웨어에서 DB 없이 못 함 → **JWT role 클레임 도입 시 보조로**. INV-07(LEARNER→TeacherFeedback 차단) = `requireRole('TEACHER')`. Scenario 4 옵션 A(TEACHER 도 학습 가능).

---

## E. 뼈대 실검증 (실 staging Supabase 대상)

Server Action 은 Next 컨텍스트가 필요해 직접 호출 대신 동일 Supabase/Prisma 경로를 스크립트로 재현:
- 가입 ✅ · 이메일 확인(로컬: **admin API `email_confirm`** 또는 대시보드 Confirm) ✅ · public.User sync+멱등(P2002) ✅ · 로그인 세션 ✅ · **세션 지속**(저장 토큰으로 동일 사용자 식별 + refresh_token 재발급) ✅.
- 검증 중 pgbouncer 버그(위 A) 발견·해소. 실메일 배송은 custom SMTP(IF-RES-001) 필요 확인(기본 SMTP 시간당 한도).

---

## F. 인프라·SoT 잡일

- **Prisma CLI 는 `.env.local` 미로드**(`.env` 만) → `dotenvx run -f .env.local -- prisma ...` 로 우회. (후속: `db:*` 스크립트에 로더 내장 제안)
- vitest 인프라: `server-only` → 빈 스텁 alias + 더미 Supabase/DATABASE env(setup) — 서버 모듈 단위 테스트 로드용.
- 세션 시작 시 처리한 것: README·LICENSE 를 main 으로(**PR #217**), 로컬 main ↔ origin/main 동기화.

---

## 오늘의 PR 요약

| PR | 내용 | 유형 |
|----|------|------|
| #217 | README·LICENSE + 세션기록 → main | docs |
| #218 | CT-DB-002 User 모델 + 3 enum + 마이그레이션 | feat(db) |
| #219 | CT-DB-002 colorMode 제외 SoT 정합 | docs |
| #220 | FW-AUTH-001 Supabase SSR + 미들웨어 + /health/auth | feat(auth) |
| #221 | FW-AUTH-002 회원가입(PII 최소 + 열거 방지) | feat(auth) |
| #222 | FW-AUTH-004(A) 콜백 + public.User 멱등 sync + 리다이렉트 가드 | feat(auth) |
| #223 | FW-AUTH-003 로그인/아웃 + 세션 쿠키 + 열거 방지 | feat(auth) |
| #224 | DATABASE_URL pgbouncer=true 문서(.env.example) | docs(env) |
| #225 | FR-AUTH-001 getCurrentUser + /api/auth/me | feat(auth) |
| #226 | FR-AUTH-002 RBAC 가드 4종 + withRoleGuard | feat(auth) |

전부 머지됨. main=`7155bf4`, 테스트 **162 green**.

---

## 후속·미해결 (선행 블록별)

- **IF-KV-001**(Upstash) — rate limit 실동작(가입·로그인·비번재설정), 계정 잠금(ACCOUNT_LOCKED).
- **CT-DB-009**(EventLog) — `auth.signin_attempt`·`auth.access_denied` 등 감사 로그.
- **NF-OBS-001**(Sentry) — sync 깨짐·에러 알림.
- **CT-DB-011**(RLS) — 데이터 레이어 방어선(가드는 앞단 defense-in-depth).
- **FW-AUTH-004 슬라이스 B** — 비밀번호 재설정 흐름, 이메일 한국어 템플릿, 실메일 SMTP(IF-RES-001).
- **미들웨어 role 매칭** — JWT role 클레임 도입 시.
- **UI 배선** — 프로토타입 `/login` 페이지를 실제 `signIn`/`signUp` Server Action 에 연결(미착수).
