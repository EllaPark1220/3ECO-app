// 산출물 썸네일 카드 (스펙 §4.5) + compact 변형 (칸반용).
import Link from "next/link";
import type { Screen } from "@/playboard/types";
import { screenKey } from "@/playboard/types";
import { getPlane } from "@/playboard/registry/planes";
import { ScreenStatusBadge } from "./StatusBadge";

/**
 * 화면 캡처 썸네일. 캡처 파이프라인(Phase 6) 전까지는 자리표시(placeholder).
 * 캡처 이미지가 생기면 `public/playboard/captures/:plane/:slug.png` 를 <img>로 교체.
 */
export function ScreenThumb({
  screen,
  overlayBadge = false,
}: {
  screen: Screen;
  overlayBadge?: boolean;
}) {
  const plane = getPlane(screen.plane);
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[14px] bg-gradient-to-br from-water-card to-water-mid/40 border-b border-line-light">
      {/* 자리표시 — 캡처 누락 시 깨진 이미지 대신 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <span className="font-mono text-[9px] tracking-[0.2em] text-accent-deep/70 uppercase mb-1">
          {plane?.title} · 캡처 예정
        </span>
        <span className="font-serif text-[15px] text-text-main/80 leading-tight">
          {screen.title}
        </span>
      </div>
      {overlayBadge && (
        <div className="absolute top-2 right-2">
          <ScreenStatusBadge status={screen.status} />
        </div>
      )}
    </div>
  );
}

export function ScreenCard({
  screen,
  compact = false,
}: {
  screen: Screen;
  compact?: boolean;
}) {
  const plane = getPlane(screen.plane);
  const key = screenKey(screen);
  const specHref = `/playboard/spec/${screen.plane}/${screen.slug}`;
  const demoHref = `/playboard/screens/${screen.plane}/${screen.slug}`;

  return (
    <article className="flex flex-col rounded-[14px] border border-line-light bg-white overflow-hidden transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(13,95,109,0.25)]">
      <Link href={specHref} aria-label={`${screen.title} 기술 스펙`}>
        <ScreenThumb screen={screen} overlayBadge={compact} />
      </Link>
      <div className="p-3.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] tracking-[0.12em] text-text-mute uppercase">
            {plane?.title} · {screen.designSpecType}
          </span>
          {!compact && <ScreenStatusBadge status={screen.status} />}
        </div>
        <h3 className="font-serif font-semibold text-[15.5px] text-text-main leading-snug">
          {screen.title}
        </h3>
        <code className="font-mono text-[11.5px] text-accent-deep">
          {screen.route}
        </code>
        <div className="flex items-center gap-3 mt-1 pt-2 border-t border-line-soft">
          <Link
            href={specHref}
            className="font-sans text-[12.5px] font-medium text-accent-deep hover:text-accent-main transition-colors"
          >
            기술 스펙
          </Link>
          <Link
            href={demoHref}
            className="font-sans text-[12.5px] font-medium text-text-soft hover:text-text-main transition-colors"
          >
            화면 데모
          </Link>
          <span className="ml-auto font-mono text-[10px] text-text-mute">{key}</span>
        </div>
      </div>
    </article>
  );
}
