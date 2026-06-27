import Link from "next/link";
import { Tile, TileIntro, SectionTitle } from "./_components/shell";
import ScreenBoard from "./_components/ScreenBoard";
import { ScreenStatusBadge, WorkStatusBadge } from "./_components/StatusBadge";
import { SCREENS } from "@/playboard/registry/screens";
import { WORK_ITEMS } from "@/playboard/registry/work-items";
import { CONTROL_AREAS } from "@/playboard/registry/control-areas";
import { SCREEN_STATUSES, WORK_STATUSES } from "@/playboard/registry/statuses";
import { sequenceFlows, FLOWS } from "@/playboard/registry/flows";
import {
  screenStatusCounts,
  workStatusCounts,
  areaCoverage,
} from "@/playboard/derive/counts";
import { deriveWaves } from "@/playboard/derive/waves";
import { flowScreens } from "./_components/helpers";

const PURPOSES = [
  "통합형 단일 명세서 — 기획·구현·기술 계약이 화면 단위로 한 곳에.",
  "살아있는 상황판 — 이슈·구현 현황을 실시간으로.",
  "mission-critical 기술 스펙 허브 — 횡단 정책을 한 곳에 잠금.",
  "PM·회의 도구 — 별도 회의자료 없이 보드가 곧 안건.",
  "실 코드 기반 아이덴티티 샘플 — 데모가 곧 디자인 증거.",
];

