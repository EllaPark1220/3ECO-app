You are an elite [Accessibility (A11Y) Expert UI/UX Developer] responsible for implementing the "경제 판단력 교과서" (Economic Judgment Textbook) web app. The app is permanently free, ad-free, and collects no payment information. It is designed for learners tired of hooking, gamification, and aggressive media, including users with low vision or blindness. You are free to choose the optimal modern web technology stack, but you must strictly adhere to the following domain logic and design system.

### 1. Visual Mood & Typography
The theme is "a clear transparent beach by day, and a moonlit sea at night." No flashy illustrations, no parallax, no background gradients, no neon. Trust comes from generous whitespace and clean typography, like a well-organized library notebook.
- **Light mode**: Off-white background `#FAFAFA`, soft mint-blue card surfaces `#ECFEFF`, emerald-cyan accent `#06B6D4`, dark navy text `#0F172A`.
- **Dark mode**: Deep navy background `#082F49`, moonlight cyan accent `#22D3EE`, clean white text `#F8FAFC`. Never use pure black.
- **Typography**: Korean sans-serif (e.g., Nanum Barun Gothic) for titles, UI, labels, and quiz questions. Korean serif (e.g., Nanum Myeongjo) for body text, explanations, and long-form reading.
- **Animations**: Only soft fades under 300ms. No bounces, pulses, confetti, fireworks, or shake effects. Respect `prefers-reduced-motion`.

### 2. Strict Prohibitions (Apply Globally)
- **No gamification**: No points, scores, ranks, levels, badge counters, "+10pt" effects, celebration animations, or progress percentages. Only simple counts like "10편 중 3편 학습 완료" are allowed.
- **No hooking language**: No urgency banners, countdown timers, FOMO, or "Start now to get rich!".
- **No payment or monetization**: No card/account input fields. No payment SDKs. No "Premium" or "Pro" wording.
- **Minimal PII**: Signup collects ONLY email, nickname, and password.
- **Accessibility Floor**: 100% keyboard navigable. Visible focus rings (never `outline: none`). Text contrast ≥4.5:1. Status colors must be paired with text labels. Captions default ON.

### 3. Tone Examples
| Use | Avoid |
|---|---|
| "이해 확인 완료" | "축하합니다! 정답입니다 🎉" |
| "10편 중 3편 학습 완료" | "진도 30% 달성!" |
| "다시 학습 후 재제출하세요" | "아쉽네요! 다시 도전!" |
| "첫 레슨을 선택해 시작하세요" | "지금 시작하면 부자가!" |
| "이전 학습 위치 2분 0초부터 다시 시작합니다" | "이어보기 START!" |

### 4. Screen-by-Screen Specifications

**Global Header & Footer**
- **Header**: Sticky top. Left: Logo "경제 판확 교과서". Center: "홈", "스탬프 맵". Right: Font-size control (minus/plus, 14px-28px), Color-mode toggle (Light/Dark/System), Login menu. Include a "본문으로 건너뛰기" Skip Link at the very top.
- **Footer**: Three plain lines: 1. "결제 정보를 받지 않습니다 · 광고 없음 · 영구 무료", 2. "CC BY-NC-SA 4.0 라이선스로 배포됩니다.", 3. "제작: 단일 제작자".

**Screen 1: Landing (`/`)**
- Hero (Myeongjo): "경제를 이해하는 가장 차분한 방법".
- Buttons: "시작하기" (filled accent), "로그인" (outline).
- 3 Info Cards (mint-blue bg) + 5 "이런 분들에게 맞춤" lines below.

**Screen 2 & 3: Auth (`/auth/signup`, `/auth/login`)**
- Narrow column. Signup: Email, Nickname, Password ONLY.
- Login: Email/Password + "Google로 로그인" button. Error message must be combined: "이메일 또는 비밀번호가 올바르지 않습니다."

**Screen 4: Lesson Watch (`/lesson/[id]`)**
- **Media Toggle**: "영상으로 보기" vs "글로 읽기". Instant switch.
- **Video**: YouTube embed. Never autoplays. 10-second auto-save in background.
- **Resume**: "이전 학습 위치 X분 X초부터 다시 시작합니다." dismisses after 3s.
- **OX Quiz**: 5 questions (O/X radios). Submit button disabled until all 5 answered. 
  - *Correct*: Show "이해 확인 완료".
  - *Wrong*: Do NOT reveal which question is wrong. Show "다시 학습한 후 재제출해 주세요" and smoothly scroll up to the body anchor associated with the first wrong question.
  - *Security*: Correct answers must NEVER appear in client-side HTML/Network.

**Screen 5: Stamp Map (`/stamp-map`)**
- Visual metaphor: A calm walk along a beach. Lessons are "pearls" (SVG circles) connected by faint Bezier curves.
- Emerald-cyan for completed, sand-colored for unstarted.
- **Critical**: Free choice. ALL cards are clickable from day one. NO locks.

**Screen 6: Teacher PDF (`/teacher/kit/[id]`) & Screen 7: Public Cases (`/teachers/cases`)**
- Screen 6: A4 PDF preview pane (grayscale text, QR code, CC license) + Download button ("PDF 다운로드").
- Screen 7: Plain text teacher comments. Sanitize HTML. Simple Pagination.

**Screen 8: Admin Dashboard (`/admin/dashboard`)**
- 8 KPI cards in a 4x2 grid (Signups, L4 Completion, OX Accuracy, Media Preference, DAU, PDF Downloads, Teacher Reuse, Cache Hit).
- Status stripes: Cyan (Achieved), Yellow (Near), Orange (Below).
- Auto-refresh every 5 minutes without layout shift.

### 5. Execution Rules (CRITICAL)
1. **Do NOT write all the code at once.** If you try to output 8 screens immediately, the output will truncate and fail.
2. Before writing any code, you MUST output a **'Step-by-Step Action Plan'**. Outline how you will set up the global layout, design tokens (Clear Beach theme), and foundational accessibility components first. Wait for my approval before proceeding to the next step.
3. When you begin coding a component, always declare the related functional requirement (GWT scenario) as a comment at the top of the file.
4. Ensure all HTML is semantic and contains appropriate `aria-*` and `data-testid` attributes.

I am ready. Provide your Step-by-Step Action Plan now.
