# Visual Design Spec v3.1

> **[PlayBoard SoT 고지]** 이 문서는 디자인 *근거*로 동결한다. 디자인 토큰의 **런타임 단일 진실 공급원은 `app/globals.css`** (VDS `:root` 변수 + `@theme`)이다. 값이 충돌하면 **`app/globals.css`가 우선**한다. 토큰 변경은 이 문서가 아니라 `app/globals.css`에 반영하고, 같은 PR에서 본 문서를 함께 갱신한다(양방향 싱크).

**경제 판단력 교과서 (고요의 경제나루)**

| 항목 | 값 |
|---|---|
| 문서 버전 | **v3.1** (학습 영역 시안 반영) |
| 작성 | 2026-05-13 (v3.0) → 2026-05-13 (v3.1) |
| 작성자 | ELLA PARK (with Mika) |
| 위계 | PRD v1 · SRS v1과 동일 위계 (Tier 1) |
| 적용 범위 | 랜딩 페이지 + **학습 영역 8개 화면 시안 완료** |
| 선행 문서 | PRD_v1.md, SRS_v1.md |
| 동위 문서 | PROJECT_DECISIONS_v1.md (정합화 이력) |
| 후행 문서 | firebase_studio_ui_prompt.md (v3.1 반영 필요) |
| v3.1 변경 요약 | §13 신설 — 학습 영역 시안 결과 반영 (진주 3-layer, 학습 흔적 모달, 카카오 OAuth, 진주 권별 색) |

---

## 0. 이 문서의 위치

본 문서는 PRD/SRS가 정의한 *기능 요건* 위에 *시각 시스템*을 정의한다.
PRD §1 "Visual Mood & Typography" 절을 확장·구체화하고, 일부 조항은 본 문서로 대체된다 (§9 정합화 노트 참조).

본 문서가 정한 디자인 토큰은 향후 모든 화면 구현의 단일 출처가 된다. 어떤 도구(Figma Make, Antigravity, Cursor 등)에 프롬프트를 던지더라도 본 문서의 값을 따른다.

---

## 1. 컨셉

### 1.1 한 줄 정의

> **맑고 투명한 해변 — 그 빛과 결.**
> 한낮의 청록빛 얕은 물에 햇살이 닿아 윤슬이 부서지는, 정적의 순간.

### 1.2 학습자가 받아야 할 첫인상

**편안함** — 마음이 놓이는 느낌.
화려함·휴양·럭셔리가 아니라, *시원하고 단정한 책을 펼쳤을 때의 안도*에 가깝다.

### 1.3 벤치마크 결

- 일본 잡지 *Casa Brutus*의 여름 휴양 특집 — 광량·여백·타이포의 운용
- 무인양품의 여름 캠페인 — 절제된 청량함
- Aesop — 컬러보다 *운용법*(여백, 타이포 위계) 참조

### 1.4 핵심 어휘

청량함, 투명함, 빛, 여백, 흐름, 조용함.

### 1.5 의도적 회피

게이미피케이션, 후킹 언어, 럭셔리 리조트 클리셰, 일러스트의 만화적 표현, 따뜻한 베이지 우세(v1 폐기 방향), 항공 뷰 호텔 클리셰(v2 폐기 방향).

---

## 2. 색 팔레트

### 2.1 라이트 모드 — 한낮의 맑은 바다

