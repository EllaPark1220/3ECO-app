# [Feature] FW-TF-004: 교사 will_reuse 경량 수집 — TeacherFeedback(will_reuse+comment) 최소 모델 + Server Action

```yaml
---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] FW-TF-004: submitTeacherFeedback() 경량 — TeacherFeedback {will_reuse, comment} 최소 필드 + 운영자 알림"
labels: 'feature, backend, teacher, kpi, priority:high, mvp-in, private-beta, grill-it'
assignees: ''
---
```

## :dart: Summary
- **기능명**: [FW-TF-004] 교사 모드의 **경량 피드백 수집** — `TeacherFeedback` 최소 모델(`will_reuse` boolean + `comment` text)과 `submitTeacherFeedback()` Server Action. will_reuse=true 시 운영자 알림(Resend).
- **목적**: grill-it T2 결정 — 교사 모드를 **PDF 다운로드 + 경량 will_reuse**로 확정. 무거운 피드백 페이지·사전/사후 설문(#53·#76·#77·#176)은 DEPRECATED 유지하되, **Stage 1 종료 KPI "교사 재사용 의사 ≥10명"(FR-KPI-007 / REQ-NF-046)** 의 데이터 진입점은 살린다.
- **범위 축소**: 기존 DEPRECATED 된 `TeacherFeedback`(CT-DB-007)의 `used_in_class` 등 무거운 필드는 제외. **will_reuse + comment 최소 필드만** 복원.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- PRD: `docs/PRD_v1.1.md` Story 3 · §6.2(TEACHER_FEEDBACK) · §1.3(보조 KPI 교사 재사용 의사)
- 결정: `docs/grill/GRILL_LEDGER.md` T2 · `CLAUDE.md` 규칙 6(교사 모드 경량)
- 선행: CT-DB-001(Prisma), FW-AUTH-003(세션), FR-AUTH-002(RBAC TEACHER), IF-RES-001(Resend)
- 짝/연계: FR-KPI-007(#41 will_reuse 집계), FR-KPI-006(#40 used_in_class — DEFER), TS-E2E-007(#134 E2E)
- 대체: 본 태스크가 DEPRECATED FW-TF-001(#76)을 경량 범위로 대체

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] **Prisma 모델(최소)** — `TeacherFeedback`:
  ```prisma
  model TeacherFeedback {
    id         String   @id @default(uuid())
    teacherId  String
    lessonId   String
    willReuse  Boolean
    comment    String?  @db.Text
    createdAt  DateTime @default(now())
    teacher    User     @relation(fields: [teacherId], references: [id])
    lesson     Lesson   @relation(fields: [lessonId], references: [lessonId])
    @@index([willReuse])
  }
  ```
  (used_in_class 등 무거운 필드 제외 — T2)
- [ ] **마이그레이션** — 경량 모델 추가(기존 DEPRECATED CT-DB-007 스키마 미사용)
- [ ] **`submitTeacherFeedback()` Server Action**:
  - RBAC 가드 — `role === 'TEACHER'` 아니면 403 (FR-AUTH-002)
  - 입력 Zod: `{ lesson_id: string, will_reuse: boolean, comment?: string }`
  - INSERT 후 `{ ok: true, feedback_id }`
  - `will_reuse === true` 시 운영자 알림 메일(Resend) fire-and-forget(silent fail)
- [ ] **재제출 정책** — 동일 교사·레슨 재제출 시 새 row append. 집계는 최신값 기준(FR-KPI-007에서 처리)
- [ ] **UI 폼(경량)** — PDF 다운로드 후 will_reuse 체크 + comment textarea + 제출(별도 무거운 페이지 없음)
- [ ] **PII/원칙 가드** — 후킹 어휘 없는 알림 본문, 결제 필드 없음

## :test_tube: Acceptance Criteria (BDD/GWT)

### Scenario 1: will_reuse=true 제출 → 저장 + 알림
- **Given**: TEACHER 로그인 사용자
- **When**: `submitTeacherFeedback({ lesson_id:'L001', will_reuse:true, comment:'재사용 예정' })`
- **Then**: TeacherFeedback 1건 INSERT(willReuse=true). Resend 운영자 알림 1회(mock). `{ ok:true }`

### Scenario 2: will_reuse=false 제출
- **Given**: TEACHER 로그인
- **When**: will_reuse=false 제출
- **Then**: INSERT 1건(willReuse=false). 운영자 알림 미발송

### Scenario 3: RBAC — LEARNER 차단
- **Given**: LEARNER 사용자
- **When**: 호출
- **Then**: 403. INSERT 0건

### Scenario 4: 경량 범위 — used_in_class 부재
- **Given**: 입력 스키마
- **When**: used_in_class 등 무거운 필드 전달 시도
- **Then**: 스키마에서 무시/거부. 모델에 해당 컬럼 없음

### Scenario 5: 알림 silent fail
- **Given**: Resend 5xx
- **When**: will_reuse=true 제출
- **Then**: INSERT 는 성공 유지. 알림 실패는 Sentry 로그만(본 흐름 영향 0)

## :gear: Technical & Non-Functional Constraints
- **경량 원칙(CLAUDE.md 규칙 6)**: will_reuse + comment 외 필드 추가 금지(무거운 피드백 재도입 시 별도 결정).
- **RBAC 강제**: TEACHER 만 작성(INV-07).
- **KPI 연결**: FR-KPI-007(#41)가 본 데이터로 재사용 의사 ≥10명 추적. FR-KPI-006(#40 used_in_class)은 DEFER.
- **금지**: used_in_class·사전/사후 설문·교사 피드백 공개 페이지(#176 DEPRECATED 유지), 결제 필드, 후킹 어휘.

## :checkered_flag: Definition of Done (DoD)
- [ ] 5개 GWT 시나리오 통과
- [ ] TeacherFeedback 경량 모델 마이그레이션
- [ ] submitTeacherFeedback() + RBAC + Zod + Resend 알림
- [ ] FR-KPI-007 연동 검증
- [ ] TS-E2E-007(#134)와 정합(경량 폼)
- [ ] PR 본문에 "grill-it T2 — 교사 경량 will_reuse 수집" 명시

## :construction: Dependencies & Blockers
- **Depends on**: CT-DB-001, FW-AUTH-003, FR-AUTH-002, IF-RES-001
- **Blocks**: FR-KPI-007(#41), TS-E2E-007(#134), Private Beta Exit(교사 재사용 의사)
- **Related**: DEPRECATED #53·#76·#77·#176 · FR-KPI-006(#40 DEFER) · grill-it T2
