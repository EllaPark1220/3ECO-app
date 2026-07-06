# [Feature] FW-AUTH-002: 회원가입 Server Action — 이메일·닉네임만, 결제 필드 영구 거부 (PII 최소)

```yaml
---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] FW-AUTH-002: 회원가입 Server Action — 이메일·닉네임만, 결제 필드 영구 거부 (PII 최소)"
labels: 'feature, backend, auth, security, privacy, priority:critical, mvp-in, alpha'
assignees: ''
---
```

## :dart: Summary
- **기능명**: [FW-AUTH-002] `signUp()` Server Action 구현 — 이메일 + 닉네임만 수집, accessibility_mode 기본 false 로 User 레코드 생성
- **목적**: PRD 원칙 2 (무료 영구 배제) · 원칙 3 (윤리 영구 배제) 와 CON-01 (개인정보) · CON-02 (결제) 를 가입 단계에서 데이터 레이어 이전 차단한다. 본 Server Action 은 결제 필드·성명·연락처·소득·주민번호 등의 입력을 구조적으로 거부하여 REQ-NF-014 · REQ-NF-015 를 영구 만족시킨다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서:
  - `/docs/SRS_V0_9.md#4.2.3` — REQ-NF-014 (PII 최소), REQ-NF-015 (결제 금지), REQ-NF-017 (비밀번호 저장)
  - `/docs/SRS_V0_9.md#1.5.2` — CON-01, CON-02
  - `/docs/SRS_V0_9.md#6.2.2` — USER 테이블 정의
  - `/docs/SRS_V0_9.md#6.3.1` — 학습자 신규 가입 시퀀스
  - `/docs/SRS_V0_9.md#6.2.3` — INV-06 (단방향 해시), INV-07 (역할 격리)
- 시퀀스 다이어그램: `/docs/SRS_V0_9.md#6.3.1`
- API 명세: `/docs/SRS_V0_9.md#6.1` (실제 Server Action 시그니처는 `/api/auth/signup` 형태로 노출 안되고 RSC form action 으로 사용)
- 선행 결정: D-AUTH (Supabase Auth)

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `lib/contracts/auth.ts` 에 Zod 스키마 `SignUpRequest` 정의 — `{ email: z.string().email(), nickname: z.string().min(2).max(40), password: z.string().min(8) }`. **다른 필드는 정의 자체를 하지 않음** (구조적 거부)
- [ ] `app/auth/actions.ts` 에 `signUp()` Server Action 구현
- [ ] FormData 입력을 Zod 스키마로 parse — 잘못된 형식이거나 추가 필드는 거부
- [ ] Supabase Auth 의 `auth.signUp({ email, password })` 호출
- [ ] `signUp()` 은 `nickname` 을 `options.data`(user_metadata)에 실어 전달. **`public.User` INSERT(id, email, nickname, role='LEARNER', accessibilityMode=false, mediaPreference='MIXED')는 이메일 확인 콜백(FW-AUTH-004)이 담당** — 확인된 계정만 등록(경계 명시, 판단②)
- [ ] 가입 확인 메일은 Supabase 가 자동 발송 (Auth Settings · FW-AUTH-001 에서 ON 처리)
- [ ] 응답 — `{ ok: true, requires_email_confirmation: true }`. user_id 는 메일 확인 전까지 노출 안함
- [ ] 입력 페이로드 로깅 시 이메일·비밀번호 마스킹 처리 (`a***@e***`)
- [ ] **중복 이메일 처리 — 열거 방지 우선(판단①)**: 존재 여부 비노출. 신규와 동일 응답 반환(위 Scenario 3 개정). `EMAIL_ALREADY_EXISTS` 미사용
- [ ] **Rate Limit — IF-KV-001(Upstash) 선행 필요로 보류(판단③)**: 코드에 `TODO(IF-KV-001)` 경계만 표시. 활성화 시 `auth` 버킷(분당 10) 재사용 또는 signup 전용 5/분 신설 결정

## :test_tube: Acceptance Criteria (BDD/GWT)

