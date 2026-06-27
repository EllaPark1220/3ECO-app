import type { Flow } from "../types";

/**
 * 흐름 레지스트리 — 평면당 1.
 * screens[] 는 같은 평면의 실재 slug 만(무결성 불변식).
 * kind=sequence 는 시나리오 walkthrough 대상, kind=set 은 비순차 케이스.
 */
export const FLOWS: Flow[] = [
  {
    id: "learner",
    title: "학습자 흐름",
    plane: "learner",
    kind: "sequence",
    description:
      "랜딩에서 시작해 강의를 듣고, 모르는 용어를 사전에서 찾고, 진척을 스탬프 맵에서 확인하며, 기록을 위해 로그인하는 순차 여정.",
    screens: ["landing", "lesson", "dictionary", "stamp-map", "auth"],
  },
  {
    id: "operator",
    title: "운영자 흐름",
    plane: "operator",
    kind: "sequence",
    description:
      "운영 지표를 확인하고 교사용 자료를 배포·점검하는 운영자 여정.",
    screens: ["admin-dashboard", "teacher-kit"],
  },
  {
    id: "system",
    title: "시스템 상태",
    plane: "system",
    kind: "set",
    description: "순서 없는 독립 예외 케이스 집합(에러·만료 등).",
    screens: ["not-found"],
  },
];

export const getFlow = (id: string): Flow | undefined =>
  FLOWS.find((f) => f.id === id);

/** 순차 흐름만 (시나리오 walkthrough 대상) */
export const sequenceFlows = (): Flow[] =>
  FLOWS.filter((f) => f.kind === "sequence");
