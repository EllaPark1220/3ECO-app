import { describe, it, expect } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { collectViolations } from "../integrity";
import { SCREENS } from "../registry/screens";
import { WORK_ITEMS } from "../registry/work-items";
import { CONTROL_AREAS } from "../registry/control-areas";
import {
  deriveWaves,
  workItemLevels,
  blockingDeps,
} from "../derive/waves";
import { screenStatusCounts, allAreaCoverage } from "../derive/counts";
import { sortScreens, nextSort } from "../derive/sort";

const fileExists = (p: string) => existsSync(resolve(process.cwd(), p));
const taskFiles = (() => {
  try {
    return readdirSync(resolve(process.cwd(), "tasks"));
  } catch {
    return [];
  }
})();

describe("PlayBoard 무결성 불변식 (스펙 §10)", () => {
  it("위반이 0건이어야 한다 (위성 문서 경로 + task 커버리지 포함)", () => {
    const violations = collectViolations({ fileExists, taskFiles });
    expect(
      violations,
      "위반:\n" + violations.map((v) => `- [${v.rule}] ${v.detail}`).join("\n"),
    ).toEqual([]);
  });

  it("모든 task 가 정확히 1개 EPIC 에 매핑된다 (SoT 이중화 금지)", () => {
    expect(taskFiles.length, "tasks/ 디렉터리가 비어있음").toBeGreaterThan(0);
    const cov = collectViolations({ taskFiles }).filter((v) =>
      v.rule.startsWith("task-coverage"),
    );
    expect(
      cov,
      "task 커버리지 위반:\n" + cov.map((v) => `- [${v.rule}] ${v.detail}`).join("\n"),
    ).toEqual([]);
  });

  it("모든 화면의 engineering 계약이 정의돼 있다", () => {
    for (const s of SCREENS) {
      expect(s.engineering, `${s.plane}/${s.slug}`).toBeDefined();
      expect(typeof s.engineering.authGate).toBe("string");
      expect(s.engineering.authGate.length).toBeGreaterThan(0);
    }
  });

  it("작업 DAG가 비순환이다", () => {
    const cyc = collectViolations().filter((v) => v.rule === "dag-cycle");
    expect(cyc).toEqual([]);
  });
});

describe("파생 알고리즘 (스펙 §7)", () => {
  it("Wave 파생: 완료 항목 제외, 레벨 오름차순", () => {
    const waves = deriveWaves();
    expect(waves.length).toBeGreaterThan(0);
    // 완료(done) 작업은 어떤 wave 에도 없어야 한다
    const doneIds = new Set(
      WORK_ITEMS.filter((w) => w.status === "done").map((w) => w.id),
    );
    for (const wave of waves) {
      for (const it of wave.items) {
        expect(doneIds.has(it.id)).toBe(false);
      }
    }
    // 레벨 오름차순
    const levels = waves.map((w) => w.level);
    expect(levels).toEqual([...levels].sort((a, b) => a - b));
  });

  it("Wave: 같은 wave 안 항목은 서로 의존하지 않는다(병렬)", () => {
    const waves = deriveWaves();
    for (const wave of waves) {
      const ids = new Set(wave.items.map((i) => i.id));
      for (const it of wave.items) {
        for (const d of it.dependsOn) {
          expect(ids.has(d)).toBe(false);
        }
      }
    }
  });

  it("위상 레벨: done=-1, review=0, todo=선행+1", () => {
    const levels = workItemLevels();
    expect(levels.get("W01")).toBe(-1); // done
    expect(levels.get("W10")).toBe(0); // todo, 선행 W06(done) → 0
    expect(levels.get("W12")).toBe(1); // todo, 선행 W10(todo,0) → 1
  });

  it("blockingDeps: 미완료 선행만", () => {
    const w11 = WORK_ITEMS.find((w) => w.id === "W11")!;
    // W11 deps: W10(todo) · W03(done) · W05(done) → 차단은 W10 만
    expect(blockingDeps(w11)).toEqual(["W10"]);
  });

  it("상태 카운트는 전체 화면 수와 합치한다", () => {
    const counts = screenStatusCounts();
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(SCREENS.length);
  });

  it("영역 커버리지는 모든 영역에서 ≥1 (커버리지 건강도)", () => {
    const cov = allAreaCoverage();
    for (const a of CONTROL_AREAS) {
      expect(cov[a.area], `영역 ${a.area}`).toBeGreaterThanOrEqual(1);
    }
  });

  it("매트릭스 정렬: status asc 는 진행 순위 오름차순, 토글 동작", () => {
    const sorted = sortScreens(SCREENS, "status", "asc");
    expect(sorted.length).toBe(SCREENS.length);
    // 토글: 같은 키 → 방향 반전
    const n = nextSort({ key: "status", dir: "asc" }, "status");
    expect(n).toEqual({ key: "status", dir: "desc" });
    // 다른 키 → asc
    const m = nextSort({ key: "status", dir: "asc" }, "title");
    expect(m).toEqual({ key: "title", dir: "asc" });
  });
});
