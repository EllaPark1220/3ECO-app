import Link from "next/link";
import { notFound } from "next/navigation";
import { Tile, TileIntro, SectionTitle, Empty } from "../../_components/shell";
import { WorkStatusBadge } from "../../_components/StatusBadge";
import { CONTROL_AREAS, getControlArea } from "@/playboard/registry/control-areas";
import { screensCoveringArea } from "@/playboard/derive/counts";
import { getWorkItem } from "@/playboard/registry/work-items";

export function generateStaticParams() {
  return CONTROL_AREAS.map((a) => ({ area: a.area }));
}

export default async function ControlAreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area } = await params;
  const ca = getControlArea(area);
  if (!ca) notFound();

  const covering = screensCoveringArea(ca.area);
  const relatedWork = ca.workItems
    .map(getWorkItem)
    .filter((w): w is NonNullable<typeof w> => w != null);

  return (
    <>
      {/* 1 개요 */}
      <Tile wide>
        <TileIntro eyebrow={`제어 영역 · ${ca.area}`} title={ca.goal}>
          {ca.summary}
        </TileIntro>
      </Tile>

      {/* 2 확정 정책 */}
      <Tile wide band="alt">
        <SectionTitle>확정 정책 (결정 잠김)</SectionTitle>
        <p className="font-sans text-[12.5px] text-text-soft mb-3">
          이 목록이 단일 기준이다.
        </p>
        {ca.policies.length ? (
          <div className="grid md:grid-cols-2 gap-3">
            {ca.policies.map((p, i) => (
              <div
                key={i}
                className="rounded-[12px] border border-line-light bg-white p-4 flex gap-3"
              >
                <span className="w-6 h-6 shrink-0 rounded-full bg-accent-soft text-text-main font-mono text-[11px] font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <div className="font-sans text-[13.5px] font-semibold text-text-main mb-1">
                    {p.statement}
                  </div>
                  <div className="font-sans text-[12.5px] text-text-soft leading-[1.6]">
                    {p.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty>확정된 정책 없음.</Empty>
        )}
      </Tile>

      {/* 3 운영 결정값 + 기준 문서 */}
      <Tile wide>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <SectionTitle>운영 결정값</SectionTitle>
            {ca.decisions.length ? (
              <dl className="divide-y divide-line-soft">
                {ca.decisions.map((d, i) => (
                  <div key={i} className="flex justify-between gap-4 py-2">
                    <dt className="font-mono text-[11px] text-text-mute uppercase">
                      {d.name}
                    </dt>
                    <dd className="font-sans text-[13px] text-text-main text-right">
                      {d.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <Empty>고정된 결정값 없음.</Empty>
            )}
          </div>
          <div>
            <SectionTitle>기준 문서</SectionTitle>
            {ca.standards.length ? (
              <ul className="space-y-2 mb-4">
                {ca.standards.map((s, i) => (
                  <li key={i} className="font-sans text-[13px]">
                    <span className="text-text-main">{s.title}</span>
                    <code className="block font-mono text-[11px] text-accent-deep">
                      {s.path}
                    </code>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>연결된 기준 문서 없음.</Empty>
            )}
            <div className="rounded-[10px] bg-water-card/60 border border-line-light p-3 font-sans text-[11.5px] text-text-soft leading-[1.6]">
              <strong className="text-accent-deep">PlayBoard 싱크 규칙:</strong> 기준
              문서 ↔ 레지스트리는 같은 PR에서 양쪽을 갱신하고 문서 상단에 이중 고지한다.
            </div>
          </div>
        </div>
      </Tile>

      {/* 4 대응 화면 + 관련 작업 */}
      <Tile wide band="alt">
        <SectionTitle>대응 화면 + 관련 작업</SectionTitle>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase text-text-mute mb-2">
              대응 화면 ({covering.length})
            </div>
            <div className="flex flex-col gap-2">
              {covering.length ? (
                covering.map((s) => (
                  <div
                    key={`${s.plane}/${s.slug}`}
                    className="rounded-[10px] border border-line-light bg-white p-3"
                  >
                    <Link
                      href={`/playboard/spec/${s.plane}/${s.slug}`}
                      className="font-sans text-[13px] font-medium text-text-main hover:text-accent-deep"
                    >
                      {s.title}
                    </Link>
                    <div className="font-sans text-[12px] text-text-soft mt-0.5">
                      {s.engineering.controlAreaNotes[ca.area]}
                    </div>
                  </div>
                ))
              ) : (
                <Empty>이 영역 요점을 가진 화면 없음.</Empty>
              )}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase text-text-mute mb-2">
              관련 작업 ({relatedWork.length})
            </div>
            <div className="flex flex-col gap-2">
              {relatedWork.length ? (
                relatedWork.map((w) => (
                  <div
                    key={w.id}
                    className="rounded-[10px] border border-line-light bg-white p-3 flex items-center gap-2"
                  >
                    <span className="font-mono text-[11px] text-text-main">
                      {w.id}
                    </span>
                    <WorkStatusBadge status={w.status} />
                    <span className="font-sans text-[12.5px] text-text-soft">
                      {w.title}
                    </span>
                  </div>
                ))
              ) : (
                <Empty>연결된 작업 없음.</Empty>
              )}
            </div>
          </div>
        </div>
      </Tile>

      {/* 5 미해소 갭 */}
      <Tile wide>
        <SectionTitle>미해소 갭</SectionTitle>
        <p className="font-sans text-[12.5px] text-text-soft mb-3">
          해소되면 확정 정책·결정값으로 승격하고 이 목록에서 제거한다(줄어드는 방향이 정상).
        </p>
        {ca.gaps.length ? (
          <ul className="rounded-[12px] border-l-[3px] border-l-status-draft bg-status-draft/5 p-4 space-y-1.5">
            {ca.gaps.map((g, i) => (
              <li
                key={i}
                className="font-sans text-[13.5px] text-text-main leading-[1.6] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-status-draft"
              >
                {g}
              </li>
            ))}
          </ul>
        ) : (
          <Empty>미해소 갭 없음.</Empty>
        )}
      </Tile>
    </>
  );
}
