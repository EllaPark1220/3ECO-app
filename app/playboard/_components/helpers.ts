// 페이지 공용 파생 헬퍼 (순수).
import type { Flow, Screen } from "@/playboard/types";
import { getScreen } from "@/playboard/registry/screens";

/** 흐름의 screens[] slug → Screen[] (순서 유지, 미존재 제거) */
export function flowScreens(flow: Flow): Screen[] {
  return flow.screens
    .map((slug) => getScreen(flow.plane, slug))
    .filter((s): s is Screen => s != null);
}

/**
 * 화면 데모 iframe URL — 구현된 실 라우트를 임베드(하이브리드).
 * `[id]` 같은 동적 파라미터는 데모 값으로 치환. system 평면은 404 유발 경로.
 */
export function demoUrlFor(screen: Screen): string {
  if (screen.plane === "system" && screen.slug === "not-found") {
    return "/__playboard_demo_404";
  }
  return screen.route.replace("[id]", "L001");
}
