# PlayBoard 도입 — 종합 작업 계획서

> **상태: 구현 완료 (2026-06-27).** Phase 1~8 전부 이행. `npm test` green(10/10) · `npm run build` green(43 라우트 SSG) · `playboard-integrity` **GO**(불변식 7/7) · 런타임 스모크(유효 200 / 없는 파라미터 404) 통과.
>
> **권장안 채택분:** D10 전체 10표면 구현 / D4 `/playboard/*` 프리픽스 / D5 vitest / D8 anchor 2026-06-30 / D9 `VERCEL_ENV`+`PROTOTYPE_ENABLED`.
> **계획 대비 결정 변경:** D7 다이어그램 — `mermaid` 의존성 대신 **파생 데이터에서 HTML/CSS로 직접 렌더**(의존성·hydration 리스크 제거, "레지스트리 파생" 원칙에 더 충실). D6 캡처 — Playwright 스크립트(`scripts/capture.mjs`) 준비, 실행은 후순위(자리표시 라이브).
>
> 이하는 원 계획 본문(근거로 보존). 변경은 위 배너와 레지스트리에 반영.
> 대상 호스트: `goyo-prototype` (고요의 경제나루 — 경제 교육 사이트)
> 스택: Next.js 16.2.6 App Router · React 19.2.4 · Tailwind v4 · shadcn/base-ui · lucide-react
> 근거 스펙: `~/.claude/skills/playboard/reference/PLAYBOARD_FINAL_SPEC_DEFINITION.md` (재현 스펙) · `PLAYBOARD_BENEFIT_N_OPERATION_RULE.md` (운영 규칙)
> 작성일: 2026-06-27

---

## 0. 이 계획서의 목적과 사용법

PlayBoard는 **레지스트리(구조화 데이터) 한 곳에서 모든 화면을 파생 렌더**하는 단일 진실 공급원(SoT) 표면이다. 기획·이슈·구현현황·일정·기술정책·디자인 실체가 하나의 살아있는 보드로 수렴한다.

**제1원칙(불가침):** 표시되는 모든 것은 레지스트리에서 파생한다. 두 곳을 손으로 맞추지 않는다.

이 문서는 그 PlayBoard를 본 프로젝트에 **재현(build)**하기 위한 전체 계획이다. 구성:
- §1 일반화 ↔ 호스트 매핑 (스펙 부록 A 워크시트를 본 repo에 맞춰 채움)
- §2 제안 레지스트리 내용 (6 SoT의 초기값 — 검토 대상)
- §3 기술 설계 결정 (이 스택에서의 구체 구현 방식)
- §4 빌드 단계 계획 (Phase별 산출물·파일경로·수용기준)
- §5 무결성 불변식 매핑
- §6 거버넌스 이식 계획
- §7 **검토 필요 결정사항(GO 전 확정)** ← 여기에 피드백 주세요
- §8 비범위 / 리스크

**진행 규약:** §7의 결정사항에 피드백을 주시면, 그 결과를 이 문서와 레지스트리·하네스에 반영한 뒤 §4 Phase 1부터 실제 구현을 시작한다.

---

## 1. 일반화 ↔ 호스트 매핑 워크시트 (스펙 부록 A)

| 일반 개념 | 본 프로젝트의 대응물 | 비고 |
|---|---|---|
| **평면 집합 (2~4)** | `learner`(학습자) · `operator`(운영자) · `system`(시스템 상태) | 3평면 제안 |
| **산출물 화면 목록** | 기존 8화면 (§2.1) | `plane/slug` 부여 |
| **구현 상태 4단계** | `planned(기획확정)` → `partial(부분구현)` → `implemented(머지완료)` → `verified(배포검증)` | 스펙 그대로 |
| **작업 항목·DAG** | 제품 개발 백로그 (§2.4) — 완료된 화면 구현 + 향후 백엔드/품질 작업 | `dependsOn`으로 DAG |
| **제어 영역 집합** | `auth · privacy · content · a11y · observability · delivery` (6) (§2.5) | 프로젝트 특성 반영 |
| **흐름 정의** | `learner`(순차) · `operator`(순차) · `system`(비순차 예외) (§2.6) | 평면당 1 |
| **Day1 anchor** | (미정 — §7 결정 D8) | wave 시작일 추정 기준 |
| **노출 플래그/환경** | `VERCEL_ENV !== 'production' OR PROTOTYPE_ENABLED === 'true'` | production 기본 비공개 |

