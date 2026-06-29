// 상태 배지 (스펙 §4.3) — 전 표면 공용. 동일 상태 = 동일 형태.
import type { ScreenStatus, WorkItemStatus } from "@/playboard/types";
import { getScreenStatus, getWorkStatus } from "@/playboard/registry/statuses";
import { SCREEN_STATUS_COLOR, WORK_STATUS_COLOR } from "./status-tokens";

export function ScreenStatusBadge({ status }: { status: ScreenStatus }) {
  const meta = getScreenStatus(status);
  const color = SCREEN_STATUS_COLOR[status];
  return <Capsule color={color} label={meta?.label ?? status} />;
}

export function WorkStatusBadge({ status }: { status: WorkItemStatus }) {
  const meta = getWorkStatus(status);
  const color = WORK_STATUS_COLOR[status];
  return <Capsule color={color} label={meta?.label ?? status} />;
}

function Capsule({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10.5px] font-semibold tracking-[0.04em] whitespace-nowrap"
      style={{
        color,
        backgroundColor: "color-mix(in srgb, " + color + " 12%, transparent)",
        border: "1px solid color-mix(in srgb, " + color + " 32%, transparent)",
      }}
    >
      <span
        aria-hidden
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
