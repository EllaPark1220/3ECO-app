// 키-값 스펙 행/리스트 (스펙 §4.4). 라벨(좌) · 값(우), 좁은 폭에서 세로 스택.
import type { ReactNode } from "react";

export function SpecList({ children }: { children: ReactNode }) {
  return <dl className="flex flex-col divide-y divide-line-soft">{children}</dl>;
}

export function SpecRow({
  label,
  children,
  items,
  empty = "없음",
}: {
  label: string;
  children?: ReactNode;
  /** 목록 값이면 items 전달 → 불릿 렌더, 비면 empty 문구 */
  items?: string[];
  empty?: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:gap-4 py-2.5">
      <dt className="font-mono text-[11px] tracking-[0.06em] text-text-mute uppercase md:w-[140px] md:shrink-0 pt-0.5">
        {label}
      </dt>
      <dd className="font-sans text-[13.5px] text-text-main leading-[1.7] flex-1">
        {items ? (
          items.length ? (
            <ul className="list-disc pl-4 space-y-0.5 marker:text-accent-soft">
              {items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          ) : (
            <span className="text-text-mute italic">{empty}</span>
          )
        ) : (
          (children ?? <span className="text-text-mute italic">{empty}</span>)
        )}
      </dd>
    </div>
  );
}