### 1.1 라우트 매핑 (스펙 10라우트 → 본 repo 경로)

PlayBoard 표면은 제품 라우트와 충돌·혼동을 막기 위해 **`/playboard` 프리픽스** 아래 둔다(스펙의 `/plan` 등을 `/playboard/plan`로 매핑). 노출 게이트는 이 prefix의 공유 레이아웃에서 강제.

| 스펙 라우트 | 본 repo 라우트 | 표면 |
|---|---|---|
| `/` | `/playboard` | 상황판 인덱스 |
| `/plan` | `/playboard/plan` | 실행 계획(DAG) |
| `/schedule` | `/playboard/schedule` | 일정표(Wave+Gantt) |
| `/implement-summary` | `/playboard/implement-summary` | 구현 통계 매트릭스 |
| `/control-area/:area` | `/playboard/control-area/[area]` | 제어 영역 상세 |
| `/spec/:plane/:slug` | `/playboard/spec/[plane]/[slug]` | 기술 스펙 |
| `/screens/:plane/:slug` | `/playboard/screens/[plane]/[slug]` | 화면 데모 |
| `/scenario/:flow` | `/playboard/scenario/[flow]` | 시나리오 walkthrough |
| `/ux-flow/:flow` | `/playboard/ux-flow/[flow]` | 데스크톱 흐름 |
| `/mobile-flow/:flow` | `/playboard/mobile-flow/[flow]` | 모바일 흐름 |

> 제품의 실제 화면(`/lesson/[id]` 등)은 그대로 두고, PlayBoard의 데모 라우트(`/playboard/screens/:plane/:slug`)는 **구현된 화면이면 실 라우트로 임베드/리다이렉트**, 미구현이면 mock을 렌더(하이브리드 캡처 대응).

---

## 2. 제안 레지스트리 내용 (6 SoT 초기값 — 검토 대상)

> 아래는 **초기 채움 제안**이다. §7에서 확정 후 코드 레지스트리(`src/playboard/registry/*.ts`)로 옮긴다.

### 2.1 Screen 레지스트리 (산출물 화면 8종)

| plane/slug | title | route | audience | 제안 status | 비고 |
|---|---|---|---|---|---|
| `learner/landing` | 랜딩 — 고요의 경제나루 | `/` | 학습자 | implemented | mock 데이터(뉴스레터 무백엔드) |
| `learner/lesson` | 레슨 학습 화면 | `/lesson/[id]` | 학습자 | implemented | YouTube 임베드·OX 퀴즈, 진척 비영속 |
| `learner/dictionary` | 핵심 용어 사전 | `/dictionary` | 학습자 | implemented | 60단어 하드코딩 |
| `learner/stamp-map` | 스탬프 맵(진척) | `/stamp-map` | 학습자 | partial | completedSet mock(4/133), 영속화 필요 |
| `learner/auth` | 로그인·회원가입 | `/login` | 학습자/운영자 | partial | UI만, 실제 인증 백엔드 없음 |
| `operator/teacher-kit` | 교사용 자료 배포 | `/teacher-kit` | 운영자 | partial | PDF 다운로드 백엔드 없음(alert demo) |
| `operator/admin-dashboard` | 운영 대시보드 | `/admin/dashboard` | 운영자 | partial | 지표 전부 하드코딩, 인증 게이트 없음 |
| `system/not-found` | 404 화면 없음 | (catch-all) | 시스템상태 | implemented | 서버 컴포넌트, 정적 |

> `status` 판정 규칙(스펙 R5): **머지=implemented, 배포검증 후에만 verified.** 현재 mock 데이터/백엔드 미연동 화면은 "기능은 머지됐으나 운영 데이터 계약 미충족"으로 보아 `partial` 제안. 최종 판정은 §7 결정 D3.

