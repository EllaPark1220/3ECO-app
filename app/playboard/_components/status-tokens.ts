// 상태 → 색 토큰 단일 관리 (스펙 §4.3).
// 한 곳에서 관리 → 배지·매트릭스 셀·DAG 노드·Gantt 막대에 동일 팔레트 주입.
import type { ScreenStatus, WorkItemStatus } from "@/playboard/types";

export const SCREEN_STATUS_COLOR: Record<ScreenStatus, string> = {
  planned: "var(--text-mute)",
  partial: "var(--status-draft)",
  implemented: "var(--accent-main)",
  verified: "var(--status-public)",
};

export const WORK_STATUS_COLOR: Record<WorkItemStatus, string> = {
  todo: "var(--text-mute)",
  review: "var(--status-draft)",
  done: "var(--status-public)",
};
