# [UI_FR-HEADER-001] 공용 SiteHeader 추출 + 세션 배선

> **상태: DRAFT (스펙 초안, pre-issue).** grill 세션 3(`docs/grill/GRILL_LEDGER.md` H1~H4)에서 확정.
> GitHub 이슈 발행·구현·하네스 반영은 **goal 단계**에서(사용자 확인 후). 이 파일은 결정 스펙만 담는다.

## 1. 배경·문제

공용 `Header` 컴포넌트가 없어, `app/{page, teacher-kit, dictionary, stamp-map, lesson/[id]}/page.tsx` **5개 파일이 인라인 `<nav>` + 정적 `<Link href="/login">로그인</Link>`을 각자 복제**한다. 세션(로그인 여부·닉네임)은 어디에도 반영되지 않는다. 랜딩만 dark 스타일, 나머지 4개는 light.

목표: ⑴ 헤더를 단일 `SiteHeader`로 추출(5중복 제거), ⑵ 로그인 상태를 헤더에 반영(닉네임/로그아웃).

## 2. 확정 결정 (grill 세션 3)

### H1 — 세션 배선 메커니즘: 라우트 그룹 + 서버 layout (옵션 4)
- `app/(site)/` **라우트 그룹**(URL 불변)으로 5개 페이지 이동. `admin`/`login`/`not-found`/`playboard`는 그룹 밖 → 다른 nav와 무충돌.
- 그룹 **서버 `layout.tsx`**가 `getViewerSession()` 호출 → `SiteHeader`(client)에 `session` prop 주입.
- **layout.tsx 헤더 승격 금지 제약과 정합**: 금지 대상은 admin 등과 충돌하는 *공용/루트* layout 승격이며, 그룹 전용 layout은 그 충돌을 구조적으로 회피한다.
- 사실 확인: 5페이지 이동 시 import(`@/`·co-located만)·테스트 **무파손**, lesson 부속 layout/loading/error **없음**, 공유 layout은 **클라 네비 간 재실행 안 됨**(세션 재조회 비용 낮음, `getCurrentUser`는 요청당 `React.cache`).

