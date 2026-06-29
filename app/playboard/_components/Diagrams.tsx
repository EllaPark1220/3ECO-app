// 파생 다이어그램 (레지스트리 → HTML/CSS, mermaid 비의존).
// DAG: 위상 레벨 컬럼. Gantt: Wave 일(day) 막대. 둘 다 작업 레지스트리에서 파생.
import { WORK_ITEMS } from "@/playboard/registry/work-items";
import { workItemLevels, deriveWaves, addDays, DAY1_ANCHOR } from "@/playboard/derive/waves";
import { getWorkStatus } from "@/playboard/registry/statuses";
import { WORK_STATUS_COLOR } from "./status-tokens";
import type { WorkItem } from "@/playboard/types";

function Node({ item }: { item: WorkItem }) {
  const color = WORK_STATUS_COLOR[item.status];
  const meta = getWorkStatus(item.status);
  return (
    <div
      className="rounded-lg border bg-white px-2.5 py-2 min-w-[150px] max-w-[180px]"
      style={{ borderColor: `color-mix(in srgb, ${color} 45%, transparent)` }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span
          aria-hidden
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="font-mono text-[10px] font-semibold text-text-main">
          {item.id}
        </span>
        <span className="font-mono text-[9px] ml-auto" style={{ color }}>
          {meta?.label}
        </span>
      </div>
      <div className="font-sans text-[12px] text-text-main leading-tight">
        {item.title}
      </div>
      {item.dependsOn.length > 0 && (
        <div className="font-mono text-[9px] text-text-mute mt-1">
          ← {item.dependsOn.join(", ")}
        </div>
      )}
    </div>
  );
}

/** 의존성 DAG — 위상 레벨별 컬럼 (완료=관계 밖 컬럼 포함) */
export function DagDiagram() {
  const levels = workItemLevels();
  const buckets = new Map<number, WorkItem[]>();
  for (const w of WORK_ITEMS) {
    const lv = levels.get(w.id) ?? -1;
    if (!buckets.has(lv)) buckets.set(lv, []);
    buckets.get(lv)!.push(w);
  }
  const sortedLevels = [...buckets.keys()].sort((a, b) => a - b);

  return (
    <div className="flex gap-3 items-start overflow-x-auto pb-2">
      {sortedLevels.map((lv, i) => {
        const header =
          lv < 0
            ? "완료 · 관계 밖"
            : `Wave ${sortedLevels.filter((x) => x >= 0 && x <= lv).length} · ${addDays(DAY1_ANCHOR, lv)}`;
        return (
          <div key={lv} className="flex items-start gap-3 shrink-0">
            <div className="flex flex-col gap-2">
              <div className="font-mono text-[10px] tracking-[0.08em] text-accent-deep uppercase font-semibold pb-1 border-b border-line-light">
                {header}
              </div>
              {buckets
                .get(lv)!
                .sort((a, b) => a.id.localeCompare(b.id))
                .map((w) => (
                  <Node key={w.id} item={w} />
                ))}
            </div>
            {i < sortedLevels.length - 1 && (
              <div className="self-center text-text-mute text-lg pt-6">→</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** 병렬 일정 Gantt — Wave 별 day 막대 */
export function GanttDiagram() {
  const waves = deriveWaves();
  if (waves.length === 0)
    return <p className="text-text-mute text-[13px]">잔여 작업 없음.</p>;
  const maxDay = Math.max(...waves.map((w) => w.level)) + 1; // level 0 → day 1
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  return (
    <div className="min-w-[560px]">
      {/* day 축 */}
      <div
        className="grid items-end gap-1 mb-2"
        style={{ gridTemplateColumns: `200px repeat(${maxDay}, 1fr)` }}
      >
        <div />
        {days.map((d) => (
          <div key={d} className="text-center">
            <div className="font-mono text-[10px] text-text-main font-semibold">
              Day {d}
            </div>
            <div className="font-mono text-[9px] text-text-mute">
              {addDays(DAY1_ANCHOR, d - 1)}
            </div>
          </div>
        ))}
      </div>

      {waves.map((wave) => (
        <div key={wave.index} className="mb-3">
          <div className="font-mono text-[10px] tracking-[0.08em] text-accent-deep uppercase font-semibold mb-1">
            Wave {wave.index} · 시작 {wave.startDate} · {wave.items.length}건 병렬
          </div>
          {wave.items.map((item) => {
            const day = wave.level + 1; // 1-based
            const color = WORK_STATUS_COLOR[item.status];
            return (
              <div
                key={item.id}
                className="grid items-center gap-1 py-0.5"
                style={{ gridTemplateColumns: `200px repeat(${maxDay}, 1fr)` }}
              >
                <div className="font-sans text-[11.5px] text-text-main truncate pr-2">
                  <span className="font-mono text-[10px] text-text-mute mr-1">
                    {item.id}
                  </span>
                  {item.title}
                </div>
                {days.map((d) => (
                  <div key={d} className="h-5">
                    {d === day && (
                      <div
                        className="h-full rounded flex items-center px-1.5"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${color} 22%, transparent)`,
                          borderLeft: `3px solid ${color}`,
                        }}
                      >
                        <span className="font-mono text-[9px] text-text-main truncate">
                          {item.id}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** 상태 범례 (DAG/Gantt 공용) */
export function WorkStatusLegend() {
  return (
    <>
      {(["done", "review", "todo"] as const).map((s) => (
        <span key={s} className="inline-flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: WORK_STATUS_COLOR[s] }}
          />
          <span className="text-text-soft">{getWorkStatus(s)?.label}</span>
        </span>
      ))}
    </>
  );
}