각 Screen은 `engineering` 제어 스펙(인가 게이트·clientActions·serverActions·dataReads·dataWrites·telemetryEvents·exceptionStates·controlAreaNotes)을 **빈칸 없이** 채운다(스펙 R3). 초기 채움은 Phase 1에서 화면별로 작성하며, 예: `learner/lesson`의 `controlAreaNotes`에 `a11y`(글자크기 토글·skip link), `content`(CC 라이선스·YouTube 임베드 정책), `observability`(퀴즈 완료 이벤트) 요점 기재.

### 2.2 Plane 레지스트리 (3평면)

- `learner` — 학습자 도메인(주 사용자). 흐름 `learner`와 1:1.
- `operator` — 운영자 도메인(교사·관리자). 흐름 `operator`와 1:1.
- `system` — 시스템 상태(에러/예외). 비순차 독립 케이스.

### 2.3 Status 레지스트리 (순서 4단계)

`planned` → `partial` → `implemented` → `verified` (칸반 컬럼·매트릭스 정렬·카운트의 단일 정렬 기준). 배지 형태·라벨 고정, 색은 기존 `--status-*`/`--accent-*` 토큰에 매핑.

작업 항목(WorkItem)은 별도 3단계: `미착수` / `리뷰대기` / `완료`.

### 2.4 WorkItem 레지스트리 (DAG — 초기 제안)

Phase는 명시 순서 배열: `["P0 디자인·프로토타입", "P1 백엔드·영속화", "P2 품질·운영"]`.

| id | title | phase | status | dependsOn | screens |
|---|---|---|---|---|---|
| W01 | 디자인 시스템 토큰(VDS) | P0 | 완료 | — | (전체) |
| W02 | 랜딩 페이지 구현 | P0 | 완료 | W01 | learner/landing |
| W03 | 레슨 플레이어·OX 퀴즈 | P0 | 완료 | W01 | learner/lesson |
| W04 | 용어 사전 | P0 | 완료 | W01 | learner/dictionary |
| W05 | 스탬프 맵 UI | P0 | 완료 | W01 | learner/stamp-map |
| W06 | 로그인·회원가입 UI | P0 | 완료 | W01 | learner/auth |
| W07 | 교사용 자료 화면 | P0 | 완료 | W01 | operator/teacher-kit |
| W08 | 관리자 대시보드 UI | P0 | 완료 | W01 | operator/admin-dashboard |
| W09 | 404·시스템 상태 | P0 | 완료 | W01 | system/not-found |
| W10 | 인증 백엔드(Kakao OAuth) | P1 | 미착수 | W06 | learner/auth, operator/admin-dashboard |
| W11 | 학습 진척 영속화 | P1 | 미착수 | W10, W03, W05 | learner/lesson, learner/stamp-map |
| W12 | 관리자 인증·역할 게이트 | P1 | 미착수 | W10 | operator/admin-dashboard |
| W13 | PDF 다운로드 백엔드 | P1 | 미착수 | W07 | operator/teacher-kit |
| W14 | 콘텐츠 CMS 연동 | P1 | 미착수 | W08 | operator/admin-dashboard |
| W15 | 접근성 감사·보강 | P2 | 미착수 | W02, W03 | learner/landing, learner/lesson |
| W16 | 관측성·계측 도입 | P2 | 미착수 | W10 | (전체) |

이 DAG에서 Wave 파생(§7.2 알고리즘) → 일정표가 자동 생성된다. (완료 항목은 관계 밖, 미착수는 선행 레벨 기반.)

### 2.5 ControlArea 레지스트리 (6 횡단 영역)

