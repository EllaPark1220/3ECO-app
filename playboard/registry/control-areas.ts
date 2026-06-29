import type { ControlArea } from "../types";

/**
 * 제어 영역 레지스트리 — 8 횡단 비기능 정책 축 (타깃 docs/tasks 근거).
 * standards[].path 는 실재 파일만(무결성 불변식이 존재 검증).
 * 해소 안 된 결정은 gaps[]에 정직하게(빈 갭 ≠ 갭 없음). 해소되면 정책/결정값으로 승격.
 */
export const CONTROL_AREAS: ControlArea[] = [
  {
    area: "security",
    goal: "인증·접근제어·보안을 일관 정책으로 잠근다.",
    summary:
      "로그인·세션·역할 게이트·전송보안의 단일 기준. 현재 로그인은 UI만 존재하고 실제 인증 백엔드·관리자 역할 게이트가 미구현 상태다. 레이트리밋 미들웨어는 적용됨. 관련 태스크: FW-AUTH-001..006, NF-SEC-001..005, CT-DB-011(RLS), TS-UT-013(RBAC).",
    policies: [
      {
        statement: "운영자 라우트는 역할 게이트 뒤에 둔다.",
        detail:
          "`/admin/*`는 운영자 세션이 없으면 접근 불가여야 한다(현재 미구현 — gaps, TS-UT-013).",
      },
      {
        statement: "API는 경로별 레이트리밋을 강제한다.",
        detail: "general 60 / auth 10 / ox 30 req/min (lib/api/rate-limit.ts, NF-SEC-005).",
      },
    ],
    decisions: [
      { name: "1차 인증 수단", value: "카카오 OAuth + 이메일/비밀번호 (Supabase)" },
      { name: "전송 보안", value: "TLS + HSTS (NF-SEC-001)" },
    ],
    standards: [
      { title: "보안·인증 결정 (PROJECT_DECISIONS)", path: "docs/PROJECT_DECISIONS_v1.md" },
      { title: "레이트리밋 미들웨어 (NF-SEC-005)", path: "lib/api/rate-limit.ts" },
      { title: "보안 요구사항 (SRS)", path: "docs/SRS_v1.1.md" },
    ],
    workItems: ["W10", "W12"],
    gaps: [
      "카카오 OAuth 실연동 미정 (W10 / FW-AUTH-006)",
      "관리자 라우트 역할 가드 부재 (W12 / TS-UT-013)",
      "세션 만료·재발급 정책 미정 (FW-AUTH-003/004)",
    ],
  },
  {
    area: "privacy",
    goal: "개인정보 수집·동의를 최소·투명하게 처리한다.",
    summary:
      "이메일·닉네임·학습 진척 등 개인 데이터의 수집 범위와 동의 처리 기준. 현재 동의 UI는 있으나 동의 로그 저장·보관 정책이 미정이다. 관련 태스크: FW-AUTH-002(PII 최소), NF-SEC-002(가명화), NF-SEC-004(감사로그).",
    policies: [
      {
        statement: "결제 정보·민감 PII는 일절 수집하지 않는다.",
        detail:
          "이메일·닉네임만 수집. 성명·연락처·소득·결제 필드는 영구 금지 (CLAUDE 규칙 2 / PRD 원칙 2).",
      },
    ],
    decisions: [
      { name: "수집 항목", value: "이메일·닉네임·학습 진척만" },
      { name: "가명화", value: "운영 지표는 가명화 파이프라인 경유 (NF-SEC-002)" },
    ],
    standards: [
      { title: "PII 최소 수집 원칙 (PRD)", path: "docs/PRD_v1.1.md" },
      { title: "가명화 파이프라인", path: "tasks/NF-SEC-002_NF_Security_Pseudonymization_Pipeline.md" },
    ],
    workItems: ["W10", "W11"],
    gaps: [
      "약관/개인정보 동의 로그 저장 미구현 (FW-AUTH-002)",
      "이메일·닉네임 보관 기간 정책 미정 (NF-SEC-004)",
    ],
  },
  {
    area: "a11y",
    goal: "접근성 기본기를 전 화면에서 유지한다 (WCAG AA).",
    summary:
      "skip 링크·포커스 링·모션 감소·글자 크기 토글 등 접근성 정책. VDS 토큰(app/globals.css)에 포커스/모션 정책이 코드로 잠겨 있다. 28px+200% 확대 무가로스크롤은 E2E(TS-E2E-006)로 검증.",
    policies: [
      {
        statement: "outline:none 금지, 포커스 링을 항상 둔다.",
        detail: ":focus-visible 에 3px 액센트 아웃라인 (app/globals.css).",
      },
      {
        statement: "prefers-reduced-motion 을 존중한다.",
        detail: "모션 감소 설정 시 애니메이션·트랜지션을 0.001ms 로 차단.",
      },
    ],
    decisions: [
      { name: "글자 크기", value: "14/18/22/28px 4단계 (기본 18px) — CLAUDE 규칙 4" },
    ],
    standards: [
      { title: "접근성·모션 정책 (VDS 런타임)", path: "app/globals.css" },
      { title: "VDS 근거 문서", path: "docs/VDS_v3.md" },
      { title: "28px·200% 무가로스크롤 E2E", path: "tasks/TS-E2E-006_Test_E2E_28px_200pct_NoHorizontalScroll.md" },
    ],
    workItems: ["W15"],
    gaps: ["자동 a11y 검사(axe) CI 게이트 미구축 (IF-CI-002)"],
  },
  {
    area: "observability",
    goal: "학습·운영 행동을 계측해 의사결정에 쓴다.",
    summary:
      "퀴즈 완료·구독·다운로드·운영 액션 등 핵심 이벤트의 계측 스키마. 현재 이벤트는 정의만 있고 실제 수집 파이프라인이 없다. 제품 KPI는 외부 분석이 아닌 내부 event_log 에서 산출. 관련: NF-OBS-*, CT-DB-009(EventLog), IF-AN-001.",
    policies: [
      {
        statement: "개인 식별 없이 집계 가능한 이벤트만 수집한다.",
        detail: "PII 를 이벤트 페이로드에 넣지 않는다.",
      },
      {
        statement: "제품 KPI 는 내부 event_log 로 산출한다.",
        detail: "GA4·추적기성 외부 스크립트 금지, Vercel Analytics + Plausible 만 (CLAUDE 규칙 3 / NF-SEC-003).",
      },
    ],
    decisions: [
      { name: "분석 도구", value: "Vercel Analytics + Plausible (GA4 금지)" },
      { name: "event_log 보관", value: "30~90일 (NF-OBS-007)" },
    ],
    standards: [
      { title: "Sentry 설정·샘플링", path: "tasks/NF-OBS-001_NF_Sentry_Setup_Sampling.md" },
      { title: "EventLog 보관 정책", path: "tasks/NF-OBS-007_NF_EventLog_Retention_30_90day.md" },
    ],
    workItems: ["W16"],
    gaps: [
      "분석 이벤트 스키마 미확정 (CT-DB-009)",
      "수집·적재 파이프라인 미구축 (W16 — 전 화면 telemetryEvents 미연동)",
    ],
  },
  {
    area: "performance",
    goal: "핵심 경로의 응답 지연·웹바이탈 예산을 지킨다.",
    summary:
      "스탬프 렌더·PDF 생성·미디어 전환의 성능 예산. 부하 테스트(k6)와 Lighthouse CI 로 게이트. 현재 측정 파이프라인은 미구축. 관련: TS-LOAD-001..005, NF-OBS-003(Sev2 지연).",
    policies: [
      {
        statement: "핵심 경로의 p95 지연 예산을 정의하고 부하로 검증한다.",
        detail: "스탬프 응답 p95 ≤ 500ms(100동시), PDF 생성 p95 ≤ 2s(50동시).",
      },
    ],
    decisions: [
      { name: "스탬프 p95", value: "≤ 500ms (TS-LOAD-001)" },
      { name: "PDF p95", value: "≤ 2s (TS-LOAD-002)" },
      { name: "웹바이탈", value: "LCP ≤ 2.5s · CLS ≤ 0.1" },
    ],
    standards: [
      { title: "스탬프 렌더 부하 p95", path: "tasks/TS-LOAD-001_Test_Load_StampRender_100Users_p95.md" },
      { title: "PDF 생성 부하 p95", path: "tasks/TS-LOAD-002_Test_Load_PDF_50Users_p95.md" },
      { title: "Sev2 지연·에러율", path: "tasks/NF-OBS-003_NF_Sev2_Latency_ErrorRate.md" },
    ],
    workItems: [],
    gaps: [
      "부하/라이트하우스 CI 게이트 미구축 (IF-CI-002 / TS-LOAD-003)",
    ],
  },
  {
    area: "cost",
    goal: "단일 운영자·무수익 단계의 인프라 비용을 0~10만원/월로 묶는다.",
    summary:
      "MVP 무료 티어(Vercel Hobby + Supabase Free) 경로와 업그레이드 트리거. 영상은 YouTube 임베드 단독으로 호스팅 비용 0원(ADR-005). 관련: NF-COST-001..004, IF-VC-001/002.",
    policies: [
      {
        statement: "MVP 인프라 비용 상한을 0~10만원/월로 둔다.",
        detail: "무료 티어 우선, 임계치 도달 시에만 유료 전환 (NF-COST-001).",
      },
    ],
    decisions: [
      { name: "영상 호스팅", value: "YouTube 임베드 단독 — 자체 CDN/이중화 0원 (ADR-005)" },
      { name: "MVP 스택", value: "Vercel Hobby + Supabase Free" },
    ],
    standards: [
      { title: "인프라 비용 상한", path: "tasks/NF-COST-001_NF_Infra_Cost_0_10man.md" },
      { title: "영상 호스팅 0원", path: "tasks/NF-COST-004_NF_VideoHosting_0won.md" },
    ],
    workItems: [],
    gaps: ["유료 전환 트리거 모니터링 미구축 (IF-VC-002)"],
  },
  {
    area: "content",
    goal: "콘텐츠·저작권·어조를 CC BY-NC-SA 4.0·후킹 금지 기준으로 운영한다.",
    summary:
      "강의 영상·용어·교사 자료의 라이선스·출처 표기와 후킹 없는 어조 기준. 영상은 youtube-nocookie 임베드, 교사 자료는 PDF 배포. 후킹 카피·게임화는 정적/LLM 린터로 차단. 관련: FW-LINT-001..004, TS-STATIC-001/002.",
    policies: [
      {
        statement: "모든 배포물에 CC BY-NC-SA 4.0 을 표기한다.",
        detail: "랜딩·레슨·교사 자료 푸터에 라이선스를 명시 (TS-STATIC-002).",
      },
      {
        statement: "후킹·게임화 카피를 금지하고 린터로 차단한다.",
        detail: "배지·랭킹·'지금!'·FOMO 어휘 금지 (CLAUDE 규칙 5 / TS-STATIC-001 / FW-LINT).",
      },
    ],
    decisions: [
      { name: "라이선스", value: "CC BY-NC-SA 4.0 (ADR-002)" },
      { name: "영상 임베드", value: "youtube-nocookie" },
    ],
    standards: [
      { title: "후킹 키워드 정적 린터 (CI)", path: "tasks/TS-STATIC-001_Test_Static_Hooking_Keywords_CI.md" },
      { title: "CC 라이선스 표기 검증", path: "tasks/TS-STATIC-002_Test_Static_Docs_CC_License.md" },
      { title: "커리큘럼", path: "docs/CURRICULUM_v1.md" },
    ],
    workItems: ["W13", "W14"],
    gaps: [
      "교사 자료 PDF 버전 관리 정책 미정 (W13)",
      "후킹 린터 LLM 게이트 미구축 (FW-LINT-002)",
    ],
  },
  {
    area: "delivery",
    goal: "배포·노출을 환경별로 안전하게 통제한다.",
    summary:
      "프리뷰/프로덕션 노출 분리와 CI 배포 파이프라인 기준. PlayBoard 자체는 production 기본 비공개(노출 게이트). main 직접 push 금지(PR). 관련: IF-CI-001..006, IF-VC-001.",
    policies: [
      {
        statement: "PlayBoard 는 production 에서 기본 비공개(404)다.",
        detail:
          "`VERCEL_ENV !== 'production' || PROTOTYPE_ENABLED === 'true'` 일 때만 노출 (playboard/derive/gate.ts).",
      },
      {
        statement: "외부 공유는 프리뷰 배포 URL 로 한다.",
        detail: "문서 export 금지 — 항상 살아있는 보드를 본다. main 직접 push 금지(PR).",
      },
    ],
    decisions: [
      { name: "노출 플래그", value: "PROTOTYPE_ENABLED (preview 전용)" },
      { name: "환경 판정", value: "VERCEL_ENV" },
    ],
    standards: [
      { title: "노출 게이트 (런타임)", path: "playboard/derive/gate.ts" },
      { title: "PlayBoard 레이아웃 가드", path: "app/playboard/layout.tsx" },
      { title: "CI 품질 파이프라인 (5 jobs)", path: "tasks/IF-CI-001_Infra_CI_Quality_Yml_5Jobs.md" },
      { title: "Vercel Hobby 프로젝트", path: "tasks/IF-VC-001_Infra_Vercel_Hobby_Project.md" },
    ],
    workItems: [],
    gaps: ["프로덕션 배포 검증 자동화 부재 (최근 stale 배포 이슈)"],
  },
];

export const getControlArea = (id: string): ControlArea | undefined =>
  CONTROL_AREAS.find((a) => a.area === id);

export const CONTROL_AREA_IDS = CONTROL_AREAS.map((a) => a.area);