### Scenario 1: 정상 회원가입
- **Given**: 유효한 이메일(`alice@example.com`) + 닉네임(`Alice`) + 비밀번호(`secure1234`)
- **When**: `signUp({ email, nickname, password })` Server Action 호출
- **Then**: `auth.users` 에 사용자 생성 + **nickname 을 `user_metadata` 에 보관**. 응답 `{ ok: true, requires_email_confirmation: true }`. 가입 확인 메일이 큐에 등록됨
- **경계(구현 편차)**: `public.User` 레코드 생성(role='LEARNER', accessibilityMode=false)은 **이메일 확인 콜백(FW-AUTH-004)** 이 담당한다 — 확인된 계정만 등록하여 미확인 orphan 행을 방지. accessibilityMode=false 등 기본값 검증은 FW-AUTH-004/TS-UT-001 에서 수행.

### Scenario 2: 결제 필드 입력 시도 — 구조적 거부
- **Given**: 폼에 `card_number: '1234-5678-...'` 또는 `account_number` 등의 추가 필드를 hidden input 으로 삽입한 악의적 요청
- **When**: `signUp()` Server Action 호출
- **Then**: Zod 스키마는 정의된 3필드 외를 무시 (passthrough 가 아닌 strict 모드). 추가 필드는 절대 DB 에 저장되지 않음. `User` 레코드에는 결제 관련 컬럼 자체가 존재하지 않음

### Scenario 3: 중복 이메일 — 열거 공격 방지(균일 응답) *(개정)*
- **Given**: `alice@example.com` 이 이미 가입된 상태
- **When**: 동일 이메일로 가입 재시도
- **Then**: **계정 존재 여부를 응답으로 드러내지 않는다.** 신규 가입과 **동일한** `{ ok: true, requires_email_confirmation: true }` 반환. (Supabase 는 "Confirm email ON" 시 기존 이메일에 obfuscated user(`identities: []`)를 에러 없이 반환하므로 구분 없이 균일 응답.)
- **개정 사유**: 기존 `EMAIL_ALREADY_EXISTS` 반환은 계정 존재를 노출하는 **이메일 열거 취약점** → 폐기. `EMAIL_ALREADY_EXISTS` 코드 자체는 유지하되 **가입 경로에서는 사용하지 않는다**. 진짜 인프라 오류만 일반 `INTERNAL_ERROR` 로(존재 비노출).

### Scenario 4: 잘못된 이메일 형식 — 400 Bad Request
- **Given**: `email: 'not-an-email'`
- **When**: `signUp()` 호출
- **Then**: Zod parse 실패. `{ error_code: 'INVALID_EMAIL', ... }`. DB INSERT 발생 안함

### Scenario 5: 짧은 비밀번호 — 400 Bad Request
- **Given**: `password: '123'` (8자 미만)
- **When**: `signUp()` 호출
- **Then**: Zod parse 실패. `{ error_code: 'PASSWORD_TOO_SHORT', ... }`

### Scenario 6: 가입 후 이메일 미확인 상태 — 로그인 차단
- **Given**: 정상 가입 후 확인 메일을 클릭하지 않은 상태
- **When**: `auth.signInWithPassword()` 시도
- **Then**: Supabase Auth 가 거부. 응답 `{ error_code: 'EMAIL_NOT_CONFIRMED' }`

### Scenario 7: 비밀번호 평문 저장 부재 검증
- **Given**: Scenario 1 직후 상태
- **When**: `auth.users` 테이블 직접 SELECT (관리자 권한)
- **Then**: `encrypted_password` 컬럼은 bcrypt 해시 (`$2a$...` 형태). 평문 일치 0건

### Scenario 8: Rate Limit — 6회 시도 차단
- **Given**: 동일 IP 에서 1분 내 5회 가입 시도 완료
- **When**: 6번째 시도
- **Then**: 응답 `{ error_code: 'RATE_LIMIT_EXCEEDED', ... }`. HTTP 429

