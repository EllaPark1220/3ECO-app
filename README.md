# 고요의 경제나루

> 경제 판단력 교과서 — 일상 경제 판단력을 갖춘 자립인을 위한 무료 학습 웹앱.
> "차근차근 함께, 스스로 결정하는 곳에 도착하는 것"을 목표로 합니다.

![License](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-blue)
![무광고·무결제](https://img.shields.io/badge/ads%20%26%20payment-none-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16-black)

**둘러보기(UI 데모):** https://goyo-economy.vercel.app · **코드:** [github.com/EllaPark1220/3ECO-app](https://github.com/EllaPark1220/3ECO-app)

> 데모는 프론트엔드(UI) 중심입니다. 백엔드·데이터 영속화는 진행 중이며 상세는 [현재 한계와 로드맵](#현재-한계와-로드맵)을 참고하세요.

폭죽도, 등수도, 결제창도 없습니다. 강의를 하나 마칠 때마다 심해 지도에 진주 하나가 조용히 켜지는 잔잔한 학습 경험을 지향합니다. 총 133편(L001~L133)의 강의를 5권(27·25·25·31·25편)으로 나누어 담습니다.

---

## 철학 — 우리가 하지 않는 것

이 프로젝트의 정체성은 기능 목록이 아니라 **하지 않기로 한 것**의 목록으로 더 잘 드러납니다. 아래는 편의를 위한 기본값이 아니라 되돌리지 않는 결정입니다.

- **과금·구독·페이월·광고·PPL·데이터 판매 영구 배제.** 결제/과금 필드가 스키마에 존재하지 않습니다.
- **최소 수집.** 수집하는 개인정보는 **이메일·닉네임뿐**입니다. 성명·연락처·소득은 받지 않습니다.
- **추적하지 않는 계측.** 웹 분석은 Vercel Analytics + Plausible만 사용하며, GA4 및 추적기성 외부 스크립트를 금지합니다. 제품 지표(KPI)는 외부 분석 도구가 아니라 내부 `event_log`(SQL)에서 산출합니다.
- **게임화 없음.** 배지·랭킹·레벨업·획득 연출이 없습니다. 스탬프 맵은 보상 장치가 아니라 "여기까지 왔다"를 비추는 인지 장치입니다.
- **영상은 유튜브 임베드 단독.** 자체 CDN·이중화를 두지 않습니다.
- **접근성 우선.** 글자 크기 14 / 18 / 22 / 28px 4단계, WCAG AA. 28px + 브라우저 200% 확대에서 가로 스크롤이 0이 되도록 합니다.

라이선스는 **CC BY-NC-SA 4.0**입니다(전문은 루트의 [`LICENSE`](./LICENSE) 참고).

---

## 주요 기능

현재 저장소에 **화면(UI)이 구현되어 있는** 라우트만 적었습니다. 백엔드 영속화 상태는 [현재 한계와 로드맵](#현재-한계와-로드맵)을 참고하세요.

| 화면 | 경로 | 설명 |
|------|------|------|
| 랜딩 | `/` (`app/page.tsx`) | 프로젝트 소개·철학·뉴스레터 구독 |
| 강의 시청 | `/lesson/[id]` | 유튜브 임베드 + 텍스트 모드 토글, OX 퀴즈(5문항), 학습 흔적 모달 |
| 진주 스탬프 맵 | `/stamp-map` | 완주 강의를 심해 지도에 진주로 표시 |
| 용어 사전 | `/dictionary` | 경제 용어 사전 |
| 로그인·회원가입 | `/login` | 이메일/비밀번호 + 카카오 OAuth 진입 |
| 교사 키트 | `/teacher-kit` | 교안 PDF 다운로드 + 경량 재사용 토글(`will_reuse`) |
| 관리자 대시보드 | `/admin/dashboard` | KPI 요약 화면 |
| PlayBoard | `/playboard/*` | 기획·구현 상황판(내부 전용, 아래 참고) |

인증은 이메일/비밀번호와 **카카오 OAuth**(Supabase Kakao provider)를 병행합니다. 교사 모드의 범위는 교안 PDF 다운로드와 경량 `will_reuse` 토글(+comment)까지로 한정하며, 무거운 피드백 페이지나 사전/사후 설문은 두지 않습니다.

---

## 기술 스택

| 영역 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 16 (App Router) · React 19 | <!-- 확인 필요: App Router 채택 사유가 코드/docs에 명시되어 있지 않음 --> |
| 언어 | TypeScript 5 | 타입으로 레지스트리 파생(SoT) 무결성을 컴파일 타임에 강제 |
| 스타일 | Tailwind CSS 4 | 디자인 토큰(VDS) 런타임 SoT는 `app/globals.css` |
| DB/ORM | Prisma 6 (PostgreSQL) | Prisma는 provider를 정적 리터럴로만 허용(env 불가)하여, 로컬·배포 모두 PostgreSQL 단일 provider로 확정(로컬은 Supabase local) |
| 인증·백엔드 | Supabase (Auth · RLS) | 카카오 OAuth provider 및 Row Level Security 활용 |
| 레이트리밋 | Upstash Redis / Ratelimit | 서버리스 친화 KV 기반 요청 제한 |
| 검증 | Zod 4 | API DTO·입력 스키마 검증 |
| UI | @base-ui/react · shadcn · lucide-react · class-variance-authority | 접근성 확보된 헤드리스 컴포넌트 기반 |
| 테스트 | Vitest + Testing Library | 무결성 불변식·단위/통합 테스트 |
| 배포 | Vercel | 분석은 Vercel Analytics + Plausible로 한정 |

분석에 Plausible을 택한 이유는 성능이 아니라 원칙입니다 — 쿠키·개인 식별 추적 없이 개인정보를 최소로 수집한다는 결정(GA4·추적 스크립트 금지)에서 따라 나온 선택입니다.

---

## 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env        # 아래 키를 실제 값으로 채웁니다 (값은 커밋 금지)

# 3. DB 준비
npm run db:generate         # Prisma Client 생성
npm run db:migrate          # 로컬 마이그레이션 적용

# 4. 개발 서버
npm run dev                 # http://localhost:3000
```

### 필요한 환경변수

`.env.example`의 키 이름만 커밋되어 있으며, 실제 값은 절대 커밋하지 않습니다. 아래 값은 모두 플레이스홀더입니다.

```env
# DB
DATABASE_PROVIDER=postgresql
DATABASE_URL=              # 예: postgresql://user:pass@host:5432/db
DIRECT_URL=               # 마이그레이션용 직접 연결 (Supabase PgBouncer 우회)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Kakao OAuth
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> PlayBoard(`/playboard`)는 production에서 기본 비공개(404)입니다. 프리뷰 환경에서 열려면 `PROTOTYPE_ENABLED=true`를 설정합니다. (아래 [PlayBoard](#playboard--단일-진실-공급원sot) 참고)

---

## 스크립트

| 명령 | 동작 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` 타입 검사 |
| `npm run test` | Vitest 실행 (무결성 불변식 포함) |
| `npm run test:watch` | Vitest 워치 모드 |
| `npm run capture` | 화면 캡처 파이프라인 (`scripts/capture.ts`) |
| `npm run db:generate` | Prisma Client 생성 |
| `npm run db:migrate` | 로컬 마이그레이션 (`prisma migrate dev`) |
| `npm run db:deploy` | 배포 마이그레이션 (`prisma migrate deploy`) |
| `npm run db:studio` | Prisma Studio |

---

## 프로젝트 구조

```
app/            Next.js App Router 라우트
  page.tsx        랜딩
  lesson/[id]/    강의 시청
  stamp-map/      진주 스탬프 맵
  dictionary/     용어 사전
  login/          로그인·회원가입
  teacher-kit/    교사 키트
  admin/          관리자 대시보드
  playboard/      기획·구현 상황판(내부 전용)
playboard/      PlayBoard SoT
  registry/       사실의 단일 출처(6개 레지스트리)
  derive/         레지스트리에서 파생되는 뷰·게이트
prisma/         schema.prisma (DB 스키마)
tasks/          세부 작업 명세 (GitHub 이슈와 1:1 동기화)
docs/           PRD·의사결정·설계 동결 문서
scripts/        capture.ts 등 운영 스크립트
```

### PlayBoard — 단일 진실 공급원(SoT)

이 저장소는 `/playboard` 아래에 **레지스트리 파생 단일 진실 공급원(PlayBoard)** 을 운영합니다. 기획·구현 상태·일정·기술 정책·디자인 현실이 한 화면으로 수렴합니다.

- **사실은 `playboard/registry/*.ts` 한 곳에만** 둡니다. 표면(화면·통계·일정 뷰)은 전부 파생이며 하드코딩 목록을 두지 않습니다.
  *왜:* 기획 문서와 코드가 서로 다른 사실을 말하는 표류(drift)를 구조적으로 막기 위해서입니다. 사실이 한 곳뿐이면 파생물은 자동으로 일치합니다.
- **SoT 이중화 금지.** 세부 작업의 단일 출처는 `tasks/*.md` ↔ GitHub 이슈이고, PlayBoard의 EPIC(`work-items.ts`)은 그 위 마일스톤 레이어로서 `externalRefs`로 **교차참조만** 합니다(복제 아님). "모든 `tasks/*.md`가 정확히 1개 EPIC에 매핑"은 무결성 테스트로 강제합니다.

**두 개의 게이트**로 SoT를 지킵니다.

1. **노출 게이트** — PlayBoard는 production에서 기본 비공개(404)입니다(`isEnabled()` = production이 아니거나 `PROTOTYPE_ENABLED=true`). 공유는 프리뷰 URL로만 합니다.
   *왜:* 내부 운영 보드를 외부에 노출하지 않으면서, 프리뷰에서는 팀이 자유롭게 열람하도록 하기 위해서입니다.
2. **머지 게이트** — 머지 전 `npm test`(무결성 불변식)가 green이어야 하고 `playboard-integrity` 감사가 GO여야 합니다.
   *왜:* 요구사항·상태·정책·디자인 변경을 반드시 같은 PR에서 레지스트리와 함께 갱신하도록 강제해, 보드가 항상 살아 있는 현실을 반영하게 하기 위해서입니다.

---

## 기여 규칙

- `main` 직접 push 금지(브랜치 보호). 반드시 **브랜치 + PR**로 작업합니다.
- 요구사항·상태·정책·디자인을 바꾸면 **같은 PR에서 PlayBoard 레지스트리를 함께** 갱신합니다.
- `tasks/*.md`는 GitHub 이슈와 1:1로 동기화합니다(라벨 `Issue Automation`, 발행/갱신은 `gh` CLI).
- 머지 전 `npm test`가 green이어야 합니다(PlayBoard 무결성 불변식 포함).
- 결정을 바꿀 때는 `docs/grill/GRILL_LEDGER.md`와 `CLAUDE.md`를 함께 갱신합니다.

---

## 현재 한계와 로드맵

이 저장소는 **P0(디자인·프로토타입) 단계가 완료**되었고, **P1(백엔드·영속화)에 착수해 인증 백엔드 뼈대가 완성**된 상태입니다. 모든 학습자·운영자 화면(랜딩·강의·스탬프 맵·사전·로그인·교사 키트·관리자 대시보드)이 UI로 구현되어 있습니다.

**구현 완료 — 인증 백엔드(P1·W10 진행분).** `prisma/schema.prisma`에 `User` 모델(+`Role`/`MediaPreference`/`FontSize` enum)이 정의되어 마이그레이션이 적용되었고, 다음이 서버 로직·테스트와 함께 동작합니다.

- **회원가입**(이메일·닉네임만, PII 최소·결제 필드 구조적 거부, 이메일 열거 방지) → **이메일 확인 콜백**(확인된 계정만 `public.User` 멱등 등록, 오픈 리다이렉트 차단) → **로그인/로그아웃**(Supabase 세션 쿠키, 열거 방지 균일 응답).
- **세션 조회**(`getCurrentUser`, 서버에서 JWT 재검증·요청당 1회) + **RBAC 가드**(learner/teacher/admin, 401/403 분리)로 인증·권한 레이어를 갖췄습니다.

아직 **UI 배선(프로토타입 로그인 화면 ↔ 실제 Server Action)** 과 **나머지 영속화(학습 진척·OX 채점·스탬프 적립·교안 PDF·콘텐츠)** 는 진행 예정입니다. 즉 강의 시청·OX·스탬프 화면은 현재까진 클라이언트 프로토타입 수준이며 DB에 영속되지 않습니다.

> 이 README는 현재 초안 수준으로, 구현 진척에 맞춰 계속 갱신됩니다.

앞으로의 작업은 PlayBoard EPIC(`playboard/registry/work-items.ts`)에 대응하며, GitHub에서는 **Phase 단위 마일스톤**으로 추적합니다. 세부 명세는 `tasks/*.md`에, 진행은 각 마일스톤의 이슈에 있습니다.

**[P1 · 백엔드·영속화](https://github.com/EllaPark1220/3ECO-app/milestone/1)** (다음 단계 · 이슈 58건)
- **인증 백엔드 (W10)** — Supabase SSR + 최소 PII 회원가입·확인·로그인·세션·RBAC 가드 **구현 완료**. 남은 것: 카카오 OAuth([#191 FW-AUTH-006](https://github.com/EllaPark1220/3ECO-app/issues/191)), 환경설정 PATCH/GET(FW/FR-AUTH-005), rate limit·감사 로그·RLS(각 IF-KV-001/CT-DB-009/CT-DB-011 선행).
- **학습 진척 영속화 (W11)** — 진척 저장(throttle·upsert), OX 멱등 채점, 스탬프 유니크 제약. → [#71 FW-PROG-001](https://github.com/EllaPark1220/3ECO-app/issues/71), [#15 CT-DB-004](https://github.com/EllaPark1220/3ECO-app/issues/15)
- **관리자 인증·역할 게이트 (W12)** — 3역할 RBAC, learner 403 가드. → [#165 TS-UT-013](https://github.com/EllaPark1220/3ECO-app/issues/165)
- **PDF 다운로드 백엔드 (W13)** — 한글 폰트 렌더러, 2단 캐시, 교사 피드백 저장. → [#69 FW-PDF-001](https://github.com/EllaPark1220/3ECO-app/issues/69), [#80 IF-CACHE-001](https://github.com/EllaPark1220/3ECO-app/issues/80)
- **콘텐츠 CMS 연동 (W14)** — 강의 3-미디어 스키마, 시드·마이그레이션. → [#14 CT-DB-003](https://github.com/EllaPark1220/3ECO-app/issues/14), [#21 CT-DB-010](https://github.com/EllaPark1220/3ECO-app/issues/21)

**[P2 · 품질·운영](https://github.com/EllaPark1220/3ECO-app/milestone/2)** (이슈 84건)
- **접근성 감사·보강 (W15)** — Axe·Lighthouse CI 게이트, E2E 접근성 검증. → [#83 IF-CI-002](https://github.com/EllaPark1220/3ECO-app/issues/83)
- **관측성·계측 도입 (W16)** — `event_log` append-only, 내부 KPI 산출, 개인정보 보호 분석. → [#79 IF-AN-001](https://github.com/EllaPark1220/3ECO-app/issues/79)

---

## 라이선스

콘텐츠 및 코드는 **CC BY-NC-SA 4.0**(저작자표시-비영리-동일조건변경허락)으로 제공됩니다. 결제 정보를 받지 않으며 광고가 없습니다.

제작 ELLA PARK · © 2026 고요의 경제나루
