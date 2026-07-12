// 커리큘럼 데이터 로더 — data/curriculum_data_v1.json(133편) 단일 출처에서 파생.
// lesson/stamp seam 의 mock 구현이 이 평탄화 목록을 공유한다.
import raw from "@/data/curriculum_data_v1.json";

export interface CurriculumEpisode {
  n: number;
  area: string;
  title: string;
  concepts: string;
  objective_1: string;
  objective_2: string;
}
export interface CurriculumVolume {
  volume_title: string;
  count: number;
  episodes: CurriculumEpisode[];
}

const VOLUMES = raw as Record<string, CurriculumVolume>;

export interface FlatLesson {
  lessonId: string; // L001~L133
  n: number; //        전체 순번 1~133
  volume: number; //   1~5 (= module order_index)
  moduleId: string; // M1~M5
  volumeTitle: string;
  episodeInVolume: number;
  area: string;
  title: string;
  concepts: string;
  objectives: [string, string];
}

function build(): FlatLesson[] {
  const out: FlatLesson[] = [];
  let global = 0;
  for (let v = 1; v <= 5; v++) {
    const vol = VOLUMES[String(v)];
    if (!vol) continue;
    for (const ep of vol.episodes) {
      global += 1;
      out.push({
        lessonId: `L${String(global).padStart(3, "0")}`,
        n: global,
        volume: v,
        moduleId: `M${v}`,
        volumeTitle: vol.volume_title,
        episodeInVolume: ep.n,
        area: ep.area,
        title: ep.title,
        concepts: ep.concepts,
        objectives: [ep.objective_1, ep.objective_2],
      });
    }
  }
  return out;
}

export const LESSONS: FlatLesson[] = build();
export const TOTAL_LESSONS = LESSONS.length;

export const getFlatLesson = (lessonId: string): FlatLesson | undefined =>
  LESSONS.find((l) => l.lessonId === lessonId);

/**
 * 레슨 라우트 파라미터 → 정규 lessonId(L\d{3}) 정규화 (W11-T6 · 접근 ②).
 * 저장소에 공존하는 두 링크 계열을 모두 흡수한다:
 *   - `L\d{3}`  — app/page.tsx 계열. 평탄 목록에 존재하면 그대로 반환.
 *   - `vol-ep`  — stamp-map(주 진척 표면)·dictionary·teacher-kit·not-found·breadcrumb 계열.
 *                 volume + episodeInVolume 조합으로 평탄 목록을 역조회(하드코딩 매핑표 없음 —
 *                 build() 가 만든 lessonId 를 그대로 재사용).
 * 그 외/미존재 → null (호출자 page 가 notFound()).
 */
export function resolveLessonId(param: string): string | null {
  if (/^L\d{3}$/.test(param)) {
    return LESSONS.some((l) => l.lessonId === param) ? param : null;
  }
  const m = /^(\d+)-(\d+)$/.exec(param);
  if (m) {
    const volume = Number(m[1]);
    const episodeInVolume = Number(m[2]);
    const hit = LESSONS.find(
      (l) => l.volume === volume && l.episodeInVolume === episodeInVolume,
    );
    return hit ? hit.lessonId : null;
  }
  return null;
}

export interface ModuleMeta {
  module_id: string;
  name: string;
  order_index: number;
}
export const MODULES: ModuleMeta[] = [1, 2, 3, 4, 5]
  .filter((v) => VOLUMES[String(v)])
  .map((v) => ({
    module_id: `M${v}`,
    name: VOLUMES[String(v)].volume_title,
    order_index: v,
  }));