## :gear: Technical & Non-Functional Constraints
- **PII 최소 (REQ-NF-014)**: User 테이블 컬럼이 SRS §6.2.2 USER 정의를 초과하지 않음. 신규 PII 컬럼 추가는 PRD v0.6 승격 필수
- **결제 영구 배제 (REQ-NF-015)**: 결제 관련 컬럼·필드·코드 0건. CI 정적 분석으로 `card_number|account_number|payment` 키워드 grep 검출 시 빌드 차단 (TS-STATIC-001 와 정합)
- **비밀번호 저장 (REQ-NF-017, INV-06)**: Supabase Auth 가 bcrypt 단방향 해시 보장. 자체 해시 로직 구현 금지
- **로깅 마스킹**: 가입 폼 페이로드 로깅 시 이메일은 `a***@e***.com`, 비밀번호는 `***` 로 마스킹. 평문 로그 0건
- **세션 미발급**: 가입 즉시 자동 로그인 금지. 이메일 확인 후 별도 로그인 (FW-AUTH-003)
- **Rate Limit**: IP당 5회/분 (가입은 일반 API 보다 엄격)
- **에러 코드 체계**: 가입 경로 사용분 — `INVALID_EMAIL`, `PASSWORD_TOO_SHORT`, `INVALID_INPUT`(닉네임·추가필드, 필드명 비노출), `INTERNAL_ERROR`(인프라 오류). `EMAIL_ALREADY_EXISTS`·`EMAIL_NOT_CONFIRMED`·`RATE_LIMIT_EXCEEDED` 는 각각 열거방지(판단①)·로그인(FW-AUTH-003)·IF-KV-001 로 이관되어 **본 가입 액션에서는 미사용**
- **응답 시간**: p95 ≤ 500ms (Supabase Auth 호출 포함)
- **금지**: 자체 비밀번호 해시 라이브러리(bcrypt-ts 등) 도입 금지. 자체 user 테이블에 password 컬럼 추가 금지

## :checkered_flag: Definition of Done (DoD)
- [ ] 8개 GWT 시나리오 전부 통과 (TS-UT-001 와 정합)
- [ ] `lib/contracts/auth.ts` 의 Zod 스키마가 strict 모드로 작동 (추가 필드 거부)
- [ ] `app/auth/actions.ts` 의 `signUp()` 구현 + RSC form 또는 client form 에서 호출 가능
- [ ] `auth.users` 와 `public.User` 의 1:1 매핑 정상 (webhook 또는 후속 INSERT 검증)
- [ ] CI 정적 분석에서 결제 키워드 검출 0건
- [ ] 로깅에 이메일·비밀번호 평문 노출 0건 (Vercel Logs 샘플 확인)
- [ ] Rate Limit 동작 검증
- [ ] TS-UT-001 (회원가입 GWT 단위 테스트) 통과
- [ ] TS-E2E-010 (결제 폼 필드 부재 시각 회귀) 통과
- [ ] PR 본문에 "본 태스크는 PRD 원칙 2·3 의 영구 배제 데이터 레이어 차단" 명시
- [ ] Linter 경고 0건

## :construction: Dependencies & Blockers
- **Depends on**:
  - FW-AUTH-001 (Supabase Auth 설치 + 환경 변수)
  - CT-DB-002 (User 모델 정의 + Role enum)
  - CT-API-001 (공통 응답·오류 포맷 + Rate Limit 미들웨어)
- **Blocks**:
  - FW-AUTH-003 (로그인 — 가입된 사용자만 로그인 가능)
  - FW-AUTH-004 (가입 확인 메일 — Resend)
  - FW-AUTH-005 (사용자 환경설정 PATCH)
  - FR-AUTH-001 (세션 조회)
  - TS-UT-001 (회원가입 단위 테스트)
  - TS-E2E-010 (결제 필드 부재 E2E)
  - 모든 후속 학습자 시나리오 (Story 1·4·5)
- **Related**:
  - PRD 원칙 2 (무료 영구) · 원칙 3 (윤리 영구) — 본 구현이 코드 레이어 차단
