# IF-SUP-001 + Kakao OAuth 셋업 체크리스트 (사용자 숙제)

> 목적: W10(인증 백엔드) 착수 전 **외부 사이트에서 직접** 해야 하는 준비물.
> 코드로 못 하는 것만 모았다. 시크릿 실제 값은 본인이 `.env.local`/Vercel 에 직접 입력.
> 관련 task: `IF-SUP-001`, `FW-AUTH-001`, `FW-AUTH-006`, `CT-DB-002`.
> 결정 근거: D7(provider=postgresql 고정, SQLite 폴백 없음) · grill-it T3(Kakao) · CLAUDE.md 규칙 2(PII 최소).

## 환경변수 매핑 한눈에 (이 표가 최종 목표)

| 환경변수 | 출처 STEP | .env.local | Vercel (환경) |
|---|---|---|---|
| `DATABASE_URL` | 5-A (staging Pooled) | ✅ staging 값 | Preview/Dev=staging · Prod=prod |
| `DIRECT_URL` | 5-B (staging Direct) | ✅ staging 값 | Preview/Dev=staging · Prod=prod |
| `NEXT_PUBLIC_SUPABASE_URL` | 5-C | ✅ staging 값 | 3환경 (Prod=prod) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 5-C | ✅ staging 값 | 3환경 (Prod=prod) |
| `SUPABASE_SERVICE_ROLE_KEY` | 5-C | ✅ staging 값 | 3환경 (Prod=prod) |
| `KAKAO_CLIENT_ID` | 8 | ✅ | 3환경 |
| `KAKAO_CLIENT_SECRET` | 8 | ✅ | 3환경 |
| `NEXT_PUBLIC_APP_URL` | (고정) | `http://localhost:3000` | Prod=실도메인 · Preview=`*.vercel.app` |

> 원칙: **로컬·Preview = staging 프로젝트 / Production = prod 프로젝트.** prod 데이터 오염 절대 금지.
> 시크릿은 채팅에 붙여넣지 말 것. `.env.local`(gitignore됨) + Vercel 에만.

---

# PART 1 — Supabase (IF-SUP-001)

## STEP 1. 계정 생성
- 사이트: <https://supabase.com> → **Start your project** → **Sign in with GitHub** (ADR-001 개인사업자 정합)
- 결과: Supabase 대시보드 접근 가능
- [ ] 완료

## STEP 2. 프로젝트 2개 생성
대시보드 → **New project** 를 2번 반복.

| 입력란 | staging 프로젝트 | prod 프로젝트 |
|---|---|---|
| Name | `economy-textbook-staging` | `economy-textbook-prod` |
| Database Password | 강한 비번 생성 → **메모**(STEP 5에서 씀) | 별도 강한 비번 → 메모 |
| Region | **Northeast Asia (Seoul)** | **Northeast Asia (Seoul)** |
| Plan | Free | Free |

- ⏳ 생성에 1~2분. "Setting up project" 끝날 때까지 대기.
- 💡 staging 하나로 Preview+Development 공용. 지금 당장은 **staging 만 있어도 로컬 개발 시작 가능**(prod 는 배포 직전에 채워도 됨).
- [ ] staging 생성  [ ] prod 생성

## STEP 3. Auth 설정 (각 프로젝트마다 동일하게)
프로젝트 선택 → 좌측 **Authentication** 진입.

### 3-A. Sign In / Providers
- **Authentication → Sign In / Providers → Email**: Enable ON
  - **Confirm email**: ON (가입 후 메일 클릭 필수)
  - Minimum password length: `8`
- 외부 OAuth(Google/GitHub 등): **그대로 비활성** (Kakao 는 PART 2 에서 켠다)

### 3-B. 세션/토큰 (Authentication → Sessions / Tokens, 또는 Settings)
- Access token (JWT) expiry: `3600` 초 (1시간) — REQ-NF-019
- Refresh token expiry: `2592000` 초 (30일)

