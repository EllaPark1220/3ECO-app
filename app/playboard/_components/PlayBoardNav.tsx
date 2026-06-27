"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** 4개 1급 섹션 (스펙 §4.2) */
const SECTIONS = [
  { href: "/playboard", label: "상황판", match: (p: string) => p === "/playboard" },
  {
    href: "/playboard/plan",
    label: "실행 계획",
    match: (p: string) => p.startsWith("/playboard/plan"),
  },
  {
    href: "/playboard/schedule",
    label: "일정표",
    match: (p: string) => p.startsWith("/playboard/schedule"),
  },
  {
    href: "/playboard/implement-summary",
    label: "구현 통계",
    // 제어영역 상세도 "구현 통계" 탭 활성 (스펙 §4.2)
    match: (p: string) =>
      p.startsWith("/playboard/implement-summary") ||
      p.startsWith("/playboard/control-area"),
  },
];

/** 알려진 세그먼트 → 한글 라벨 (breadcrumb) */
const SEG_LABEL: Record<string, string> = {
  playboard: "PlayBoard",
  plan: "실행 계획",
  schedule: "일정표",
  "implement-summary": "구현 통계",
  "control-area": "제어 영역",
  spec: "기술 스펙",
  screens: "화면 데모",
  scenario: "시나리오",
  "ux-flow": "데스크톱 흐름",
  "mobile-flow": "모바일 흐름",
};

function buildCrumbs(pathname: string) {
  const segs = pathname.split("/").filter(Boolean); // ['playboard', ...]
  const crumbs: { label: string; href: string }[] = [];
  let acc = "";
  for (const seg of segs) {
    acc += "/" + seg;
    crumbs.push({ label: SEG_LABEL[seg] ?? decodeURIComponent(seg), href: acc });
  }
  return crumbs;
}

export default function PlayBoardNav() {
  const pathname = usePathname() || "/playboard";
  const crumbs = buildCrumbs(pathname);

  return (
    <nav
      aria-label="PlayBoard 내비게이션"
      className="sticky top-0 z-[100] bg-[#F8FCFC]/85 backdrop-blur-md saturate-150 border-b border-line-soft"
    >
      <div className="max-w-[1180px] mx-auto px-5 md:px-8 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {/* breadcrumb */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] uppercase overflow-x-auto whitespace-nowrap">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <span key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-text-mute">/</span>}
                {isLast ? (
                  <span className="text-accent-deep font-semibold">{c.label}</span>
                ) : (
                  <Link
                    href={c.href}
                    className="text-text-mute hover:text-accent-deep transition-colors"
                  >
                    {c.label}
                  </Link>
                )}
              </span>
            );
          })}
        </div>

        {/* 섹션 탭 */}
        <div
          role="tablist"
          aria-label="PlayBoard 섹션"
          className="flex gap-1 overflow-x-auto"
        >
          {SECTIONS.map((s) => {
            const active = s.match(pathname);
            return (
              <Link
                key={s.href}
                href={s.href}
                role="tab"
                aria-current={active ? "page" : undefined}
                aria-selected={active}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all ${
                  active
                    ? "bg-white text-accent-deep font-semibold shadow-[0_2px_8px_-3px_rgba(13,95,109,0.2)]"
                    : "text-text-soft hover:text-text-main hover:bg-water-card"
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
