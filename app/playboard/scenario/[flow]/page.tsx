import Link from "next/link";
import { notFound } from "next/navigation";
import { Tile, TileIntro } from "../../_components/shell";
import { ScreenStatusBadge } from "../../_components/StatusBadge";
import { ScreenThumb } from "../../_components/ScreenCard";
import { FLOWS, getFlow, sequenceFlows } from "@/playboard/registry/flows";
import { getControlArea } from "@/playboard/registry/control-areas";
import { flowScreens } from "../../_components/helpers";

export function generateStaticParams() {
  // 순차 흐름 전용
  return sequenceFlows().map((f) => ({ flow: f.id }));
}

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ flow: string }>;
}) {
  const { flow } = await params;
  const f = getFlow(flow);
  if (!f || f.kind !== "sequence") notFound();

  const screens = flowScreens(f);
  const others = FLOWS.filter((x) => x.id !== f.id);

  return (
    <>
      <Tile wide>
        <TileIntro eyebrow={`시나리오 · ${f.title}`} title="기획·구현 walkthrough">
          {f.description}
        </TileIntro>
      </Tile>

      <Tile wide band="alt">
        <div className="flex flex-col gap-5">
          {screens.map((s, i) => {
            const eng = s.engineering;
            const areaIds = Object.keys(eng.controlAreaNotes);
            return (
              <div
                key={`${s.plane}/${s.slug}`}
                className="rounded-[14px] border border-line-light bg-white overflow-hidden grid md:grid-cols-2"
              >
                {/* 좌: 캡처 */}
                <div className="flex flex-col">
                  <div className="px-4 pt-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.1em] text-accent-deep uppercase font-semibold">
                      {f.title} · {i + 1}단계
                    </span>
                    <code className="font-mono text-[10.5px] text-text-mute">
                      {s.route}
                    </code>
                  </div>
                  <div className="p-4">
                    <ScreenThumb screen={s} />
                  </div>
                </div>

                {/* 우: 사양 */}
                <div className="p-4 border-t md:border-t-0 md:border-l border-line-light">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-serif font-semibold text-[16px] text-text-main">
                      {s.title}
                    </h3>
                    <ScreenStatusBadge status={s.status} />
                  </div>
                  <p className="font-sans text-[12.5px] text-text-soft leading-[1.6] mb-3">
                    {s.flowNote}
                    {s.statusNote && (
                      <span className="block text-status-draft mt-0.5">
                        {s.statusNote}
                      </span>
                    )}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <MiniBox title="클라이언트 동작" items={eng.clientActions} />
                    <MiniBox title="서버 동작" items={eng.serverActions} />
                  </div>

                  <div className="font-mono text-[10.5px] text-text-soft mb-2">
                    인가: {eng.authGate} · 읽기 {eng.dataReads.length} · 쓰기{" "}
                    {eng.dataWrites.length} · 이벤트 {eng.telemetryEvents.length}
                  </div>
                  <div className="font-mono text-[10.5px] text-text-mute mb-3">
                    {s.designSpecType} · {s.implLocation ?? "미구현"}
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-line-soft">
                    <span className="flex flex-wrap gap-1.5">
                      {areaIds.map((a) => (
                        <Link
                          key={a}
                          href={`/playboard/control-area/${a}`}
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-water-card text-accent-deep hover:bg-water-mid/40"
                        >
                          {getControlArea(a)?.area ?? a}
                        </Link>
                      ))}
                    </span>
                    <Link
                      href={`/playboard/spec/${s.plane}/${s.slug}`}
                      className="font-sans text-[12px] font-semibold text-accent-deep hover:text-accent-main"
                    >
                      기술 스펙 상세 →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Tile>

      <Tile wide>
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href={`/playboard/ux-flow/${f.id}`}
            className="font-sans text-[13px] font-medium text-accent-deep hover:text-accent-main"
          >
            이 흐름 데스크톱 오버뷰 →
          </Link>
          {others.map((o) => (
            <Link
              key={o.id}
              href={`/playboard/scenario/${o.id}`}
              className="font-sans text-[12.5px] text-text-soft hover:text-text-main"
            >
              {o.title}
            </Link>
          ))}
        </div>
      </Tile>
    </>
  );
}

function MiniBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[8px] bg-water-card/40 p-2.5">
      <div className="font-mono text-[9px] uppercase text-text-mute mb-1">
        {title}
      </div>
      {items.length ? (
        <ul className="space-y-0.5">
          {items.map((it, i) => (
            <li key={i} className="font-sans text-[11px] text-text-soft leading-tight">
              • {it}
            </li>
          ))}
        </ul>
      ) : (
        <span className="font-sans text-[11px] text-text-mute italic">없음</span>
      )}
    </div>
  );
}
