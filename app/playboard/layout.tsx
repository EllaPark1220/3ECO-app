import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isEnabled } from "@/playboard/derive/gate";
import PlayBoardNav from "./_components/PlayBoardNav";

export const metadata: Metadata = {
  title: "PlayBoard — 고요의 경제나루",
  description: "기획·구현·일정·정책이 한 곳으로 수렴하는 단일 진실 공급원(SoT) 보드.",
  robots: { index: false, follow: false },
};

/**
 * 노출 게이트 (스펙 §7.4): production 기본 비공개(404).
 * isEnabled() = VERCEL_ENV !== 'production' || PROTOTYPE_ENABLED === 'true'.
 */
export default function PlayBoardLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!isEnabled()) notFound();

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "var(--bg-light)", color: "var(--text-main)" }}
    >
      <PlayBoardNav />
      <main>{children}</main>
      <footer className="bg-water-light/60 border-t border-line-light mt-8">
        <div className="max-w-[1180px] mx-auto px-5 md:px-8 py-8 font-mono text-[11px] tracking-[0.08em] text-text-mute uppercase">
          PlayBoard · 레지스트리 파생 SoT · production 기본 비공개 · 공유는 프리뷰 URL로
        </div>
      </footer>
    </div>
  );
}
