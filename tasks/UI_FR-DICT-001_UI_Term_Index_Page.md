# [Feature] UI_FR-DICT-001: 용어 인덱스 (Term Index) 페이지 구현

```yaml
---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] UI_FR-DICT-001: 용어 인덱스 페이지 — 가나다순 정렬 + 검색 + 에피소드 말풍선 연동"
labels: 'feature, frontend, dictionary, accessibility, priority:high'
assignees: ''
---
```

## :dart: Summary
- **기능명**: [UI_FR-DICT-001] 용어 인덱스 (Term Index) 페이지 `/dictionary`
- **목적**: 사용자가 `경제판단력교과서_마스터_v3.xlsx`에 정의된 모든 경제 용어를 한곳에서 가나다순으로 찾아볼 수 있도록 지원. 특정 단어를 클릭하면 툴팁/말풍선을 통해 해당 단어가 설명된 에피소드 명칭과 영상 내 시간(위치) 정보, 그리고 해당 영상 위치로 바로 이동할 수 있는 링크를 제공.

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `app/dictionary/page.tsx` RSC 페이지 구현.
- [ ] **데이터 소스 연동**: `경제판단력교과서_마스터_v3.xlsx`를 기준으로 추출된 용어 DB 연동.
- [ ] **검색 기능 (Search Bar)**: 상단에 검색창 배치, 클라이언트 사이드 혹은 서버 액션 기반 실시간 필터링.
- [ ] **가나다순 정렬 렌더링**: 용어들을 자음별(ㄱ, ㄴ, ㄷ...)로 그룹화하여 목록 렌더링.
- [ ] **툴팁/말풍선 (Popover/Tooltip) 컴포넌트**:
  - 특정 용어 클릭 시 노출 (웹 접근성을 위해 포커스/엔터 키 지원).
  - 내용: 설명된 에피소드 제목, 영상 내 타임라인 (예: 2분 15초).
  - **이동 링크**: "영상 보러가기" 버튼을 누르면 `/lesson/[id]?t=[초]` 형태로 이동하여 해당 타임라인부터 영상이 재생되도록 지원.
- [ ] **디자인**: 글로벌 폰트인 **Pretendard** 적용.

## :test_tube: Acceptance Criteria (BDD/GWT)

### Scenario 1: 가나다순 목록 표시
- **Given**: 페이지에 진입한 사용자.
- **When**: `/dictionary` 화면을 볼 때.
- **Then**: 모든 단어가 가나다순으로 깔끔하게 정렬되어 표시됨.

### Scenario 2: 단어 검색
- **Given**: 검색창에 "인플레이션"을 입력.
- **When**: 키보드 타이핑 또는 검색 버튼 클릭.
- **Then**: "인플레이션"과 일치하거나 포함하는 단어만 필터링되어 나타남.

### Scenario 3: 단어 클릭 및 말풍선 노출
- **Given**: 정렬된 단어 중 하나를 클릭.
- **When**: 클릭 이벤트 발생.
- **Then**: 화면 이동 없이 팝오버(Popover)가 나타나며, 해당 에피소드 정보와 영상 내 시간 위치가 노출됨.

### Scenario 4: 영상 보러가기 링크 이동
- **Given**: 말풍선이 열린 상태.
- **When**: "영상 보러가기" 버튼 클릭.
- **Then**: 해당 레슨 페이지(`/lesson/[id]`)의 특정 시간대로 즉시 리다이렉션됨.

## :gear: Technical Constraints
- **접근성(A11y)**: 팝오버는 키보드 네비게이션이 가능해야 하며, 스크린 리더에서 읽을 수 있도록 적절한 `aria-haspopup` 및 `aria-expanded` 속성을 제공해야 함.
- **글꼴**: 글로벌 테마에 맞춰 `Pretendard` 서체 강제.
- **UI 컴포넌트**: `shadcn/ui`의 Popover 또는 Dialog 컴포넌트를 활용하여 렌더링 안정성 확보.

## :checkered_flag: Definition of Done (DoD)
- [ ] 페이지 컴포넌트 및 정렬 로직 구현 완료.
- [ ] 검색창 필터링 정상 동작.
- [ ] Popover를 활용한 말풍선과 타임스탬프 링크 리다이렉트 확인.
- [ ] Pretendard 폰트 및 웹 접근성(Axe-core) 테스트 통과.