| area | goal(한 줄) | 초기 gaps 예시 |
|---|---|---|
| `auth` | 인증·접근제어 일관 정책 | Kakao OAuth 실연동 미정, 관리자 라우트 가드 부재 |
| `privacy` | 개인정보·동의 처리 | 이메일·닉네임 수집 보관정책 미정, 동의 로그 미저장 |
| `content` | 콘텐츠·저작권(CC BY-NC-SA) | YouTube 임베드 정책, PDF 라이선스 표기 |
| `a11y` | 접근성(skip link·aria·글자크기) | 자동 a11y 검사 부재 |
| `observability` | 관측성·계측 | 분석 이벤트 스키마 미정 |
| `delivery` | 배포·노출 게이트 | 프리뷰/프로덕션 노출 분리, 환경변수 운영 |

> `delivery` 영역은 본 repo의 최근 배포 이슈(Vercel 프로덕션 stale 문제) 맥락에서 특히 유효 — 배포·노출 결정을 여기 잠근다.

### 2.6 Flow 레지스트리 (3흐름)

- `learner` (순차 시나리오): `landing → lesson → dictionary → stamp-map → auth`.
- `operator` (순차): `admin-dashboard → teacher-kit`.
- `system` (비순차 독립 케이스): `not-found` (+ 향후 에러/만료 상태).

> 시나리오 walkthrough(`/playboard/scenario/:flow`)는 **순차 흐름 전용** → `learner`·`operator`만. `system`은 데스크톱/모바일 흐름 오버뷰에서 "순서 없는 케이스"로 표시.

---

## 3. 기술 설계 결정 (이 스택 구체화)

### 3.1 디렉터리 구조 (제안)

```
src/
  playboard/
    registry/        # 6 SoT (순수 데이터 + 타입)
      screens.ts  planes.ts  statuses.ts  work-items.ts  control-areas.ts  flows.ts
      index.ts       # 통합 export
    derive/          # 파생 함수 (순수 로직)
      counts.ts      # 상태별 카운트·커버리지
      waves.ts       # 위상 레벨 Wave 파생 (§7.2)
      sort.ts        # 매트릭스 정렬
      gate.ts        # isEnabled() 노출 게이트
    diagrams/        # DAG/Gantt mermaid 소스 생성
    __tests__/       # 무결성 불변식 테스트
  app/
    (playboard)/     # 라우트 그룹 — 공유 레이아웃에서 노출 게이트 강제
      playboard/
        layout.tsx               # 게이트 + PlayBoardNav + 타일 셸
        page.tsx                 # 인덱스
        plan/page.tsx
        schedule/page.tsx
        implement-summary/page.tsx
        control-area/[area]/page.tsx
        spec/[plane]/[slug]/page.tsx
        screens/[plane]/[slug]/page.tsx
        scenario/[flow]/page.tsx
        ux-flow/[flow]/page.tsx
        mobile-flow/[flow]/page.tsx
    _playboard-components/        # 5 클라이언트 위젯 + 프리미티브
      PlayBoardNav.tsx  ScreenBoard.tsx  SortableMatrixTable.tsx
      DiagramModal.tsx  MobileCarousel.tsx
      StatusBadge.tsx  SpecRow.tsx  ScreenCard.tsx  MermaidRenderer.tsx
public/
  playboard/captures/<plane>/<slug>.png   # 캡처 산출물
scripts/
  capture.ts        # 헤드리스 캡처 파이프라인
```

### 3.2 핵심 기술 결정

1. **레지스트리 = 타입드 TS 모듈.** DB 없음 → `as const` 객체 + 타입으로 SoT 구성. 모든 표면은 `derive/`를 통해 계산. 화면에 하드코딩 목록 금지(제1원칙).
2. **노출 게이트 = `(playboard)` 레이아웃 + `notFound()`.** Vercel 환경 구분을 위해 `NODE_ENV` 대신 **`VERCEL_ENV`** 사용:
   `isEnabled() = process.env.VERCEL_ENV !== 'production' || process.env.PROTOTYPE_ENABLED === 'true'`.
   로컬(dev)·preview 자동 노출, production 기본 404. (이 repo는 Vercel 배포이므로 이 구분이 정확.)
