'use client';

// FR-헤더세션 (grill 세션 3, H3) — 공용 SiteHeader.
// PR-A: 구조 추출 · 기능 0변경 · 정적 로그인 링크(세션 미배선).
// variant/active 는 공유 layout 이 자식별 prop 을 못 넘기므로 usePathname 런타임 파생.
//   - variant: pathname === '/' → dark(랜딩, fixed 오버레이) / 그 외 → light(sticky).
//   - active : pathname 이 NAV_ITEMS 와 매칭될 때만 강조(랜딩 HOME · /dictionary INDEX · /stamp-map STAMP MAP).
//              /teacher-kit · /lesson/[id] 는 NAV_ITEMS 미포함 → 강조 없음.
// 세션(닉네임/로그아웃)은 PR-B 에서 배선. 지금은 정적 <Link href="/login">.
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'HOME' },
  { href: '/dictionary', label: 'INDEX' },
  { href: '/stamp-map', label: 'STAMP MAP' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const variant = pathname === '/' ? 'dark' : 'light';
  const isActive = (href: string) => pathname === href;

  if (variant === 'dark') {
    // 랜딩: 현행 dark nav 재현 — fixed teal 반투명 오버레이, white 링크, skip-link 없음.
    return (
      <nav className="fixed top-0 left-0 right-0 z-[100] px-5 py-4 md:px-10 md:py-5 flex justify-between items-center backdrop-blur-md bg-[rgba(10,58,66,0.28)] border-b border-white/10 saturate-150">
        <div className="font-serif font-semibold text-[17px] tracking-tight drop-shadow-md">
          고요의 경제나루
        </div>
        <div className="flex gap-4 md:gap-7 items-center">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`text-[13px] md:text-sm hover:text-white hover:-translate-y-[1px] transition-all drop-shadow-md ${
                isActive(item.href) ? 'text-white font-semibold' : 'text-white/90 font-medium'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-[13px] md:text-sm text-white/90 font-medium hover:text-white hover:-translate-y-[1px] transition-all drop-shadow-md"
          >
            로그인
          </Link>
        </div>
      </nav>
    );
  }

  // light(그 외 4페이지): 정규값 bg-[#F8FCFC]/90 · md:gap-6 · 링크 text-sm. skip-link 포함.
  return (
    <>
      <a
        href="#main"
        className="absolute -top-10 left-0 bg-accent-deep text-white px-4 py-2 text-sm z-[200] focus:top-0 outline-none"
      >
        본문으로 건너뛰기
      </a>
      <nav className="sticky top-0 z-[100] px-5 py-4 md:px-10 flex justify-between items-center bg-[#F8FCFC]/90 backdrop-blur-md saturate-150 border-b border-line-soft">
        <Link href="/" className="font-serif font-semibold text-base text-text-main tracking-tight">
          고요의 경제나루
        </Link>
        <div className="flex gap-4 md:gap-6 items-center">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`text-[13px] md:text-sm transition-colors ${
                isActive(item.href)
                  ? 'text-accent-deep font-semibold'
                  : 'text-text-soft font-medium hover:text-accent-deep'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-[13px] md:text-sm text-text-soft font-medium hover:text-accent-deep transition-colors"
          >
            로그인
          </Link>
        </div>
      </nav>
    </>
  );
}
