"use client";

// 구현 통계 매트릭스 (스펙 §5.4) — 정렬 가능한 화면 × {구현상태, 제어영역 커버리지●}.
import { useState } from "react";
import Link from "next/link";
import { SCREENS } from "@/playboard/registry/screens";
import { CONTROL_AREAS } from "@/playboard/registry/control-areas";
import { sortScreens, nextSort, type SortKey, type SortDir } from "@/playboard/derive/sort";
import { ScreenStatusBadge } from "./StatusBadge";

function Arrow({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className="ml-1 text-[10px] text-accent-deep">
      {active ? (dir === "asc" ? "▲" : "▼") : "↕"}
    </span>
  );
}

export default function SortableMatrixTable() {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "status",
    dir: "asc",
  });
  const rows = sortScreens(SCREENS, sort.key, sort.dir);

  const click = (key: SortKey) => setSort((cur) => nextSort(cur, key));

  const Th = ({ k, children }: { k: SortKey; children: React.ReactNode }) => (
    <th className="text-left p-2.5 sticky top-0 bg-water-card">
      <button
        type="button"
        onClick={() => click(k)}
        className="font-mono text-[10.5px] tracking-[0.06em] uppercase text-text-soft hover:text-accent-deep transition-colors inline-flex items-center"
      >
        {children}
        <Arrow active={sort.key === k} dir={sort.dir} />
      </button>
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-[14px] border border-line-light">
      <table className="w-full border-collapse text-left min-w-[640px]">
        <thead>
          <tr className="border-b border-line-light">
            <Th k="title">화면</Th>
            <Th k="status">구현 현황</Th>
            {CONTROL_AREAS.map((a) => (
              <Th key={a.area} k={a.area}>
                {a.area}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr
              key={`${s.plane}/${s.slug}`}
              className="border-b border-line-soft last:border-0 hover:bg-water-card/30"
            >
              <td className="p-2.5">
                <Link
                  href={`/playboard/spec/${s.plane}/${s.slug}`}
                  className="font-sans text-[13px] font-medium text-text-main hover:text-accent-deep transition-colors"
                >
                  {s.title}
                </Link>
                <div className="font-mono text-[10px] text-text-mute">
                  {s.plane}
                </div>
              </td>
              <td className="p-2.5">
                <ScreenStatusBadge status={s.status} />
              </td>
              {CONTROL_AREAS.map((a) => {
                const note = s.engineering.controlAreaNotes[a.area];
                return (
                  <td key={a.area} className="p-2.5 text-center">
                    {note ? (
                      <span
                        className="text-accent-main text-[15px]"
                        title={note}
                        aria-label={note}
                      >
                        ●
                      </span>
                    ) : (
                      <span className="text-line-light text-[15px]" aria-hidden>
                        ·
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-line-light bg-water-card/40">
            <td className="p-2.5 font-mono text-[10.5px] text-text-mute uppercase">
              총 {SCREENS.length} 화면
            </td>
            <td className="p-2.5" />
            {CONTROL_AREAS.map((a) => {
              const covered = SCREENS.filter(
                (s) => s.engineering.controlAreaNotes[a.area] != null,
              ).length;
              return (
                <td
                  key={a.area}
                  className="p-2.5 text-center font-mono text-[11px] text-accent-deep font-semibold"
                >
                  {covered}
                </td>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
