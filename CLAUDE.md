# CLAUDE.md — 경제 판단력 교과서 프로젝트 규칙

> 에이전트가 항상 따라야 하는 프로젝트 고정 결정. 단일 출처: `docs/PRD_v1.1.md` + `docs/PROJECT_DECISIONS_v1.md`.
> 아래 규칙은 grill-it 세션(`docs/grill/GRILL_LEDGER.md`)에서 확정된 CORE 결정이다.

## 고정 결정 (grill-it 확정)

1. **레슨 ID·편수**: `lessonId`는 `L001`~`L133` 포맷, 고유·불변. 총 133편, 권별 편수 가변(1권27·2권25·3권25·4권31·5권25). 권 완주/설문 트리거는 "권당 25 고정"이 아니라 **권별 실제 편수** 기준으로 계산한다. (T1)
2. **인증·PII**: 인증은 이메일/비밀번호 + **카카오 OAuth**(Supabase Kakao provider) 병행. 수집 PII는 **이메일·닉네임만**. 성명·연락처·소득·**결제/과금 필드는 영구 금지**. (T3 / PRD 원칙 2)
3. **분석·계측**: 웹 분석은 **Vercel Analytics + Plausible**만 사용. **GA4 및 추적기성 외부 스크립트 금지**(NF-SEC-003). 제품 KPI는 외부 분석이 아니라 내부 `event_log`(Supabase SQL)에서 산출한다. (T6)
4. **접근성 — 글자 크기**: 글자 크기 토글은 **14 / 18 / 22 / 28px 4단계** 고정. 28px + 브라우저 200% 확대에서 가로 스크롤 0. (T5 / WCAG AA)
5. **게임화 금지**: 배지·랭킹·레벨업·획득/축하 연출 금지. 스탬프 맵은 보상이 아닌 인지 장치. 단, **학습 흔적 모달은 4조건**(300ms 페이드 / "흔적·마침" 어휘 / 자유 닫기 ESC·backdrop·X / 카카오 공유 선택·자동X)을 모두 충족할 때만 허용되는 예외. (T4)
6. **교사 모드 범위**: 교사 모드 = 교안 **PDF 다운로드 + 경량 `will_reuse` 토글(+comment)**까지만. 무거운 교사 피드백 페이지·사전/사후 설문은 도입하지 않는다. `TeacherFeedback`은 `will_reuse`+`comment` 최소 필드. (T2)
7. **학습 진척·레슨 접근**: 학습 진척은 재생 위치를 **초 단위(`lastPositionSec`)로만** 저장한다(진도율% 미저장·클라 파생). **레슨 시청은 비로그인 공개, 진척 저장/재개만 로그인**(쓰기 `requireUser`→401, 읽기 `getCurrentUser` graceful→위치 0). **스탬프 획득은 OX 통과가 발급**(Stamp)하고 **스탬프맵은 완료만 표시**(진행중 표시·게임화 없음, 게임화 금지 정신과 정합). (W11 grill 세션2)

## 영구 원칙 (PRD, 변경 불가)
- 과금·구독·페이월·후킹·PPL·데이터 판매 영구 배제.
- 영상 호스팅은 유튜브 단독(임베디드), 이중화/자체 CDN 없음 (ADR-005).
- 라이선스 CC BY-NC-SA 4.0 (ADR-002). 개인사업자 체제 (ADR-001).

## 작업 관행
- 결정 변경 시 `docs/grill/GRILL_LEDGER.md`와 본 파일을 함께 갱신한다.
- `tasks/*.md`는 GitHub Issue와 1:1 동기화(라벨 `Issue Automation`). 발행/갱신은 `gh` CLI.
- `main` 직접 push 금지(브랜치 보호) — 브랜치 + PR.

## PlayBoard SoT — 이중 고지

이 repo는 `/playboard` 아래 **레지스트리 파생 단일 진실 공급원(PlayBoard)** 을 운영한다.
전체 운영 규칙은 `AGENTS.md` 의 "PlayBoard — 기획·구현·운영 통합 SoT" 절을 따른다(이 파일과 이중 명시).

핵심만:
- 사실은 `playboard/registry/*.ts` 한 곳에만. 표면은 모두 파생(제1원칙). 하드코딩 목록 금지.
- 요구사항·상태·정책·디자인 변경은 **같은 PR에서 레지스트리와 함께** 갱신.
- **SoT 이중화 금지:** 세부 작업의 SoT 는 `tasks/*.md` ↔ GitHub 이슈. PlayBoard `work-items.ts`(EPIC)는 `externalRefs` 로 task 패밀리를 교차참조만 한다(복제 금지). 패밀리→EPIC 맵 = `playboard/registry/task-epics.ts`, "모든 task 가 1개 EPIC 에 매핑"을 무결성 테스트로 강제.
- 디자인 토큰 런타임 SoT 는 `app/globals.css`(VDS). `docs/VDS_v3.md` 는 근거 동결(충돌 시 CSS 우선).
- 머지 전 `npm test`(무결성 불변식) **green** 필수 + `playboard-integrity` GO.
- PlayBoard 는 production 기본 비공개(노출 게이트). `PROTOTYPE_ENABLED=true` 는 preview 전용. 공유는 프리뷰 URL.
