import type { Plane } from "../types";

/** 평면 레지스트리 — 3평면 (학습자 / 운영자 / 시스템 상태) */
export const PLANES: Plane[] = [
  {
    id: "learner",
    title: "학습자",
    description: "주 사용자(학생) 도메인 — 강의 학습·진척·계정.",
  },
  {
    id: "operator",
    title: "운영자",
    description: "교사·관리자 도메인 — 자료 배포·운영 대시보드.",
  },
  {
    id: "system",
    title: "시스템 상태",
    description: "에러·예외 등 화면이라기보다 상태인 비순차 케이스.",
  },
];

export const getPlane = (id: string): Plane | undefined =>
  PLANES.find((p) => p.id === id);
