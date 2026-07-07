# [Feature] FW-AUTH-006: 카카오 OAuth 로그인 (Supabase Kakao provider) — 이메일/비번 병행 + PII 최소

```yaml
---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] FW-AUTH-006: 카카오 OAuth (Supabase Kakao provider) — 이메일·닉네임만 수집 + 기존 이메일/비번과 병행"
labels: 'feature, backend, auth, oauth, priority:high, mvp-in, closed-beta, grill-it'
assignees: ''
---
```

## :dart: Summary
- **기능명**: [FW-AUTH-006] Supabase Auth 의 **Kakao OAuth provider** 활성화 + 카카오 로그인/회원가입 흐름. 기존 이메일/비밀번호(FW-AUTH-002·003)와 **병행** 제공.
- **목적**: 한국 비숙련 페르소나(한정숙·정해민)의 가입 마찰을 낮춘다. grill-it T3 결정 — PRD v1.1 §3 "카카오 OAuth 예고"를 MVP 본문으로 확정.
- **PII 불변 원칙**: 카카오에서 **이메일·닉네임만** 수신. 성명·연락처·생일·성별 등 추가 PII 수집 금지. 결제/과금 필드 영구 금지(PRD 원칙 2 · [[CLAUDE.md]]).

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- PRD: `docs/PRD_v1.1.md` §3(인증 보강 예고) · §5.3(PII 최소)
- 결정: `docs/grill/GRILL_LEDGER.md` T3 · `CLAUDE.md` 규칙 2
- 외부: Supabase Auth — Login with Kakao (https://supabase.com/docs/guides/auth/social-login/auth-kakao)
- 선행: IF-SUP-001(Supabase 프로젝트), FW-AUTH-001(SSR 셋업), FW-AUTH-003(세션 쿠키)

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 카카오 개발자 콘솔 — REST 앱 등록 + Redirect URI(`{SUPABASE_URL}/auth/v1/callback`) 등록 + 동의항목 **이메일·닉네임만** 설정
- [ ] Supabase Dashboard — Auth > Providers > Kakao 활성화 + Client ID/Secret 등록
- [ ] 환경변수 — `KAKAO_CLIENT_ID`/`KAKAO_CLIENT_SECRET` 은 **Supabase Dashboard(Kakao provider)가 단독 보관**. **Next 앱 env·`.env.example` 에 추가하지 않음** — Supabase 가 서버 측에서 OAuth 코드 교환을 수행하므로 앱은 키가 불필요하고, 앱 번들/서버 env 에 Secret 을 두면 "Client Secret 은 서버 환경변수만, 클라 노출 금지" 원칙과 무관하게 노출면만 늘린다(백엔드 전용 = Supabase 경계 내). 앱은 `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`(기존)만 사용.
- [ ] **로그인 버튼** — `supabase.auth.signInWithOAuth({ provider: 'kakao', options: { redirectTo, scopes: 'account_email profile_nickname' } })`
- [ ] **콜백 처리** — FW-AUTH-004 의 `/auth/callback` 라우트에서 카카오 코드 교환 + 세션 쿠키 발급(SSR)
- [ ] **User 매핑** — 최초 카카오 로그인 시 `User` 레코드 생성: `email`(카카오 이메일) + `nickname`(카카오 닉네임)만. 나머지 컬럼은 기본값(role=LEARNER, fontSize=S 등 [[CT-DB-002]])
- [ ] **이메일 충돌 정책** — 동일 이메일이 이미 비번 가입으로 존재 시 정책 결정: 계정 연결(권장) 또는 안내 메시지. MVP는 **Supabase 기본 identity linking** 사용
- [ ] **PII 가드** — 카카오 응답에서 이메일·닉네임 외 필드는 저장하지 않음(매핑 함수에서 명시적 화이트리스트)
- [ ] UI — 로그인/회원가입 화면에 "카카오로 시작하기" 버튼(접근성: 키보드·aria-label) 추가

## :test_tube: Acceptance Criteria (BDD/GWT)

### Scenario 1: 카카오 신규 로그인 → User 생성
- **Given**: 카카오 계정으로 최초 로그인
- **When**: 동의(이메일·닉네임) 후 콜백 완료
- **Then**: `User` 1건 생성(email·nickname만 채워짐, 나머지 기본값). 세션 쿠키(HttpOnly·Secure·SameSite=Lax) 발급

### Scenario 2: PII 최소 — 추가 필드 미저장
- **Given**: 카카오가 생일·성별 등 추가 정보를 반환
- **When**: User 매핑
- **Then**: email·nickname 외 어떤 PII도 DB에 저장 0. 결제 필드 부재

### Scenario 3: 이메일/비번과 병행
- **Given**: 동일 사용자가 이전에 이메일/비번으로 가입
- **When**: 같은 이메일로 카카오 로그인
- **Then**: Supabase identity linking 으로 동일 User 에 연결(중복 계정 0) 또는 명확한 안내

### Scenario 4: 콜백 실패 — 안전 처리
- **Given**: 카카오 인증 거부/취소
- **When**: 콜백
- **Then**: 로그인 페이지로 복귀 + 사용자 친화 에러. 세션 미발급. 서버 에러 로그만

### Scenario 5: 접근성
- **Given**: 키보드 사용자
- **When**: Tab 으로 "카카오로 시작하기" 포커스 + Enter
- **Then**: OAuth 흐름 진입. aria-label "카카오 계정으로 로그인" 노출

## :gear: Technical & Non-Functional Constraints
- **PII 최소(불변)**: 이메일·닉네임만. 동의항목도 2종으로 제한.
- **Secret 보안**: Client Secret 은 서버 환경변수만. 클라이언트 번들 노출 금지.
- **세션 일관성**: 이메일/비번 흐름과 동일한 쿠키 정책(FW-AUTH-003) 재사용.
- **금지**: 추가 PII 수집, 결제/과금 필드, 카카오 메시지 API 등 마케팅 권한 요청.

## :checkered_flag: Definition of Done (DoD)
- [ ] 5개 GWT 시나리오 통과
- [ ] Supabase Kakao provider 활성화 + 환경변수 3환경 등록
- [ ] 카카오 로그인 → User(email·nickname) 생성 + 세션 쿠키
- [ ] PII 화이트리스트 가드(이메일·닉네임 외 저장 0) 단위 테스트
- [ ] 이메일/비번 병행 + identity linking 동작
- [ ] 접근성(키보드·aria) 통과
- [ ] PR 본문에 "grill-it T3 — 카카오 OAuth MVP 확정, PII 최소" 명시

## :construction: Dependencies & Blockers
- **Depends on**: IF-SUP-001, FW-AUTH-001, FW-AUTH-003, FW-AUTH-004(콜백), CT-DB-002(User)
- **Blocks**: 한국 페르소나 가입 전환 KPI(FR-KPI-001)
- **Related**: PRD §3 · grill-it T3 · CLAUDE.md 규칙 2
