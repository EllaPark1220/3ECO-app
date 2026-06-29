// task → EPIC 교차참조 (SoT 이중화 금지)
// 제1원칙: tasks/*.md ↔ GitHub 이슈가 세부 작업의 단일 SoT다. 이 맵은 그 위의
// 코어스 EPIC(work-items.ts) 으로의 **롤업**이며, "모든 task 가 정확히 1개 EPIC 에
// 매핑"됨을 무결성 테스트(task-coverage)로 강제한다 — 복제하지 않고 커버리지만 보장.
//
// 매핑 단위 = task 파일명의 **패밀리 프리픽스**(예: FW-AUTH-006 → "FW-AUTH").
// Record 이므로 한 패밀리는 정확히 한 EPIC 에만 귀속된다(중복 불가).
// 새 패밀리를 추가하면 이 맵에도 등록해야 테스트가 green(고아 패밀리 금지).

/** task 파일명에서 패밀리 프리픽스 추출. task 가 아니면(메타·인덱스) null. */
export function taskFamily(filename: string): string | null {
  const base = filename.replace(/^.*[\\/]/, "");
  if (!base.endsWith(".md")) return null;
  if (/^0[.\s]/.test(base)) return null; // "0. TASK_LIST.md" 등 메타 인덱스
  if (/^UI[_-]/.test(base)) return "UI";
  const m = base.match(/^([A-Z]{2,}-[A-Z0-9]{2,})-\d+/);
  return m ? m[1] : null;
}

/** 45 task 패밀리 → 코어스 EPIC(W01~W16) 롤업. 화면/도메인 기준 귀속. */
export const TASK_FAMILY_TO_EPIC: Record<string, string> = {
  // W01 디자인 토큰·UI
  UI: "W01",
  "IF-FONT": "W01",
  // W02 랜딩(뉴스레터·실험)
  "FW-NL": "W02",
  "IF-RES": "W02",
  "FR-EXP": "W02",
  "FW-EXP": "W02",
  // W03 레슨·OX
  "FR-LES": "W03",
  "FW-OX": "W03",
  // W04 용어사전
  "FR-DICT": "W04",
  "FR-LINT": "W04",
  // W05 스탬프 맵
  "FR-STAMP": "W05",
  "FW-STAMP": "W05",
  // W06 로그인 UI
  "FR-AUTH": "W06",
  // W07 교사 자료(피드백)
  "FR-TF": "W07",
  "FW-TF": "W07",
  // W08 관리자 대시보드(KPI)
  "FR-KPI": "W08",
  // W10 인증 백엔드·스키마
  "FW-AUTH": "W10",
  "CT-DB": "W10",
  "CT-API": "W10",
  "IF-SUP": "W10",
  "NF-SEC": "W10",
  // W11 학습 진척·설문 영속화
  "FW-PROG": "W11",
  "FR-SUR": "W11",
  "FW-SUR": "W11",
  // W13 PDF 다운로드 백엔드·캐시
  "FW-PDF": "W13",
  "FR-PDF": "W13",
  "IF-CACHE": "W13",
  // W14 콘텐츠 CMS·시드·정적 검증·후킹 린터
  "CT-MOCK": "W14",
  "IF-SCALE": "W14",
  "FW-LINT": "W14",
  "TS-STATIC": "W14",
  // W15 품질·테스트·CI 게이트
  "TS-E2E": "W15",
  "TS-UT": "W15",
  "TS-IT": "W15",
  "TS-LOAD": "W15",
  "IF-CI": "W15",
  // W16 관측성·운영·인프라
  "NF-OBS": "W16",
  "NF-RISK": "W16",
  "NF-COST": "W16",
  "NF-FINAL": "W16",
  "NF-STAGE": "W16",
  "IF-AN": "W16",
  "IF-GEM": "W16",
  "IF-CRON": "W16",
  "IF-VC": "W16",
};