3. **파라미터 검증 = 레지스트리 조회.** `[plane]/[slug]`·`[area]`·`[flow]`가 레지스트리에 없으면 `notFound()`. `generateStaticParams`로 유효 조합만 SSG 가능.
4. **5개 클라이언트 섬만 `'use client'`**, 나머지 표면은 서버 컴포넌트 정적 렌더. (PlayBoardNav, ScreenBoard, SortableMatrixTable, DiagramModal, MobileCarousel.)
5. **다이어그램 = mermaid (신규 의존성).** DAG flowchart·Gantt를 mermaid로 렌더. `DiagramModal`이 미리보기→모달 전환, `MermaidRenderer`가 클라이언트 렌더. (대안: 사전 렌더 SVG — §7 D7.)
6. **상태 배지 토큰 단일 관리.** 4단계 status → 기존 `--status-*`/`--accent-*` CSS 토큰 매핑을 한 파일(`StatusBadge`)에서 관리, 다이어그램 노드색에도 동일 팔레트 주입.
7. **무결성 테스트 러너 = Vitest (신규 의존성, 권장).** 현재 테스트 인프라 전무 → 경량 Vitest 도입. (대안: `node --test`+tsx — §7 D5.)
8. **캡처 파이프라인 = Playwright (신규 의존성).** 헤드리스로 구현 화면=실 라우트, 미구현=mock 데모 촬영 → `public/playboard/captures/:plane/:slug.png`. Phase 6에서 도입; 그 전까지 카드는 자리표시(placeholder)로 동작.
9. **테마 = 호스트 위임.** 색·폰트·간격은 기존 VDS 토큰 사용. PlayBoard는 형태·배치·표현 계약만 구현.

### 3.3 신규 의존성 (검토 대상)

| 패키지 | 용도 | 대안 |
|---|---|---|
| `vitest` (+ `@vitejs/plugin-react` 불필요, 노드 환경) | 무결성 불변식 테스트 | `node --test` + `tsx` |
| `mermaid` | DAG·Gantt 렌더 | 정적 SVG 사전 생성 |
| `playwright` (devDep) | 하이브리드 캡처 | 수동 스크린샷(임시) |

> Next 16 호환성은 각 도입 Phase에서 `node_modules/next/dist/docs/` 가이드 확인 후 진행(AGENTS.md 지침 준수).

---

## 4. 빌드 단계 계획 (Phase별)

각 Phase는 끝에 **수용 기준**을 만족해야 다음으로 진행. Phase 2의 무결성 테스트가 green이어야 이후 Phase 의미가 성립.

### Phase 0 — 매핑 확정 (이 문서 + 사용자 검토) ← 현재 단계
- 산출물: 본 계획서, §7 결정사항 합의.
- 수용: 사용자가 §7에 피드백 → 평면·상태·제어영역·라우트·의존성·도구 확정.

### Phase 1 — 6 레지스트리 + 파생 export
- 산출물: `src/playboard/registry/*.ts`(8화면·3평면·4상태·16작업·6영역·3흐름 전부 채움, engineering 계약 빈칸 없이), `src/playboard/derive/*.ts`(counts·waves·sort·gate).
- 파일: §3.1 `registry/`, `derive/`.
- 수용: 모든 화면의 engineering 계약 충족, 파생 함수가 카운트·커버리지·wave·정렬 반환. 하드코딩 목록 0.

### Phase 2 — 무결성 불변식 자동 검사 (green 게이트)
- 산출물: `src/playboard/__tests__/integrity.test.ts` + `package.json`에 `test` 스크립트.
- 검사: §5의 7개 불변식 전부.
- 수용: **테스트 green.** 이 게이트 통과 전 이후 Phase 진행 금지. `playboard-integrity` 서브에이전트로 GO 확인.

### Phase 3 — 라우트 골격 + 노출 게이트 + 내비
- 산출물: `(playboard)` 라우트 그룹, 10 라우트 파일(빈 셸), 게이트 레이아웃, `PlayBoardNav`(breadcrumb + 4섹션 탭 강조), 파라미터 검증(없으면 404), 교차 링크 골격.
- 수용: production에서 404, dev/preview에서 노출. 없는 파라미터 404. 내비 sticky·현재 강조 동작.

