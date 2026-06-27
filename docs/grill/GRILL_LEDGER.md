# Grill Ledger — 착수 전 결정 토픽 원장

> grill-it 세션 진척 원장. 첫 UNRESOLVED 토픽부터 재개 가능.
> 참조 범위(A): `docs/PRD_v1.1.md` · `ISSUE_LIST.md`
> 관심 방향(B): UX flow · 기술스택 · 설계 미확정 부분
> 완료조건(C): 범위 내 미해소 토픽 전부 RESOLVED
> OUTPUT(D): PRD/SRS + Agent Harness(CLAUDE.md 등) 반영

```
RESOLVED: 8 / TOTAL: 8   (STOP: ALL_RESOLVED)
- [x] T1 | CORE  | 레슨 총 편수·권 구성 확정          | status:RESOLVED
- [x] T2 | CORE  | 교사 모드 MVP 범위               | status:RESOLVED
- [x] T3 | CORE  | 인증 수단 범위 (카카오 OAuth)     | status:RESOLVED
- [x] T4 | CORE  | OX 통과·학습 흔적 모달 UX         | status:RESOLVED
- [x] T5 | CORE  | 글자 크기 토글 단계값             | status:RESOLVED
- [x] T6 | CORE  | 분석·계측 도구 단일화             | status:RESOLVED
- [x] T7 | MINOR | 진주 스탬프 권별 색·미완 표현      | status:RESOLVED
- [x] T8 | MINOR | 교안 PDF 분량 표준               | status:RESOLVED
```

## 결정 로그

- [x] T1 | CORE | 레슨 총 편수·권 구성 | status:RESOLVED | decision: **133편 체계 확정** — lessonId L001~L133, 권별 가변(1권27·2권25·3권25·4권31·5권25), 권 완주 트리거 = 권별 실제 편수. MVP 초기 시드 10~25편 유지 | applied: PRD §변경이력/§4, tasks(TS-UT-008·CT-MOCK-001·FW-OX-004), 이슈 #160·#23·#68, CLAUDE.md
- [x] T2 | CORE | 교사 모드 MVP 범위 | status:RESOLVED | decision: **PDF 다운로드 + 경량 will_reuse 토글(+comment)**. 무거운 피드백 페이지·사전사후 설문 DEPRECATED 유지. TeacherFeedback = will_reuse+comment 최소 필드 | applied: PRD §6.2/Story3, tasks(TS-E2E-007·FR-KPI-006·신규 FW-TF-004), 이슈 #134·#40·신규, CLAUDE.md
- [x] T3 | CORE | 인증 수단 범위 | status:RESOLVED | decision: **카카오 OAuth MVP 포함** — Supabase Kakao provider + 이메일/비번 병행, PII 이메일·닉네임만(불변) | applied: PRD §3, SRS, 신규 task FW-AUTH-006 + 이슈, CLAUDE.md
- [x] T4 | CORE | OX 통과·학습 흔적 모달 UX | status:RESOLVED | decision: **in-page 메시지 + 4조건 학습 흔적 모달**(300ms 페이드·"흔적/마침" 어휘·자유 닫기·카카오 공유 선택) | applied: PRD §1/§4, 신규 task UI_FR-OX-002 + 이슈, #173·#175 연계
- [x] T5 | CORE | 글자 크기 토글 단계값 | status:RESOLVED | decision: **14/18/22/28px 4단계** (16/18/20 폐기) | applied: tasks(UI_FR-LES-004), 이슈 #171, PRD Story5 AC4/§5.6, CLAUDE.md
- [x] T6 | CORE | 분석·계측 도구 단일화 | status:RESOLVED | decision: **Vercel Analytics + Plausible, GA4 배제**. 제품 KPI는 내부 event_log(Supabase SQL) | applied: PRD §6.4/Story2 AC4, SRS, CLAUDE.md
- [x] T7 | MINOR | 진주 스탬프 권별 색·미완 표현 | status:RESOLVED | decision: **PRD 색 스펙**(하늘/분홍/노랑/연두/순백, 미완=점선 outline+투명) → #175 + Tailwind 토큰 | applied: tasks(UI_FR-STAMP-002), 이슈 #175
- [x] T8 | MINOR | 교안 PDF 분량 표준 | status:RESOLVED | decision: **A4 2~3p 표준**, TEACHER_KIT.pages 2~3 검증, 단일 PDF | applied: tasks(UI_FW-PDF-002), 이슈 #177, PRD §6.2
