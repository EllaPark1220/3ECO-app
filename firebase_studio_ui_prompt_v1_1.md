# Firebase Studio UI Prompt v1

**경제 판단력 교과서 (고요의 경제나루) — AI 코드 생성 도구용 통합 프롬프트**

| 항목 | 값 |
|---|---|
| 문서 버전 | v1.0 |
| 작성 | 2026-05-13 |
| 작성자 | ELLA PARK (with Mika) |
| 사용 대상 | Firebase Studio, Cursor, V0, Bolt, Antigravity 등 AI 코드 생성 도구 |
| 단일 출처 | 본 문서 + VDS_v3.1 + PROJECT_DECISIONS_v1 + CURRICULUM_v1 |
| 시안 자산 | 8개 HTML 시안 파일 (`*_v1.html`, `*_v2.html`, `*_v3.html` 등) — 실제 구현 시 코드 출처로 활용 |
| 추정 구현 기간 | 2~3주 (1인 개발 기준) |

---

## 0. 이 문서를 AI 도구에 사용하는 법

다음 두 가지 사용 패턴을 권장한다.

### 패턴 A — 단일 화면 구현
한 번에 한 화면씩 만들 때:
1. §1 Project Overview + §2 Tech Stack + §3 Design System을 항상 컨텍스트로 제공
2. §6에서 만들고 싶은 화면 1개의 명세를 추가
3. 해당 시안 HTML 파일을 첨부 (코드 출처)
4. AI에게 *"이 시안의 결을 유지하면서 [Tech Stack]으로 구현해 줘"* 라고 요청

### 패턴 B — 전체 프로젝트 부트스트랩
프로젝트 전체를 한 번에 만들 때:
1. 본 문서 전체를 컨텍스트로 제공
2. VDS_v3.1과 PROJECT_DECISIONS_v1도 함께 제공
3. CURRICULUM_v1.json 데이터 파일 첨부
4. 8개 시안 HTML 파일 모두 첨부
5. *"§7 구현 순서대로 부트스트랩 해줘"* 요청

**한 가지 원칙**: 본 문서는 *결정의 압축본*이다. 시안 HTML과 마스터 데이터가 *진실의 출처*이므로, 충돌 시 시안과 데이터가 우선한다.

---

## 1. Project Overview

### 1.1 제품 정의

**경제 판단력 교과서 (고요의 경제나루)** — 한국어 사용자를 위한 무료·광고 없는 경제 학습 사이트.

5권 133편의 영상 강의 + 글로 읽기 + OX 퀴즈 + 진주 스탬프 + 용어 사전 + 교사용 PDF.

### 1.2 사용자

성인 학습자 20~60세. 경제 입문~중급. *천천히, 차분히, 흔들리지 않고* 학습 진도를 자기 속도로 가져가고 싶은 사람.

### 1.3 핵심 가치 (절대 흔들리지 않는 원칙)

| 원칙 | 의미 |
|---|---|
| 무료 | 결제 없음, 결제 정보 일절 수집 안 함 |
| 광고 없음 | 외부 광고 노출 일절 없음 |
| 안티 게이미피케이션 | 점수·등수·획득·축하 알림 없음. 진주 스탬프는 *기록*이지 *보상*이 아님 |
| 최소 PII | 이메일·닉네임만 수집. 그 외 일절 받지 않음 |
| 차분한 톤 | 모든 카피·모션·시각이 조용하고 명확함. 호들갑·자극 회피 |
| CC BY-NC-SA 4.0 | 모든 콘텐츠 자유 배포 (출처·비상업적·동일 조건) |

### 1.4 디자인 메타포

**맑고 투명한 해변 — 그 빛과 결.**
한낮의 청록빛 얕은 물에 햇살이 닿아 윤슬이 부서지는, 정적의 순간.

### 1.5 의도적 회피

- 게이미피케이션 (점수·등수·뱃지·축하 폭죽)
- 후킹 언어 ("지금 시작!", "오늘만 할인", "X명이 학습 중")
- 럭셔리 리조트 클리셰
- 만화적 일러스트
- 따뜻한 베이지 우세 톤
- 항공 뷰 호텔 클리셰

