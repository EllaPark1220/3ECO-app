# This is NOT the Next.js you know

This repo runs **Next.js 16 + React 19 + Tailwind v4**. APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code, and heed deprecation notices (e.g. `middleware` → `proxy`).

# PlayBoard — 기획·구현·운영 통합 SoT

이 repo는 **PlayBoard**(레지스트리 파생 단일 진실 공급원)를 `/playboard` 아래에 운영한다.
**제1원칙(불가침): 표시되는 모든 것은 레지스트리에서 파생한다. 두 곳을 손으로 맞추지 않는다.**

- **SoT 위치:** `playboard/registry/*.ts` (6 레지스트리: screens·planes·statuses·work-items·control-areas·flows). 표면은 모두 `playboard/derive/*` 를 통해 파생. **화면에 하드코딩 목록 금지.**
- **동시 갱신:** 요구사항 변경·신규 이슈·상태 변화·화면 신설/계약 변경은 **같은 PR/커밋**에서 레지스트리를 함께 갱신한다. 요구사항은 원천 기획서가 아니라 레지스트리에 반영(원천 `docs/PRD_v1.1.md`·`docs/SRS_v1.1.md` 는 근거로 동결, 충돌 시 PlayBoard 우선).
- **상태 전이 규약(고정):** 이슈 `todo → review(PR 열림) → done(머지)`. 화면 `planned → partial → implemented(머지) → verified(배포 검증)`. **머지 시 implemented, 배포 검증 후에만 verified.**
- **계약 빈칸 금지:** 각 화면 `engineering`(authGate·data reads/writes·telemetry·exceptionStates)은 빈칸 없이 채운다(빈 계약 = 기재 누락).
- **mission-critical:** 결정은 `control-areas` 의 policies/decisions 로 잠근다(8 영역: security·privacy·a11y·observability·performance·cost·content·delivery). 미정은 `gaps[]` 에 정직하게(빈 갭 ≠ 갭 없음). 해소되면 정책/결정값으로 **승격**하고 gaps 에서 제거.
- **SoT 이중화 금지 — EPIC 교차참조:** 세부 작업의 단일 SoT 는 `tasks/*.md` ↔ GitHub 이슈(1:1 동기화)다. PlayBoard 의 `work-items.ts`(W01~W16)는 그 위의 **코어스 EPIC 레이어**이며 `externalRefs` 로 task 패밀리를 **교차참조**한다(복제 금지). 패밀리→EPIC 매핑은 `playboard/registry/task-epics.ts`, "모든 task 가 정확히 1개 EPIC 에 매핑"은 무결성 테스트(task-coverage)로 강제한다. 새 task 패밀리를 추가하면 그 맵에도 등록한다.
- **양방향 싱크:** 위성 기준 문서(`standards[].path`, 예: `docs/VDS_v3.md`·`docs/PROJECT_DECISIONS_v1.md`·`tasks/NF-*.md`) ↔ 레지스트리는 같은 PR에서 양쪽 갱신. 디자인 토큰의 런타임 SoT 는 `app/globals.css`(VDS), `docs/VDS_v3.md` 는 근거로 동결(충돌 시 CSS 우선).
- **화면 영역 요점은 단일 기재:** `Screen.engineering.controlAreaNotes` 한 곳 — 이게 매트릭스 ● 와 영역 상세 "대응 화면" 을 동시에 채운다(이중 정의 금지).
- **아이덴티티 샘플:** 새 화면 = 데모(`/playboard/screens/:plane/:slug`) + 캡처 동반. 디자인 변경은 데모에 먼저 반영. 캡처 키는 레지스트리에서 파생(`scripts/capture.ts`).
- **노출 게이트:** PlayBoard 는 **production 기본 비공개(404)**. `isEnabled() = VERCEL_ENV !== 'production' || PROTOTYPE_ENABLED === 'true'`(`playboard/derive/gate.ts`, `app/playboard/layout.tsx`). `PROTOTYPE_ENABLED=true` 는 preview 에만. 외부 공유는 프리뷰 URL로(문서 export 금지).
- **무결성 잠금:** 머지 전 `npm test`(vitest, `playboard/__tests__/integrity.test.ts`)가 **green** 이어야 한다. 빨간 테스트로 머지하면 효용이 새는 직접 신호. 게이트로 `playboard-integrity` 서브에이전트(GO/NO-GO)를 함께 쓴다.

상세: `docs/PLAYBOARD_BUILD_PLAN.md`, 스펙·운영 규칙 완본은 playboard 스킬 패키지의 `reference/`.