| 변수 | HEX | 역할 |
|---|---|---|
| `--bg-light` | `#F8FCFC` | 전체 배경 (학습 영역의 기본) |
| `--water-light` | `#DCEAEE` | 옅은 청록 카드 · 상단 강조 |
| `--water-card` | `#EBF5F5` | 학습 카드 배경 |
| `--water-mid` | `#B5DBE0` | 중간 청록 · 보조 액센트 |
| `--accent-soft` | `#86D0D6` | 부드러운 강조 |
| `--accent-main` | `#1A8E9C` | **메인 액센트** · 버튼 기본 |
| `--accent-deep` | `#0D5F6D` | 깊은 청록 · 호버 · 강조 텍스트 |
| `--accent-darkest` | `#052830` | 가장 깊은 청록 · 다크 영역 |
| `--text-on-light-main` | `#0E2B30` | 본문 · 제목 (검정 #000 사용 금지) |
| `--text-on-light-soft` | `#4A5A60` | 보조 텍스트 |
| `--text-on-light-mute` | `#7A8A90` | 캡션 · 비활성 |
| `--line-light` | `#DCE7E8` | 테두리 · 구분선 |

### 2.2 색의 의미 시스템

**수면 → 깊은 바다**의 위계가 색 시스템의 척추다.

```
F8FCFC (수면 위 햇살)
  └─ DCEAEE (수면 바로 아래)
       └─ B5DBE0 (얕은 물)
            └─ 86D0D6 (중간 깊이)
                 └─ 1A8E9C (깊어지는 청록)
                      └─ 0D5F6D (깊은 바다)
                           └─ 052830 (가장 깊은 곳)
```

랜딩 페이지는 이 위계를 *위→아래 스크롤*로 시각화한다.

### 2.3 다크 모드 — 달빛 비추는 밤바다

| 변수 | HEX | 역할 |
|---|---|---|
| `--dark-bg` | `#082F49` | 전체 배경 (PRD §1 유지) |
| `--dark-card` | `#0F3B4A` | 카드 · 강조 영역 |
| `--dark-line` | `#1E5A6D` | 테두리 |
| `--dark-accent-cyan` | `#5FCDC4` | 메인 액센트 |
| `--dark-text-main` | `#F5EBD7` | 본문 (PRD §1 명시) |
| `--dark-text-soft` | `#A89A87` | 보조 텍스트 |

### 2.4 절대 금지

- 순검정 `#000000` — 따뜻한 다크 (`#0E2B30` 또는 `#1F2937`)로 대체
- 순백 `#FFFFFF` — 청명한 흰빛 (`#F8FCFC`)로 대체. 단 사진 위 텍스트는 `#FFFFFF` 허용
- 따뜻한 베이지 우세 (v1 폐기 방향)
- 해질녘 산호색 (v1 폐기 방향)

---

## 3. 타이포그래피

### 3.1 폰트 시스템

| 용도 | 폰트 | Weight |
|---|---|---|
| 헤드라인 (H1, H2, 카드 제목) | **Hahmlet** | 600, 700 |
| 본문 · UI · 버튼 · 라벨 | **Pretendard Variable** | 400, 500, 600, 700 |
| 코드 · 메타 정보 · eyebrow | JetBrains Mono | 400, 500, 600 |

### 3.2 폰트 선정 이유

- **Hahmlet**: 둥근 모던 명조. Noto Serif KR의 올드함 없이 감성과 단정함을 둘 다 갖춤. 청록빛 청량한 색과 잘 어울리는 곡선.
- **Pretendard**: 한국어 모던 웹 디자인의 표준. 가독성과 호환성 모두 최강.
- **영문 강조 미사용**: v2에서 시도했던 Cormorant Garamond Italic 영문 강조는 *폐기*. 한글 위주 서비스에서 어색함.

### 3.3 텍스트 위계

| 레벨 | 폰트 / 굵기 | 크기 | line-height | 사용처 |
|---|---|---|---|---|
| Hero H1 | Hahmlet 700 | `clamp(34px, 5.5vw, 60px)` | 1.3 | 랜딩 히어로 |
| Section H2 | Hahmlet 600 | `clamp(28px, 4.2vw, 44px)` | 1.3 | 섹션 타이틀 |
| Card H3 | Hahmlet 600 | 19px | 1.4 | 카드 제목 |
| Body | Pretendard 400 | 16px | **1.85** | 본문 |
| Sub | Pretendard 400 | 15-17px | 1.85 | 부제·설명 |
| Small | Pretendard 400 | 13-14px | 1.7 | 캡션 |
| Eyebrow | Mono 600 | 11px | 1.5 | 섹션 라벨 (영문, letter-spacing 0.3em) |

### 3.4 운용 규칙

- 본문 행간 **1.85** 고정. 시선이 천천히 흐르도록 호흡을 확보한다.
- 글자 크기 사용자 조절 14~28px (PRD §1 유지).
- 강조어에 italic이나 영문 세리프 사용 금지. *색만으로* 또는 *Hahmlet의 굵기 변화로* 강조.
- 헤드라인 글자 수 권장: H1은 6~30자, H2는 6~20자.
- 한자·중국식 표현 금지.

---

## 4. 사진 사용 가이드

### 4.1 정책 (옵션 A → A+ 확장)

- **일러스트는 사용하지 않는다** (옵션 A 결정 유지).
- 단, *작은 SVG 실루엣 (마스코트, 아이콘)* 은 일러스트가 아닌 **심볼**로 분류하여 허용.
- 사진은 **랜딩 페이지에 한정**해 사용한다. 학습 영역에는 사진 사용 금지.

### 4.2 사진 선정 기준

| 항목 | 기준 |
|---|---|
| 주요 피사체 | 물 표면 클로즈업, 윤슬, 얕은 청록빛 바다. **항공 뷰·인물·물건·장소 표지 없음.** |
| 색조 | 청록(시안)이 주조, 흰빛이 50% 이상. 노을·일출 등 따뜻한 색조 금지. |
| 구도 | 광활한 풍경보다 **부분 클로즈업** 우세. 시선 강한 포인트 없음. |
| 절대 금지 | 인물, 가공된 일러스트풍, 채도 높은 보정, 흑백, 복잡한 패턴 |
| 라이센스 | Unsplash License, CC0, 또는 직접 촬영. 출처는 페이지에 명시. |

### 4.3 사용 위치

| 영역 | 사진 사용 |
|---|---|
| 랜딩 페이지 히어로 | ✅ 풀스크린 |
| 페이지 전환 brief 영역 | ✅ 부분 |
| 빈 상태(Empty State) | ✅ 부드러운 배경 |
| 레슨 시청 화면 | ❌ |
| OX 퀴즈 | ❌ |
| 스탬프 맵 | ❌ |
| 관리자 대시보드 | ❌ |
| 폼 입력 화면 | ❌ |

### 4.4 사진 위 텍스트 처리

- 사진 위에 텍스트가 올라가면 다음 중 하나 적용:
  - 화이트 오버레이 12~18%
  - 사진 하단 30%에 흰빛 그라데이션 페이드
  - 텍스트 영역에 vignette + blur sub-shadow (랜딩 히어로 채택 방식)
- 흰 텍스트에는 항상 `text-shadow: 0 2px 24px rgba(0,0,0,0.35), 0 1px 6px rgba(0,0,0,0.25)` 적용.
- WCAG AA 대비 4.5:1 검증은 사진의 *가장 밝은 영역*에서 수행.

### 4.5 현재 채택된 사진

| 위치 | 사진 | 출처 |
|---|---|---|
| 랜딩 히어로 | "Sunlight sparkles and reflects on the water" | Neo Lee · Unsplash · `photo-1742075292207-0b480220556d` |

---

## 5. 모션 정책

### 5.1 영역별 분리 (중요)

PRD §1의 모션 정책은 *학습 영역*에만 엄격하게 적용된다. 랜딩 페이지는 별도 정책을 둔다.

| 영역 | 정책 |
|---|---|
| **학습 영역** (레슨, 퀴즈, 스탬프 맵, 관리자, 폼) | PRD §1 그대로. 300ms 이하 페이드만. 패럴랙스·바운스·확대·confetti 금지. |
| **랜딩 페이지** | Ken Burns 효과, 깊이별 색 그라데이션, 미세 별빛 등 허용. |

### 5.2 학습 영역 모션 규칙 (PRD §1 유지)

- 모든 전환 300ms 이하 ease-in-out 페이드.
- 슬라이드·줌·바운스·shake·pulse·confetti·"+10pt" 효과 절대 금지.
- 오류 표시 진동 없음. 부드러운 페이드만.
- 정답 시에도 폭죽 없이 *"이해 확인 완료"* 문구만 표시.

### 5.3 랜딩 페이지 모션 허용 항목

| 효과 | 사양 |
|---|---|
| Ken Burns | scale 1.02 → 1.07 + translate -1.2% -1.5%, 36초 ease-in-out infinite alternate |
| 컨텐츠 fade-up | 24px translateY, 1.4s ease-out, 0.2s 간격 stagger |
| 스크롤 reveal | 30px translateY, 1s, IntersectionObserver threshold 0.1 |
| 스크롤 인디케이터 | 8px 위아래, 3s ease-in-out infinite |
| Deep sparkle | opacity 0.2 → 0.8, 5s ease-in-out infinite, 각 점 다른 delay |

### 5.4 접근성 (필수)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

위 미디어 쿼리 활성 시 모든 모션 즉시 비활성화. 단, 페이드 인된 요소들은 `opacity: 1`로 강제 가시화.

---

## 6. 컴포넌트 규격

### 6.1 곡률 (Border Radius)

| 토큰 | 값 | 사용처 |
|---|---|---|
| `--radius-sm` | `6px` | 작은 칩, 태그 |
| `--radius-md` | `12px` | 버튼, 입력 필드 |
| `--radius-lg` | `16-18px` | 카드 |
| `--radius-xl` | `20px` | 큰 컨테이너, 모달 |

### 6.2 버튼

**Primary**
```css
background: #1A8E9C;
color: #FFFFFF;
padding: 15px 34px;
border-radius: 12px;
font: 600 15px Pretendard;
box-shadow: 0 10px 28px -10px rgba(0,0,0,0.5);

/* hover */
background: #0D5F6D;
transform: translateY(-2px);
box-shadow: 0 18px 40px -14px rgba(26,142,156,0.7);
```

**Outline (사진 위)**
```css
background: rgba(255,255,255,0.1);
color: #FFFFFF;
border: 1.5px solid rgba(255,255,255,0.45);
backdrop-filter: blur(10px);
```

**Outline (밝은 배경)**
```css
background: transparent;
color: #0E2B30;
border: 1.5px solid #DCE7E8;
```

### 6.3 카드 (학습 영역용)

```css
background: #FFFFFF;
border: 1px solid #DCE7E8;
border-radius: 18px;
padding: 36px 28px 32px;
transition: all 0.4s ease;

/* hover */
transform: translateY(-4px);
border-color: #86D0D6;
box-shadow: 0 24px 48px -24px rgba(26, 142, 156, 0.25);
```

### 6.4 입력 필드

```css
padding: 14px 18px;
border: 1.5px solid #DCE7E8;
border-radius: 12px;
background: #F8FCFC;
font: 400 15px Pretendard;

/* focus */
border-color: #1A8E9C;
background: #FFFFFF;
outline: none;
/* 접근성: outline:none 시 visible focus ring 다른 방식으로 제공 */
box-shadow: 0 0 0 3px rgba(26,142,156,0.2);
```

### 6.5 네비게이션 (고정 헤더)

```css
position: fixed;
padding: 22px 40px;
backdrop-filter: blur(14px) saturate(140%);
background: rgba(10, 58, 66, 0.28);  /* 사진 위 */
/* 또는 */
background: rgba(248, 252, 252, 0.85); /* 학습 영역 */
border-bottom: 1px solid rgba(255,255,255,0.1);
```

### 6.6 진주 스탬프 (PRD §6 명시)

```css
/* 완료 진주 */
width: 28px; height: 28px;
border-radius: 50%;
background: radial-gradient(circle at 30% 30%, #B8E0DC, #3FB5AE);
box-shadow: 0 2px 8px -2px rgba(63, 181, 174, 0.4);

/* 미완 진주 */
background: #F1E9DB;
border: 1.5px dashed #D8CCB5;
```

숫자·% 표시 절대 금지 (PRD §2 유지).

---

## 7. 레이아웃 원칙

### 7.1 컨테이너

```css
max-width: 1100px;
margin: 0 auto;
padding: 0 40px;
```

모바일(≤720px): `padding: 0 24px`

### 7.2 그리드

- **컨텐츠 카드 그리드**: `repeat(3, 1fr)`, 22px gap
- **태블릿** (≤960px): `repeat(2, 1fr)`
- **모바일** (≤720px): `1fr`, 16px gap

### 7.3 섹션 간 호흡

- 데스크탑: `padding: 120-160px 40px`
- 모바일: `padding: 80-100px 24px`

### 7.4 텍스트 max-width (가독성)

- 본문 단락: 600~680px
- 부제: 540px
- 한 줄 헤드라인: 760px

---

## 8. 랜딩 페이지 구조 (확정본)

### 8.1 4 Stage 서사 구조

| Stage | 깊이 | 내용 | 색 시스템 |
|---|---|---|---|
| 1 | 수면 | 히어로 (윤슬 사진 + 슬로건 + 버튼) | 청록 + 윤슬 → 하단 옅은 청록 페이드 |
| 2 | 수면 아래 | 6가지 컨텐츠 도구 카드 (3×2 그리드) | 옅은 청록 + 흰빛 |
| 3 | 중간 깊이 | 5권 커리큘럼 리스트 | 옅은 청록 → 깊은 청록 그라데이션 |
| 4 | 가장 깊은 곳 | 마지막 CTA + footer | 깊은 청록 → 가장 깊은 청록 + 별빛 |

### 8.2 카피 (확정)

| 위치 | 텍스트 |
|---|---|
| Hero H1 | 광고도 결제도 없이,<br>차근차근 경제를 배우다 |
| Hero Sub | 5권 125편으로 천천히 흐르는 경제 강의.<br>당신의 속도에 맞춰 시작하세요. |
| Hero Primary CTA | 강의 둘러보기 |
| Hero Outline CTA | 로그인 |
| Stage 2 H2 | 차분히 배울 수 있는<br>여섯 가지 도구 |
| Stage 2 Sub | 강요하지 않고, 흐름을 끊지 않으며,<br>당신이 멈추고 싶을 때 멈출 수 있도록. |
| Stage 3 H2 | 5권 125편의 흐름 |
| Stage 3 Sub | 처음부터 끝까지 순서대로 읽어도 좋고,<br>관심 가는 권부터 펼쳐도 좋습니다. |
| Stage 4 H2 | 지금, 천천히<br>첫 편을 펼쳐 보세요 |
| Stage 4 Sub | 계정 없이도 둘러볼 수 있습니다.<br>학습 흔적을 남기고 싶을 때만 가입하세요. |
| Footer 1 | 결제 정보를 받지 않습니다 · 광고 없음 |
| Footer 2 | CC BY-NC-SA 4.0 라이선스로 배포됩니다 |
| Footer 3 | 제작 · ELLA PARK |

### 8.3 6가지 컨텐츠 카드 (확정 배치)

**1행 — 학습 활동**
1. 125편의 영상 강의
2. 글로 읽는 학습
3. OX 퀴즈로 이해 확인

**2행 — 지원 도구**
4. 핵심 용어 사전
5. 진주 스탬프 맵
6. 교사용 PDF 자료

### 8.4 5권 커리큘럼 (잠정 — Ella님의 실제 마스터 데이터로 교체 필요)

| 권 | 제목 | 한 줄 설명 | 편수 |
|---|---|---|---|
| 1권 | 시장과 가격 | 왜 어떤 것은 비싸고 어떤 것은 싼가 | 25편 |
| 2권 | 화폐와 금융 | 돈은 어떻게 흘러가고, 어디에서 만들어지나 | 25편 |
| 3권 | 거시 경제의 흐름 | 금리, 환율, 성장 — 큰 그림을 보는 법 | 25편 |
| 4권 | 글로벌과 무역 | 국가들 사이의 경제는 어떻게 연결되어 있나 | 25편 |
| 5권 | 우리의 일상과 선택 | 배운 것을 매일의 판단에 어떻게 쓰는가 | 25편 |

⚠️ **`경제판단력교과서_마스터_v3.xlsx`의 실제 데이터로 반드시 교체할 것.**

---

## 9. PRD §1과의 정합화 노트

본 문서 확정에 따라 PRD §1 일부 조항이 다음과 같이 수정·확장된다.

### 9.1 표현 수정

| PRD §1 원문 | 수정 |
|---|---|
| "기능주의적 미니멀리즘(functional minimalism)" | **"부드러운 미니멀리즘(Soft Minimalism)"** |
| "Pretendard universally for all elements" | **"Hahmlet (헤딩) + Pretendard (본문 · UI)"** |

### 9.2 추가 조항 (§1.4 신설)

> **§1.4 영역별 시각 정책**
>
> - **랜딩 페이지 한정**: 풀스크린 사진, Ken Burns 효과, 깊이별 색 그라데이션, 미세 별빛 모션 허용
> - **학습 영역 (레슨/퀴즈/스탬프 맵/관리자/폼)**: 기존 정책 그대로 — 사진 없음, 일러스트 없음, 300ms 페이드만
> - **접근성**: `prefers-reduced-motion` 활성 시 랜딩 페이지의 모든 모션도 즉시 비활성화

### 9.3 유지되는 조항 (변경 없음)

- 게이미피케이션 금지 (No points, scores, ranks, levels, badges, %)
- 후킹 언어 금지 (No urgency, FOMO, countdown)
- 결제·광고 정보 없음
- 최소 PII (이메일, 닉네임, 비밀번호만)
- WCAG AA 대비 4.5:1
- 시각장애 사용자 키보드 100% 접근
- 자막 기본 ON

---

## 10. 결정 이력 (Decision Log)

투명성을 위해 폐기된 시도까지 기록한다.

| 시도 | 핵심 결정 | 결과 |
|---|---|---|
| v1 | "유럽 그림책 일러스트" + "편안함" 답변 기반 → 따뜻한 베이지/해질녘 산호 톤, Gowun Batang 명조 | ❌ 폐기 (이미지 레퍼런스와 어휘 답변의 불일치 발견) |
| v2 | Unsplash 항공 뷰 사진 + Hahmlet | ❌ 폐기 (호텔/리조트 클리셰 우려, "도서관 노트" 본질 이탈) |
| **v3** | **윤슬 클로즈업 사진(Neo Lee) + Hahmlet + 푸른 청록 액센트** | ✅ **확정** |

### 폐기 시도에서 배운 교훈

- **어휘만으로 디자인 방향을 추론하면 안 된다.** 이미지 레퍼런스를 항상 먼저 모은다.
- **클리셰 회피는 의식적으로 검증해야 한다.** 풀스크린 사진 = 호텔 사이트 클리셰 함정.
- **모순으로 보이는 것이 모순이 아닐 수 있다.** 마스코트 실루엣은 일러스트가 아니라 심볼이다.

---

## 11. 남은 작업 (v3.1 시점 갱신)

### 11.1 즉시 후속

1. ⏳ **`firebase_studio_ui_prompt.md` 재작성** — 본 문서 v3.1 + `PROJECT_DECISIONS_v1.md` 반영. (다음 작업 C-3)
2. ⏳ **2~5권 실제 제목·핵심 개념·학습목표 추출** — `경제판단력교과서_마스터_v4.xlsx` (v3 아님) 참조. (다음 작업 C-2)
3. ✅ **PRD §1 수정 반영** — `PROJECT_DECISIONS_v1.md` §1.3·§1.4에서 결정 완료.

### 11.2 시각 자산 확보

4. ⏳ **레퍼런스 이미지 자료실 정리** — Ella님의 8장 + Pinterest 콜라주를 Notion 또는 Figma에 "Beach Reference v1" 페이지로 모으기.
5. ⏳ **추가 사진 큐레이션** — 빈 상태(Empty State)용 부드러운 윤슬 사진 2~3장 더 확보. (현재는 빈 상태에 사진 안 씀, SVG 심볼만 — §13.6 참조)
6. ⏳ **`shell_pearl.png` 라이선스 확인** — GPT 생성, 상업 이용 가능성 검토. (`PROJECT_DECISIONS_v1.md` §4.2)

### 11.3 학습 영역 8개 화면 디자인 ✅ **전체 완료 (v3.1)**

본 문서 §6 컴포넌트 규격과 §7 레이아웃 원칙 + §13 v3.1 결정 사항으로 1차 구현 완료:

- [x] 용어 사전 (`/dictionary`) — `dictionary_v1.html`
- [x] 회원가입·로그인 통합 (`/auth/*`) — `auth_v1.html` (카카오 OAuth 포함)
- [x] 레슨 시청 (`/lesson/[id]`) — `lesson_watch_v1.html` (영상↔글 토글, OX 퀴즈, 학습 흔적 모달)
- [x] 스탬프 맵 (`/stamp-map`) — `stamp_map_v3.html` (5권 권별 진주)
- [x] 교사용 PDF (`/teacher/kit/[id]`) — `teacher_kit_v1.html`
- [x] 관리자 대시보드 (`/admin/dashboard`) — `admin_dashboard_v1.html`
- [x] 빈 상태 / 오류 페이지 — `empty_states_v1.html` (404 / 학습 시작 전 / 로그인 필요 / 검색 결과 없음 4종 시안)

### 11.4 v3.1 시점 미해결 (보류)

- **마스코트 (혹등고래 실루엣 3마리)** — 랜딩 페이지에서 제거됨 (Ella님 결정). 다른 화면 활용 여부 추후 결정.
- **로고 디자인** — "고요의 경제나루" 텍스트 로고 외에 심볼 로고 미정.
- **진주 색 overlay 모바일 좌표 미세 어긋남** — `lesson_watch_v1.html` 학습 흔적 모달 (`PROJECT_DECISIONS_v1.md` §4.1).
- **다크 모드 디자인** — VDS_v3에 토큰 일부 정의, 실제 시안 미적용. PRD §1 "달빛 비추는 밤바다" launch 시점 결정.
- **OX 퀴즈 데이터셋** — 현재 1편만, 총 133편 × 5문제 필요. C-2와 함께.

---

## 12. 빠른 참조 (Quick Reference for AI Prompts)

이 절은 디자인 도구에 프롬프트를 던질 때 그대로 복사해 쓰는 용도다.

```yaml
project: 경제 판단력 교과서 (고요의 경제나루)
concept: 맑고 투명한 해변. 한낮의 청록빛 얕은 물과 윤슬.
mood: 청량함, 투명함, 빛, 여백, 조용함
first_impression: 편안함 (마음이 놓이는 느낌)

colors:
  bg: "#F8FCFC"
  card_water: "#EBF5F5"
  accent_soft: "#86D0D6"
  accent_main: "#1A8E9C"
  accent_deep: "#0D5F6D"
  accent_darkest: "#052830"
  text_main: "#0E2B30"
  text_soft: "#4A5A60"
  line: "#DCE7E8"

typography:
  heading: "Hahmlet 600/700"
  body: "Pretendard Variable 400"
  body_line_height: 1.85

radius:
  sm: 6px, md: 12px, lg: 18px, xl: 20px

forbidden:
  - 게이미피케이션 (점수, 등수, 배지, %, +pt)
  - 후킹 (긴급, FOMO, 카운트다운)
  - 일러스트 (단, 작은 SVG 심볼은 허용)
  - 사진 (학습 영역에는 사용 금지)
  - 검정 #000, 순백 #FFF
  - 화려한 모션 (학습 영역에서)
  - 따뜻한 색조 (해질녘, 노을, 베이지 우세)

motion:
  default: "300ms ease-in-out fade only"
  landing_only: "Ken Burns, depth gradient, deep sparkles allowed"
  accessibility: "prefers-reduced-motion 활성 시 모두 비활성화"

accessibility:
  contrast: WCAG AA (≥4.5:1)
  keyboard: 100% navigable
  focus_ring: visible (outline:none 금지)
  reduced_motion: respected
```

---

## 13. v3.1 변경 사항 (2026-05-13) — 학습 영역 시안 결과

본 섹션은 v3.0 발행 직후 진행된 *학습 영역 8개 화면 시안*에서 도출·검증된 결정을 본 문서에 박제한 것이다. 본 섹션의 결정은 모두 시안 코드로 1차 구현·검증되었다.

상위 결정 이력은 `PROJECT_DECISIONS_v1.md` §3 참조.

### 13.1 진주 디자인 — 3-layer approach (확정)

진주는 세 개 레이어로 구성된다. **권 색은 진주 자체의 색이 아니라, 흰빛 진주에 비치는 영롱한 빛이다.**

```
Layer 3 (위):   작은 흰빛 highlight 반사점 (32%, 28% 위치)
Layer 2 (중):   권별 영롱한 색 tint (얇게 비침)
Layer 1 (아래): 흰빛~크림 진주 광택 베이스
                #FFFFFF → #FBF7F0 → #ECDFCC → #C8B8A4
```

**CSS 구현 (완료 진주 1권 예시)**:
```css
.pearl-done.pearl-vol-1 {
  background:
    radial-gradient(circle at 32% 28%,
      rgba(255,255,255,0.95) 0%,
      rgba(255,255,255,0) 22%),
    radial-gradient(circle at 55% 55%,
      rgba(184, 218, 235, 0.32) 30%,
      rgba(184, 218, 235, 0.1) 70%,
      rgba(255, 235, 235, 0.12) 100%),
    radial-gradient(circle at 38% 30%,
      #FFFFFF 0%, #FBF7F0 45%, #ECDFCC 85%, #C8B8A4 100%);
  box-shadow: 0 3px 10px -2px rgba(160, 145, 130, 0.4);
}
```

**미완 진주**: 권 색 점선 outline + 내부 투명
```css
.pearl-todo.pearl-vol-1 {
  background: transparent;
  border: 1.5px dashed rgba(184, 210, 229, 0.65);
}
```

### 13.2 권별 영롱 tint (Layer 2) — 확정 토큰

| 권 | 권 이름 | rgba (밀도 0.32~0.42) | 비유 |
|---|---|---|---|
| 1권 | 돈의 언어 | `rgba(184, 218, 235, _)` | 옅은 하늘 |
| 2권 | 돈의 흐름 | `rgba(240, 197, 208, _)` | 옅은 분홍 |
| 3권 | 돈의 구조 | `rgba(245, 224, 181, _)` | 옅은 노랑 |
| 4권 | 돈의 결정 | `rgba(200, 223, 196, _)` | 옅은 연두 |
| 5권 | 돈의 인생 | 미묘한 분홍·하늘 혼합 또는 무첨가 | **순백 진주** (가장 영롱) |

5권은 *학습 종착점*의 의미로 가장 영롱한 흰 진주로 표현. 권 색 tint를 거의 넣지 않거나 미묘하게만.

### 13.3 학습 흔적 모달 (Completion Modal) — 신설 컴포넌트

PRD §1의 게이미피케이션 회피 원칙과 정합하는 *유일한 모달*이다.

**트리거**: 레슨 페이지에서 OX 5문제 모두 정답 (서버 검증 후)

**허용 조건** (PRD §1과 정합):
- 300ms 페이드 인만, 다른 모션 금지
- 어휘: "획득/축하" 금지, **"흔적/마침"** 사용
- 사용자 자유 닫기 (ESC / backdrop / X)
- 카카오 공유는 선택, 자동 X

**모달 디자인 토큰**:
- backdrop: `rgba(14, 43, 48, 0.5)` + `backdrop-filter: blur(6px)`
- card: 흰 배경, `border-radius: 22px`
- shadow: `0 24px 48px -16px rgba(13,95,109,0.3)`
- transition: `opacity 300ms ease` + `transform: translateY(12px → 0)`

**모달 내용 구성**:
1. eyebrow: "학습 흔적" (mono, 11px, accent-deep)
2. 조개·진주 비주얼 (140px 정도)
3. 학습 주제명 + 부제 (Hahmlet)
4. 요약 2~3문장 (Pretendard, water-card 배경 박스)
5. 날짜·시간 (mono, `YYYY.MM.DD (요일) HH:MM`)
6. 카카오 공유 버튼 + 닫기 버튼

**조개·진주 비주얼 표현**:
- 베이스 이미지: `shell_pearl.png` (480×480, base64 임베드 권장)
- 권별 색 표현: 진주 위치에 `mix-blend-mode: color` 오버레이
- 5권은 오버레이 없음 (원본 그대로, 가장 영롱한 흰 진주)

### 13.4 카카오 브랜드 색 (신설)

| 용도 | 색 |
|---|---|
| 카카오 버튼 기본 | `#FEE500` |
| 카카오 버튼 hover | `#F5DC00` |
| 카카오 버튼 텍스트 | `#3C1E1E` |
| 카카오 아이콘 | inline SVG (외부 의존성 없음) |

**배치 원칙**: 카카오 노란색이 사이트 청록 톤과 직접 부딪치지 않도록 *카드 안 컴포넌트로 격리*. 절대 페이지 헤더·전체 배경 등 큰 면적에 사용 금지.

### 13.5 관리자 화면 톤 (신설)

학습자 화면과 *시각적으로 명확히 구분* 하기 위한 디자인 차별화.

| 요소 | 학습자 화면 | 관리자 화면 |
|---|---|---|
| nav 배경 | `rgba(248, 252, 252, 0.92)` 라이트 | **`#052830` (accent-darkest) 다크** |
| nav 텍스트 | `--text-soft` | `rgba(255, 255, 255, 0.7)` |
| "Admin" 배지 | — | `rgba(134, 208, 214, 0.18)` 배경 + accent-soft 텍스트 |
| 본문 영역 | 라이트 모드 | 라이트 모드 (일관성) |

**PII 보호 원칙**:
- 학습자 ID는 모두 마스킹 (`jih****`, `eco****`)
- 등수·점수·랭킹 *관리자도 보지 않음* (PRD §1 정합)
- 활동 로그는 시간 순서만, 학습자별 누적 비교 없음

### 13.6 빈 상태 (Empty State) 패턴 (신설)

4가지 시나리오 패턴 확립:

| 시나리오 | 심볼 | 제목 톤 |
|---|---|---|
| 404 | 큰 "404" 타이포 (Hahmlet, water-light 색) | "찾으시는 페이지가 없어요" |
| 학습 시작 전 | 빈 진주 점선 outline (72px) | "아직 켜진 진주가 없습니다" |
| 로그인 필요 | line SVG 자물쇠 (64px) | "로그인이 필요해요" |
| 검색 결과 없음 | line SVG 돋보기 (64px) | "찾으시는 단어가 없습니다" |

**금지 표현**: "어머!", "이런!", "헐", 폭죽·이모지 남발, "다시 시도하세요!" 같은 명령형.

**CTA 구성**: 주요 행동 1개(`--accent-main` 채움) + 보조 행동 1개(outline). 부가 안내(연락처 등)는 작게.

### 13.7 PRD 정합화 결정 (신규 4건)

본 v3.1에서 PRD §1·§3·§5·§6과 새로 정합화한 결정:

1. **카카오 OAuth 추가** (PRD §3 보강) — 이메일·닉네임만 수집하므로 PRD §3 최소 PII 원칙과 정합. 대안 인증 방식이지 추가 PII 수집 아님.

2. **학습 흔적 모달 허용** (PRD §1 예외 조항) — §13.3의 4가지 허용 조건을 모두 충족하면 PRD §1 게이미피케이션 회피 원칙과 정합.

3. **진주 권별 색 적용** (PRD §6 보강) — 시각적 권 구분 + 진주 메타포 정확화(베이스는 흰빛, 권 색은 영롱한 빛). 학습자 자랑·등수와 무관.

4. **편 수 정정** (PRD 전반) — 마스터 v4 기준 125편 → **133편** (1권 27 / 2권 25 / 3권 25 / 4권 31 / 5권 25).

자세한 결정 근거는 `PROJECT_DECISIONS_v1.md` §1.1~§1.5 참조.

### 13.8 v3.1 Quick Reference (AI 프롬프트용 추가 토큰)

§12의 기존 Quick Reference에 추가:

```yaml
volume_pearl_tints:
  vol_1: "rgba(184, 218, 235, 0.32)"
  vol_2: "rgba(240, 197, 208, 0.34)"
  vol_3: "rgba(245, 224, 181, 0.38)"
  vol_4: "rgba(200, 223, 196, 0.34)"
  vol_5: "transparent"  # 순백 진주

pearl_base_gradient: |
  radial-gradient(circle at 38% 30%,
    #FFFFFF 0%,
    #FBF7F0 45%,
    #ECDFCC 85%,
    #C8B8A4 100%)

pearl_highlight_gradient: |
  radial-gradient(circle at 32% 28%,
    rgba(255,255,255,0.95) 0%,
    rgba(255,255,255,0) 22%)

completion_modal:
  backdrop: "rgba(14, 43, 48, 0.5)"
  blur: "6px"
  card_radius: "22px"
  card_shadow: "0 24px 48px -16px rgba(13, 95, 109, 0.3)"
  transition: "opacity 300ms ease, transform 300ms ease"
  initial_transform: "translateY(12px)"
  active_transform: "translateY(0)"

kakao:
  yellow: "#FEE500"
  yellow_hover: "#F5DC00"
  text: "#3C1E1E"

admin_nav:
  background: "#052830"  # accent-darkest
  text: "rgba(255, 255, 255, 0.7)"
  active_text: "#FFFFFF"
  badge_bg: "rgba(134, 208, 214, 0.18)"

empty_state:
  title_font: "Hahmlet"
  title_weight: 600
  title_size: "22~28px"
  symbol_color: "var(--accent-soft)"  # 옅은 청록
  cta_primary: "var(--accent-main)"   # 큰 청록 버튼

volume_episode_counts:
  vol_1: 27
  vol_2: 25
  vol_3: 25
  vol_4: 31
  vol_5: 25
  total: 133
```

### 13.9 산출물 (구현 검증된 시안 파일)

본 v3.1의 결정이 코드로 1차 구현된 파일 목록:

| 화면 | 파일 |
|---|---|
| 랜딩 (4단계 풀페이지) | `landing_fullpage_v2.html` |
| 레슨 시청 + 학습 흔적 모달 | `lesson_watch_v1.html` |
| 스탬프 맵 (권별 진주) | `stamp_map_v3.html` |
| 용어 사전 | `dictionary_v1.html` |
| 회원가입·로그인 (카카오 포함) | `auth_v1.html` |
| 교사용 PDF | `teacher_kit_v1.html` |
| 관리자 대시보드 | `admin_dashboard_v1.html` |
| 빈 상태 4종 시안 | `empty_states_v1.html` |
| 조개·진주 자산 | `shell_pearl.png` |

### 13.10 v3.1 미해결 (다음 처리)

본 시안 작업에서 의도적으로 보류한 항목 — `PROJECT_DECISIONS_v1.md` §4 참조.

핵심:
- 진주 색 overlay 모바일 좌표 미세 어긋남 (중간 우선순위)
- `shell_pearl.png` 라이선스 확인 (높은 우선순위)
- 2~5권 데이터 미입력 (다음 작업 C-2)
- 다크 모드 디자인 미완 (낮은 우선순위, launch 시점)
- OX 퀴즈 데이터셋 (1편만 있음, 추후 C-2에서 함께 추출)

---
도구나 협업자가 바뀌어도 이 문서를 따른다.

**이상.**
본 문서는 디자인 결정의 단일 출처(Single Source of Truth)다. v3.1 갱신으로 학습 영역 시안 결정까지 모두 반영되었다.
