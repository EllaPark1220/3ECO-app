// 무결성 불변식 (스펙 §10) — 레지스트리 정합성을 코드로 강제.
// collectViolations() 가 빈 배열이면 green. fileExists 주입 시 위성 문서 경로까지 검증.
import { screenKey } from "./types";
import { SCREENS } from "./registry/screens";
import { WORK_ITEMS } from "./registry/work-items";
import { CONTROL_AREAS, CONTROL_AREA_IDS } from "./registry/control-areas";
import { FLOWS } from "./registry/flows";
import { PLANES } from "./registry/planes";
import { PHASE_ORDER } from "./registry/statuses";
import { TASK_FAMILY_TO_EPIC, taskFamily } from "./registry/task-epics";

export interface Violation {
  rule: string;
  detail: string;
}

export function collectViolations(opts?: {
  fileExists?: (path: string) => boolean;
  /** tasks/ 디렉터리의 파일명 목록 (주입 시 task→EPIC 커버리지 검증) */
  taskFiles?: string[];
}): Violation[] {
  const v: Violation[] = [];
  const screenKeys = new Set(SCREENS.map(screenKey));
  const workIds = new Set(WORK_ITEMS.map((w) => w.id));
  const planeIds = new Set(PLANES.map((p) => p.id));
  const areaIds = new Set(CONTROL_AREA_IDS as string[]);
  const systemSlugs = new Set(
    SCREENS.filter((s) => s.plane === "system").map((s) => s.slug),
  );

  // 1a. 화면의 workItems[] → 실재 작업 id
  for (const s of SCREENS) {
    for (const w of s.workItems) {
      if (!workIds.has(w)) {
        v.push({
          rule: "orphan-ref(screen→work)",
          detail: `${screenKey(s)} 의 workItem '${w}' 미존재`,
        });
      }
    }
  }
  // 1b. 작업의 screens[] → 실재 화면 키
  for (const w of WORK_ITEMS) {
    for (const k of w.screens) {
      if (!screenKeys.has(k)) {
        v.push({
          rule: "orphan-ref(work→screen)",
          detail: `${w.id} 의 screen '${k}' 미존재`,
        });
      }
    }
  }
  // 1c. 작업 dependsOn → 실재 작업 id
  for (const w of WORK_ITEMS) {
    for (const d of w.dependsOn) {
      if (!workIds.has(d)) {
        v.push({
          rule: "orphan-ref(work→dep)",
          detail: `${w.id} 의 dependsOn '${d}' 미존재`,
        });
      }
    }
  }

  // 2. 작업 DAG 비순환
  const cycle = findCycle(WORK_ITEMS);
  if (cycle) {
    v.push({ rule: "dag-cycle", detail: `사이클: ${cycle.join(" → ")}` });
  }

  // 3. exceptionStates[] = system 평면 실재 slug
  for (const s of SCREENS) {
    for (const ex of s.engineering.exceptionStates) {
      if (!systemSlugs.has(ex)) {
        v.push({
          rule: "exception-state",
          detail: `${screenKey(s)} 의 exceptionState '${ex}' 가 system 평면 slug 아님`,
        });
      }
    }
  }

  // 4. implemented/verified 화면은 implLocation 필수
  for (const s of SCREENS) {
    if (
      (s.status === "implemented" || s.status === "verified") &&
      !s.implLocation
    ) {
      v.push({
        rule: "impl-location",
        detail: `${screenKey(s)} 는 ${s.status} 이나 implLocation 없음`,
      });
    }
  }

  // 5. 흐름 screens[] = 같은 평면 실재 slug
  for (const f of FLOWS) {
    if (!planeIds.has(f.plane)) {
      v.push({ rule: "flow-plane", detail: `흐름 ${f.id} 평면 '${f.plane}' 미존재` });
    }
    for (const slug of f.screens) {
      const exists = SCREENS.some(
        (s) => s.plane === f.plane && s.slug === slug,
      );
      if (!exists) {
        v.push({
          rule: "flow-screen",
          detail: `흐름 ${f.id} 의 slug '${slug}' 가 평면 ${f.plane} 에 없음`,
        });
      }
    }
  }

  // 6. controlAreaNotes 키 = 정의된 영역 집합 내
  for (const s of SCREENS) {
    for (const key of Object.keys(s.engineering.controlAreaNotes)) {
      if (!areaIds.has(key)) {
        v.push({
          rule: "area-note-key",
          detail: `${screenKey(s)} 의 controlAreaNote 키 '${key}' 미정의 영역`,
        });
      }
    }
  }

  // 6b. 작업 phase 는 PHASE_ORDER 내
  for (const w of WORK_ITEMS) {
    if (!PHASE_ORDER.includes(w.phase)) {
      v.push({
        rule: "phase-order",
        detail: `${w.id} 의 phase '${w.phase}' 가 PHASE_ORDER 밖`,
      });
    }
  }

  // 7. 위성 기준 문서 경로 실재 (fileExists 주입 시)
  if (opts?.fileExists) {
    for (const a of CONTROL_AREAS) {
      for (const std of a.standards) {
        if (!opts.fileExists(std.path)) {
          v.push({
            rule: "standard-path",
            detail: `영역 ${a.area} 의 기준 문서 '${std.path}' 파일 없음`,
          });
        }
      }
    }
  }

  // 8. task → EPIC 커버리지 (taskFiles 주입 시) — SoT 이중화 금지의 기계 검증.
  //    모든 task 파일이 정확히 1개 EPIC 에 매핑되고, 매핑된 EPIC 이 실재하며,
  //    맵의 모든 패밀리가 실제 task 를 가진다(고아·dangling·stale 금지).
  if (opts?.taskFiles) {
    const usedFamilies = new Set<string>();
    for (const file of opts.taskFiles) {
      const fam = taskFamily(file);
      if (fam === null) continue; // 메타·인덱스 파일은 task 아님
      usedFamilies.add(fam);
      const epic = TASK_FAMILY_TO_EPIC[fam];
      if (!epic) {
        v.push({
          rule: "task-coverage(orphan-family)",
          detail: `task '${file}' 의 패밀리 '${fam}' 가 어떤 EPIC 에도 매핑 안 됨`,
        });
      } else if (!workIds.has(epic)) {
        v.push({
          rule: "task-coverage(dangling-epic)",
          detail: `패밀리 '${fam}' → EPIC '${epic}' 미존재`,
        });
      }
    }
    for (const fam of Object.keys(TASK_FAMILY_TO_EPIC)) {
      if (!usedFamilies.has(fam)) {
        v.push({
          rule: "task-coverage(stale-family)",
          detail: `맵의 패밀리 '${fam}' 에 해당하는 task 파일이 없음`,
        });
      }
    }
  }

  return v;
}

/** DFS 사이클 탐지 — 사이클 경로 반환(없으면 null) */
function findCycle(
  items: { id: string; dependsOn: string[] }[],
): string[] | null {
  const byId = new Map(items.map((w) => [w.id, w]));
  const state = new Map<string, 0 | 1 | 2>(); // 0=white 1=gray 2=black
  const stack: string[] = [];

  function dfs(id: string): string[] | null {
    const node = byId.get(id);
    if (!node) return null;
    state.set(id, 1);
    stack.push(id);
    for (const d of node.dependsOn) {
      const st = state.get(d) ?? 0;
      if (st === 1) {
        const from = stack.indexOf(d);
        return [...stack.slice(from), d];
      }
      if (st === 0) {
        const c = dfs(d);
        if (c) return c;
      }
    }
    stack.pop();
    state.set(id, 2);
    return null;
  }

  for (const w of items) {
    if ((state.get(w.id) ?? 0) === 0) {
      const c = dfs(w.id);
      if (c) return c;
    }
  }
  return null;
}
