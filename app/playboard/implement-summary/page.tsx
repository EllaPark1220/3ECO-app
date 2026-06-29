import { Tile, TileIntro } from "../_components/shell";
import SortableMatrixTable from "../_components/SortableMatrixTable";
import { ScreenStatusBadge } from "../_components/StatusBadge";
import { SCREEN_STATUSES } from "@/playboard/registry/statuses";
import { screenStatusCounts } from "@/playboard/derive/counts";

export default function ImplementSummaryPage() {
  const counts = screenStatusCounts();

  return (
    <Tile wide>
      <TileIntro eyebrow="구현 통계" title="화면 × 제어영역 커버리지 매트릭스">
        <span className="text-accent-main font-semibold">●</span> = 그 영역 요점을
        화면 레지스트리에 기재함. 빈칸(·) = 해당 없음 또는 기획 갭(갭 판정은 제어
        영역 상세의 미해소 갭에서). 컬럼 머리글을 눌러 정렬한다.
      </TileIntro>

      {/* 상태 분포 칩 */}
      <div className="flex flex-wrap gap-3 mb-5">
        {SCREEN_STATUSES.map((st) => (
          <span key={st.id} className="inline-flex items-center gap-1.5">
            <ScreenStatusBadge status={st.id} />
            <span className="font-mono text-[12px] text-text-soft">
              {counts[st.id]}
            </span>
          </span>
        ))}
      </div>

      <SortableMatrixTable />
    </Tile>
  );
}
