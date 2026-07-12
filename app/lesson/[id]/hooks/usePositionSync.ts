// FW-PROG-002 — 재생 위치 자동 송신 훅. YouTube IFrame API 의 getCurrentTime() 을
// 10초 throttle 로 읽어 saveProgress Server Action 을 호출하고, 언로드/언마운트 시
// navigator.sendBeacon 으로 마지막 위치를 1회 확정 전송한다(Story 4 의 자동 저장 진입점).
//
// 서버 계약(W11): saveProgress 는 미인증 시 401(ErrorResponse)로 응답한다. 본 훅은
// sessionActive 게이트로 익명 사용자에겐 아예 발화하지 않고(불필요한 401 스팸 제거),
// 그럼에도 예외적으로 도달한 에러 응답은 조용히 무시한다(graceful degradation).
"use client";

import { useEffect, useRef } from "react";
import { saveProgress } from "@/app/progress/actions";

// @types/youtube 미도입 — 훅이 실제로 사용하는 최소 표면만 로컬 정의(외부 의존 회피).
export const YT_PLAYER_STATE_PLAYING = 1; // YT.PlayerState.PLAYING

export interface YTPlayerLike {
  getCurrentTime: () => number;
  getPlayerState?: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
}

const SYNC_INTERVAL_MS = 10_000; // REQ-FUNC-020 — 10초 간격(임의 간격 금지)
const SYNC_ROUTE = "/api/progress/sync"; // sendBeacon transport(saveProgressCore 공유)

/** 재개 위치 적용(FR-PROG-001) — 0초면 seek 생략(첫 시청 UX), >0 이면 seekTo(sec, true). */
export function seekToResume(
  player: Pick<YTPlayerLike, "seekTo">,
  initialPositionSec: number,
): void {
  if (initialPositionSec > 0) {
    player.seekTo(initialPositionSec, true);
  }
}

/** 현재 위치를 sendBeacon 으로 확정 전송(언로드/언마운트 경로). 실패는 무시. */
export function flushPosition(lessonId: string, player: YTPlayerLike): void {
  if (typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") {
    return;
  }
  const positionSec = Math.floor(player.getCurrentTime());
  navigator.sendBeacon(
    SYNC_ROUTE,
    JSON.stringify({ lesson_id: lessonId, position_sec: positionSec }),
  );
}

/**
 * usePositionSync — 10초 throttle 저장 + 언로드/언마운트 확정 flush.
 * @param lessonId       정규 lessonId(L\d{3})
 * @param player         YT.Player(또는 유사 객체). null 이면 대기(생성 전).
 * @param sessionActive  로그인 세션 여부. false 면 발화 안 함(익명 미저장 정책, W11-T7).
 */
export function usePositionSync(
  lessonId: string,
  player: YTPlayerLike | null,
  sessionActive: boolean,
): void {
  const lastSentRef = useRef<number>(-1);

  useEffect(() => {
    if (!player || !sessionActive) return;

    const interval = setInterval(() => {
      // 재생 중일 때만 저장(일시정지·버퍼링·종료 시 skip)
      const state = player.getPlayerState?.();
      if (state !== undefined && state !== YT_PLAYER_STATE_PLAYING) return;

      const positionSec = Math.floor(player.getCurrentTime());
      if (positionSec === lastSentRef.current) return; // 동일 위치 중복 저장 방지

      void saveProgress({ lesson_id: lessonId, position_sec: positionSec })
        .then((res) => {
          // 401·검증실패 등 ErrorResponse 는 조용히 무시(사용자 무인지). 성공 시에만 기록.
          if (res && "ok" in res && res.ok) lastSentRef.current = positionSec;
        })
        .catch((err) => {
          // 네트워크 예외 — 다음 interval 에서 재시도(IndexedDB 큐잉은 FW-PROG-003)
          console.error("saveProgress failed:", err);
        });
    }, SYNC_INTERVAL_MS);

    // 언로드 시 확정 전송 — pagehide(모바일·bfcache 안전). unmount cleanup 도 동일 flush.
    const onPageHide = () => flushPosition(lessonId, player);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      clearInterval(interval);
      window.removeEventListener("pagehide", onPageHide);
      flushPosition(lessonId, player); // 이탈 시 마지막 위치 1회 확정
    };
  }, [lessonId, player, sessionActive]);
}