---

## 2. Tech Stack 권장

| 영역 | 권장 |
|---|---|
| Framework | Next.js 14+ (App Router) 또는 동급 |
| Styling | Tailwind CSS + CSS Variables (VDS 토큰을 변수로) |
| Auth | Firebase Auth + Kakao OAuth |
| Database | Firestore 또는 PostgreSQL (Supabase) |
| File Storage | Firebase Storage 또는 R2 (PDF 자료, 이미지) |
| Video | YouTube unlisted (private 임베드) 또는 Vimeo |
| Hosting | Firebase Hosting 또는 Vercel |
| Fonts | Hahmlet (Google Fonts) + Pretendard Variable + JetBrains Mono |
| 형상 관리 | Git (GitHub Private repo) |

**핵심 의존성** (npm):
- `next`, `react`, `react-dom`
- `tailwindcss`
- `firebase` (auth + firestore + storage)
- `@kakao/javascript-sdk` (Kakao Login + Share)

---

## 3. Design System (VDS_v3.1 압축)

자세한 명세는 `VDS_v3.md` 참조. 본 절은 AI 프롬프트용 핵심 토큰만.

### 3.1 색 변수 (CSS)

```css
:root {
  color-scheme: light;

  /* 배경·면 */
  --bg-light: #F8FCFC;
  --water-light: #DCEAEE;
  --water-card: #EBF5F5;

  /* 액센트 */
  --accent-soft: #86D0D6;
  --accent-main: #1A8E9C;
  --accent-deep: #0D5F6D;
  --accent-darkest: #052830; /* 관리자 nav 전용 */

  /* 텍스트 */
  --text-main: #0E2B30;
  --text-soft: #4A5A60;
  --text-mute: #7A8A90;

  /* 선·구분 */
  --line-light: #DCE7E8;
  --line-soft: #E8F0F0;

  /* 상태 (관리자 화면) */
  --status-public: #2A9F6E;
  --status-private: #9B8E6D;
  --status-draft: #B85540;
}
```

### 3.2 권별 진주 색 (3-layer approach)

진주는 **흰빛 베이스 + 권 색 영롱 tint + 작은 highlight** 의 3-layer로 표현. *권 색은 진주 자체의 색이 아니라 흰빛 진주에 비치는 영롱한 빛이다.*

```css
/* 1권 (돈의 언어) — 옅은 하늘 */
.pearl-done.pearl-vol-1 {
  background:
    radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95), rgba(255,255,255,0) 22%),
    radial-gradient(circle at 55% 55%, rgba(184, 218, 235, 0.32) 30%, rgba(184, 218, 235, 0.1) 70%, rgba(255, 235, 235, 0.12) 100%),
    radial-gradient(circle at 38% 30%, #FFFFFF 0%, #FBF7F0 45%, #ECDFCC 85%, #C8B8A4 100%);
  box-shadow: 0 3px 10px -2px rgba(160, 145, 130, 0.4);
}

/* 미완 진주 — 권 색 점선 outline + 투명 */
.pearl-todo.pearl-vol-1 {
  background: transparent;
  border: 1.5px dashed rgba(184, 210, 229, 0.65);
}
```

권별 tint 색 (Layer 2):
- 1권: `rgba(184, 218, 235, 0.32)` — 옅은 하늘
- 2권: `rgba(240, 197, 208, 0.34)` — 옅은 분홍
- 3권: `rgba(245, 224, 181, 0.38)` — 옅은 노랑
- 4권: `rgba(200, 223, 196, 0.34)` — 옅은 연두
- 5권: tint 없음 (순백 진주, 가장 영롱)

자세한 코드는 `stamp_map_v3.html` 시안 참조.

### 3.3 타이포

```css
:root {
  --hahmlet: "Hahmlet", serif;          /* 헤딩, 강조 */
  --pretendard: "Pretendard Variable", -apple-system, sans-serif;  /* 본문 */
  --mono: "JetBrains Mono", monospace;  /* 라벨, 메타 */
}
```

