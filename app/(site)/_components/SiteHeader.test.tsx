import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// usePathname 를 제어해 variant/active 파생을 검증. next/navigation 모킹.
const { usePathnameMock } = vi.hoisted(() => ({ usePathnameMock: vi.fn() }));
vi.mock('next/navigation', () => ({ usePathname: usePathnameMock }));

import { SiteHeader } from './SiteHeader';

function renderAt(pathname: string) {
  usePathnameMock.mockReturnValue(pathname);
  return render(<SiteHeader />);
}

const SKIP_LINK = '본문으로 건너뛰기';

afterEach(() => {
  cleanup();
  usePathnameMock.mockReset();
});

describe('SiteHeader — variant 파생', () => {
  it('랜딩(/) 은 dark variant (fixed + teal 반투명, sticky 아님)', () => {
    const { container } = renderAt('/');
    const nav = container.querySelector('nav')!;
    expect(nav.className).toContain('fixed');
    expect(nav.className).toContain('bg-[rgba(10,58,66,0.28)]');
    expect(nav.className).not.toContain('sticky');
  });

  it.each(['/dictionary', '/stamp-map', '/teacher-kit', '/lesson/L001'])(
    '%s 는 light variant (sticky + 정규 bg-[#F8FCFC]/90)',
    (path) => {
      const { container } = renderAt(path);
      const nav = container.querySelector('nav')!;
      expect(nav.className).toContain('sticky');
      expect(nav.className).toContain('bg-[#F8FCFC]/90');
      expect(nav.className).not.toContain('fixed');
    },
  );
});

describe('SiteHeader — NAV_ITEMS 렌더', () => {
  it('HOME · INDEX · STAMP MAP 3개 링크와 정적 로그인 링크를 렌더', () => {
    renderAt('/dictionary');
    expect(screen.getByRole('link', { name: 'HOME' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'INDEX' })).toHaveAttribute('href', '/dictionary');
    expect(screen.getByRole('link', { name: 'STAMP MAP' })).toHaveAttribute('href', '/stamp-map');
    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login');
  });
});

describe('SiteHeader — active 파생 (NAV_ITEMS 매칭만)', () => {
  it('랜딩(/) → HOME 만 active (신규 강조)', () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: 'HOME' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'INDEX' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'STAMP MAP' })).not.toHaveAttribute('aria-current');
  });

  it('/dictionary → INDEX 만 active', () => {
    renderAt('/dictionary');
    expect(screen.getByRole('link', { name: 'INDEX' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'HOME' })).not.toHaveAttribute('aria-current');
  });

  it('/stamp-map → STAMP MAP 만 active', () => {
    renderAt('/stamp-map');
    expect(screen.getByRole('link', { name: 'STAMP MAP' })).toHaveAttribute('aria-current', 'page');
  });

  it('/teacher-kit → NAV_ITEMS 미포함이라 강조 없음', () => {
    renderAt('/teacher-kit');
    for (const name of ['HOME', 'INDEX', 'STAMP MAP']) {
      expect(screen.getByRole('link', { name })).not.toHaveAttribute('aria-current');
    }
  });

  it('/lesson/[id] → NAV_ITEMS 미포함이라 강조 없음', () => {
    renderAt('/lesson/L001');
    for (const name of ['HOME', 'INDEX', 'STAMP MAP']) {
      expect(screen.getByRole('link', { name })).not.toHaveAttribute('aria-current');
    }
  });
});

describe('SiteHeader — skip-link (light 전용)', () => {
  it('light variant 에는 skip-link 렌더', () => {
    renderAt('/dictionary');
    const skip = screen.getByRole('link', { name: SKIP_LINK });
    expect(skip).toHaveAttribute('href', '#main');
  });

  it('dark(랜딩) variant 에는 skip-link 없음', () => {
    renderAt('/');
    expect(screen.queryByText(SKIP_LINK)).toBeNull();
  });
});

describe('SiteHeader — 정적 로그인 (세션 미배선)', () => {
  it.each(['/', '/dictionary', '/lesson/L001'])(
    '%s 에서도 닉네임/로그아웃 없이 정적 로그인 링크만',
    (path) => {
      renderAt(path);
      expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '로그아웃' })).toBeNull();
    },
  );
});
