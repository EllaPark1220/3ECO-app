'use client';

import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg-light)', color: 'var(--text-main)', lineHeight: 1.7, fontSize: '16px' }}>
      <a href="#main" className="absolute -top-10 left-0 bg-accent-deep text-white px-4 py-2 text-sm z-[200] focus:top-0 outline-none">
        본문으로 건너뛰기
      </a>

      {/* Admin Nav */}
      <nav className="sticky top-0 z-[100] px-5 py-3 md:px-10 flex flex-wrap justify-between items-center bg-accent-darkest text-white border-b border-white/10 gap-2.5">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="font-serif font-semibold text-[15px] text-white tracking-tight">
            고요의 경제나루
          </Link>
          <span className="inline-flex items-center px-2.5 py-0.5 bg-[#86D0D6]/20 border border-[#86D0D6]/35 text-accent-soft rounded-md font-mono text-[10px] tracking-[0.18em] font-semibold uppercase">
            Admin
          </span>
        </div>
        <div className="flex gap-1">
          <Link href="/admin/dashboard" className="px-3 py-[7px] text-[13.5px] text-white bg-white/10 font-semibold rounded-[7px] transition-all">
            대시보드
          </Link>
          <Link href="#" className="px-3 py-[7px] text-[13.5px] text-white/70 hover:text-white hover:bg-white/5 font-medium rounded-[7px] transition-all">
            콘텐츠
          </Link>
          <Link href="#" className="px-3 py-[7px] text-[13.5px] text-white/70 hover:text-white hover:bg-white/5 font-medium rounded-[7px] transition-all">
            회원
          </Link>
          <Link href="#" className="px-3 py-[7px] text-[13.5px] text-white/70 hover:text-white hover:bg-white/5 font-medium rounded-[7px] transition-all">
            설정
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-2.5 font-sans text-[13px] text-white/70">
          <span>운영자 · <strong className="text-white font-semibold">ELLA</strong></span>
        </div>
      </nav>

      <main className="max-w-[1280px] w-full mx-auto px-[18px] py-[28px] md:px-10 md:py-9 pb-20" id="main">
        <header className="flex justify-between items-end gap-5 flex-wrap mb-9">
          <div className="flex-1 min-w-[240px]">
            <div className="font-mono text-[11px] tracking-[0.25em] text-accent-deep font-semibold uppercase mb-2">
              DASHBOARD
            </div>
            <h1 className="font-serif font-semibold text-[30px] leading-[1.3] text-text-main tracking-[-0.015em]">
              고요한 운영, 차분한 학습
            </h1>
          </div>
          <div className="font-mono text-[12px] text-text-mute tracking-[0.05em] hidden md:block">
            2026.05.13 (수) · 22:14 기준
          </div>
        </header>

        {/* 4 Summary Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4 mb-14" aria-label="주요 지표">
          <div className="bg-white border border-line-light rounded-[14px] p-4 md:p-[22px_22px_20px]">
            <div className="font-mono text-[10.5px] tracking-[0.18em] text-text-soft font-semibold uppercase mb-3">등록 회원</div>
            <div className="font-serif font-bold text-[24px] md:text-[32px] leading-[1.1] text-text-main tracking-[-0.02em] mb-1.5">
              1,247<span className="font-sans font-medium text-[14px] text-text-soft ml-1">명</span>
            </div>
            <div className="font-mono text-[11px] text-text-mute tracking-[0.03em]">
              최근 7일 <strong className="font-sans font-semibold text-status-public">+34</strong>
            </div>
          </div>
          <div className="bg-white border border-line-light rounded-[14px] p-4 md:p-[22px_22px_20px]">
            <div className="font-mono text-[10.5px] tracking-[0.18em] text-text-soft font-semibold uppercase mb-3">7일 활성 학습자</div>
            <div className="font-serif font-bold text-[24px] md:text-[32px] leading-[1.1] text-text-main tracking-[-0.02em] mb-1.5">
              423<span className="font-sans font-medium text-[14px] text-text-soft ml-1">명</span>
            </div>
            <div className="font-mono text-[11px] text-text-mute tracking-[0.03em]">
              전주 대비 <strong className="font-sans font-semibold text-status-public">+18%</strong>
            </div>
          </div>
          <div className="bg-white border border-line-light rounded-[14px] p-4 md:p-[22px_22px_20px]">
            <div className="font-mono text-[10.5px] tracking-[0.18em] text-text-soft font-semibold uppercase mb-3">누적 학습 완료</div>
            <div className="font-serif font-bold text-[24px] md:text-[32px] leading-[1.1] text-text-main tracking-[-0.02em] mb-1.5">
              8,612<span className="font-sans font-medium text-[14px] text-text-soft ml-1">편</span>
            </div>
            <div className="font-mono text-[11px] text-text-mute tracking-[0.03em]">
              오늘 <strong className="font-sans font-semibold text-status-public">+127</strong>
            </div>
          </div>
          <div className="bg-white border border-line-light rounded-[14px] p-4 md:p-[22px_22px_20px]">
            <div className="font-mono text-[10.5px] tracking-[0.18em] text-text-soft font-semibold uppercase mb-3">PDF 다운로드</div>
            <div className="font-serif font-bold text-[24px] md:text-[32px] leading-[1.1] text-text-main tracking-[-0.02em] mb-1.5">
              3,481<span className="font-sans font-medium text-[14px] text-text-soft ml-1">회</span>
            </div>
            <div className="font-mono text-[11px] text-text-mute tracking-[0.03em]">
              최근 7일 <strong className="font-sans font-semibold text-status-public">+96</strong>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Main Table */}
          <section>
            <h2 className="flex justify-between items-baseline font-serif font-semibold text-[20px] text-text-main tracking-[-0.01em] mb-4.5">
              최근 편집된 콘텐츠
              <Link href="#" className="font-sans text-[13px] font-medium text-accent-deep hover:underline">
                전체 보기 →
              </Link>
            </h2>

            <div className="bg-white border border-line-light rounded-[14px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse font-sans text-[14px]">
                  <thead className="bg-bg-light border-b border-line-light">
                    <tr>
                      <th className="p-3 md:p-[12px_16px] text-left font-mono text-[10.5px] tracking-[0.15em] text-text-soft font-semibold uppercase whitespace-nowrap">편</th>
                      <th className="p-3 md:p-[12px_16px] text-left font-mono text-[10.5px] tracking-[0.15em] text-text-soft font-semibold uppercase whitespace-nowrap">제목</th>
                      <th className="p-3 md:p-[12px_16px] text-left font-mono text-[10.5px] tracking-[0.15em] text-text-soft font-semibold uppercase whitespace-nowrap">상태</th>
                      <th className="hidden md:table-cell p-[12px_16px] text-left font-mono text-[10.5px] tracking-[0.15em] text-text-soft font-semibold uppercase whitespace-nowrap">마지막 수정</th>
                      <th className="hidden md:table-cell text-right p-[12px_16px] font-mono text-[10.5px] tracking-[0.15em] text-text-soft font-semibold uppercase whitespace-nowrap w-[80px]">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-bg-light transition-colors border-b border-line-soft">
                      <td className="p-3 md:p-[14px_16px] align-middle font-mono text-[12px] text-accent-deep font-semibold tracking-[0.05em] whitespace-nowrap w-[70px]">1권 27편</td>
                      <td className="p-3 md:p-[14px_16px] align-middle font-serif font-medium text-[14.5px] text-text-main tracking-[-0.005em]">돈의 언어 — 1권 정리 ②</td>
                      <td className="p-3 md:p-[14px_16px] align-middle">
                        <span className="inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full font-mono text-[10.5px] font-semibold tracking-[0.05em] whitespace-nowrap bg-[#B85540]/10 text-status-draft">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-draft shrink-0"></span>DRAFT
                        </span>
                      </td>
                      <td className="hidden md:table-cell p-[14px_16px] align-middle font-mono text-[11.5px] text-text-mute tracking-[0.03em] whitespace-nowrap w-[100px]">2026.05.13</td>
                      <td className="hidden md:table-cell p-[14px_16px] align-middle text-right w-[80px]">
                        <Link href="#" className="inline-block px-2.5 py-1.5 bg-transparent border border-line-light rounded-[7px] font-sans text-[12px] text-text-soft hover:border-accent-main hover:text-accent-deep hover:bg-water-card transition-colors">편집</Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-bg-light transition-colors border-b border-line-soft">
                      <td className="p-3 md:p-[14px_16px] align-middle font-mono text-[12px] text-accent-deep font-semibold tracking-[0.05em] whitespace-nowrap w-[70px]">1권 26편</td>
                      <td className="p-3 md:p-[14px_16px] align-middle font-serif font-medium text-[14.5px] text-text-main tracking-[-0.005em]">돈의 언어 — 1권 정리 ①</td>
                      <td className="p-3 md:p-[14px_16px] align-middle">
                        <span className="inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full font-mono text-[10.5px] font-semibold tracking-[0.05em] whitespace-nowrap bg-[#9B8E6D]/10 text-status-private">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-private shrink-0"></span>비공개
                        </span>
                      </td>
                      <td className="hidden md:table-cell p-[14px_16px] align-middle font-mono text-[11.5px] text-text-mute tracking-[0.03em] whitespace-nowrap w-[100px]">2026.05.12</td>
                      <td className="hidden md:table-cell p-[14px_16px] align-middle text-right w-[80px]">
                        <Link href="#" className="inline-block px-2.5 py-1.5 bg-transparent border border-line-light rounded-[7px] font-sans text-[12px] text-text-soft hover:border-accent-main hover:text-accent-deep hover:bg-water-card transition-colors">편집</Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-bg-light transition-colors border-b border-line-soft">
                      <td className="p-3 md:p-[14px_16px] align-middle font-mono text-[12px] text-accent-deep font-semibold tracking-[0.05em] whitespace-nowrap w-[70px]">1권 25편</td>
                      <td className="p-3 md:p-[14px_16px] align-middle font-serif font-medium text-[14.5px] text-text-main tracking-[-0.005em]">평균 너머의 한 단위를 보다 — 평균과 한계</td>
                      <td className="p-3 md:p-[14px_16px] align-middle">
                        <span className="inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full font-mono text-[10.5px] font-semibold tracking-[0.05em] whitespace-nowrap bg-[#2A9F6E]/10 text-status-public">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-public shrink-0"></span>공개
                        </span>
                      </td>
                      <td className="hidden md:table-cell p-[14px_16px] align-middle font-mono text-[11.5px] text-text-mute tracking-[0.03em] whitespace-nowrap w-[100px]">2026.05.10</td>
                      <td className="hidden md:table-cell p-[14px_16px] align-middle text-right w-[80px]">
                        <Link href="#" className="inline-block px-2.5 py-1.5 bg-transparent border border-line-light rounded-[7px] font-sans text-[12px] text-text-soft hover:border-accent-main hover:text-accent-deep hover:bg-water-card transition-colors">편집</Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-bg-light transition-colors border-b border-line-soft">
                      <td className="p-3 md:p-[14px_16px] align-middle font-mono text-[12px] text-accent-deep font-semibold tracking-[0.05em] whitespace-nowrap w-[70px]">1권 24편</td>
                      <td className="p-3 md:p-[14px_16px] align-middle font-serif font-medium text-[14.5px] text-text-main tracking-[-0.005em]">경제에도 계절이 있다 — 경기와 호황·불황</td>
                      <td className="p-3 md:p-[14px_16px] align-middle">
                        <span className="inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full font-mono text-[10.5px] font-semibold tracking-[0.05em] whitespace-nowrap bg-[#2A9F6E]/10 text-status-public">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-public shrink-0"></span>공개
                        </span>
                      </td>
                      <td className="hidden md:table-cell p-[14px_16px] align-middle font-mono text-[11.5px] text-text-mute tracking-[0.03em] whitespace-nowrap w-[100px]">2026.05.08</td>
                      <td className="hidden md:table-cell p-[14px_16px] align-middle text-right w-[80px]">
                        <Link href="#" className="inline-block px-2.5 py-1.5 bg-transparent border border-line-light rounded-[7px] font-sans text-[12px] text-text-soft hover:border-accent-main hover:text-accent-deep hover:bg-water-card transition-colors">편집</Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-bg-light transition-colors border-b border-line-soft">
                      <td className="p-3 md:p-[14px_16px] align-middle font-mono text-[12px] text-accent-deep font-semibold tracking-[0.05em] whitespace-nowrap w-[70px]">1권 17편</td>
                      <td className="p-3 md:p-[14px_16px] align-middle font-serif font-medium text-[14.5px] text-text-main tracking-[-0.005em]">월급에서 미리 빠지는 안전망 — 4대보험</td>
                      <td className="p-3 md:p-[14px_16px] align-middle">
                        <span className="inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full font-mono text-[10.5px] font-semibold tracking-[0.05em] whitespace-nowrap bg-[#2A9F6E]/10 text-status-public">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-public shrink-0"></span>공개
                        </span>
                      </td>
                      <td className="hidden md:table-cell p-[14px_16px] align-middle font-mono text-[11.5px] text-text-mute tracking-[0.03em] whitespace-nowrap w-[100px]">2026.05.05</td>
                      <td className="hidden md:table-cell p-[14px_16px] align-middle text-right w-[80px]">
                        <Link href="#" className="inline-block px-2.5 py-1.5 bg-transparent border border-line-light rounded-[7px] font-sans text-[12px] text-text-soft hover:border-accent-main hover:text-accent-deep hover:bg-water-card transition-colors">편집</Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-bg-light transition-colors">
                      <td className="p-3 md:p-[14px_16px] align-middle font-mono text-[12px] text-accent-deep font-semibold tracking-[0.05em] whitespace-nowrap w-[70px]">1권 1편</td>
                      <td className="p-3 md:p-[14px_16px] align-middle font-serif font-medium text-[14.5px] text-text-main tracking-[-0.005em]">다 가질 수 없다는 것 — 희소성과 선택</td>
                      <td className="p-3 md:p-[14px_16px] align-middle">
                        <span className="inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full font-mono text-[10.5px] font-semibold tracking-[0.05em] whitespace-nowrap bg-[#2A9F6E]/10 text-status-public">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-public shrink-0"></span>공개
                        </span>
                      </td>
                      <td className="hidden md:table-cell p-[14px_16px] align-middle font-mono text-[11.5px] text-text-mute tracking-[0.03em] whitespace-nowrap w-[100px]">2026.04.20</td>
                      <td className="hidden md:table-cell p-[14px_16px] align-middle text-right w-[80px]">
                        <Link href="#" className="inline-block px-2.5 py-1.5 bg-transparent border border-line-light rounded-[7px] font-sans text-[12px] text-text-soft hover:border-accent-main hover:text-accent-deep hover:bg-water-card transition-colors">편집</Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-[14px_16px] bg-bg-light text-center border-t border-line-light">
                <Link href="#" className="font-sans text-[13px] text-accent-deep font-medium hover:underline">
                  전체 133편 중 6편 표시 · 모두 보기 →
                </Link>
              </div>
            </div>
          </section>

          {/* Activity Logs */}
          <aside>
            <h2 className="font-serif font-semibold text-[20px] text-text-main tracking-[-0.01em] mb-4.5">최근 활동</h2>
            <div className="bg-white border border-line-light rounded-[14px] py-1.5 max-h-[540px] overflow-y-auto">
              <div className="flex gap-2.5 md:gap-3.5 p-3 md:p-[14px_20px] border-b border-line-soft items-start">
                <div className="font-mono text-[10.5px] text-text-mute tracking-[0.03em] pt-[1px] shrink-0 w-[44px]">22:14</div>
                <div className="flex-1 font-sans text-[13px] text-text-soft leading-[1.55]">
                  <span className="inline-block px-[7px] py-[1px] bg-water-card rounded-[5px] font-mono text-[10px] text-accent-deep font-semibold tracking-[0.05em] uppercase mr-1">JOIN</span>
                  <span className="font-mono text-[11.5px] text-accent-deep font-semibold tracking-[0.02em]">jih****</span>님이 가입했습니다
                </div>
              </div>
              <div className="flex gap-2.5 md:gap-3.5 p-3 md:p-[14px_20px] border-b border-line-soft items-start">
                <div className="font-mono text-[10.5px] text-text-mute tracking-[0.03em] pt-[1px] shrink-0 w-[44px]">22:10</div>
                <div className="flex-1 font-sans text-[13px] text-text-soft leading-[1.55]">
                  <span className="inline-block px-[7px] py-[1px] bg-water-card rounded-[5px] font-mono text-[10px] text-accent-deep font-semibold tracking-[0.05em] uppercase mr-1">DONE</span>
                  <span className="font-mono text-[11.5px] text-accent-deep font-semibold tracking-[0.02em]">eco****</span>님이 <span className="text-text-main font-medium">1권 1편</span>을 마쳤습니다
                </div>
              </div>
              <div className="flex gap-2.5 md:gap-3.5 p-3 md:p-[14px_20px] border-b border-line-soft items-start">
                <div className="font-mono text-[10.5px] text-text-mute tracking-[0.03em] pt-[1px] shrink-0 w-[44px]">21:58</div>
                <div className="flex-1 font-sans text-[13px] text-text-soft leading-[1.55]">
                  <span className="inline-block px-[7px] py-[1px] bg-water-card rounded-[5px] font-mono text-[10px] text-accent-deep font-semibold tracking-[0.05em] uppercase mr-1">PDF</span>
                  <span className="text-text-main font-medium">1권 17편 4대보험</span> 자료가 다운로드되었습니다
                </div>
              </div>
              <div className="flex gap-2.5 md:gap-3.5 p-3 md:p-[14px_20px] border-b border-line-soft items-start">
                <div className="font-mono text-[10.5px] text-text-mute tracking-[0.03em] pt-[1px] shrink-0 w-[44px]">21:42</div>
                <div className="flex-1 font-sans text-[13px] text-text-soft leading-[1.55]">
                  <span className="inline-block px-[7px] py-[1px] bg-water-card rounded-[5px] font-mono text-[10px] text-accent-deep font-semibold tracking-[0.05em] uppercase mr-1">DONE</span>
                  <span className="font-mono text-[11.5px] text-accent-deep font-semibold tracking-[0.02em]">ang****</span>님이 <span className="text-text-main font-medium">1권 3편</span>을 마쳤습니다
                </div>
              </div>
              <div className="flex gap-2.5 md:gap-3.5 p-3 md:p-[14px_20px] border-b border-line-soft items-start">
                <div className="font-mono text-[10.5px] text-text-mute tracking-[0.03em] pt-[1px] shrink-0 w-[44px]">21:35</div>
                <div className="flex-1 font-sans text-[13px] text-text-soft leading-[1.55]">
                  <span className="inline-block px-[7px] py-[1px] bg-water-card rounded-[5px] font-mono text-[10px] text-accent-deep font-semibold tracking-[0.05em] uppercase mr-1">DONE</span>
                  <span className="font-mono text-[11.5px] text-accent-deep font-semibold tracking-[0.02em]">min****</span>님이 <span className="text-text-main font-medium">1권 8편</span>을 마쳤습니다
                </div>
              </div>
              <div className="flex gap-2.5 md:gap-3.5 p-3 md:p-[14px_20px] border-b border-line-soft items-start">
                <div className="font-mono text-[10.5px] text-text-mute tracking-[0.03em] pt-[1px] shrink-0 w-[44px]">21:18</div>
                <div className="flex-1 font-sans text-[13px] text-text-soft leading-[1.55]">
                  <span className="inline-block px-[7px] py-[1px] bg-water-card rounded-[5px] font-mono text-[10px] text-accent-deep font-semibold tracking-[0.05em] uppercase mr-1">JOIN</span>
                  <span className="font-mono text-[11.5px] text-accent-deep font-semibold tracking-[0.02em]">soo****</span>님이 가입했습니다 <span className="text-text-mute text-[11px]">· 카카오</span>
                </div>
              </div>
              <div className="flex gap-2.5 md:gap-3.5 p-3 md:p-[14px_20px] border-b border-line-soft items-start">
                <div className="font-mono text-[10.5px] text-text-mute tracking-[0.03em] pt-[1px] shrink-0 w-[44px]">20:53</div>
                <div className="flex-1 font-sans text-[13px] text-text-soft leading-[1.55]">
                  <span className="inline-block px-[7px] py-[1px] bg-water-card rounded-[5px] font-mono text-[10px] text-accent-deep font-semibold tracking-[0.05em] uppercase mr-1">PDF</span>
                  <span className="text-text-main font-medium">1권 1편 희소성</span> 자료가 다운로드되었습니다
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