기본 line-height: 1.78~1.85 (본문 가독성).

### 3.4 모션 정책

**학습 영역**: 300ms ease 페이드만. 그 외 모든 모션(바운스·스케일 변화·폭죽·번쩍임) 금지.

**랜딩 영역**: Ken Burns (36s), 부드러운 패럴럭스, 옅은 sparkle 허용. 단, 학습 영역으로 넘어가면 다시 정적.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

### 3.5 사진·일러스트 정책

- **랜딩만 사진 허용** (현재 Neo Lee Unsplash photo 사용 중, ID: `photo-1742075292207-0b480220556d`)
- **학습 영역은 사진 사용 안 함**
- **만화적·장식적 일러스트 금지**
- 단순 line SVG (기능적 아이콘)는 학습 영역에 허용
- **예외**: 학습 흔적 모달의 조개·진주 이미지 (`shell_pearl.png`) — 학습 결과 표시의 핵심 비주얼이므로 허용. 단 라이선스 확인 필요 (현재 GPT 생성, 상업 이용 가능성 검토 중)

### 3.6 색-기능 절대 규칙

- **모바일 다크 모드 트랩 회피**: 모든 HTML에 `<meta name="color-scheme" content="light">` + `:root { color-scheme: light; }` 강제 (자동 다크 모드로 디자인이 깨지는 것 방지)

---

## 4. Information Architecture

### 4.1 라우트 트리

```
/                          랜딩 (4-stage 풀페이지 스크롤)
/lesson/[vol]-[ep]         레슨 시청 (영상+글 토글, OX 퀴즈)
/stamp-map                 진주 스탬프 맵 (5권 권별 그리드)
/dictionary                용어 사전 (가나다 인덱스, 검색)
/teacher/kit/[vol]-[ep]    교사용 PDF 다운로드 (계정 불필요)
/auth/login                로그인 (이메일 + 카카오)
/auth/signup               회원가입 (이메일 + 카카오)
/admin/dashboard           관리자 대시보드 (운영자 전용)
/admin/contents            콘텐츠 관리 (전체 편 목록)
/admin/members             회원 관리
/curriculum/[vol]          권별 커리큘럼 (스탬프 맵에서 권 클릭 시)
```

빈 상태 라우트:
```
/404, /500                 오류 페이지
*                          로그인 필요 인터셉트 (스탬프 맵 등)
```

### 4.2 인증 흐름

```
[Anonymous]
  ├─ 랜딩, 용어 사전, 교사용 PDF 다운로드: OK
  ├─ 영상 시청·읽기: OK (단 진도 저장 안 됨)
  ├─ OX 퀴즈 풀기: 가능하지만 진주 부여 안 됨
  └─ 스탬프 맵 접근: 로그인 유도

[Authenticated — 이메일/비번 또는 카카오]
  ├─ 모든 학습자 기능 사용
  ├─ 진도·진주 자동 저장
  └─ 학습 흔적 모달 + 카카오 공유

[Admin — 별도 권한]
  └─ /admin/* 접근 가능
```

### 4.3 데이터 모델 (Firestore 권장)

