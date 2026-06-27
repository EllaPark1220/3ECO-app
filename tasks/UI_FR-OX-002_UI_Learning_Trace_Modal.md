# [Feature] UI_FR-OX-002: OX 통과 학습 흔적 모달 (4조건 게이미피케이션 예외) + in-page 메시지

```yaml
---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] UI_FR-OX-002: OX 통과 시 in-page 메시지 + 학습 흔적 모달 (4조건: 300ms 페이드·흔적 어휘·자유 닫기·공유 선택)"
labels: 'feature, frontend, ox, stamp, accessibility, priority:high, mvp-in, closed-beta, grill-it'
assignees: ''
---
```

## :dart: Summary
- **기능명**: [UI_FR-OX-002] OX 전체 통과(서버 검증) 직후 **in-page 메시지 + 학습 흔적 모달**을 동시 표시. 모달은 게임화 금지 원칙의 **4조건 한정 예외**.
- **목적**: 박지훈 "선이 그어지는 감각"을 게임화 없이 강화. grill-it T4 결정 — PRD v1.1 §1·§4 예고를 MVP 본문으로 확정.
- **4조건 (모두 충족해야 모달 허용, PRD v1.1)**:
  1. **300ms 페이드** 인/아웃만 (튀는 애니메이션·이펙트 금지)
  2. **"흔적·마침" 어휘** 사용, "획득·축하·달성·레벨업" 등 보상 어휘 금지
  3. **자유 닫기** — ESC · backdrop 클릭 · X 버튼 모두 가능
  4. **카카오 공유 선택적** — 기본 비노출/수동, 자동 공유·자동 팝업 금지

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- PRD: `docs/PRD_v1.1.md` §1(게이미피케이션 예외 조항) · §4(OX 통과 후 모달) · Story 1
- 결정: `docs/grill/GRILL_LEDGER.md` T4 · `CLAUDE.md` 규칙 5(게임화 금지/예외)
- 선행: FW-OX-001(OX 채점·Stamp INSERT), UI_FR-OX-001(#173 OX RadioGroup 제출), UI_FR-STAMP-002(#175 스탬프 맵)
- 연계: FW-STAMP-001(공유 토큰, Could) — 공유 버튼은 선택적 연결

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/lesson/[id]/components/LearningTraceModal.tsx` Client Component — shadcn/ui `Dialog`(Radix) 기반(키보드·focus trap·ARIA 자동)
- [ ] **트리거** — `submitOx()` 응답 `{ passed: true, stamp_earned }` 수신 시: (a) in-page 메시지(접근성 라이브 리전 `aria-live="polite"`) + (b) 모달 동시 노출
- [ ] **조건 1 — 300ms 페이드**: `transition: opacity 300ms` 만. scale/bounce/confetti 등 금지
- [ ] **조건 2 — 어휘**: 본문 "이 차시의 흔적을 남겼어요" / "한 걸음 마침" 류. 후킹 린터 사전(TS-STATIC-001) + "획득/축하/달성/레벨/배지" 금지어 검증
- [ ] **조건 3 — 자유 닫기**: ESC, backdrop 클릭, 우상단 X 모두 닫기. 자동 닫힘 타이머 없음(사용자 통제)
- [ ] **조건 4 — 공유 선택**: "스탬프 맵 공유"는 **수동 버튼**만, 기본 강조 안 함. 자동 카카오 공유 팝업 금지. 공유 토큰은 FW-STAMP-001 연결(미구현 시 버튼 숨김)
- [ ] **미인증/실패** — OX 미통과 또는 미로그인 시 모달 미노출(in-page 메시지만 또는 없음)
- [ ] **접근성** — 모달 오픈 시 포커스 이동 + 닫을 때 트리거로 복귀. 색 대비 4.5:1. 스크린 리더 제목/설명 레이블
- [ ] **게임화 가드 테스트 훅** — 금지 어휘·이펙트 부재를 시각 회귀(연계 #188 TS-E2E-009)로 검증 가능하게 data-testid 부여

## :test_tube: Acceptance Criteria (BDD/GWT)

### Scenario 1: OX 통과 → in-page + 모달 동시
- **Given**: 로그인 사용자가 OX 전체 정답 제출
- **When**: 서버 `passed: true` 응답
- **Then**: in-page 메시지(aria-live) + 학습 흔적 모달 300ms 페이드로 동시 노출

### Scenario 2: 어휘 가드
- **Given**: 모달 렌더
- **When**: 본문 텍스트 검사
- **Then**: "흔적/마침" 계열만. "획득·축하·달성·레벨·배지" 0건(후킹 린터 통과)

### Scenario 3: 자유 닫기 3경로
- **Given**: 모달 오픈
- **When**: ESC / backdrop 클릭 / X 버튼 각각
- **Then**: 모두 정상 닫힘. 자동 닫힘 타이머 없음

### Scenario 4: 공유 자동 금지
- **Given**: 모달 오픈
- **When**: 노출 상태 검사
- **Then**: 카카오 공유 자동 팝업 0. 공유는 수동 버튼만(또는 미연결 시 숨김)

### Scenario 5: OX 미통과 — 모달 없음
- **Given**: 오답 포함 제출
- **When**: 서버 `passed: false`
- **Then**: 흔적 모달 미노출. 오답 앵커 스크롤(FR-LES-005)만

### Scenario 6: 접근성
- **Given**: 키보드/스크린 리더 사용자
- **When**: 모달 오픈
- **Then**: focus trap + 제목/설명 레이블 + ESC 닫기. 색 대비 ≥4.5:1

## :gear: Technical & Non-Functional Constraints
- **게임화 금지 원칙(CLAUDE.md 규칙 5)**: 본 모달은 4조건 충족 시에만 허용되는 유일 예외. 4조건 중 하나라도 위반하면 머지 금지.
- **shadcn/ui Dialog(Radix)**: 접근성 기본 제공. 커스텀 모달 직접 구현 금지.
- **공유 결합도**: 공유 토큰(FW-STAMP-001) 미구현 시 버튼 비노출 — 흔적 모달 자체는 공유 없이 독립 동작.
- **금지**: confetti/사운드/배지/점수/자동 공유/자동 닫힘.

## :checkered_flag: Definition of Done (DoD)
- [ ] 6개 GWT 시나리오 통과
- [ ] `LearningTraceModal.tsx` 구현(Radix Dialog)
- [ ] 4조건 전부 충족 + 위반 시 실패하는 테스트
- [ ] 후킹 린터(어휘) + axe(접근성) 통과
- [ ] 시각 회귀(#188)와 정합
- [ ] PR 본문에 "grill-it T4 — 학습 흔적 모달 4조건 예외" 명시

## :construction: Dependencies & Blockers
- **Depends on**: FW-OX-001, UI_FR-OX-001(#173), UI_FR-STAMP-002(#175)
- **Related**: FW-STAMP-001(공유 토큰, 선택), TS-E2E-009(#188 게임화 부재 회귀), PRD §1·§4 · grill-it T4