### Phase 4 — 재사용 프리미티브
- 산출물: `StatusBadge`(전 표면·다이어그램 공용 토큰), `SpecRow`/`SpecList`, `ScreenCard`(+compact), `DiagramModal`(포털·ESC·배경클릭·스크롤락, **버튼 중첩 금지**), `MermaidRenderer`.
- 수용: 상태 배지 전 표면 일관, 모달 상호작용 계약 충족.

### Phase 5 — 10 표면 페이지 구현
스펙 §5 순서대로. (분할 가능 — §7 D10에서 MVP 우선 여부 결정.)
1. 인덱스 6타일(히어로/일반 요약/제어영역 요약/시나리오 진입/ScreenBoard/푸터)
2. 실행 계획(DAG 모달 + 단계별 표)
3. 일정표(Gantt 모달 + Wave 카드, 차단 선행 표기)
4. 구현 통계 매트릭스(화면×영역 ● + 정렬 토글 + 푸터 합계)
5. 제어 영역 상세 5섹션
6. 기술 스펙(화면 계약 + 엔지니어링 제어 + 연결 작업 + 캡처)
7. 시나리오 walkthrough(좌 캡처/우 사양)
8. 데스크톱 흐름 오버뷰(썸네일 스트립 + 캡처 카드)
9. 모바일 흐름 오버뷰(iframe 폰 프레임 캐러셀)
10. 화면 데모(반응형, 캡처 대상; 구현 화면은 실 라우트 임베드)
- 수용: 스펙 §11 페이지 구성 체크리스트 전부.

### Phase 6 — 하이브리드 캡처 파이프라인
- 산출물: `scripts/capture.ts`(Playwright), 캡처 이미지 → `public/playboard/captures/`.
- 수용: 구현 화면=실 라우트, 미구현=mock 데모 촬영. 1화면=1이미지. 누락 시 자리표시.

### Phase 7 — 거버넌스 이식
- 산출물: `AGENTS.md`·`CLAUDE.md`에 "PlayBoard — SoT" 절 이중 명시(§6).
- 수용: 동시 갱신·양방향 싱크·갭 승격·노출 게이트 규칙이 하네스에 강제 명시됨.

### Phase 8 — 수용 점검
- 산출물: 스펙 §11 체크리스트 통과 기록.
- 수용: `playboard-integrity` 서브에이전트 **GO**(전 불변식 + Board Health green).

---

## 5. 무결성 불변식 매핑 (Phase 2 테스트 대상)

| 불변식(스펙 §10) | 본 repo 적용 |
|---|---|
| 화면 `workItems[]`·작업 `screens[]` 실재 참조(고아 금지) | Screen↔WorkItem 양방향 id 검증 |
| 작업 DAG 비순환 | W01~W16 `dependsOn` 위상정렬 가능 |
| `exceptionStates[]`는 system 평면 실재 slug | `system/not-found` 등만 허용 |
| implemented/verified 화면은 `implLocation` 필수 | 각 화면의 `src/app/...` 경로 |
| 흐름 `screens[]`는 같은 평면 실재 slug | learner/operator/system 흐름 검증 |
| 제어영역 노트 키는 정의된 영역 집합 내 | `auth·privacy·content·a11y·observability·delivery`만 |
| 위성 기준 문서 경로 실재 | ControlArea `standards[].path` 존재 검증 |

---

## 6. 거버넌스 이식 계획 (Phase 7)

`AGENTS.md`·`CLAUDE.md`에 추가할 "PlayBoard — 기획·구현·운영 통합 SoT" 절 요지(스펙 §9, 운영규칙 §3):
- **동시 갱신:** 요구사항·상태·정책·디자인 변경은 같은 PR에서 레지스트리를 함께 갱신.
- **상태 전이 규약 고정:** 이슈 `미착수→리뷰대기(PR)→완료(머지)`, 화면 `planned→partial→implemented(머지)→verified(배포검증)`.
- **양방향 싱크:** 위성 기준 문서 ↔ 레지스트리 같은 PR + 문서 상단 이중 고지.
- **갭 승격:** 해소된 갭은 정책/결정값으로 올리고 `gaps[]`에서 제거.
- **노출:** production 기본 비공개, 공유는 프리뷰 URL.
- **무결성 잠금:** 머지 전 `test`(무결성) green + `playboard-integrity` GO.

