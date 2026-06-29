// 파생: 카운트·커버리지 (스펙 §7.1) — 순수 로직
import type {
  ControlAreaId,
  Screen,
  ScreenStatus,
  WorkItem,
  WorkItemStatus,
} from "../types";
import { SCREENS } from "../registry/screens";
import { WORK_ITEMS } from "../registry/work-items";
import { CONTROL_AREAS } from "../registry/control-areas";
import { SCREEN_STATUSES, WORK_STATUSES } from "../registry/statuses";

/** 상태별 화면 수 (모든 상태 키 포함, 0도 표기) */
export function screenStatusCounts(
  screens: Screen[] = SCREENS,
): Record<ScreenStatus, number> {
  const out = Object.fromEntries(
    SCREEN_STATUSES.map((s) => [s.id, 0]),
  ) as Record<ScreenStatus, number>;
  for (const s of screens) out[s.status] += 1;
  return out;
}

/** 상태별 작업 수 */
export function workStatusCounts(
  items: WorkItem[] = WORK_ITEMS,
): Record<WorkItemStatus, number> {
  const out = Object.fromEntries(
    WORK_STATUSES.map((s) => [s.id, 0]),
  ) as Record<WorkItemStatus, number>;
  for (const w of items) out[w.status] += 1;
  return out;
}

/** 영역 커버리지 = controlAreaNotes[area] 가진 화면 수 */
export function areaCoverage(
  area: ControlAreaId,
  screens: Screen[] = SCREENS,
): number {
  return screens.filter((s) => s.engineering.controlAreaNotes[area] != null)
    .length;
}

/** 모든 영역의 커버리지 맵 {area: covered} */
export function allAreaCoverage(
  screens: Screen[] = SCREENS,
): Record<ControlAreaId, number> {
  const out = {} as Record<ControlAreaId, number>;
  for (const a of CONTROL_AREAS) out[a.area] = areaCoverage(a.area, screens);
  return out;
}

/** 그 영역 요점을 가진 화면들(역참조) */
export function screensCoveringArea(
  area: ControlAreaId,
  screens: Screen[] = SCREENS,
): Screen[] {
  return screens.filter((s) => s.engineering.controlAreaNotes[area] != null);
}

export const totalScreens = (screens: Screen[] = SCREENS): number =>
  screens.length;