### 3-C. URL 설정 (Authentication → URL Configuration)
| 항목 | staging | prod |
|---|---|---|
| Site URL | `http://localhost:3000` (로컬 개발 기준) | `https://<실도메인 또는 vercel앱>` |
| Redirect URLs (추가) | `http://localhost:3000/auth/callback` 그리고 `https://*.vercel.app/auth/callback` | `https://<실도메인>/auth/callback` |

> ⚠️ `/auth/callback` 경로는 W10 의 FW-AUTH-004 가 만들 라우트다. 지금 등록만 해두면 됨.

### 3-D. 이메일 템플릿 한국어화 (Authentication → Emails / Templates)
- **Confirm signup** 제목: `[경제 판단력 교과서] 이메일 인증을 완료해주세요`
- **Reset password** 제목: `[경제 판단력 교과서] 비밀번호 재설정 안내`
- 본문은 한국어로. `{{ .ConfirmationURL }}` 변수 유지. (Alpha 는 Supabase 기본 SMTP 사용 — FW-AUTH-004)
- [ ] staging Auth 설정  [ ] prod Auth 설정

## STEP 4. Storage 버킷 (선택 — W13 PDF용, W10 만이면 건너뛰기 가능)
- **Storage → New bucket**
  - `teacher-kit` — **Public bucket** ON (CC BY-NC-SA 공개 PDF · L2 캐시)
  - `assets` — Private (빈 버킷만)
- Policies: `teacher-kit` read=anyone/write=service_role, `assets` read=authenticated/write=service_role
- [ ] (선택) 완료 — W13 단계로 미뤄도 무방

## STEP 5. 연결 정보 추출 → .env.local 입력 (★ 핵심)
프로젝트 → 상단 **Connect** 버튼 (또는 Settings → Database / Settings → API).

### 5-A. `DATABASE_URL` (Pooled — 런타임용)
- **Connect → ORMs → Prisma**, 또는 Settings → Database → Connection string → **Transaction** (port **6543**)
- 형태: `postgresql://postgres.<ref>:[YOUR-PASSWORD]@aws-...pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`
- `[YOUR-PASSWORD]` 를 STEP 2 의 DB 비번으로 치환
- → `.env.local` 의 **`DATABASE_URL`** (staging 값)

### 5-B. `DIRECT_URL` (Direct — 마이그레이션용)
- Settings → Database → Connection string → **Session** (port **5432**, pooler 우회)
- 형태: `postgresql://postgres.<ref>:[YOUR-PASSWORD]@aws-...pooler.supabase.com:5432/postgres`
- → `.env.local` 의 **`DIRECT_URL`** (staging 값)

### 5-C. API 키 (Settings → API)
| 대시보드 항목 | → 환경변수 |
|---|---|
| Project URL (`https://<ref>.supabase.co`) | `NEXT_PUBLIC_SUPABASE_URL` |
| Project API keys → **anon / public** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Project API keys → **service_role** (Reveal) | `SUPABASE_SERVICE_ROLE_KEY` (서버 전용·노출 금지) |

- [ ] `.env.local` 5개 값 입력 완료 (staging 기준)

> ✅ 검증(나중에 코드 붙은 뒤): `npm run dev` → `GET http://localhost:3000/api/health/db` → `{ "ok": true }` 면 DB 연결 성공.

## STEP 6. Vercel 환경변수 등록
Vercel CLI(설치됨)로 등록하거나 대시보드(Project → Settings → Environment Variables) 사용.

CLI 예시 (값은 프롬프트에서 직접 입력, 채팅 노출 없음):
```bash
vercel link          # 최초 1회 — 프로젝트 연결
# Preview/Development = staging 값, Production = prod 값
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development
vercel env add DATABASE_URL production
# 위를 DIRECT_URL · NEXT_PUBLIC_SUPABASE_URL · NEXT_PUBLIC_SUPABASE_ANON_KEY
#            · SUPABASE_SERVICE_ROLE_KEY 에 대해 반복
```
- 💡 로컬과 동기화 확인: `vercel env pull .env.vercel.local`
- [ ] 5개 변수 × 3환경 등록 (Kakao 2종은 PART 2 후 추가)