```typescript
// users (Firebase Auth + Firestore 보강)
{
  uid: string;
  email: string;
  nickname: string;
  provider: 'email' | 'kakao';
  created_at: Timestamp;
  is_admin?: boolean;
}

// episodes (정적 컬렉션, 콘텐츠팀이 관리)
{
  id: string;             // "1-1", "2-3" 형식
  vol_num: 1 | 2 | 3 | 4 | 5;
  ep_num: number;
  area: string;           // "1. 사고의 출발점" 등
  title: string;          // "다 가질 수 없다는 것 — 희소성과 선택"
  concepts: string[];     // ["희소성", "선택"]
  objective_1: string;
  objective_2: string;
  video_url: string;      // YouTube unlisted URL
  content_html: string;   // 글로 읽기 본문
  summary: string;        // 학습 흔적 모달용 2-3문장 요약
  pdf_url: string;        // 교사용 자료
  status: 'public' | 'private' | 'draft';
  updated_at: Timestamp;
}

// quizzes (정적 컬렉션)
{
  episode_id: string;
  questions: Array<{
    q: string;
    answer: 'O' | 'X';
    explanation: string;  // 오답 시 표시
    text_anchor: string;  // 글 모드 자동 스크롤 위치 (HTML id)
  }>;
  // 항상 5문제, 모두 정답이어야 완료
}

// user_progress
{
  user_id: string;
  episode_id: string;
  video_position?: number;     // resume용 (초 단위)
  text_scroll_position?: number;
  quiz_attempts: number;
  completed_at: Timestamp | null;
  last_seen_at: Timestamp;
}

// terms (정적 사전, 자동 빌드 가능)
{
  id: string;
  word: string;
  definition: string;
  first_vol: number;
  first_ep: number;
  first_title: string;
  all_episodes: Array<[vol, ep]>;  // 등장 위치들
}

// pdf_downloads (통계용, 비식별)
{
  episode_id: string;
  downloaded_at: Timestamp;
  // user_id는 저장하지 않음 (PII 보호)
}
```

데이터 시드: `curriculum_data_v1.json` 파일을 Firestore에 import.

---

## 5. Components Library (필수 재사용 컴포넌트)

다음 컴포넌트는 여러 화면에서 재사용된다. 단일 파일·단일 책임으로 구현.

### 5.1 `<Pearl />` — 진주
- props: `volNum (1~5)`, `isDone (boolean)`, `onClick`, `tooltip`
- 3-layer 그라데이션 적용 (§3.2)
- hover/focus: 베이지·펄 그림자, scale(1.08), translateY(-4px)
- ARIA: `role="link"`, `aria-label`로 권/편 안내

### 5.2 `<CompletionModal />` — 학습 흔적 모달
- props: `isOpen`, `onClose`, `volNum`, `epNum`, `title`, `subtitle`, `summary`, `onKakaoShare`
- backdrop: `rgba(14, 43, 48, 0.5) + blur(6px)`
- transition: opacity 300ms + translateY(12px → 0)
- 닫기: ESC / backdrop click / X 버튼 (모두 동등)
- 진주 표현: `shell_pearl.png` + 권 색 `mix-blend-mode: color` overlay
- **PRD 정합 어휘**: "획득/축하" 절대 금지, "흔적/마침" 사용

### 5.3 `<QuizSection />` — OX 퀴즈
- props: `questions[]`, `onSubmit`, `onComplete`, `onIncorrect`
- 모든 답을 선택해야 제출 버튼 활성화
- 클라이언트 검증 + 서버 재검증 (진주 부여는 서버 결과 기반)
- 오답 시: 자동 글 모드 전환 + 첫 오답 위치 스크롤

### 5.4 `<EmptyState />` — 빈 상태
- props: `variant (404|loginRequired|noResults|notStarted)`, `title`, `desc`, `primaryAction`, `secondaryAction`
- 시안: `empty_states_v1.html`의 4종 패턴
- 어휘 가드: "어머!", "이런!" 같은 호들갑 금지

### 5.5 `<KakaoButton />` — 카카오 액션
- props: `mode ('login' | 'signup' | 'share')`, `onClick`
- 배경: `#FEE500`, hover `#F5DC00`, 텍스트 `#3C1E1E`
- 카카오 아이콘 inline SVG (외부 의존성 없음)

### 5.6 `<NavBar />` — 네비게이션
- 변형: 학습자용 (라이트) vs 관리자용 (`#052830` 다크)
- backdrop-filter: blur(16px) saturate(140%)
- sticky top: 0

---

## 6. 화면별 명세

각 화면의 명세는 *최소한*이다. 자세한 구조·인터랙션은 첨부된 시안 HTML 파일을 본다.

### 6.1 `/` 랜딩

**시안 파일**: `landing_fullpage_v2.html`

