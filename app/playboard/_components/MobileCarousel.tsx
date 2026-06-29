"use client";

// 모바일 흐름 캐러셀 (스펙 §5.10) — 실제 반응형 데모를 폰 프레임 iframe에 모바일 폭으로 로드.
import Link from "next/link";

const MOBILE_VP = 375; // 모바일 브레이크포인트 미만 (기능 치수)
const DISPLAY_W = 224; // 표시 폭
const SCALE = DISPLAY_W / MOBILE_VP;
const FRAME_H = 460;

export interface CarouselItem {
  plane: string;
  slug: string;
  title: string;
  step?: number;
}

export default function MobileCarousel({
  items,
  sequence,
}: {
  items: CarouselItem[];
  sequence: boolean;
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
      {items.map((it, i) => (
        <div key={`${it.plane}/${it.slug}`} className="flex items-center gap-4 shrink-0">
          <div className="snap-center flex flex-col items-center gap-2">
            {/* 폰 베젤 */}
            <div
              className="relative rounded-[28px] border-[7px] border-[#0E2B30] bg-black overflow-hidden shadow-[0_12px_32px_-12px_rgba(13,95,109,0.5)]"
              style={{ width: DISPLAY_W, height: FRAME_H }}
            >
              <iframe
                title={`${it.title} 모바일`}
                src={`/playboard/screens/${it.plane}/${it.slug}`}
                style={{
                  width: MOBILE_VP,
                  height: FRAME_H / SCALE,
                  border: "0",
                  transform: `scale(${SCALE})`,
                  transformOrigin: "top left",
                }}
                loading="lazy"
              />
            </div>
            <div className="text-center">
              <div className="font-mono text-[11px] text-text-main">
                {sequence && it.step != null ? `${it.step}. ` : ""}
                {it.title}
              </div>
              <Link
                href={`/playboard/spec/${it.plane}/${it.slug}`}
                className="font-sans text-[11.5px] text-accent-deep hover:text-accent-main"
              >
                기술 스펙
              </Link>
            </div>
          </div>
          {sequence && i < items.length - 1 && (
            <span className="text-text-mute text-lg">→</span>
          )}
        </div>
      ))}
    </div>
  );
}
