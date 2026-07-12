# 세션 기록 — 2026-07-13 (W11 학습 진척·이어보기 완결 + prod 500 인시던트)

> 브랜치들: `fix/auth-email-confirm-flow` → `feat/w11-lesson-progress-wiring` → `fix/lesson-view-graceful-degrade` → `chore/l001-smoke-video` → `chore/l001-real-video-e001` · 작성: Ella + Claude
> 시작 상태: 인증 백엔드 완성 + prod 배포(#237 이메일 콜백 fix까지) + W11 **서버 코어**(#234: saveProgress·getResumePosition·마이그레이션) 머지 상태. 테스트 205 green.
> 종료 상태: **W11 완결**(진척 저장 + 이어보기 실측 통과), prod 500 회귀 진단·수정, orphan 계정 정합 복구. 테스트 **225 green**, main=`792f719`.

이 세션은 "W11 클라이언트 배선 → prod 스모크 → 500 인시던트 → 근본 진단·수정 → 실콘텐츠 교체"를 한 줄로 이었다. 작업 타입별로 정리한다.

---

## A. W11 클라이언트 배선 (#238)

서버 코어(#234)를 실제 시청 페이지에 연결. 하드코딩 프로토타입 `app/lesson/[id]/page.tsx` 를 **Server Component** 로 전환.

- **ID 정규화(접근 ②)**: `lib/data/curriculum.ts` 에 `resolveLessonId(param)` 추가 — repo 에 공존하는 두 링크 계열(`L\d{3}`=app/page, `vol-ep`=stamp-map/dictionary/teacher-kit)을 모두 흡수. curriculum 의 global 매핑 재사용(하드코딩 표 없음, 133편 round-trip 테스트). 접근 ①(전체 링크 교체)은 stamp-map `completedSet`(vol-ep 키잉) 재작업이 커서 기각.
- **RSC 주입**: `getResumePosition` + `getCurrentUser` → `initialPositionSec`/`sessionActive` prop.
- **client island**: `LessonPlayerClient.tsx`(YouTube IFrame API, `onReady` seek), `usePositionSync.ts`(10초 throttle `saveProgress` + `pagehide`/unmount `sendBeacon`), OX/모달은 `LessonOxQuiz.tsx` 로 verbatim 이전(스코프 밖).
- 스코프 경계 준수: OX/스탬프/시드/스키마 무변경. videoId 는 `getLesson` seam. 테스트 +15(220).

부산물: `FontSizeToggle.tsx`(#216 유래 고아 스텁, 3단계 스펙위반 + lint 2건) 발견 → 소유 태스크 UI_FR-LES-004 에 정리 항목 분리 기록(**#239**, 문서 전용).

## B. 🚨 prod 500 인시던트 — `/lesson/L001` (로그인 시)

배포 직후 스모크에서 **로그인 상태**로 `/lesson/L001` 접속 시 500. 익명(curl)은 200. 로그 스트림(`vercel logs`)이 ECONNRESET 반복으로 스택 확보 실패 → **증거 기반 배제법**으로 확정.

### 진단 (로그 없이)
1. **(b) Prisma 연결 실패 → 기각**: `/api/health/db`(`prisma.$queryRaw SELECT 1`)가 prod 200. `.env.production.local` 로 prod DB 직접 probe 성공.
2. **(b') 테이블 미마이그레이션 → 기각**: prod 에 `User`·`LessonProgress` 테이블 존재.
3. **(a) 확정**: 확인된 auth 계정 **3** / `public.User` **2** → 정확히 1계정이 auth 세션은 있는데 `public.User` 없음. 그 계정 로그인 시 `getCurrentUser` 의 `prisma.user.findUnique` → null → **`throw AuthError("INTERNAL_ERROR")`** → RSC 500. 익명은 그 전 `getUser()` null 로 return 이라 200.

### 근본 원인 (두 겹)
- **데이터**: `public.User` 는 이메일 확인 콜백 `syncConfirmedUser` 만 생성(signUp·트리거 아님). 문제 계정은 **#237(콜백 token_hash 재작성) 배포 17분 전(07-10 00:48 KST)** 구 PKCE 경로로 확인된 **잔재**(sync 미실행). #237 이후 계정(01:16)은 정상. → 현행 배선 정상, 이 계정만 옛 테스트 잔재.
- **구조 회귀(#238)**: 레슨 시청은 W11-T7 상 **비로그인 공개**여야 하는데, 렌더 경로에 **가드용 strict `getCurrentUser`**(broken-sync 에서 throw)를 넣어 세션/DB 이상이 공개 페이지를 통째로 500 냄.

## C. 수정 — graceful degrade (#240)

- `lib/services/progress.ts` 에 **`getViewerProgress(lessonId)`** 추가 — **절대 throw 안 함**. 세션/진척 읽기 실패(broken-sync `AuthError`·DB 오류)는 익명 뷰로 degrade `{ initialPositionSec: 0, sessionActive: false }` + anomaly `console.error`(`TODO(CT-DB-009)` EventLog).
- 페이지가 `getCurrentUser`+`getResumePosition` 직접 호출 → `getViewerProgress` 로 교체. **쓰기 경로는 계속 strict `requireUser`(401)**.
- 테스트 +5(225): 익명·로그인·진척없음·**broken-sync degrade**·DB실패 degrade.

## D. orphan 계정 정합 복구 (백필)

- `.env.production.local`(DIRECT_URL)로 `syncConfirmedUser` 로직 replicate — 누락된 `public.User` 1행 생성(id·email·nickname=metadata 후보·role=LEARNER, P2002 멱등). 개인정보 값 미출력(존재/카운트/타임스탬프만).
- **정합 재확인: auth_confirmed=3, public_user=3, still_orphan=0.** 대상 계정(`mel***@gmail.com`) 사용자 확인 후 실행.
- 이 계정은 백필만으로도 500 해소(#240 배포 전에도) — 단 #240 은 향후 유사 이상 방어로 유지.

## E. L001 스모크 영상 → 실 E001 영상 교체 (#241 → #242)

`Lesson` 에 video 컬럼 없음(3매체=CT-DB-003 미착수) → videoId 는 `getLesson` seam 하드코딩 MOCK. 기존 `5R0epUboFsk` 는 **삭제/비공개(oembed 404)** → "재생 불가"의 원인. DB UPDATE 불가(컬럼 부재) → **seam 코드 오버라이드**로 해결.

- **#241**: `lib/data/lesson.ts` 에 `SMOKE_VIDEO_IDS = { L001: "aqz-KE-bpKQ" }`(Big Buck Bunny, 임베드 검증용). L001 한정, 나머지 편·DB·스키마·시드 무변경.
- **#242**: 채용 담당자 노출 고려 → 실제 **E001 영상 `oLPoeKtsvXc`**("고요의 경제나루", oembed 200)로 교체. W14/CT-DB-003 교체 경로 주석 유지.

→ 배포 후 **재생 + 재생→이탈→재진입 이어보기 위치 복원 실측 통과** → **W11 클로즈**.

## F. 인프라 정리

- **`goyo-economy` repo 연결 해제 완료** — 3-eco-app(goyoeco.com) 단일 프로젝트로 정리. (Vercel 프로젝트 목록에 잔존했던 중복 제거.)

---

## 오늘 머지된 PR

| PR | 요약 | 타입 |
|----|------|------|
| #238 | W11 시청 페이지 진척 저장·이어보기 배선(resolveLessonId·usePositionSync·LessonPlayerClient) | feat(progress) |
| #239 | UI_FR-LES-004 에 FontSizeToggle 고아 스텁 정리 항목 기록 | docs(tasks) |
| #240 | 시청 페이지 graceful degrade(getViewerProgress) — prod 500 회귀 수정 | fix(lesson) |
| #241 | L001 스모크 영상 오버라이드(임베드 검증용) | chore(lesson) |
| #242 | L001 실 E001 영상(oLPoeKtsvXc) 교체 | chore(lesson) |

전부 머지됨. main=`792f719`, 테스트 **225 green**.

---

## 후속·미해결 (다음 세션 후보)

- **헤더 세션 배선** — nav 의 `<Link href="/login">` 정적 하드코딩 → 로그인 후 UI(닉네임/로그아웃) 미구현. 레슨 500 과 무관한 별개.
- **FR-LES-003 편별 콘텐츠 배선** — 현재 헤더/브레드크럼/본문이 "1권 1편"·mock 고정. `getLesson` seam 을 편별 실데이터로.
- **CT-DB-003(3매체 컬럼)** — `Lesson.youtubeVideoId`·script·pdf 실컬럼. 현재는 seam 하드코딩 + L001 오버라이드. 이 컬럼 도입 시 seam→Prisma 교체(주석 명시).
- **FW-PROG-003** — IndexedDB 오프라인 큐(401/네트워크 실패 폴백), **FW-PROG-004** 다기기 LWW 배너.
- **카카오 이메일 필수동의** — 비즈앱 검수 필요(이메일 스코프).
- **Preview env 정리** — preview 배포 다수 Error 상태 관측, 정리 필요.
- **이월(E2E/부하)** — TS-IT-007(100회 재개), 다중 탭, 메모리 프로파일, p95 측정.
