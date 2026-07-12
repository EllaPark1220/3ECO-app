import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";

// saveProgress Server Action 모킹 — 훅의 저장 호출만 관측(실제 서버 미로드).
const { saveProgressMock } = vi.hoisted(() => ({ saveProgressMock: vi.fn() }));
vi.mock("@/app/progress/actions", () => ({ saveProgress: saveProgressMock }));

import {
  usePositionSync,
  seekToResume,
  flushPosition,
  YT_PLAYER_STATE_PLAYING,
  type YTPlayerLike,
} from "./usePositionSync";

const PAUSED = 2;

let currentTime = 0;
let playerState = YT_PLAYER_STATE_PLAYING;
let player: YTPlayerLike;
let sendBeaconMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.useFakeTimers();
  currentTime = 0;
  playerState = YT_PLAYER_STATE_PLAYING;
  saveProgressMock.mockReset().mockResolvedValue({
    ok: true,
    lesson_id: "L001",
    saved_position_sec: 0,
    saved_at: "2026-07-13T00:00:00.000Z",
    is_first_save: true,
  });
  player = {
    getCurrentTime: vi.fn(() => currentTime),
    getPlayerState: vi.fn(() => playerState),
    seekTo: vi.fn(),
  };
  sendBeaconMock = vi.fn();
  Object.defineProperty(navigator, "sendBeacon", {
    configurable: true,
    writable: true,
    value: sendBeaconMock,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("usePositionSync() — 10초 throttle 저장 (FW-PROG-002)", () => {
  it("경계: 9초엔 미발화, 10초에 saveProgress 1회(현재 위치)", async () => {
    currentTime = 5;
    renderHook(() => usePositionSync("L001", player, true));

    await vi.advanceTimersByTimeAsync(9_000);
    expect(saveProgressMock).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1_000); // 누적 10초
    expect(saveProgressMock).toHaveBeenCalledTimes(1);
    expect(saveProgressMock).toHaveBeenCalledWith({ lesson_id: "L001", position_sec: 5 });
  });

  it("일시정지(PLAYING 아님) → 저장 skip", async () => {
    playerState = PAUSED;
    renderHook(() => usePositionSync("L001", player, true));
    await vi.advanceTimersByTimeAsync(30_000);
    expect(saveProgressMock).not.toHaveBeenCalled();
  });

  it("동일 위치 → 중복 저장 방지, 위치 변화 시 재저장", async () => {
    currentTime = 30;
    renderHook(() => usePositionSync("L001", player, true));

    await vi.advanceTimersByTimeAsync(10_000);
    expect(saveProgressMock).toHaveBeenCalledTimes(1);

    // 위치 그대로 → skip
    await vi.advanceTimersByTimeAsync(10_000);
    expect(saveProgressMock).toHaveBeenCalledTimes(1);

    // 위치 변화 → 재저장
    currentTime = 40;
    await vi.advanceTimersByTimeAsync(10_000);
    expect(saveProgressMock).toHaveBeenCalledTimes(2);
    expect(saveProgressMock).toHaveBeenLastCalledWith({ lesson_id: "L001", position_sec: 40 });
  });

  it("익명(sessionActive=false) → 저장·beacon 모두 미발화(미저장 정책)", async () => {
    currentTime = 20;
    const { unmount } = renderHook(() => usePositionSync("L001", player, false));
    await vi.advanceTimersByTimeAsync(30_000);
    expect(saveProgressMock).not.toHaveBeenCalled();
    unmount();
    expect(sendBeaconMock).not.toHaveBeenCalled();
  });

  it("언마운트 → sendBeacon 으로 마지막 위치 1회 확정 전송", () => {
    currentTime = 42;
    const { unmount } = renderHook(() => usePositionSync("L001", player, true));
    unmount();
    expect(sendBeaconMock).toHaveBeenCalledWith(
      "/api/progress/sync",
      JSON.stringify({ lesson_id: "L001", position_sec: 42 }),
    );
  });

  it("pagehide → sendBeacon 확정 전송", () => {
    currentTime = 77;
    renderHook(() => usePositionSync("L001", player, true));
    window.dispatchEvent(new Event("pagehide"));
    expect(sendBeaconMock).toHaveBeenCalledWith(
      "/api/progress/sync",
      JSON.stringify({ lesson_id: "L001", position_sec: 77 }),
    );
  });
});

describe("seekToResume() — 재개 위치 적용 (FR-PROG-001)", () => {
  it("initialPositionSec>0 → seekTo(sec, true)", () => {
    const p = { seekTo: vi.fn() };
    seekToResume(p, 120);
    expect(p.seekTo).toHaveBeenCalledWith(120, true);
  });

  it("initialPositionSec=0 → seek 생략(첫 시청 UX)", () => {
    const p = { seekTo: vi.fn() };
    seekToResume(p, 0);
    expect(p.seekTo).not.toHaveBeenCalled();
  });
});

describe("flushPosition() — 확정 전송 payload", () => {
  it("현재 위치를 floor 하여 sync route 로 sendBeacon", () => {
    (player.getCurrentTime as ReturnType<typeof vi.fn>).mockReturnValue(45.9);
    flushPosition("L050", player);
    expect(sendBeaconMock).toHaveBeenCalledWith(
      "/api/progress/sync",
      JSON.stringify({ lesson_id: "L050", position_sec: 45 }),
    );
  });
});
