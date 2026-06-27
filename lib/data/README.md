# lib/data — mock → 실데이터 seam

화면(`app/**`)과 백엔드(Prisma/Supabase) 사이의 **계약 경계**다.
각 함수의 입출력 타입은 `lib/contracts/*`(Zod SSOT)이며, **현재 구현은 mock**이다.
백엔드가 들어올 때 이 함수 본문만 Prisma 구현으로 교체하면 **화면 코드는 바뀌지 않는다**.

레슨/스탬프 mock 은 실제 `data/curriculum_data_v1.json`(133편)에서 파생한다.

## seam ↔ EPIC ↔ 계약 매핑

| seam | 함수 | 계약 | mock→Prisma EPIC |
|---|---|---|---|
| `lesson.ts` | `getLesson` | `contracts/lesson` | W14 (CT-DB-003, FR-LES-001) |
| `stamp.ts` | `getStampMap` | `contracts/stamp` | W11 (CT-DB-005, FR-STAMP-001) |
| `ox.ts` | `submitOx` | `contracts/ox` | W11 (FW-OX-001, CT-DB-006) |
| `progress.ts` | `saveProgress` | `contracts/progress` | W11 (FW-PROG-001, CT-DB-004) |
| `newsletter.ts` | `subscribe` | `contracts/newsletter` | W02 (FW-NL-001, IF-RES-001) |
| `teacher-kit.ts` | `listKits`/`getKit` | `contracts/teacher-kit` | W13 (FW-PDF-001, CT-DB-007) |
| `survey.ts` | `submitSurvey` | `contracts/survey` | W11 (FW-SUR-001, CT-DB-008) |

## 현재 상태 / 다음 단계

- **이번 마이그레이션 범위**: seam(계약 경계) 확립 + mock 구현 + 계약 검증 테스트(`__tests__/seam.test.ts`)까지. **백엔드(Prisma) 구현은 없음** — 기존 193 이슈 백로그로 진행.
- **화면 연결**: 현재 제품 화면은 인라인 mock 으로 렌더한다. 각 화면은 자신의 백엔드 EPIC(W10~W14) 작업 시 인라인 mock 을 이 seam 함수 호출로 교체한다(`화면은 lib/data/* 에서만 데이터 import` 규칙으로 수렴).
- 교체 시에도 출력은 `*Schema.parse()` 로 계약을 유지하므로 회귀가 드러난다.
