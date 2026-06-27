import Link from "next/link";
import { notFound } from "next/navigation";
import { SCREENS, getScreen } from "@/playboard/registry/screens";
import { ScreenStatusBadge } from "../../../_components/StatusBadge";
import { demoUrlFor } from "../../../_components/helpers";

export function generateStaticParams() {
  return SCREENS.map((s) => ({ plane: s.plane, slug: s.slug }));
}

/**
 * 화면 데모 (스펙 §5.11) — 산출물 화면의 실물/목업.
 * 하이브리드: 구현된 실 라우트를 iframe으로 임베드(반응형 그대로).
 * 모바일 흐름·캡처 파이프라인의 촬영 대상.
 */
export default async function ScreenDemoPage({
  params,
}: {
  params: Promise<{ plane: string; slug: string }>;
}) {
  const { plane, slug } = await params;
  const screen = getScreen(plane, slug);
  if (!screen) notFound();

  const demoUrl = demoUrlFor(screen);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-4 py-2.5 border-b border-line-light bg-water-card/40 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-text-mute uppercase">
            화면 데모
          </span>
          <span className="font-serif text-[14px] text-text-main">
            {screen.title}
          </span>
          <ScreenStatusBadge status={screen.status} />
        </div>
        <div className="flex items-center gap-3">
          <code className="font-mono text-[11px] text-accent-deep">
            {demoUrl}
          </code>
          <Link
            href={`/playboard/spec/${plane}/${slug}`}
            className="font-sans text-[12px] font-medium text-accent-deep hover:text-accent-main"
          >
            기술 스펙 →
          </Link>
        </div>
      </div>
      <iframe
        title={`${screen.title} 데모`}
        src={demoUrl}
        className="flex-1 w-full border-0"
        style={{ minHeight: "calc(100vh - 44px)" }}
      />
    </div>
  );
}
