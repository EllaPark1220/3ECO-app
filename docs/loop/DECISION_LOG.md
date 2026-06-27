# DECISION LOG — 에이전틱 구현 루프 의사결정 원장

> `/goal` 자동 구현 루프의 신규 의사결정 체크포인트. 멀티에이전트 공통 카운터(아래 grep 가능 줄)로 조기 종료를 판정한다.
> 분류: CORE = 아키텍처·보안·외부의존·데이터모델·핵심 UX 계약 / MINOR = 네이밍·디렉터리·로그 포맷·UI 디테일
> 종료: CORE 3 도달(CORE_BUDGET) · MINOR 10 도달(MINOR_BUDGET) · 미해소 이슈 0(NO_UNBLOCKED_ISSUES) · turn 50(TURN_CAP)

CORE: 3
MINOR: 4

---

## 결정 기록 (1건 1행: `[Dn] CLASS | issue | 결정 | 근거`)
- [D1] CORE | scaffold(전체 기반) | 스캐폴드 구체 스택 확정 = Next.js 15 App Router + React 19 + TypeScript 5 + Tailwind v3 + shadcn/ui | SRS C-TEC-001~007이 스택 종류만 고정했고 메이저 버전 미확정. shadcn 안정성 위해 Tailwind v3 채택.
- [D2] CORE | scaffold(테스트) | 단위/통합 테스트 러너 = Vitest (+@testing-library/react), E2E = Playwright(기존 확정) | TS-UT 태스크가 러너 미지정. Vite 친화·ESM·속도로 Vitest 선택.
- [D3] MINOR | scaffold(레이아웃) | 소스 레이아웃 = repo 루트 `app/`·`lib/`·`components/`(src/ 미사용), 패키지매니저 npm | 태스크들이 `lib/db.ts`·`npm install` 표기 → 그 관례 따름.
- [D4] MINOR | CT-API-001 | request_id 전파 = middleware UUID 발급 + 요청/응답 `X-Request-Id` 헤더(다운스트림은 헤더 read). AsyncLocalStorage 풀 전파는 후속 | 태스크 Scenario 8 request-scoped 요구를 MVP 경량(헤더)으로 충족. Upstash 라이브 검증·Sentry 연계는 IF-KV-001/NF-OBS-001 후속.
- [D5] MINOR | CT-API-009 | 이메일 입력 정규화 = 검증 이전 trim+lowercase (transform→pipe(email)). task의 검증→변환 순서 대신 정규화 선행 | 실무 폼의 공백 패딩 이메일 허용(TDD가 실패 케이스로 포착). 견고성 향상, 계약 의미 동일.
- [D6] MINOR | CT-API-011 | 공유 에러코드 HTTP 매핑 = SHARE_LIMIT_EXCEEDED 429 · SHARE_TOKEN_EXPIRED 410(Gone) · SHARE_TOKEN_NOT_FOUND 404 | task가 코드명만 명시하고 HTTP 미지정 → 의미에 맞는 표준 상태 선택.
- [D7] CORE | CT-DB-001 | DB provider = **postgresql 정적 고정**(로컬도 Supabase local/Docker Postgres), Prisma **v6 고정**(v7 generator output 변경 회피) | Prisma 는 `provider`를 정적 리터럴로만 허용 → SRS C-TEC-003 의 "SQLite 로컬 ↔ PostgreSQL 배포 단일 스키마(env provider)"가 불가. 단일 provider 로 해소. **선행 스펙(C-TEC-003)과 상충하므로 인간 검토 필요.**

STOP REASON: CORE_BUDGET
