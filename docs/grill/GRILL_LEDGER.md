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

---

# W11 — 학습 진척 영속화 (grill 세션 2)

> 참조(A): tasks/(FR-LES/PROG/STAMP·CT-DB-003/004/005·CT-API-003/005) · lib/auth/guards.ts · lib/contracts · 현 schema.prisma(User만) · 기존 진척 grill 세션1(T1~T8)
> 방향(B): ① 저장 단위 ② 조회 시점 ③ 스탬프맵 반영 ④ 본인 가드+비로그인 ⑤ 마이그레이션 범위
> 완료(C): 범위 내 미해소 토픽 전부 RESOLVED · OUTPUT(D): tasks/*.md + CLAUDE.md/AGENTS.md 하네스 + 이 원장

```
RESOLVED: 9 / TOTAL: 9   (STOP: ALL_RESOLVED)
- [x] W11-T1 | CORE  | 저장 범위: lastPositionSec 만 (완료 boolean=OX 소관, %미저장)       | depends:-       | status:RESOLVED | decision: 재생 위치(lastPositionSec)만 영속화 · oxCompleted/stampEarned 은 스키마 컬럼만 두고 OX 기능(FW-OX-001)이 소유 · 진도율% 미저장(초 단위만, 클라 파생) | applied: 이 원장(closeout 시 FW-PROG-001·CT-DB-004 노트+goal 스펙 일괄)
- [x] W11-T2 | CORE  | 마이그레이션 모델 범위 = Lesson + LessonProgress                    | depends:W11-T1  | status:RESOLVED | decision: 이번 마이그레이션 = Lesson + LessonProgress 2개만. LessonProgress 는 CT-DB-004 전 컬럼+`(userId,lessonId)` UNIQUE+cascade+INV-04 CHECK(Postgres) 한 번에. Module·Stamp 제외(스탬프맵/OX 소관) | applied: 이 원장(closeout 일괄)
- [x] W11-T3 | CORE  | Lesson 모델 = 최소 stub + 소량 시드                                 | depends:W11-T2  | status:RESOLVED | decision: Lesson 최소 stub(lessonId unique + title + createdAt) + L001~L010 제목 시드. 3매체 미디어 컬럼은 CT-DB-003 에서 additive 마이그레이션(주의: NOT NULL 추가 시 기존 행 재시드) | applied: 이 원장(closeout 일괄)
- [x] W11-T4 | CORE  | 저장 경로 = SA + Route Handler 공유core, 응답 = 리치(계약 유지)      | depends:W11-T1  | status:RESOLVED | decision: lib/contracts/progress.ts 리치 응답(SSOT) 유지 · FW-PROG-001 의 {ok:true} 는 계약에 맞춰 정정 · saveProgressCore(userId,input) 를 Server Action(saveProgress)과 Route Handler(POST /api/progress/sync, sendBeacon)가 공유 | applied: 이 원장(closeout 시 FW-PROG-001 정정 일괄)
- [x] W11-T5 | CORE  | throttle = 항상 upsert(서버 throttle 제거)                          | depends:W11-T4  | status:RESOLVED | decision: Prisma 단일 upsert, @updatedAt 매번 갱신. 10초 간격 스로틀은 클라 훅(FW-PROG-002) 책임. 서버는 입력검증+upsert만(raw SQL/read-then-write 없음). FW-PROG-001 Scenario 3(updatedAt 미갱신) 정정 | applied: 이 원장(closeout 일괄)
- [x] W11-T6 | CORE  | 재개 조회 = RSC 직접 조회(getResumePosition)                        | depends:W11-T3  | status:RESOLVED | decision: 레슨 페이지 Server Component 가 getResumePosition(lessonId) 로 prisma 직접 조회 → initialPositionSec prop 을 client player 에 주입(SSR 첫 페인트 반영, fetch 왕복 0). LessonProgress 없으면 0. 클라 재조회 필요 시 후속 GET route | applied: 이 원장(closeout 일괄)
- [x] W11-T7 | CORE  | 시청 공개 + 진척만 로그인(requireUser 재사용)                       | depends:-       | status:RESOLVED | decision: 신규 가드 없음 — 쓰기=requireUser(비로그인 401), 읽기(RSC)=getCurrentUser graceful(null→위치 0). 레슨 시청 자체는 비로그인 허용, 진척 저장/재개만 로그인. requireSelfOrAdmin 아님(대상 userId 미수신). 익명 localStorage 저장은 스코프 밖(후속 FW-PROG-003) | applied: 이 원장(closeout 일괄)
- [x] W11-T8 | CORE  | 스탬프맵 미변경(완료=Stamp/OX 소관)                                 | depends:W11-T1  | status:RESOLVED | decision: W11 은 스탬프맵/Stamp/Module 미변경. 스탬프 획득은 OX(FW-OX) 소관, saveProgress 는 스탬프맵 revalidate 불필요(사용자별·RSC 재조회). '진행중 표시'는 게임화 금지 정신상 신중한 별도 UX 결정으로 후속 | applied: 이 원장(closeout 일괄)
- [x] W11-T9 | MINOR | EventLog = TODO(CT-DB-009) 스텁                                     | depends:-       | status:RESOLVED | decision: progress.saved/anomaly 발행 자리는 TODO(CT-DB-009) 주석 스텁(기존 auth 코드와 동일 패턴). W11 은 발행 안 함 | applied: 이 원장, closeout 시 FW-PROG-001 노트
```

---

# FR-헤더세션 — 공용 SiteHeader 추출 + 세션 배선 (grill 세션 3)

> 참조(A): app/{page,teacher-kit,dictionary,stamp-map,lesson/[id]}/page.tsx · lib/auth/session.ts · lib/services/progress.ts · app/api/auth/me/route.ts · PR #238/#240
> 방향(B): 공용 헤더 컴포넌트 추출 + 세션(로그인 여부) 반영 배선
> 완료(C): CORE 토픽 전부 RESOLVED — **명세만 산출, 코드 미작성**. 사용자 확인 후 goal 로 이관
> OUTPUT(D): tasks/ 신규 FR 스펙 초안 + 이 원장 (하네스·구현은 goal 단계에서)
> 제약: **layout.tsx 헤더 승격 금지**(admin/login/not-found/playboard 가 별도 nav 사용 → 충돌) · 스코프 최소

```
RESOLVED: 4 / TOTAL: 4   (STOP: ALL_RESOLVED)
- [x] H1 | CORE | 세션 배선 메커니즘                                                            | depends:-     | status:RESOLVED
- [x] H2 | CORE | orphan no-throw 가드 지점                                                     | depends:H1    | status:RESOLVED
- [x] H3 | CORE | SiteHeader 인터페이스                                                         | depends:H1    | status:RESOLVED
- [x] H4 | CORE | PR-A/PR-B 분할 + 스타일 drift 정규화                                          | depends:H1,H3 | status:RESOLVED
```

## 결정 로그 (세션 3)

- [x] H1 | CORE | 세션 배선 메커니즘 | status:RESOLVED | decision: **옵션 4 — `app/(site)/` 라우트 그룹 + 서버 layout**에서 `getViewerSession()` 호출 → `SiteHeader`(client, `usePathname`으로 variant·active) 에 prop 주입. 1그룹·pathname 파생 variant(랜딩 dark+fixed / 그 외 light+sticky). **전제 정정 수용**: `sessionActive`(lessonId 결합·닉네임 없음) 재사용 불가 → 신규 **lesson 비결합 no-throw** `getViewerSession(): ViewerSession = {authenticated:true,nickname} | {authenticated:false}` 공통 필수, orphan(AuthError)·DB오류 폴백 `{authenticated:false}`+anomaly console.error(TODO CT-DB-009), 절대 throw 안 함. 옵션3(하이브리드) 기각. 사실확인: 5페이지 이동 시 import·테스트 무파손(저위험)·lesson 부속 layout/loading/error 없음·공유 layout은 클라 네비 간 재실행 안 됨(세션 재조회 비용 낮음). | applied: GRILL_LEDGER(세션3); 스펙 초안은 closeout 시 tasks/ 신규 FR
- [x] H2 | CORE | orphan no-throw 가드 지점 | status:RESOLVED | decision: **함수 no-throw + 방어적 렌더 2단**, 그룹 error.tsx 미신설. ⑴ `getViewerSession()` try/catch 단일 서버 가드점(orphan/DB→{authenticated:false}), ⑵ 그룹 layout의 유일한 동적 호출이 이 no-throw 함수뿐 → layout throw 경로 없음, ⑶ `SiteHeader`(client)는 prop 순수 렌더로 `authenticated!==true`(undefined 포함) 전부 익명 처리 → "로그인" 링크. `app/(site)/error.tsx`는 throw 경로가 없어 미신설(스코프 최소), 스펙에 "향후 경화 옵션"으로만 메모. | applied: GRILL_LEDGER(세션3)
- [x] H3 | CORE | SiteHeader 인터페이스 | status:RESOLVED | decision: **`SiteHeader({ session: ViewerSession })` client 컴포넌트**. variant(`/`→dark+fixed / 그 외 light+sticky)·active item은 `usePathname` **런타임 파생**(공유 layout이라 prop 불가), active 강조는 NAV_ITEMS(HOME·INDEX·STAMP MAP) 매칭만 — 랜딩 HOME만 신규 강조, /teacher-kit·/lesson 은 미포함이라 강조 없음(H4 기록). NAV_ITEMS 단일 배열로 링크·active DRY. 우측 슬롯: `session.authenticated ? {nickname 비링크 라벨 + "로그아웃"} : <Link href="/login">로그인</Link>`. **로그아웃 = 기존 `signOut()` Server Action → `router.refresh()`**(그룹 layout 재실행 → 익명 재렌더). 로그인/로그아웃 후 세션 즉시 반영도 동일 `router.refresh()` 조건. 신규 라우트 0. | applied: GRILL_LEDGER(세션3)
- [x] H4 | CORE | PR-A/PR-B 분할 + 스타일 drift 정규화 | status:RESOLVED | decision: **2-PR 분할**. 추출은 헤더 1개가 5페이지를 렌더 → 페이지별 drift 보존 불가·정규값 선택 강제 → PR-A 정의 = "**기능 0변경 + 시각적 수렴**"(바이트 동일 아님). **PR-A**: `app/(site)/` 그룹 이동(git mv, import·테스트 무파손) + `SiteHeader` 추출 + 그룹 `layout.tsx` 신설 + 5개 인라인 nav 제거 + drift 정규화(light 정규값 `bg-[#F8FCFC]/90`·`md:gap-6`·`text-sm`; dark=랜딩 현행 variant 보존) + active 강조는 NAV_ITEMS 매칭만(랜딩 HOME 신규 강조·teacher-kit·lesson 강조 없음), skip-link는 light만. 헤더는 정적 `로그인` 유지(세션 0). **PR-B**: `getViewerSession()` 신설 + 그룹 layout에서 호출→SiteHeader `session` prop 주입 + 닉네임 라벨/로그아웃(`signOut()`→`router.refresh()`) + 로그인·로그아웃 후 `router.refresh()`. 검증 seam: A=5페이지 시각 동등, B=세션 반영. | applied: GRILL_LEDGER(세션3); tasks/UI_FR-HEADER-001(스펙 초안)

---

**세션 3 STOP: ALL_RESOLVED** — 반영: 이 원장 + tasks/UI_FR-HEADER-001_UI_SiteHeader_Session_Wiring.md(스펙 초안). 구현·이슈·하네스 반영은 goal 단계(사용자 확인 후).

