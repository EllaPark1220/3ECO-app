// 파생: 병렬 Wave (위상 레벨) — 스펙 §7.2. 순수 로직.
// 완료=레벨 -1(관계 밖), 리뷰대기=레벨 0, 미착수=max(미완료 선행 레벨)+1.
// 같은 레벨 = 상호 무의존(병렬). 메모이즈 재귀로 사이클 방어.
import type { Wave, WorkItem } from "../types";
import { WORK_ITEMS } from "../registry/work-items";

/** 일정 추정 기준일 (Day1 anchor) — 1 wave ≈ 1 Day 가정 */
export const DAY1_ANCHOR = "2026-06-30";

/** anchor(YYYY-MM-DD)에 n일 더한 YYYY-MM-DD (UTC 기준, 현재시각 비의존) */
export function addDays(anchorISO: string, n: number): string {
  const [y, m, d] = anchorISO.split("-").map(Number);
  const base = Date.UTC(y, m - 1, d);
  const next = new Date(base + n * 86_400_000);
  const yy = next.getUTCFullYear();
  const mm = String(next.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(next.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/** 각 작업의 위상 레벨 (메모이즈 재귀, 사이클 가드) */
export function workItemLevels(
  items: WorkItem[] = WORK_ITEMS,
): Map<string, number> {
  const byId = new Map(items.map((w) => [w.id, w]));
  const memo = new Map<string, number>();
  const visiting = new Set<string>();

  function level(id: string): number {
    const w = byId.get(id);
    if (!w) return -1; // 미존재 선행은 관계 밖 취급
    if (memo.has(id)) return memo.get(id)!;
    if (visiting.has(id)) return 0; // 사이클 방어 — 무한루프 차단
    visiting.add(id);

    let result: number;
    if (w.status === "done") {
      result = -1; // 완료 = 관계 밖
    } else if (w.status === "review") {
      result = 0; // 리뷰 대기 = 최우선
    } else {
      // 미착수 = max(미완료 선행 레벨) + 1, 미완료 선행 없으면 0
      const incompleteDepLevels = w.dependsOn
        .map((d) => byId.get(d))
        .filter((dep): dep is WorkItem => dep != null && dep.status !== "done")
        .map((dep) => level(dep.id));
      const maxDep = incompleteDepLevels.length
        ? Math.max(...incompleteDepLevels)
        : -1;
      result = maxDep + 1;
    }
    visiting.delete(id);
    memo.set(id, result);
    return result;
  }

  for (const w of items) level(w.id);
  return memo;
}

/** 레벨별 버킷팅 → 오름차순 Wave (미완료·level>=0 만) */
export function deriveWaves(items: WorkItem[] = WORK_ITEMS): Wave[] {
  const levels = workItemLevels(items);
  const buckets = new Map<number, WorkItem[]>();
  for (const w of items) {
    const lv = levels.get(w.id) ?? -1;
    if (lv < 0) continue; // 완료 항목 제외
    if (!buckets.has(lv)) buckets.set(lv, []);
    buckets.get(lv)!.push(w);
  }
  const sortedLevels = [...buckets.keys()].sort((a, b) => a - b);
  return sortedLevels.map((lv, i) => ({
    index: i + 1,
    level: lv,
    startDate: addDays(DAY1_ANCHOR, lv),
    items: buckets.get(lv)!.sort((a, b) => a.id.localeCompare(b.id)),
  }));
}

/** 한 작업의 "차단 선행" = 아직 완료되지 않은 선행 id */
export function blockingDeps(
  item: WorkItem,
  items: WorkItem[] = WORK_ITEMS,
): string[] {
  const byId = new Map(items.map((w) => [w.id, w]));
  return item.dependsOn.filter((d) => {
    const dep = byId.get(d);
    return dep != null && dep.status !== "done";
  });
}
