import Link from "next/link";
import { notFound } from "next/navigation";
import { Tile, TileIntro, SectionTitle, Empty } from "../../../_components/shell";
import { ScreenStatusBadge, WorkStatusBadge } from "../../../_components/StatusBadge";
import { SpecList, SpecRow } from "../../../_components/SpecRow";
import { ScreenThumb } from "../../../_components/ScreenCard";
import { SCREENS, getScreen } from "@/playboard/registry/screens";
import { getWorkItem } from "@/playboard/registry/work-items";
import { getControlArea } from "@/playboard/registry/control-areas";

export function generateStaticParams() {
  return SCREENS.map((s) => ({ plane: s.plane, slug: s.slug }));
}

export default async function SpecPage({
  params,
}: {
  params: Promise<{ plane: string; slug: string }>;
}) {
  const { plane, slug } = await params;
  const screen = getScreen(plane, slug);
  if (!screen) notFound();

  const eng = screen.engineering;
  const works = screen.workItems
    .map(getWorkItem)
    .filter((w): w is NonNullable<typeof w> => w != null);
  const areaNotes = Object.entries(eng.controlAreaNotes);

  return (
    <>
      {/* 헤더 */}
      <Tile wide>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <TileIntro eyebrow={`기술 스펙 · ${plane}/${slug}`} title={screen.title}>
            {screen.flowNote}
            {screen.statusNote && (
              <div className="mt-1.5 text-[12.5px] text-status-draft">
                {screen.statusNote}
              </div>
            )}
          </TileIntro>
          <div className="flex items-center gap-3 pt-1">
            <ScreenStatusBadge status={screen.status} />
            <Link
              href={`/playboard/screens/${plane}/${slug}`}
              className="font-sans text-[13px] font-medium text-accent-deep hover:text-accent-main"
            >
              화면 데모 →
            </Link>
          </div>
        </div>
      </Tile>

      {/* 화면 계약 개요 + 캡처 */}
      <Tile wide band="alt">
        <SectionTitle>화면 계약</SectionTitle>
        <div className="grid md:grid-cols-2 gap-6">
          <SpecList>
            <SpecRow label="앱 라우트">
              <code className="font-mono text-[12px] text-accent-deep">
                {screen.route}
              </code>
            </SpecRow>
            <SpecRow label="디자인 분류">{screen.designSpecType}</SpecRow>
            <SpecRow label="구현 위치">
              {screen.implLocation ? (
                <code className="font-mono text-[12px] text-text-main">
                  {screen.implLocation}
                </code>
              ) : (
                <span className="text-text-mute italic">미구현</span>
              )}
            </SpecRow>
            <SpecRow label="요구사항 근거" items={screen.requirementRefs} />
          </SpecList>
          <div className="rounded-[14px] border border-line-light overflow-hidden bg-white">
            <ScreenThumb screen={screen} />
          </div>
        </div>
      </Tile>

      {/* 엔지니어링 제어 스펙 */}
      <Tile wide>
        <SectionTitle>엔지니어링 제어 스펙</SectionTitle>
        <SpecList>
          <SpecRow label="인가 게이트">{eng.authGate}</SpecRow>
          <SpecRow label="클라이언트 동작" items={eng.clientActions} />
          <SpecRow label="서버 동작" items={eng.serverActions} />
          <SpecRow label="데이터 읽기" items={eng.dataReads} empty="없음" />
          <SpecRow label="데이터 쓰기" items={eng.dataWrites} empty="없음" />
          <SpecRow label="계측 이벤트" items={eng.telemetryEvents} empty="수집 없음" />
          <SpecRow label="예외 상태">
            {eng.exceptionStates.length ? (
              <span className="flex flex-wrap gap-2">
                {eng.exceptionStates.map((ex) => (
                  <Link
                    key={ex}
                    href={`/playboard/spec/system/${ex}`}
                    className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-water-card text-accent-deep hover:bg-water-mid/40"
                  >
                    {ex}
                  </Link>
                ))}
              </span>
            ) : (
              <span className="text-text-mute italic">없음</span>
            )}
          </SpecRow>
        </SpecList>

        {/* 제어 영역 관심사 */}
        <div className="mt-5">
          <div className="font-mono text-[10px] uppercase text-text-mute mb-2">
            제어 영역 관심사
          </div>
          {areaNotes.length ? (
            <div className="grid md:grid-cols-2 gap-3">
              {areaNotes.map(([areaId, note]) => {
                const ca = getControlArea(areaId);
                return (
                  <div
                    key={areaId}
                    className="rounded-[10px] border border-line-light bg-white p-3"
                  >
                    <Link
                      href={`/playboard/control-area/${areaId}`}
                      className="font-mono text-[11px] font-semibold text-accent-deep uppercase hover:text-accent-main"
                    >
                      {ca?.area ?? areaId}
                    </Link>
                    <div className="font-sans text-[12.5px] text-text-soft mt-1 leading-[1.6]">
                      {note}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty>이 화면이 다루는 제어 영역 요점 없음.</Empty>
          )}
        </div>
      </Tile>

      {/* 연결된 작업 */}
      <Tile wide band="alt">
        <SectionTitle>연결된 작업 ({works.length})</SectionTitle>
        {works.length ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {works.map((w) => (
              <div
                key={w.id}
                className="rounded-[10px] border border-line-light bg-white p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[11px] text-text-main">
                    {w.id}
                  </span>
                  <WorkStatusBadge status={w.status} />
                </div>
                <div className="font-sans text-[13px] text-text-main">
                  {w.title}
                </div>
                <code className="font-mono text-[10.5px] text-text-mute">
                  {w.doc}
                </code>
              </div>
            ))}
          </div>
        ) : (
          <Empty>연결된 작업 없음.</Empty>
        )}
      </Tile>
    </>
  );
}
