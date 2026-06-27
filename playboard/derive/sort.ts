// 파생: 매트릭스 정렬 (스펙 §7.3) — 순수 로직.
import type { ControlAreaId, Screen } from "../types";
import { screenStatusOrder } from "../registry/statuses";

export type SortKey = "title" | "status" | ControlAreaId;
export type SortDir = "asc" | "desc";

/** 값 추출: 제목=문자열, 상태=진행 순위 정수, 영역=노트 존재 0/1 */
function extract(screen: Screen, key: SortKey): string | number {
  if (key === "title") return screen.title;
  if (key === "status") return screenStatusOrder(screen.status);
  // control area
  return screen.engineering.controlAreaNotes[key] != null ? 1 : 0;
}

/** 정렬 — 동률은 제목 사전순 안정 정렬 */
export function sortScreens(
  screens: Screen[],
  key: SortKey,
  dir: SortDir,
): Screen[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...screens].sort((a, b) => {
    const va = extract(a, key);
    const vb = extract(b, key);
    let cmp: number;
    if (typeof va === "number" && typeof vb === "number") {
      cmp = va - vb;
    } else {
      cmp = String(va).localeCompare(String(vb), "ko");
    }
    if (cmp !== 0) return cmp * factor;
    // 동률 → 제목 사전순(방향 무관 안정)
    return a.title.localeCompare(b.title, "ko");
  });
}

/** 컬럼 클릭 토글: 같은 키면 방향 반전, 다른 키면 asc */
export function nextSort(
  current: { key: SortKey; dir: SortDir },
  clicked: SortKey,
): { key: SortKey; dir: SortDir } {
  if (current.key === clicked) {
    return { key: clicked, dir: current.dir === "asc" ? "desc" : "asc" };
  }
  return { key: clicked, dir: "asc" };
}
