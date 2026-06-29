# PlayBoard 캡처 (하이브리드 파이프라인 — 스펙 §8)

산출물 1개 = 이미지 1장. 파일명 규칙: `:plane/:slug.png`
예) `learner/lesson.png`, `operator/admin-dashboard.png`

- **하이브리드:** 구현된 화면은 실 라우트, 미구현/기획 화면은 데모 목업(`/playboard/screens/:plane/:slug`)을 촬영.
- 캡처가 없으면 `ScreenThumb` 가 깨진 이미지 대신 **자리표시(placeholder)** 를 렌더한다(현재 상태).
- 캡처 생성: `npm run capture` (Playwright 필요 — 도입은 후순위). 화면 키 목록은 **레지스트리(`playboard/registry/screens.ts`)에서 파생**한다(hand-sync 없음).
- 생성되면 `ScreenThumb` 를 `<img src="/playboard/captures/:plane/:slug.png">` 로 교체.

> 구현 결과물이 바뀌면 캡처를 재생성한다(상황판 썸네일 = 실제 화면이라는 약속, 스펙 R6/R14).