**목적**: 첫 방문자에게 사이트의 가치(무료·차분·5권 133편)를 한 페이지 스크롤로 보여줌. 회원 가입을 *유혹*하지 말고 *초대*하라.

**4-stage 구조**:
1. Stage 1 (히어로): Unsplash 윤슬 사진 + Ken Burns + 헤드라인
2. Stage 2 (콘텐츠 카드 3×2): 영상강의 / 글로읽기 / OX퀴즈 / 용어사전 / 진주스탬프 / PDF
3. Stage 3 (5권 커리큘럼): 1~5권 권 정체성·편수·핵심 학습 결과
4. Stage 4 (CTA + footer): 가입 버튼 + 라이선스·결제·광고 안내

**5권 데이터** (Stage 3, 정확):
- 1권 돈의 언어 (27편) — 뉴스·영수증·월급명세서의 단어가 들림
- 2권 돈의 흐름 (25편) — 환율·금리 뉴스가 내 삶과 연결됨
- 3권 돈의 구조 (25편) — 회사 건강을 지표로 판단할 수 있음
- 4권 돈의 결정 (31편) — 소비·저축·대출·보험·세금·투자를 스스로 결정
- 5권 돈의 인생 (25편) — 흔들리지 않는 판단·태도·돈의 의미 정립

**카피 가드**:
- ✅ "5권 133편으로 천천히 흐르는 경제 강의"
- ❌ "지금 가입하면 X% 할인!" / "오늘만!"

---

### 6.2 `/lesson/[vol]-[ep]` 레슨 시청

**시안 파일**: `lesson_watch_v1.html`

**목적**: 한 편의 영상·글·OX 퀴즈를 통합한 학습 화면.

**핵심 인터랙션**:
1. 영상 ↔ 글로읽기 토글 (resume 토스트 3.5s 자동 사라짐)
2. OX 5문제 — 모든 답 선택 시 제출 활성화 (클라 + 서버 검증)
3. 정답 시:
   - in-page 메시지: "이해 확인 완료" + "학습이 잘 자리 잡았습니다. 다음 편으로 이어가세요."
   - 동시에 `<CompletionModal />` 표시 (300ms 페이드)
4. 오답 시:
   - 메시지: "다시 학습한 후 재제출해 주세요"
   - 자동 글 모드 전환 + 첫 오답 위치 anchor 스크롤

**상태**:
```typescript
{
  mode: 'video' | 'text';
  resumeShown: boolean;
  answers: Record<number, 'O' | 'X' | null>;
  result: null | { correct: boolean; wrong_indices: number[] };
  modalOpen: boolean;
}
```

**데이터 fetch**:
- `episodes/{id}` (콘텐츠)
- `quizzes/{episode_id}` (퀴즈)
- `user_progress/{user_id}_{episode_id}` (resume 위치)

**진주 부여 조건**: 서버 검증 통과 후 `completed_at`을 `serverTimestamp()`로 기록.

---

### 6.3 `/stamp-map` 스탬프 맵

**시안 파일**: `stamp_map_v3.html`

**목적**: 학습자가 자기 학습 흔적을 시각적으로 본다. 자랑이 아닌 *기록*.

**구조**:
- 페이지 헤더 (전체 진행 카운트)
- 권별 상태 범례
- 5권 섹션 (각각: 권 마커 진주 + 권명 + 질문 + 진행 카운트 + 진주 그리드)

**진주 그리드**:
- flex wrap (32px 진주, gap 16/14)
- 모바일: 28px 진주, gap 13/11
- hover: scale(1.08), translateY(-4px), 베이지 그림자
- click: `/lesson/[id]`로 이동
- tooltip: 권/편 메타 + 편 제목 + 학습 상태

**데이터**:
- `episodes/` 전체 (133편 메타)
- `user_progress/` (현재 사용자의 모든 완료 기록)

**미완 진주는 클릭해도 이동 가능**: 학습자가 자유롭게 어느 편이든 시작 가능 (선형 강제 X).

---

### 6.4 `/dictionary` 용어 사전

**시안 파일**: `dictionary_v1.html`

