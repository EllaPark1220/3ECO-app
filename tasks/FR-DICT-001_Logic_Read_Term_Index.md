# [Feature] FR-DICT-001: 용어 인덱스 (Term Index) 데이터 API

```yaml
---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] FR-DICT-001: GET /api/dictionary — 엑셀 기반 정적 용어 데이터 응답"
labels: 'feature, backend, api, dictionary'
assignees: ''
---
```

## :dart: Summary
- **기능명**: [FR-DICT-001] 용어 데이터 조회 API (`GET /api/dictionary`)
- **목적**: 프론트엔드 UI(`UI_FR-DICT-001`)에서 표시할 가나다순 용어, 설명, 그리고 연결된 에피소드(Lesson) ID 및 타임라인을 제공합니다. 엑셀 `경제판단력교과서_마스터_v3.xlsx` 데이터를 기반으로 한 정적 JSON/DB 조회를 처리합니다.

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/api/dictionary/route.ts` Route Handler 생성
- [ ] **응답 DTO 정의**:
  ```ts
  export interface TermIndexResponse {
    terms: Array<{
      id: string;
      term_name: string;        // 용어 (예: 인플레이션)
      definition: string;       // 용어 설명
      lesson_id: string;        // 등장하는 에피소드 ID
      lesson_title: string;     // 에피소드 명칭
      timestamp_seconds: number;// 영상 내 위치 (초)
    }>;
  }
  ```
- [ ] 데이터 소스 연동 로직 (JSON 정적 파일 또는 DB 테이블 연동)
- [ ] 응답 시 가나다순 정렬 기본 적용

## :test_tube: Acceptance Criteria (BDD/GWT)
### Scenario 1: 정상 조회
- **Given**: API 호출
- **When**: `GET /api/dictionary`
- **Then**: 200 OK + `terms` 배열 반환. 항목들이 가나다순으로 정렬되어 있음.
