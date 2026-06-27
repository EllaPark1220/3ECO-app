import Link from "next/link";
import { Tile, TileIntro, SectionTitle, Empty } from "../_components/shell";
import DiagramModal from "../_components/DiagramModal";
import { DagDiagram, WorkStatusLegend } from "../_components/Diagrams";
import { WorkStatusBadge } from "../_components/StatusBadge";
import { WORK_ITEMS } from "@/playboard/registry/work-items";
import { PHASE_ORDER } from "@/playboard/registry/statuses";
import { getScreenByKey } from "@/playboard/registry/screens";

export default function PlanPage() {
  return (
    <>
      <Tile wide>
        <TileIntro
          eyebrow="실행 계획"
          title="작업 항목 의존성 DAG"
        >
          총 {WORK_ITEMS.length}개 작업. 작업 레지스트리에서 파생한 살아있는 계획이며,
          일정 추정은{" "}
          <Link href="/playboard/schedule" className="text-accent-deep underline">
            일정표
          </Link>
          에서 본다.
        </TileIntro>
        <DiagramModal title="작업 의존성 DAG" legend={<WorkStatusLegend />}>
          <DagDiagram />
        </DiagramModal>
      </Tile>

      <Tile wide band="alt">
        <SectionTitle>단계별 현황</SectionTitle>
        <div className="flex flex-col gap-6">
          {PHASE_ORDER.map((phase) => {
            const items = WORK_ITEMS.filter((w) => w.phase === phase);
            if (items.length === 0) return null;
            return (
              <div key={phase}>
                <div className="font-mono text-[11px] tracking-[0.1em] text-accent-deep font-semibold uppercase mb-2">
                  {phase}
                </div>
                <div className="overflow-x-auto rounded-[12px] border border-line-light">
                  <table className="w-full text-left min-w-[560px] border-collapse">
                    <thead>
                      <tr className="border-b border-line-light bg-water-card/40 font-mono text-[10px] uppercase text-text-mute">
                        <th className="p-2.5">항목</th>
                        <th className="p-2.5">제목</th>
                        <th className="p-2.5">상태</th>
                        <th className="p-2.5">선행</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((w) => {
                        const firstScreen =
                          w.screens.length > 0
                            ? getScreenByKey(w.screens[0])
                            : undefined;
                        return (
                          <tr
                            key={w.id}
                            className="border-b border-line-soft last:border-0"
                          >
                            <td className="p-2.5 font-mono text-[11px] text-text-main">
                              {w.id}
                              {w.externalRefs && (
                                <span className="text-text-mute ml-1">
                                  {w.externalRefs}
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 font-sans text-[13px]">
                              {firstScreen ? (
                                <Link
                                  href={`/playboard/spec/${firstScreen.plane}/${firstScreen.slug}`}
                                  className="text-text-main hover:text-accent-deep"
                                >
                                  {w.title}
                                </Link>
                              ) : (
                                <span className="text-text-main">{w.title}</span>
                              )}
                            </td>
                            <td className="p-2.5">
                              <WorkStatusBadge status={w.status} />
                            </td>
                            <td className="p-2.5 font-mono text-[11px] text-text-mute">
                              {w.dependsOn.length ? w.dependsOn.join(", ") : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
          {WORK_ITEMS.length === 0 && <Empty>작업 항목 없음.</Empty>}
        </div>
      </Tile>
    </>
  );
}
