// FR-LES-003 / FW-PROG-002 / FR-PROG-001 — 레슨 미디어 영역(클라이언트 아일랜드).
// YouTube IFrame API(enablejsapi)로 플레이어를 생성하고, onReady 에서 재개 위치로 seek 하며,
// usePositionSync 로 10초 간격 저장 + 언로드 확정 전송을 수행한다.
// 진척 저장/재개 외(OX·모달·헤더)는 이 컴포넌트가 다루지 않는다(스코프 경계).
"use client";

import { useEffect, useRef, useState } from "react";
import {
  usePositionSync,
  seekToResume,
  type YTPlayerLike,
} from "../hooks/usePositionSync";

interface YTPlayerCtor {
  new (
    el: HTMLElement | string,
    opts: {
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: { onReady?: (e: { target: YTPlayerLike }) => void };
    },
  ): YTPlayerLike & { destroy: () => void };
}
declare global {
  interface Window {
    YT?: { Player: YTPlayerCtor };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// 정식 IFrame API 스크립트를 1회 로드(비공식 API·스크래핑 금지, ADR-005).
function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
}

function formatMMSS(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}분 ${s}초`;
}

interface Props {
  lessonId: string;
  /** youtube_video_id — getLesson seam 제공. TODO(CT-DB-003): 실제 미디어 컬럼(3매체) 연동 시 교체. */
  youtubeVideoId: string;
  /** RSC 가 getResumePosition 으로 서버 주입(익명·신규는 0). */
  initialPositionSec: number;
  /** 로그인 세션 여부 — 익명은 저장 미발화(W11-T7). */
  sessionActive: boolean;
}

export default function LessonPlayerClient({
  lessonId,
  youtubeVideoId,
  initialPositionSec,
  sessionActive,
}: Props) {
  const [viewMode, setViewMode] = useState<"video" | "text">("video");
  const [player, setPlayer] = useState<YTPlayerLike | null>(null);
  const [showResumeToast, setShowResumeToast] = useState(initialPositionSec > 0);
  const mountRef = useRef<HTMLDivElement | null>(null);

  usePositionSync(lessonId, player, sessionActive);

  // 플레이어 생성 + onReady 재개 seek(FR-PROG-001). 마운트당 1회.
  useEffect(() => {
    let created: (YTPlayerLike & { destroy: () => void }) | null = null;
    let cancelled = false;
    void loadYouTubeIframeApi().then(() => {
      if (cancelled || !mountRef.current || !window.YT?.Player) return;
      created = new window.YT.Player(mountRef.current, {
        videoId: youtubeVideoId,
        playerVars: { enablejsapi: 1, modestbranding: 1, rel: 0, cc_load_policy: 1 },
        events: {
          onReady: (e) => seekToResume(e.target, initialPositionSec),
        },
      });
      setPlayer(created);
    });
    return () => {
      cancelled = true;
      created?.destroy?.();
      setPlayer(null);
    };
  }, [youtubeVideoId, initialPositionSec]);

  // 재개 토스트 자동 dismiss(차분한 안내 — 게임화·후킹 금지, CON-05).
  useEffect(() => {
    if (!showResumeToast) return;
    const t = setTimeout(() => setShowResumeToast(false), 5000);
    return () => clearTimeout(t);
  }, [showResumeToast]);

  const restartFromBeginning = () => {
    player?.seekTo(0, true);
    setShowResumeToast(false);
  };

  return (
    <div className="mb-[60px] relative">
      {/* Media Toggle */}
      <div className="inline-flex bg-water-card rounded-xl p-1 mb-[22px]" role="tablist">
        <button
          className={`flex items-center gap-2 p-[10px_22px] rounded-[9px] font-sans text-[14px] transition-all cursor-pointer border-none ${viewMode === "video" ? "bg-white text-text-main font-semibold shadow-[0_2px_8px_-3px_rgba(13,95,109,0.2)]" : "bg-transparent text-text-soft font-medium hover:text-text-main"}`}
          onClick={() => setViewMode("video")}
          role="tab"
          aria-selected={viewMode === "video"}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-[1.6]">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          영상으로 보기
        </button>
        <button
          className={`flex items-center gap-2 p-[10px_22px] rounded-[9px] font-sans text-[14px] transition-all cursor-pointer border-none ${viewMode === "text" ? "bg-white text-text-main font-semibold shadow-[0_2px_8px_-3px_rgba(13,95,109,0.2)]" : "bg-transparent text-text-soft font-medium hover:text-text-main"}`}
          onClick={() => setViewMode("text")}
          role="tab"
          aria-selected={viewMode === "text"}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-[1.6]">
            <path d="M4 6h16M4 12h16M4 18h7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          글로 읽기
        </button>
      </div>

      {/* Video — 토글로 텍스트 전환 시에도 플레이어 인스턴스 유지(위치 보존) */}
      <div className={viewMode === "video" ? "" : "hidden"}>
        <div className="relative aspect-video bg-water-card rounded-2xl overflow-hidden border border-line-light">
          {/* YT.Player 가 이 div 를 iframe 으로 대체(enablejsapi=1) */}
          <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />
        </div>

        {showResumeToast && (
          <div
            role="status"
            className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 bg-water-card border-l-[3px] border-l-accent-main rounded-[10px] px-4 py-3 font-sans text-[13.5px] text-accent-deep animate-[toastFade_0.4s_ease_forwards]"
          >
            <span>
              이전에 학습하던 {formatMMSS(initialPositionSec)} 지점부터 이어서 재생합니다.
            </span>
            <button
              onClick={restartFromBeginning}
              className="font-medium underline underline-offset-2 hover:text-accent-main"
            >
              처음부터 보기
            </button>
          </div>
        )}
      </div>

      {/* Text — 하드코딩 프로토타입 본문 유지(진척 스코프 밖) */}
      {viewMode === "text" && (
        <div className="font-sans text-[17px] leading-[1.95] text-text-main">
          <h3 className="font-serif font-semibold text-[22px] text-text-main mt-0 mb-3.5 tracking-[-0.01em]">
            선택의 대가
          </h3>
          <p className="mb-4">
            모든 것을 다 가질 수 있다면 경제학은 필요 없습니다. 하지만 우리의 시간, 돈, 자원은 한정되어 있습니다.
          </p>
          <p className="mb-4">
            이것을 <strong>희소성(Scarcity)</strong>이라고 부릅니다. 희소하기 때문에 우리는 무언가를 선택해야만 합니다.
          </p>
        </div>
      )}
    </div>
  );
}