**목적**: 학습 중 만난 단어를 찾고, 처음 등장한 영상으로 이동.

**구조**:
- 페이지 헤더 (총 용어 수 표시, 현재 373개)
- 검색 입력 (sticky, top: 60px)
- 자모 인덱스 (`ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ #`)
- 자모 그룹별 용어 카드 (단어 + 정의 + 처음 등장 영상 링크)

**핵심 인터랙션**:
- 실시간 검색 (단어와 정의 모두 매칭)
- 자모 jump (smooth scroll)
- 결과 없음: `<EmptyState variant="noResults">`

**데이터**:
- `terms/` 전체 컬렉션 (정적 데이터, 정기 빌드)
- 자모 추출은 클라이언트 측 함수 (한글 유니코드 0xAC00~0xD7A3)

---

### 6.5 `/auth/login`, `/auth/signup`

**시안 파일**: `auth_v1.html` (한 파일에 토글로 두 모드)

**목적**: 최소 PII로 빠른 인증. 카카오 빠른 시작 우선 노출 (한국 사용자 편의).

**구조**:
- 단순 nav (메뉴 없음)
- 가운데 정렬 카드 (max-width 440px)
- 모드 탭 (로그인/회원가입)
- 카카오 빠른 시작 버튼 (상단)
- "또는 이메일로" 구분선
- 이메일·비밀번호 폼 (회원가입 모드: + 닉네임·비번 확인·약관 2개)

**검증 규칙**:
- 이메일 형식 (HTML5 `type=email`)
- 비밀번호: 회원가입 시 8자 이상
- 비밀번호 확인 일치
- 약관 2개 모두 체크 (회원가입)

**데이터 흐름**:
- 이메일 가입: Firebase Auth `createUserWithEmailAndPassword`
- 카카오: Kakao SDK `Kakao.Auth.login()` → Firebase Auth Custom Token으로 변환
- 첫 카카오 로그인 시 자동 가입 (별도 가입 절차 없음)
- 어느 경우든 `users` 컬렉션에 `{email, nickname}` 만 저장. 그 외 모든 PII 거부.

---

### 6.6 `/teacher/kit/[vol]-[ep]` 교사용 PDF

**시안 파일**: `teacher_kit_v1.html`

**목적**: 교사·부모·스터디 리더가 *계정 없이* PDF 다운로드.

**구조**:
- breadcrumb (권 → 편 → 교사용 자료)
- PDF 표지 mock (A4 비율, 책 두께 효과로 ::before, ::after 사용)
- 메타 정보 그리드 (영역·핵심 개념·학습 목표·분량)
- 큰 청록 다운로드 버튼 + 보조 미리보기 버튼
- "계정 없이도 누구나 다운로드" 안내
- 활용 가이드 3단계 (함께 영상 보기 → PDF로 이어가기 → 스스로 풀어보기)
- CC BY-NC-SA 4.0 라이선스 박스 (출처 표기·비상업적·동일 조건)

**인증**: 불필요. 다운로드 시 익명 통계만 기록 (`pdf_downloads`).

---

### 6.7 `/admin/dashboard` 관리자 대시보드

**시안 파일**: `admin_dashboard_v1.html`

**목적**: 운영자가 콘텐츠·회원·활동을 한눈에 본다.

**시각적 구분**: 학습자 화면과 *명확히 구분* 되도록 nav 배경을 `--accent-darkest (#052830)` 다크로. "Admin" 배지 명시.

**구조**:
- 짙은 청록 admin-nav (Admin 배지 + 메뉴 + 운영자 정보)
- 페이지 헤더 (날짜·시각)
- 요약 카드 4개 그리드 (회원·활성·학습완료·PDF다운로드)
- 2-column: 콘텐츠 테이블 + 최근 활동 로그
- 모바일: 1-column 적층

**PII 보호 (관리자도 적용)**:
- 학습자 ID는 모두 마스킹 (`jih****`, `eco****`)
- 등수·점수·랭킹 *관리자도 보지 않음* (PRD §1 정합)
- 활동 로그는 시간 순서만, 학습자별 누적 비교 없음

