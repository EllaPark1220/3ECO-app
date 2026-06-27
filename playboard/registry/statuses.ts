import type { StatusMeta, WorkStatusMeta } from "../types";

/**
 * 구현 상태 — 순서 있는 4단계 (좌→우 진행).
 * order = 칸반 컬럼 순서·매트릭스 정렬·카운트의 단일 정렬 기준.
 * 라벨·순서는 스펙, 색은 호스트 테마 토큰에 위임(StatusBadge).
 */
export const SCREEN_STATUSES: StatusMeta[] = [
  { id: "planned", label: "기획 확정", order: 0 },
  { id: "partial", label: "부분 구현", order: 1 },
  { id: "implemented", label: "구현·머지", order: 2 },
  { id: "verified", label: "검증 완료", order: 3 },
];

/** 작업 항목 상태 — 3단계 */
export const WORK_STATUSES: WorkStatusMeta[] = [
  { id: "todo", label: "미착수", order: 0 },
  { id: "review", label: "리뷰 대기", order: 1 },
  { id: "done", label: "완료", order: 2 },
];

/** 단계(Phase) 명시 순서 배열 — Object.keys 정렬 의존 금지 */
export const PHASE_ORDER: string[] = [
  "P0 디자인·프로토타입",
  "P1 백엔드·영속화",
  "P2 품질·운영",
];

export const screenStatusOrder = (id: string): number =>
  SCREEN_STATUSES.find((s) => s.id === id)?.order ?? 99;

export const getScreenStatus = (id: string): StatusMeta | undefined =>
  SCREEN_STATUSES.find((s) => s.id === id);

export const getWorkStatus = (id: string): WorkStatusMeta | undefined =>
  WORK_STATUSES.find((s) => s.id === id);
