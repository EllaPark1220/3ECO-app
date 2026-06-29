// PlayBoard — 데이터 모델 타입 계약 (SoT)
// 스펙 §3. 모든 표면은 이 레지스트리에서 파생한다(제1원칙).

/** 평면 식별자 — 산출물 화면을 묶는 최상위 분류 축 */
export type PlaneId = "learner" | "operator" | "system";

/** 구현 상태 — 순서 있는 4단계 (칸반·매트릭스·카운트의 단일 정렬 기준) */
export type ScreenStatus = "planned" | "partial" | "implemented" | "verified";

/** 작업 항목 상태 — 3단계 */
export type WorkItemStatus = "todo" | "review" | "done";

/** 횡단 제어 영역 식별자 (8 — 타깃 docs/tasks 근거) */
export type ControlAreaId =
  | "security"
  | "privacy"
  | "a11y"
  | "observability"
  | "performance"
  | "cost"
  | "content"
  | "delivery";

/** 흐름 식별자 (보통 평면과 1:1) */
export type FlowId = "learner" | "operator" | "system";

/** 디자인 분류 라벨 (색·테마 아님, 분류만) */
export type DesignSpecType = "콘텐츠형" | "서비스형";

/** 화면 식별자 — `plane/slug` */
export type ScreenKey = `${PlaneId}/${string}`;

/** 엔지니어링 제어 스펙 (스펙 §3.2) — 빈칸 금지: 빈 계약은 "기재 누락" */
export interface Engineering {
  /** 인가 게이트 한 줄 */
  authGate: string;
  clientActions: string[];
  serverActions: string[];
  dataReads: string[];
  dataWrites: string[];
  telemetryEvents: string[];
  /** 연결된 예외 상태 화면 slug (system 평면) */
  exceptionStates: string[];
  /** {제어영역 → 이 화면에서의 요점}. 키 존재 여부가 매트릭스 ● 채움을 결정 */
  controlAreaNotes: Partial<Record<ControlAreaId, string>>;
}

/** 산출물 화면 레지스트리 (스펙 §3.1) */
export interface Screen {
  plane: PlaneId;
  slug: string;
  title: string;
  /** 이 화면이 표현하는 실제 앱 경로(설명 대상) */
  route: string;
  designSpecType: DesignSpecType;
  flowNote: string;
  status: ScreenStatus;
  statusNote?: string;
  /** 이 화면을 만든/바꾼 작업 항목 id */
  workItems: string[];
  /** 동결 기획서 근거 참조 */
  requirementRefs: string[];
  /** 구현 위치(파일/모듈). 없으면 미구현 */
  implLocation?: string;
  engineering: Engineering;
}

/** 작업 항목 레지스트리 — DAG (스펙 §3.5) */
export interface WorkItem {
  id: string;
  title: string;
  /** 단계/마일스톤 (PHASE_ORDER 중 하나) */
  phase: string;
  status: WorkItemStatus;
  externalRefs?: string;
  /** 선행 항목 id (DAG 간선) — 비순환 보장 */
  dependsOn: string[];
  /** 이 항목이 건드리는 산출물 화면 키 (`plane/slug`) */
  screens: ScreenKey[];
  doc: string;
}

/** 제어 영역 레지스트리 (스펙 §3.7) */
export interface ControlArea {
  area: ControlAreaId;
  goal: string;
  summary: string;
  policies: { statement: string; detail: string }[];
  decisions: { name: string; value: string }[];
  standards: { title: string; path: string }[];
  workItems: string[];
  gaps: string[];
}

/** 평면 레지스트리 */
export interface Plane {
  id: PlaneId;
  title: string;
  description: string;
}

/** 구현 상태 메타 (순서·라벨) */
export interface StatusMeta {
  id: ScreenStatus;
  label: string;
  /** 칸반·정렬 진행 순위 (낮을수록 초기) */
  order: number;
}

/** 작업 상태 메타 */
export interface WorkStatusMeta {
  id: WorkItemStatus;
  label: string;
  order: number;
}

/** 흐름 레지스트리 */
export interface Flow {
  id: FlowId;
  title: string;
  plane: PlaneId;
  /** 순차 시나리오 | 독립 케이스 집합 */
  kind: "sequence" | "set";
  description: string;
  /** 평면 내 화면 slug (순서 의미는 kind=sequence일 때) */
  screens: string[];
}

/** 파생: 병렬 착수 묶음 */
export interface Wave {
  index: number;
  level: number;
  startDate: string;
  items: WorkItem[];
}

/** 화면 키 헬퍼 */
export const screenKey = (s: Pick<Screen, "plane" | "slug">): ScreenKey =>
  `${s.plane}/${s.slug}`;
