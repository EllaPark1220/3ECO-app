import Link from "next/link";
import { notFound } from "next/navigation";
import { Tile, TileIntro } from "../../_components/shell";
import { ScreenThumb } from "../../_components/ScreenCard";
import { FLOWS, getFlow } from "@/playboard/registry/flows";
import { flowScreens } from "../../_components/helpers";

export function generateStaticParams() {
  return FLOWS.map((f) => ({ flow: f.id }));
}

export default async function UxFlowPage({
  params,
}: {
  params: Promise<{ flow: string }>;
}) {
  const { flow } = await params;
  const f = getFlow(flow);
  if (!f) notFound();

  const screens = flowScreens(f);
  const seq = f.kind === "sequence";

  return (
    <>
      <Tile>
        <TileIntro
          eyebrow={`데스크톱 흐름 · ${f.title}`}
          title="완성 모습 통독"
        >
          {f.description}
          <div className="mt-1 font-mono text-[11px] text-text-mute">
            화면 {screens.length}개 · {seq ? "순차 흐름" : "독립 예외 케이스"}
          </div>
        </TileIntro>

        {/* 썸네일 스트립 */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 snap-x">
          {screens.map((s, i) => (
            <div key={`${s.plane}/${s.slug}`} className="flex items-center gap-2 shrink-0">
              <Link
                href={`/playboard/screens/${s.plane}/${s.slug}`}
                className="w-[140px] snap-start"
              >
                <ScreenThumb screen={s} />
              </Link>
              {seq && i < screens.length - 1 && (
                <span className="text-text-mute">→</span>
              )}
            </div>
          ))}
        </div>

        <Link
          href={`/playboard/mobile-flow/${f.id}`}
          className="font-sans text-[13px] text-accent-deep hover:text-accent-main"
        >
          모바일 오버뷰로 보기 →
        </Link>
      </Tile>

      <Tile band="alt">
        <div className="flex flex-col gap-8">
          {screens.map((s, i) => (
            <article key={`${s.plane}/${s.slug}`}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-[10px] tracking-[0.1em] text-accent-deep uppercase font-semibold">
                  {seq ? `${i + 1}단계` : "예외 케이스"} · {s.designSpecType}
                </span>
                <Link
                  href={`/playboard/screens/${s.plane}/${s.slug}`}
                  className="font-sans text-[12px] font-medium text-accent-deep hover:text-accent-main"
                >
                  화면 데모 →
                </Link>
              </div>
              <h2 className="font-serif font-semibold text-[19px] text-text-main mb-1">
                {s.title}
              </h2>
              <p className="font-sans text-[13px] text-text-soft mb-3">
                {seq
                  ? `${s.flowNote} · 실 라우트 ${s.route}`
                  : `트리거: ${s.route} · ${s.flowNote}`}
              </p>
              <Link href={`/playboard/screens/${s.plane}/${s.slug}`} className="block">
                <ScreenThumb screen={s} />
              </Link>
            </article>
          ))}
        </div>
      </Tile>
    </>
  );
}