## STEP 7. 운영 메모 (인지만 — 지금 작업 없음)
- **Free pause(R10)**: 7일 무활동 시 자동 pause. → 후속 `IF-CRON-001`(5분 warmup)이 대응.
- **Free 한도**: DB 500MB / Storage 1GB / Auth 50K MAU / Bandwidth 5GB. 주1회 Usage 확인.
- **백업**: Free 자동백업 7일. Alpha/Beta 마일스톤마다 수동 `pg_dump` 권장.

---

# PART 2 — Kakao OAuth (FW-AUTH-006)

> 선행: PART 1 STEP 5-C 의 `NEXT_PUBLIC_SUPABASE_URL` 값이 있어야 Redirect URI 를 만든다.
> PII 불변: 동의항목은 **이메일·닉네임만**. 그 외 금지(CLAUDE.md 규칙 2).

## STEP 8. 카카오 개발자 콘솔 — 앱 등록
- 사이트: <https://developers.kakao.com> → 카카오 계정 로그인
- **내 애플리케이션 → 애플리케이션 추가하기**
  - 앱 이름: `고요의 경제나루` (자유)
  - 사업자명: 본인
- 생성 후 **앱 키** 화면:
  - **REST API 키** → `.env.local` 의 **`KAKAO_CLIENT_ID`**
- **보안** 메뉴 → **Client Secret** 생성/발급 + **사용 ON**
  - → `.env.local` 의 **`KAKAO_CLIENT_SECRET`**
- [ ] REST API 키·Client Secret 확보

## STEP 9. 카카오 — 동의항목 (PII 최소)
- **카카오 로그인 → 활성화 설정**: ON
- **카카오 로그인 → 동의항목**:
  - **닉네임(profile_nickname)**: 필수 동의
  - **카카오계정(이메일)(account_email)**: 필수 동의
  - 그 외(생일/성별/연령대/전화번호 등): **모두 미설정** (PII 최소)
- [ ] 동의항목 2종만 설정

## STEP 10. 카카오 — Redirect URI 등록
- **카카오 로그인 → Redirect URI 등록**:
  - `https://<STEP 5-C 의 ref>.supabase.co/auth/v1/callback`
  - (staging·prod 프로젝트가 다르면 각 Supabase URL 별로 등록)
- **플랫폼 → Web 사이트 도메인**: `http://localhost:3000`, `https://<실도메인/vercel앱>`
- [ ] Redirect URI 등록

## STEP 11. Supabase — Kakao provider 활성화
- staging(및 prod) 프로젝트 → **Authentication → Sign In / Providers → Kakao**: Enable ON
  - **Kakao Client ID** = STEP 8 의 REST API 키
  - **Kakao Client Secret** = STEP 8 의 Client Secret
- 저장
- [ ] staging Kakao ON  [ ] prod Kakao ON

## STEP 12. Vercel 에 Kakao 변수 추가
```bash
vercel env add KAKAO_CLIENT_ID production    # preview/development 도 반복
vercel env add KAKAO_CLIENT_SECRET production # preview/development 도 반복
```
- [ ] `KAKAO_CLIENT_ID`·`KAKAO_CLIENT_SECRET` × 3환경 등록

---

# 완료 게이트 (이게 다 되면 Claude 가 코드 착수)

- [ ] `.env.local` 의 7개 시크릿(+APP_URL) 채워짐 (staging 기준)
- [ ] Supabase staging Auth 설정 완료(Email 확인 ON · 한국어 템플릿 · Redirect URL)
- [ ] (Kakao 쓸 거면) STEP 8~12 완료
- [ ] Vercel 환경변수 등록(배포 시점까지 prod 값 포함)

> 위 중 **staging `.env.local` 5개(DB 2 + Supabase 3)** 만 채워지면 → `CT-DB-002 User 모델`부터 바로 착수 가능.
> Kakao 는 FW-AUTH-006 단계 전까지만 끝내면 되므로 뒤로 미뤄도 무방.

## 다음
준비 끝나면 "Supabase staging 채웠다" 한마디면 Claude 가 CT-DB-002 → FW-AUTH-001 순으로 구현 시작.
