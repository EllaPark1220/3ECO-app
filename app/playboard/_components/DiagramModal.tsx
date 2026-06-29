"use client";

// 다이어그램 모달 (스펙 §4.6): 인라인 축소 미리보기 → 클릭 시 뷰포트 채우는 모달.
// 주의: 클릭 오버레이를 다이어그램 내부 버튼과 중첩(버튼 안 버튼)시키지 않는다 →
//       오버레이는 다이어그램의 "형제"로 둔다(hydration 오류 방지).
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export default function DiagramModal({
  title,
  legend,
  children,
}: {
  title: string;
  legend?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // 배경 스크롤 잠금
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="relative">
      {/* 미리보기: 컨테이너 맞춤 축소 + 하단 페이드. children은 형제(버튼 중첩 X) */}
      <div className="relative max-h-[320px] overflow-hidden rounded-[14px] border border-line-light bg-white">
        <div className="pointer-events-none p-4">{children}</div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </div>
      {/* 오버레이 버튼 — 다이어그램의 형제 */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-accent-deep text-white font-sans text-[12.5px] font-medium shadow-md hover:bg-accent-main transition-colors"
      >
        클릭하여 크게 보기 →
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-[rgba(14,43,48,0.55)] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-[1100px] max-h-[90vh] flex flex-col bg-white rounded-[18px] border border-line-light shadow-[0_24px_48px_-16px_rgba(13,95,109,0.4)]"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-line-light">
                <h3 className="font-serif font-semibold text-[18px] text-text-main">
                  {title}
                </h3>
                <div className="flex items-center gap-4">
                  {legend && (
                    <div className="hidden md:flex items-center gap-3 text-[11px]">
                      {legend}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="닫기"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-text-soft hover:bg-water-card hover:text-text-main transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </header>
              <div className="overflow-auto p-6">{children}</div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
