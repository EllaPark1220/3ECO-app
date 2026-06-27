import Link from "next/link";
import { Tile, TileIntro, SectionTitle } from "../_components/shell";
import DiagramModal from "../_components/DiagramModal";
import { GanttDiagram, WorkStatusLegend } from "../_components/Diagrams";
import { WorkStatusBadge } from "../_components/StatusBadge";
import { deriveWaves, blockingDeps, DAY1_ANCHOR } from "@/playboard/derive/waves";
import { WORK_ITEMS } from "@/playboard/registry/work-items";

export default function SchedulePage() {
  const waves = deriveWaves();
  const remaining = WORK_ITEMS.filter((w) => w.status !== "done").length;

  return (
    <>
      <Tile wide>
        <TileIntro eyebrow="일정표" title="병렬 구현 일정 (Wave)">
          작업 DAG에서 파생한 <strong>Wave(동시 착수 가능 묶음)</strong>. 같은 Wave는
          서로 무의존이라 병렬 착수 가능하다. 시작일은 Day1 기준 {DAY1_ANCHOR} 가정의
          추정이며, DAG는{" "}
          <Link href="/playboard/plan" className="text-accent-deep underline">
            실행 계획
          </Link>
          에서 본다.
        </TileIntro>
        <DiagramModal title="병렬 일정 Gantt" legend={<WorkStatusLegend />}>
          <GanttDiagram />
        </DiagramModal>
      </Tile>

      <Tile wide band="alt">
        <SectionTitle>Wave별 착수 계획 (잔여 {remaining}건)</SectionTitle>
        <div className="flex flex-col gap-6">
          {waves.map((wave) => (
            <div key={wave.index}>
              <div className="font-mono text-[11px] tracking-[0.1em] text-accent-deep font-semibold uppercase mb-2.5">
                Wave {wave.index} · 시작 가능 {wave.startDate} · {wave.items.length}건 병렬
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {wave.items.map((item) => {
                  const blocking = blockingDeps(item);
                  return (
                    <div
                      key={item.id}
                      className="rounded-[12px] border border-line-light bg-white p-4"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-[11px] font-semibold text-text-main">
                          {item.id}
                          {item.externalRefs && (
                            <span className="text-text-mute ml-1">
                              {item.externalRefs}
                            </span>
                          )}
                        </span>
                        <WorkStatusBadge status={item.status} />
                      </div>
                      <div className="font-sans text-[13.5px] text-text-main leading-snug mb-2">
                        {item.title}
                      </div>
                      <div className="font-mono text-[10.5px] mb-2">
                        {blocking.length === 0 ? (
                          <span className="text-accent-main">
                            차단 선행 없음 — 즉시 착수 가능
                          </span>
                        ) : (
                          <span className="text-status-draft">
                            선행 대기: {blocking.join(", ")}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.screens.map((k) => (
                          <Link
                            key={k}
                            href={`/playboard/spec/${k}`}
                            className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-water-card text-accent-deep hover:bg-water-mid/40"
                          >
                            {k}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {waves.length === 0 && (
            <p className="font-sans text-[13.5px] text-text-mute italic">
              잔여 작업이 없습니다. 모든 작업이 완료 상태입니다.
            </p>
          )}
        </div>
      </Tile>
    </>
  );
}
