# DECISION LOG — 에이전틱 구현 루프 의사결정 원장

> `/goal` 자동 구현 루프의 신규 의사결정 체크포인트. 멀티에이전트 공통 카운터(아래 grep 가능 줄)로 조기 종료를 판정한다.
> 분류: CORE = 아키텍처·보안·외부의존·데이터모델·핵심 UX 계약 / MINOR = 네이밍·디렉터리·로그 포맷·UI 디테일
> 종료: CORE 3 도달(CORE_BUDGET) · MINOR 10 도달(MINOR_BUDGET) · 미해소 이슈 0(NO_UNBLOCKED_ISSUES) · turn 50(TURN_CAP)

CORE: 2
MINOR: 1

---

## 결정 기록 (1건 1행: `[Dn] CLASS | issue | 결정 | 근거`)
- [D1] CORE | scaffold(전체 기반) | 스캐폴드 구체 스택 확정 = Next.js 15 App Router + React 19 + TypeScript 5 + Tailwind v3 + shadcn/ui | SRS C-TEC-001~007이 스택 종류만 고정했고 메이저 버전 미확정. shadcn 안정성 위해 Tailwind v3 채택.
- [D2] CORE | scaffold(테스트) | 단위/통합 테스트 러너 = Vitest (+@testing-library/react), E2E = Playwright(기존 확정) | TS-UT 태스크가 러너 미지정. Vite 친화·ESM·속도로 Vitest 선택.
- [D3] MINOR | scaffold(레이아웃) | 소스 레이아웃 = repo 루트 `app/`·`lib/`·`components/`(src/ 미사용), 패키지매니저 npm | 태스크들이 `lib/db.ts`·`npm install` 표기 → 그 관례 따름.
