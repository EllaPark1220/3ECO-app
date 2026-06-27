import Link from "next/link";
import { notFound } from "next/navigation";
import { Tile, TileIntro } from "../../_components/shell";
import MobileCarousel, {
  type CarouselItem,
} from "../../_components/MobileCarousel";
import { FLOWS, getFlow } from "@/playboard/registry/flows";
import { flowScreens } from "../../_components/helpers";

export function generateStaticParams() {
  return FLOWS.map((f) => ({ flow: f.id }));
}

export default async function MobileFlowPage({
  params,
}: {
  params: Promise<{ flow: string }>;
}) {
  const { flow } = await params;
  const f = getFlow(flow);
  if (!f) notFound();

  const seq = f.kind === "sequence";
  const items: CarouselItem[] = flowScreens(f).map((s, i) => ({
    plane: s.plane,
    slug: s.slug,
    title: s.title,
    step: i + 1,
  }));

  return (
    <Tile wide>
      <TileIntro
        eyebrow={`모바일 UX 오버뷰 · ${f.title}`}
        title="실제 반응형 레이아웃을 폰 프레임으로"
      >
        {f.description}
        <div className="mt-1">
          <Link
            href={`/playboard/ux-flow/${f.id}`}
            className="font-sans text-[13px] text-accent-deep hover:text-accent-main"
          >
            데스크톱 오버뷰로 보기 →
          </Link>
        </div>
      </TileIntro>

      <MobileCarousel items={items} sequence={seq} />
    </Tile>
  );
}
