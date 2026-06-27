"use client";

// ScreenBoard (스펙 §5.5) — 타일/칸반 토글. 전체 산출물 화면.
import { useState } from "react";
import { SCREENS } from "@/playboard/registry/screens";
import { SCREEN_STATUSES } from "@/playboard/registry/statuses";
import { ScreenCard } from "./ScreenCard";
import { ScreenStatusBadge } from "./StatusBadge";

export default function ScreenBoard() {
  const [view, setView] = useState<"tile" | "kanban">("tile");

  return (
    <div>
      <div
        role="tablist"
        aria-label="보기 모드"
        className="inline-flex bg-water-card rounded-xl p-1 mb-4"
      >
        {(["tile", "kanban"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={view === m}
            onClick={() => setView(m)}
            className={`px-4 py-1.5 rounded-lg font-sans text-[13px] transition-all ${
              view === m
                ? "bg-white text-text-main font-semibold shadow-[0_2px_8px_-3px_rgba(13,95,109,0.2)]"
                : "text-text-soft font-medium hover:text-text-main"
            }`}
          >
            {m === "tile" ? "타일" : "칸반"}
          </button>
        ))}
      </div>

      {view === "tile" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCREENS.map((s) => (
            <ScreenCard key={`${s.plane}/${s.slug}`} screen={s} />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {SCREEN_STATUSES.map((st) => {
            const cards = SCREENS.filter((s) => s.status === st.id);
            return (
              <div key={st.id} className="min-w-[220px] flex-1 shrink-0">
                <div className="flex items-center gap-2 mb-2.5">
                  <ScreenStatusBadge status={st.id} />
                  <span className="font-mono text-[11px] text-text-mute">
                    {cards.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {cards.length ? (
                    cards.map((s) => (
                      <ScreenCard
                        key={`${s.plane}/${s.slug}`}
                        screen={s}
                        compact
                      />
                    ))
                  ) : (
                    <p className="font-sans text-[12px] text-text-mute italic py-3">
                      해당 없음
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