export default function PlayBoardIndex() {
  const sCounts = screenStatusCounts();
  const wCounts = workStatusCounts();
  const waves = deriveWaves();
  const nextWave = waves[0];

  return (
    <>
      {/* 타일1: 히어로 */}
      <Tile wide>
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8">
          <div>
            <TileIntro
              eyebrow="PlayBoard · 단일 진실 공급원"
              title="고요의 경제나루 — 기획·구현 상황판"
            >
              레지스트리 한 곳에서 모든 표면을 파생한다. 두 곳을 손으로 맞추지 않는다.
            </TileIntro>
            <ul className="mt-4 space-y-1.5">
              {PURPOSES.map((p, i) => (
                <li
                  key={i}
                  className="font-sans text-[13.5px] text-text-soft leading-[1.7] pl-5 relative before:content-['·'] before:absolute before:left-1 before:text-accent-main before:font-bold"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <aside className="bg-water-card/50 rounded-[14px] p-5 border border-line-light">
            <div className="font-mono text-[10px] tracking-[0.2em] text-accent-deep font-semibold uppercase mb-3">
              UX Flow
            </div>
            <div className="flex flex-col gap-2.5">
              {FLOWS.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="font-serif text-[14px] text-text-main">
                    {f.title}
                    {f.kind === "set" && (
                      <span className="font-mono text-[9px] text-text-mute ml-1">
                        (예외)
                      </span>
                    )}
                  </span>
                  <span className="flex gap-1.5 shrink-0">
                    <Link
                      href={`/playboard/ux-flow/${f.id}`}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-line-light text-accent-deep hover:border-accent-soft"
                    >
                      데스크톱
                    </Link>
                    <Link
                      href={`/playboard/mobile-flow/${f.id}`}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-line-light text-accent-deep hover:border-accent-soft"
                    >
                      모바일
                    </Link>
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </Tile>

      {/* 타일2: 구현 상황판 일반 — 3 요약 카드 */}
      <Tile wide band="alt">
        <SectionTitle>구현 상황판</SectionTitle>
        <div className="grid md:grid-cols-3 gap-4">
          {/* 화면 */}
          <Link
            href="/playboard/implement-summary"
            className="rounded-[14px] border border-line-light bg-white p-5 hover:shadow-[0_8px_24px_-12px_rgba(13,95,109,0.25)] transition-shadow"
          >
            <div className="font-mono text-[10px] tracking-[0.15em] text-text-mute uppercase mb-1">
              화면
            </div>
            <div className="font-serif text-[28px] text-text-main font-bold mb-2">
              {SCREENS.length}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SCREEN_STATUSES.map((st) => (
                <span key={st.id} className="inline-flex items-center gap-1">
                  <ScreenStatusBadge status={st.id} />
                  <span className="font-mono text-[11px] text-text-soft">
                    {sCounts[st.id]}
                  </span>
                </span>
              ))}
            </div>
            <div className="mt-3 font-sans text-[12px] text-accent-deep">
              구현 통계 매트릭스 →
            </div>
          </Link>

          {/* 작업 */}
          <Link
            href="/playboard/plan"
            className="rounded-[14px] border border-line-light bg-white p-5 hover:shadow-[0_8px_24px_-12px_rgba(13,95,109,0.25)] transition-shadow"
          >
            <div className="font-mono text-[10px] tracking-[0.15em] text-text-mute uppercase mb-1">
              작업
            </div>
            <div className="font-serif text-[28px] text-text-main font-bold mb-2">
              {WORK_ITEMS.length}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {WORK_STATUSES.map((st) => (
                <span key={st.id} className="inline-flex items-center gap-1">
                  <WorkStatusBadge status={st.id} />
                  <span className="font-mono text-[11px] text-text-soft">
                    {wCounts[st.id]}
                  </span>
                </span>
              ))}
            </div>
            <div className="mt-3 font-sans text-[12px] text-accent-deep">
              실행 계획(DAG) →
            </div>
          </Link>

          {/* 일정 */}
          <Link
            href="/playboard/schedule"
            className="rounded-[14px] border border-line-light bg-white p-5 hover:shadow-[0_8px_24px_-12px_rgba(13,95,109,0.25)] transition-shadow"
          >
            <div className="font-mono text-[10px] tracking-[0.15em] text-text-mute uppercase mb-1">
              병렬 일정표
            </div>
            <div className="font-serif text-[28px] text-text-main font-bold mb-2">
              {waves.length} <span className="text-[14px] font-normal">waves</span>
            </div>
            {nextWave ? (
              <div className="font-sans text-[12px] text-text-soft">
                다음 Wave {nextWave.index} · {nextWave.startDate}
                <div className="font-mono text-[11px] text-text-mute mt-0.5">
                  {nextWave.items.map((i) => i.id).join(", ")}
                </div>
              </div>
            ) : (
              <div className="font-sans text-[12px] text-text-mute italic">
                잔여 작업 없음
              </div>
            )}
            <div className="mt-3 font-sans text-[12px] text-accent-deep">
              일정표 →
            </div>
          </Link>
        </div>
      </Tile>

      {/* 타일3: 제어 영역 요약 */}
      <Tile wide>
        <SectionTitle>제어 영역</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CONTROL_AREAS.map((a) => {
            const covered = areaCoverage(a.area);
            return (
              <Link
                key={a.area}
                href={`/playboard/control-area/${a.area}`}
                className="rounded-[12px] border border-line-light bg-white p-4 hover:border-accent-soft transition-colors"
              >
                <div className="font-mono text-[12px] font-semibold text-accent-deep uppercase mb-1">
                  {a.area}
                </div>
                <div className="font-sans text-[12px] text-text-soft leading-snug mb-2 line-clamp-2">
                  {a.goal}
                </div>
                <div className="font-mono text-[10.5px] text-text-mute">
                  대응 화면 {covered}/{SCREENS.length}
                  {a.gaps.length > 0 && (
                    <span className="text-status-draft ml-2">
                      갭 {a.gaps.length}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </Tile>

      {/* 타일4: 사용자 유형별 PlayBoard (시나리오 진입) */}
      <Tile wide band="alt">
        <SectionTitle>사용자 유형별 기획·구현 PlayBoard</SectionTitle>
        <div className="grid md:grid-cols-2 gap-4">
          {sequenceFlows().map((f) => {
            const screens = flowScreens(f);
            const counts = SCREEN_STATUSES.map((st) => ({
              st,
              n: screens.filter((s) => s.status === st.id).length,
            }));
            return (
              <div
                key={f.id}
                className="rounded-[14px] border border-line-light bg-white p-5"
              >
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h3 className="font-serif font-semibold text-[17px] text-text-main">
                    {f.title}
                  </h3>
                  <span className="font-mono text-[11px] text-text-mute">
                    화면 {screens.length}개
                  </span>
                </div>
                <p className="font-sans text-[12.5px] text-text-soft leading-[1.6] mb-3">
                  {f.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {counts.map(({ st, n }) => (
                    <span
                      key={st.id}
                      className="font-mono text-[10.5px] text-text-soft"
                    >
                      {st.label} {n}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/playboard/scenario/${f.id}`}
                  className="inline-block font-sans text-[13px] font-semibold text-accent-deep hover:text-accent-main"
                >
                  기획·구현 PlayBoard 들어가기 →
                </Link>
              </div>
            );
          })}
        </div>
      </Tile>

      {/* 타일5: 화면별 현황 — ScreenBoard */}
      <Tile wide>
        <SectionTitle>화면별 기획·구현 현황</SectionTitle>
        <ScreenBoard />
      </Tile>
    </>
  );
}
