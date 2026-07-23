// FR-헤더세션 (grill 세션 3, H1) — app/(site) 라우트 그룹 layout (server component).
// URL 불변(라우트 그룹). 공용 SiteHeader 를 5페이지에 상주 렌더하고 children 을 이어 붙인다.
// PR-A: 세션 조회 없음(정적 로그인). PR-B 에서 getViewerSession() 호출 → SiteHeader session prop 주입.
// 제약: 루트/공용 layout 헤더 승격 금지(admin·login·not-found·playboard 별도 nav 충돌)를,
//       그룹 전용 layout 으로 구조적으로 회피.
import { SiteHeader } from './_components/SiteHeader';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