**접근 제어**: `users/{uid}.is_admin === true` 만 접근 허용. 그 외 사용자는 403 → 학습자 홈으로 리다이렉트.

---

### 6.8 빈 상태 / 오류 페이지

**시안 파일**: `empty_states_v1.html` (4종 시안 모음)

**구현 시 분리할 라우트**:
- `/404` (또는 `not-found.tsx`) — 404 시안 적용
- `/500` (또는 `error.tsx`) — 같은 패턴, 큰 "500" 타이포 + "잠시 후 다시 시도해 주세요"
- `/stamp-map` 비로그인 시 → `<EmptyState variant="loginRequired">` 인터셉트
- `/stamp-map` 로그인 신규 회원 → `<EmptyState variant="notStarted">` (진주 0개일 때)
- `/dictionary` 검색 결과 0개 → 인라인 `<EmptyState variant="noResults">`

**4종 톤 (이미 시안에 적용됨)**:
- 호들갑 없음
- 다음 행동 제안 (primary CTA + secondary CTA)
- 단순 line SVG 또는 타이포로 시각 단서

---

## 7. 권장 구현 순서

구현 순서는 기존의 tasks/0. TASK_LIST.md를 따르세요. 

---

## 8. Anti-Patterns (절대 하지 말 것)

다음은 시안 검토에서 *의도적으로 회피*한 패턴이다. AI 도구가 *디폴트로 추가하려 할 가능성*이 있으니 명시적으로 차단.

### 8.1 게이미피케이션 (PRD §1)

- ❌ 점수, 별점, 등급, 레벨, 뱃지, 트로피
- ❌ "획득 완료!" "축하합니다!" "+10pt"
- ❌ 학습자 간 랭킹·리더보드
- ❌ "연속 X일 학습 중!" "1등!"
- ❌ 폭죽·바운스·번쩍임·소리 효과
- ✅ 진주 스탬프는 *기록*이지 *보상*이 아님 — "오늘 마친 한 편", "학습 흔적"

### 8.2 후킹 카피

- ❌ "지금 시작!", "오늘만!", "X명이 학습 중", "곧 마감!"
- ❌ FOMO 언어 ("놓치면 후회")
- ❌ "단 5분이면…" 같은 과장
- ✅ "천천히, 차분히", "당신의 속도로", "흔적이 켜집니다"

### 8.3 시각적 자극

- ❌ 만화적·캐릭터·이모지 남발
- ❌ 화려한 그라데이션, 네온 색
- ❌ 따뜻한 베이지 우세 (v1 폐기 방향)
- ❌ 항공 뷰 호텔 클리셰 (v2 폐기 방향)
- ✅ 청록·흰빛·옅은 베이지 보조 (v3.1 확정)

### 8.4 PII 수집

- ❌ 생년월일, 주소, 전화번호, 이름(실명), 직업, 성별
- ❌ 학습 기기 정보, 광고 식별자
- ❌ 결제 정보 (애초에 결제 기능 없음)
- ✅ 이메일 + 닉네임 외 *어떤 정보도* 수집·저장·표시 안 함

### 8.5 모션 과잉

- ❌ 모든 진입에 entrance animation
- ❌ 스크롤 reveal 남용 (학습 영역)
- ❌ 호버 시 강한 transform·glow
- ✅ 학습 영역은 300ms ease 페이드만, 그 외는 정적

### 8.6 다크 모드 미준비 트랩

- ❌ `color-scheme: auto` (모바일에서 의도치 않은 다크 모드)
- ✅ 모든 HTML에 `color-scheme: light` 강제 (다크 모드는 별도 시안 후 적용)

---

## 9. 참조 자산 매핑

본 프로젝트의 단일 출처 파일들:

| 파일 | 역할 |
|---|---|
| `VDS_v3.md` | 디자인 시스템 단일 출처 (v3.1) |
| `PROJECT_DECISIONS_v1.md` | PRD/SRS 보강 결정 이력 |
| `CURRICULUM_v1.md` | 5권 133편 사람 읽기용 문서 |
| `curriculum_data_v1.json` | 5권 133편 코드 통합용 데이터 |
| 본 문서 | AI 도구용 통합 프롬프트 |