### 전제 정정 (수용) — `sessionActive` 재사용 불가
기존 `sessionActive`(#238)는 `lessonId`에 **결합**되고 **닉네임을 담지 않아** 헤더에 재사용 불가. 따라서 **lesson 비결합 + no-throw 세션 함수 신설**이 공통 전제.

```ts
// lib/auth/viewer-session.ts  (신규, server-only, lesson 비결합)
export type ViewerSession =
  | { authenticated: true; nickname: string }
  | { authenticated: false };

export async function getViewerSession(): Promise<ViewerSession> {
  try {
    const user = await getCurrentUser();               // null | User | throw(AuthError)
    return user
      ? { authenticated: true, nickname: user.nickname }
      : { authenticated: false };                       // 익명 — 정상
  } catch (e) {
    // orphan(auth↔public sync 깨짐 AuthError)·일시 DB 오류 → 미인증 degrade
    console.error("[getViewerSession] 세션 읽기 실패 — 미인증 degrade", e); // TODO(CT-DB-009) EventLog
    return { authenticated: false };
  }
}
```
- **반환 타입**: 판별 유니온 `ViewerSession`.
- **폴백 값**: orphan(`AuthError`)·DB 오류 → `{ authenticated: false }` + anomaly `console.error`. **절대 throw 안 함**(`getViewerProgress` #240과 동일 degrade 철학).

### H2 — orphan no-throw 가드: 함수 no-throw + 방어적 렌더 (2단)
1. `getViewerSession()` try/catch = 단일 서버 가드점.
2. 그룹 layout의 유일한 동적 호출이 이 no-throw 함수뿐 → layout throw 경로 없음.
3. `SiteHeader`(client)는 prop 순수 렌더 — `authenticated !== true`(undefined 포함) 전부 익명 처리 → `로그인` 링크. 컴포넌트 자체가 throw 불가.
- `app/(site)/error.tsx`는 **미신설**(throw 경로 없음, 스코프 최소). 스펙상 "향후 경화 옵션"으로만 기록.

> **H2 불변식 메모:** `app/(site)/error.tsx`는 **layout 오류를 잡지 못하고 상위로 전파**되므로, layout 방어는 `getViewerSession()`의 **no-throw 계약이 유일한 수단**이다. **layout에 추가되는 동적 호출은 모두 no-throw여야 한다.**

### H3 — SiteHeader 인터페이스
```tsx
// app/(site)/_components/SiteHeader.tsx   'use client'
import { usePathname } from 'next/navigation';
import type { ViewerSession } from '@/lib/auth/viewer-session';

const NAV_ITEMS = [
  { href: '/',           label: 'HOME' },
  { href: '/dictionary', label: 'INDEX' },
  { href: '/stamp-map',  label: 'STAMP MAP' },
];

export function SiteHeader({ session }: { session: ViewerSession }) {
  const pathname = usePathname();
  const variant  = pathname === '/' ? 'dark' : 'light';   // 공유 layout이라 prop 불가 → 런타임 파생
  const isActive = (href: string) => pathname === href;   // active = NAV_ITEMS 매칭만(랜딩→HOME, /dictionary→INDEX, /stamp-map→STAMP MAP)
  // 우측 슬롯:
  //   session.authenticated
  //     ? <span>{session.nickname}</span> + <button>로그아웃</button>   // 닉네임 비링크 라벨
  //     : <Link href="/login">로그인</Link>
}
```
- **prop**: `session: ViewerSession` 하나만.
- **variant / active**: `usePathname` 런타임 파생(공유 layout이 자식별 prop을 못 넘김). `NAV_ITEMS`(HOME·INDEX·STAMP MAP) 단일 배열로 링크·active DRY. active는 pathname이 NAV_ITEMS와 매칭될 때만 — `/teacher-kit`·`/lesson/[id]`는 매칭 항목이 없어 **강조 없음**.
- **로그인 상태 affordance**: 닉네임 **비링크 라벨** + **로그아웃**. 로그아웃 = 기존 `signOut()` Server Action(`app/auth/actions.ts`) → `router.refresh()`로 그룹 layout 재실행 → 익명 재렌더. **신규 라우트 0.**
- **세션 즉시 반영**: 로그인/로그아웃 성공 시 `router.refresh()` 필수(layout이 서버라 SSR 시점 세션 값 → 클라 네비만으론 안 바뀜).

> **사실확인 각주 (grill 세션 3 후속):**
> - **signOut() 충돌 없음**: `app/auth/actions.ts`의 `signOut()`은 `supabase.auth.signOut()`만 하고 **`redirect()` 미호출·반환 `{ ok: true }`** → 호출부의 `router.refresh()`와 이중 내비게이션 충돌 없음. 클라에서 `await signOut(); router.refresh()` 패턴 그대로 안전.
> - **nickname 빈 값 방어 불요**: `User.nickname`은 `@db.VarChar(40)` **NOT NULL**이고, `lib/auth/sync-user.ts`가 metadata 부재 시 `email` 로컬파트로 폴백 → 모든 `public.User`에서 **비어 있지 않음 보장**. `session.nickname`은 항상 렌더 가능(이메일·카카오 공통).

### H4 — 2-PR 분할 + drift 정규화
헤더 1개가 5페이지를 렌더 → 페이지별 drift 보존 불가·정규값 선택 강제 → **PR-A는 "기능 0변경 + 시각적 수렴"**(바이트 동일 아님).

**PR-A (구조 추출 · 기능 0변경 · 정적 로그인 유지)**
- `app/(site)/` 그룹 생성 + 5페이지 `git mv`.
- `SiteHeader` 추출 + 그룹 `layout.tsx` 신설 + 5개 인라인 `<nav>` 제거.
- **drift 정규화**:
  - light 정규값: `bg-[#F8FCFC]/90` · `md:gap-6` · 링크 `text-sm`. (lesson·stamp-map `/85`, lesson `gap-[26px]`·`text-[14px]` 수렴)
  - dark 정규값: 랜딩 현행(`fixed`·teal 반투명·white·`gap-7`) variant로 보존.
  - active 강조: **랜딩 HOME에만 신규 강조** 등장(현재 랜딩은 무강조). `/dictionary`→INDEX·`/stamp-map`→STAMP MAP은 현행 유지. `/teacher-kit`·`/lesson/[id]`는 NAV_ITEMS 미포함 → 강조 대상 아님. skip-link는 light variant만.
- 헤더는 **정적 `로그인` 유지**(세션 0). 검증 seam = **5페이지 시각 동등**.

**PR-B (세션 배선)**
- `getViewerSession()` 신설 + 그룹 layout에서 호출 → `SiteHeader` `session` prop 주입.
- 닉네임 라벨/로그아웃(`signOut()` → `router.refresh()`) + 로그인·로그아웃 후 `router.refresh()`.
- 검증 seam = **세션 반영**(익명→로그인→orphan degrade).

## 3. Acceptance Criteria

**PR-A (구조 추출 · 기능 0변경)**
- [ ] `app/(site)/` 그룹에 5페이지 이동, **URL 5개 모두 불변**, `npm test` green(경로·import 무파손).
- [ ] **헤더 마크업을 검증하는 기존 테스트가 0건이므로, `npm test` green은 PR-A의 시각적 회귀를 보장하지 않는다. 시각 검증은 아래 육안 대조 항목으로만 판정한다.**
- [ ] 5페이지 헤더가 단일 `SiteHeader`로 렌더, 랜딩=dark/나머지=light, 현재 항목 active 강조.
- [ ] **랜딩 dark variant는 `fixed` 유지**(hero 오버레이 보존). hero 첫 섹션은 현행처럼 헤더 높이 보정 padding 없음(무보정 확인됨) → layout 이관 후에도 상단 여백 조정 불필요.
- [ ] **skip-link(`<a href="#main">`)는 light variant만** 렌더. 대상 `id="main"`은 teacher-kit·dictionary·stamp-map·lesson 4개 `<main>`에 실재(확인됨) → 타겟 유효. 랜딩(dark)은 skip-link 없음(현행 일관).
- [ ] 5페이지 인라인 `<nav>` 제거, 시각적으로 현행과 동등(정규화된 outlier — lesson·stamp-map bg, lesson gap/text — 는 문서화된 의도 수렴).
- [ ] 헤더는 로그인 여부와 무관하게 정적 `로그인` 링크(세션 미배선).
- [ ] **`SiteHeader` 단위 테스트 신규 추가**(현재 헤더 마크업 커버리지 0): variant 파생(`/`→dark / 그 외→light), active item 파생, NAV_ITEMS 렌더, skip-link light-only.
- [ ] **육안 before/after 대조**(머지 전 수행, 개별 체크):
  - [ ] 랜딩: hero 오버레이 유지, 헤더가 hero 콘텐츠를 가리지 않음
  - [ ] light 4곳: 배경 불투명도(`/85`→`/90` 수렴)·gap(`26px`→`24px`=`gap-6` 수렴) 적용 확인
  - [ ] 랜딩 HOME 신규 active 강조 확인 (teacher-kit·lesson은 NAV_ITEMS 미포함이라 강조 대상 아님)
  - [ ] Tab 키로 skip-link 포커스 → `#main` 도달 (light 4곳)
- [ ] **클라 네비게이션 확인**: 헤더가 layout 상주로 마운트 유지된 채 variant만 전환. 랜딩 → `/dictionary` → 랜딩 이동 시 `fixed`↔`sticky` 전환에서 **레이아웃 점프·헤더 사라짐 없음** 확인.

**PR-B (세션 배선)**
- [ ] 익명: `로그인` 링크. 로그인: `{nickname}` + `로그아웃`.
- [ ] orphan 계정/DB 오류: 헤더 **throw 없이** 익명 렌더(`getViewerSession` degrade), 페이지 200.
- [ ] 로그아웃 클릭 → `signOut()`(redirect 미호출·`{ok:true}` 확인됨) → `router.refresh()` → 헤더 익명 전환(이중 내비게이션 없음).
- [ ] 로그인/로그아웃 직후 헤더 세션 상태 반영(`router.refresh()`).
- [ ] **`getViewerSession()` 단위 테스트**: 익명→`{authenticated:false}`, 로그인→`{authenticated:true,nickname}`, orphan(`AuthError`)·DB오류→`{authenticated:false}`(throw 안 함). `nickname` 항상 non-empty 전제(폴백 보장) 반영.
- [ ] **`SiteHeader` 세션 렌더 테스트**: `authenticated:true`→닉네임+로그아웃, `authenticated:false`/undefined→로그인 링크(방어적 렌더).
- [ ] **닉네임 truncate**: `nickname` 최대 40자(`varchar(40)`). 긴 닉네임에서 nav가 밀리지 않도록 `truncate`/`max-width` 처리. **40자 닉네임으로 실측 확인.**

## 4. 리스크·검증 포인트
- **랜딩 dark 헤더 픽셀 동등**: 현재 nav가 hero `<section>` 내부 `fixed` 오버레이 → layout 자식으로 이관 시 z-index/배경 레이어 재현 확인(PR-A 최대 리스크).
- **drift 정규화 시각 변화**: outlier 페이지(lesson·stamp-map bg, lesson gap/text)에 미세 변화 — 의도된 수렴, 리뷰에 명시.
- **active 강조 신규 추가**: **랜딩 HOME**에 강조 등장(현재 무강조 → NAV_ITEMS 매칭). teacher-kit·lesson은 NAV_ITEMS 미포함이라 강조 없음.

## 5. 신규/변경 파일 (goal 단계)
- 신규: `app/(site)/layout.tsx`, `app/(site)/_components/SiteHeader.tsx`, `lib/auth/viewer-session.ts`(+테스트).
- 이동: `app/{page,teacher-kit,dictionary,stamp-map,lesson/[id]}` → `app/(site)/…`.
- 변경: 5페이지 인라인 `<nav>` 제거.
- 미변경: `admin`/`login`/`not-found`/`playboard` nav, `app/layout.tsx`(루트), `/api/auth/me`(소비자 없음, 계약 유지 — 헤더는 별도 API 불필요: 옵션4는 layout 서버 조회라 `/api/auth/session` 신규 엔드포인트도 불필요).