---

## 7. 검토 필요 결정사항 (GO 전 확정) ← 피드백 요청

> 아래에 의견 주시면 반영 후 Phase 1 착수합니다. 각 항목 **권장안**을 함께 제시했습니다.

| # | 결정 | 권장안 | 대안 / 고려점 |
|---|---|---|---|
| **D1** | 평면 수·명칭 | `learner·operator·system` 3평면 | `operator`를 teacher/admin 2개로 분리(4평면)? |
| **D2** | `learner/auth`(로그인) 평면 귀속 | `learner` (사용자 가입 흐름) | 운영자도 쓰므로 별도 `account` 평면? |
| **D3** | 기존 8화면 초기 status | mock/백엔드 미연동 5종 = `partial`, 정적 3종 = `implemented` | 전부 `implemented`로? (프로토타입 기준) |
| **D4** | 라우트 위치 | `/playboard/*` 프리픽스 | 스펙 그대로 최상위 `/plan` 등(제품 경로와 충돌 위험) |
| **D5** | 테스트 러너 | `vitest` 도입 | `node --test` + `tsx`(무의존성) |
| **D6** | 캡처 도구 | `playwright` (devDep) | 수동 스크린샷으로 시작, 자동화 후순위 |
| **D7** | 다이어그램 렌더 | `mermaid` 클라이언트 | 정적 SVG 사전 생성(런타임 의존성 0) |
| **D8** | Day1 anchor(일정 기준일) | 2026-06-30(월) | 실제 스프린트 시작일 지정 |
| **D9** | 노출 플래그 이름·조건 | `PROTOTYPE_ENABLED` + `VERCEL_ENV` 기반 | 다른 플래그명/조건? |
| **D10** | 구현 범위·순서 | **MVP 먼저**: 인덱스+레지스트리+매트릭스+plan+spec(5표면) → 이후 흐름/캡처 | 10표면 일괄 구현? |
| **D11** | 제어 영역 6종 구성 | §2.5 그대로 | 가감(예: privacy 통합/security 분리)? |
| **D12** | WorkItem DAG 초기값 | §2.4 16항목 | 향후 백로그 항목 가감? |

---

## 8. 비범위 / 리스크

**비범위(이번 도입에서 안 하는 것):**
- 제품 화면의 실제 백엔드 구현(W10~W14)은 PlayBoard가 **추적**할 뿐, 이 도입 작업에 포함되지 않음.
- 디자인 토큰 신규 제작(기존 VDS 위임).

**리스크 / 주의:**
- **Next 16 API 차이:** AGENTS.md가 명시한 대로 `node_modules/next/dist/docs/`를 단계마다 확인(라우트 그룹·`notFound()`·`generateStaticParams`·params Promise 등 버전 동작 확인).
- **신규 의존성 3종**(vitest·mermaid·playwright)이 Next 16/React 19와 호환되는지 도입 시 검증.
- **mermaid 모달 hydration:** 클릭 오버레이를 다이어그램 내부 버튼과 중첩 금지(스펙 §4.6) — 형제 오버레이로 분리.
- **캡처 파이프라인**이 가장 무겁고 환경 의존적 → MVP에서는 자리표시로 미루고 마지막에 자동화.
- **노출 게이트**가 production에서 확실히 404인지 배포 후 검증(최근 배포 stale 이슈 고려).

---

## 9. 다음 행동

1. 사용자가 **§7 결정사항(D1~D12)**에 피드백.
2. 피드백 반영 → 이 문서 갱신 + (필요 시) AskUserQuestion으로 잔여 모호점 해소.
3. **Phase 1**(레지스트리)부터 구현 착수. 이후 Phase 2 무결성 테스트 green을 게이트로 순차 진행.

> 본 계획서는 살아있는 문서다 — 구현 중 결정이 바뀌면 같은 변경 단위에서 이 문서와 레지스트리를 함께 갱신한다(제1원칙).
