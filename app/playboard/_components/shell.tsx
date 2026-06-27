import type { ReactNode } from "react";

/** 콘텐츠 타일 — 인접 타일 배경 교차(band)로 구획 (스펙 §4.1) */
export function Tile({
  children,
  band = "base",
  wide = false,
  id,
}: {
  children: ReactNode;
  band?: "base" | "alt";
  /** 보드형(넓은 폭) vs 읽기형(좁은 가독 폭) */
  wide?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={band === "alt" ? "bg-water-card/40" : "bg-transparent"}
    >
      <div
        className={`mx-auto px-5 md:px-8 py-9 ${wide ? "max-w-[1180px]" : "max-w-[760px]"}`}
      >
        {children}
      </div>
    </section>
  );
}

/** 타일 인트로 헤더 — 모노 카테고리 + 제목 + 설명 */
export function TileIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-6">
      <div className="font-mono text-[11px] tracking-[0.25em] text-accent-deep font-semibold uppercase mb-2">
        {eyebrow}
      </div>
      <h1 className="font-serif font-bold text-[clamp(22px,3vw,30px)] leading-[1.3] text-text-main tracking-[-0.01em]">
        {title}
      </h1>
      {children && (
        <div className="mt-2.5 font-sans text-[14.5px] leading-[1.75] text-text-soft">
          {children}
        </div>
      )}
    </header>
  );
}

/** 섹션 소제목 (타일 내부 구획) */
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-serif font-semibold text-[19px] text-text-main mb-3.5 tracking-[-0.005em]">
      {children}
    </h2>
  );
}

/** 빈 상태 문구 */
export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-[13.5px] text-text-mute italic py-2">
      {children}
    </p>
  );
}