시안 HTML 파일 매핑:

| 시안 | 화면 | 라우트 |
|---|---|---|
| `landing_fullpage_v2.html` | 랜딩 | `/` |
| `lesson_watch_v1.html` | 레슨 시청 + 학습 흔적 모달 | `/lesson/[id]` |
| `stamp_map_v3.html` | 스탬프 맵 | `/stamp-map` |
| `dictionary_v1.html` | 용어 사전 | `/dictionary` |
| `auth_v1.html` | 로그인·회원가입 | `/auth/*` |
| `teacher_kit_v1.html` | 교사용 PDF | `/teacher/kit/[id]` |
| `admin_dashboard_v1.html` | 관리자 대시보드 | `/admin/dashboard` |
| `empty_states_v1.html` | 빈 상태 4종 | (각 라우트에 분산 적용) |
| `shell_pearl.png` | 학습 흔적 모달의 조개·진주 자산 | (assets) |

---

## 10. 우선순위 미해결 사항

다음은 launch 전 처리 필요. AI 도구가 자동으로 해결할 수 없는 *사람의 결정*이 필요.

| # | 항목 | 결정 필요한 것 |
|---|---|---|
| 1 | `shell_pearl.png` 라이선스 | GPT 생성 이미지의 상업 이용 가능 여부, 또는 정식 일러스트 교체 |
| 2 | 학습 흔적 모달 진주 좌표 모바일 미세 어긋남 | top/left 좌표 미디어 쿼리 또는 SVG mask로 정밀화 |
| 3 | OX 퀴즈 데이터셋 | 133편 × 5문제 = 665문제 작성 (현재 1편만) |
| 4 | 권별 영상 콘텐츠 | YouTube unlisted 영상 133편 (실제 강의 영상) |
| 5 | 권별 글 콘텐츠 | 133편 학습 자료 HTML (자세한 글 형태) |
| 6 | 권별 PDF 콘텐츠 | 133편 교사용 PDF (A4 8페이지 기준) |
| 7 | 학습 흔적 모달 요약 | 133편 × 2~3문장 (학습 흔적 카드용) |
| 8 | 다크 모드 디자인 | "달빛 비추는 밤바다" 시안 작업 |
| 9 | 카카오 Share SDK 통합 | 실제 공유 카드 이미지 생성 (현재 alert만) |
| 10 | 분석·로그 | 학습자 활동 통계 (관리자 대시보드용, PII 안전) |

---

## 11. AI 도구에 던질 때 권장 시작 프롬프트

다음 한 문장으로 시작하면 AI가 본 문서를 *정합적으로* 사용한다.

```
이 프로젝트는 한국어 사용자를 위한 무료·광고 없는 경제 학습 사이트
"고요의 경제나루"입니다. 첨부한 시안 HTML 파일과 firebase_studio_ui_prompt.md를
단일 출처로 삼아 [Next.js + Tailwind + Firebase]로 구현해 주세요.

핵심 원칙은:
1. 안티 게이미피케이션 (점수·등수·획득 어휘 금지)
2. 최소 PII (이메일·닉네임만)
3. 차분한 톤 (호들갑·자극 금지)
4. 학습 영역 모션은 300ms 페이드만

시안의 결을 *그대로* 유지하면서, 컴포넌트로 분리하고
[해당 화면 이름]을 구현해 주세요.

시안과 본 문서가 충돌하면 시안이 우선합니다.
```

---

**문서 끝.**

본 문서는 결정의 *압축본*이지 결정 자체가 아니다. 결정의 원본은 PROJECT_DECISIONS_v1.md, VDS_v3.md, 그리고 시안 HTML 파일들에 있다.

AI 도구는 본 문서로 *시작*하고, 진실의 출처(시안 + 마스터 데이터)로 *돌아가서* 검증한다.
