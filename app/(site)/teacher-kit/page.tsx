'use client';

import Link from 'next/link';

export default function TeacherKitPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg-light)', color: 'var(--text-main)', lineHeight: 1.78, fontSize: '16px' }}>
      <a href="#main" className="absolute -top-10 left-0 bg-accent-deep text-white px-4 py-2 text-sm z-[200] focus:top-0 outline-none">
        본문으로 건너뛰기
      </a>

      {/* Nav */}
      <nav className="sticky top-0 z-[100] px-5 py-4 md:px-10 flex justify-between items-center bg-[#F8FCFC]/90 backdrop-blur-md saturate-150 border-b border-line-soft">
        <Link href="/" className="font-serif font-semibold text-base text-text-main tracking-tight">
          고요의 경제나루
        </Link>
        <div className="flex gap-4 md:gap-6 items-center">
          <Link href="/" className="text-[13px] md:text-sm text-text-soft font-medium hover:text-accent-deep transition-colors">HOME</Link>
          <Link href="/dictionary" className="text-[13px] md:text-sm text-text-soft font-medium hover:text-accent-deep transition-colors">INDEX</Link>
          <Link href="/stamp-map" className="text-[13px] md:text-sm text-text-soft font-medium hover:text-accent-deep transition-colors">STAMP MAP</Link>
          <Link href="/login" className="text-[13px] md:text-sm text-text-soft font-medium hover:text-accent-deep transition-colors">로그인</Link>
        </div>
      </nav>

      <main className="max-w-[1100px] w-full mx-auto px-[22px] py-[36px] md:px-10 md:py-[50px] pb-20" id="main">

        <div className="font-mono text-[11px] tracking-[0.1em] text-accent-deep mb-[26px] font-semibold uppercase">
          <Link href="#" className="text-text-mute hover:text-accent-deep transition-colors">1권 · 돈의 언어</Link>
          <span className="text-text-mute mx-2 font-normal">/</span>
          <Link href="/lesson/1-1" className="text-text-mute hover:text-accent-deep transition-colors">1편</Link>
          <span className="text-text-mute mx-2 font-normal">/</span>
          <span>교사용 자료</span>
        </div>

        <header className="mb-10 md:mb-14">
          <div className="font-mono text-[11px] tracking-[0.3em] text-accent-deep font-semibold mb-3.5 uppercase">TEACHER KIT</div>
          <h1 className="font-serif font-semibold text-[26px] md:text-[clamp(26px,4vw,38px)] leading-[1.3] text-text-main tracking-[-0.015em] mb-2.5">
            교사용 자료
          </h1>
          <p className="font-sans text-[15px] text-text-soft leading-[1.85] max-w-[560px]">
            교실에서, 가정에서, 스터디에서 — 누구나 자유롭게 인쇄해 가르치고 함께 읽을 수 있도록 만든 자료입니다.
          </p>
        </header>

        {/* 메인: 표지 + 정보 */}
        <section className="grid grid-cols-1 md:grid-cols-[minmax(300px,360px)_1fr] gap-10 md:gap-14 items-start mb-16 md:mb-[72px]">
          
          {/* PDF 표지 (mock) */}
          <div className="relative w-full max-w-[360px] mx-auto md:mx-0">
            <div className="absolute inset-0 pointer-events-none before:content-[''] before:absolute before:inset-0 before:bg-white before:border before:border-line-light before:rounded-md before:translate-x-[3px] before:translate-y-[3px] before:z-20 after:content-[''] after:absolute after:inset-0 after:bg-white after:border after:border-line-light after:rounded-md after:translate-x-[6px] after:translate-y-[6px] after:z-10 after:opacity-90"></div>
            <div className="relative aspect-[210/297] bg-white rounded-md p-[30px_24px_24px] md:p-[38px_32px_30px] flex flex-col z-30 border border-line-light" style={{ boxShadow: '0 14px 36px -10px rgba(13, 95, 109, 0.22), 0 2px 6px -2px rgba(13, 95, 109, 0.1)' }}>
              <div className="border-b border-line-soft pb-3 md:pb-3.5 mb-5 md:mb-[26px]">
                <div className="font-serif font-semibold text-[13px] md:text-[14px] text-accent-deep tracking-[-0.01em] mb-1">고요의 경제나루</div>
                <div className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-text-mute uppercase">Teacher's Kit · 교사용 자료</div>
              </div>

              <div className="flex-1 flex flex-col justify-center text-center">
                <div className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-accent-main font-semibold mb-3 md:mb-4 uppercase">VOL. 01 · EPISODE 01</div>
                <h2 className="font-serif font-bold text-[20px] md:text-[22px] text-text-main leading-[1.35] tracking-[-0.015em] mb-1.5">다 가질 수 없다는 것</h2>
                <p className="font-serif font-normal text-[13px] md:text-[14px] text-text-soft leading-[1.4]">— 희소성과 선택</p>
              </div>

              <div className="border-t border-line-soft pt-3 md:pt-3.5 mt-5 md:mt-[26px] flex justify-between items-center">
                <span className="font-mono text-[8.5px] md:text-[9.5px] tracking-[0.15em] text-text-mute uppercase">CC BY-NC-SA 4.0</span>
                <span className="font-mono text-[8.5px] md:text-[9.5px] tracking-[0.15em] text-text-mute uppercase">A4 · 8 PAGES</span>
              </div>
            </div>
          </div>

          {/* 우측 정보 */}
          <div className="pt-0 md:pt-3">
            <div className="font-mono text-[11px] tracking-[0.25em] text-accent-deep font-semibold uppercase mb-2.5">1권 · 돈의 언어 · 1편</div>
            <h2 className="font-serif font-bold text-[24px] md:text-[clamp(24px,3vw,32px)] leading-[1.3] text-text-main tracking-[-0.015em] mb-1">다 가질 수 없다는 것</h2>
            <div className="font-serif font-normal text-[16px] md:text-[clamp(16px,1.8vw,20px)] text-text-soft mb-6 md:mb-[26px]">— 희소성과 선택</div>

            <div className="bg-water-card rounded-[14px] p-5 md:p-[22px_24px] mb-6 md:mb-7">
              <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-1 md:gap-4 py-2 border-b border-[#DCE7E8]/60 items-start last:border-b-0">
                <div className="font-mono text-[10.5px] tracking-[0.15em] text-accent-deep font-semibold uppercase md:pt-1">영역</div>
                <div className="font-sans text-[14.5px] text-text-main leading-[1.7]">1. 사고의 출발점</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-1 md:gap-4 py-2 border-b border-[#DCE7E8]/60 items-start last:border-b-0">
                <div className="font-mono text-[10.5px] tracking-[0.15em] text-accent-deep font-semibold uppercase md:pt-1">핵심 개념</div>
                <div className="font-sans text-[14.5px] text-text-main leading-[1.7]">희소성 · 선택</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-1 md:gap-4 py-2 border-b border-[#DCE7E8]/60 items-start last:border-b-0">
                <div className="font-mono text-[10.5px] tracking-[0.15em] text-accent-deep font-semibold uppercase md:pt-1">학습 목표</div>
                <div className="font-sans text-[14.5px] text-text-main leading-[1.7]">
                  <ol className="list-none m-0 p-0" style={{ counterReset: 'obj' }}>
                    <li className="relative pl-6 pt-0.5 pb-1 before:content-[counter(obj)] before:absolute before:left-0 before:top-1 before:w-[18px] before:h-[18px] before:rounded-full before:bg-accent-soft before:text-text-main before:font-mono before:text-[10px] before:font-semibold before:flex before:items-center before:justify-center before:leading-none" style={{ counterIncrement: 'obj' }}>
                      자원이 한정될 때 모든 욕구를 다 채울 수 없음을 설명할 수 있다
                    </li>
                    <li className="relative pl-6 pt-0.5 pb-1 before:content-[counter(obj)] before:absolute before:left-0 before:top-1 before:w-[18px] before:h-[18px] before:rounded-full before:bg-accent-soft before:text-text-main before:font-mono before:text-[10px] before:font-semibold before:flex before:items-center before:justify-center before:leading-none" style={{ counterIncrement: 'obj' }}>
                      '경제는 선택의 학문'이라는 정의를 자기 말로 풀 수 있다
                    </li>
                  </ol>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-1 md:gap-4 py-2 border-b border-[#DCE7E8]/60 items-start last:border-b-0">
                <div className="font-mono text-[10.5px] tracking-[0.15em] text-accent-deep font-semibold uppercase md:pt-1">분량</div>
                <div className="font-sans text-[14.5px] text-text-main leading-[1.7]">A4 · 8 페이지 · 약 1.2 MB</div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <button onClick={() => alert('PDF 다운로드 데모 — 실서비스에서는 실제 PDF 파일이 다운로드됩니다.')} className="inline-flex items-center gap-2.5 px-7 py-4 bg-accent-main text-white rounded-xl font-sans font-semibold text-[15px] cursor-pointer no-underline transition-all hover:bg-accent-deep hover:-translate-y-0.5" style={{ boxShadow: '0 8px 22px -10px rgba(26, 142, 156, 0.5)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-[18px] h-[18px]">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                PDF 다운로드
              </button>
              <Link href="#" className="inline-flex items-center gap-1.5 px-[22px] py-4 bg-transparent text-text-main border-[1.5px] border-line-light rounded-xl font-sans font-medium text-[14px] cursor-pointer no-underline transition-all hover:border-accent-soft hover:bg-water-card hover:text-accent-deep">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                온라인 미리보기
              </Link>
              <div className="w-full mt-3.5 font-mono text-[10.5px] tracking-[0.05em] text-text-mute">
                계정 없이도 누구나 다운로드할 수 있습니다 · 결제·광고 없음
              </div>
            </div>
          </div>
        </section>

        {/* 활용 가이드 */}
        <section className="mb-16">
          <h2 className="font-serif font-semibold text-[26px] leading-[1.3] text-text-main tracking-[-0.01em] mb-6">교실에서 이렇게 활용해 보세요</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
            <div className="bg-white border border-line-light rounded-2xl p-[28px_24px]">
              <div className="font-mono text-[12px] tracking-[0.2em] text-accent-main font-semibold mb-3.5 uppercase">STEP 01</div>
              <h3 className="font-serif font-semibold text-[18px] text-text-main tracking-[-0.005em] mb-2.5">함께 영상 보기</h3>
              <p className="font-sans text-[14px] text-text-soft leading-[1.7]">학습자들과 강의 영상을 함께 시청합니다. 중간에 멈추고 자유롭게 질문을 던져도 좋습니다.</p>
            </div>
            <div className="bg-white border border-line-light rounded-2xl p-[28px_24px]">
              <div className="font-mono text-[12px] tracking-[0.2em] text-accent-main font-semibold mb-3.5 uppercase">STEP 02</div>
              <h3 className="font-serif font-semibold text-[18px] text-text-main tracking-[-0.005em] mb-2.5">PDF로 이어가기</h3>
              <p className="font-sans text-[14px] text-text-soft leading-[1.7]">PDF에 담긴 보충 설명·예시·토론 질문으로 영상에서 다룬 개념을 학습자의 일상으로 끌어옵니다.</p>
            </div>
            <div className="bg-white border border-line-light rounded-2xl p-[28px_24px]">
              <div className="font-mono text-[12px] tracking-[0.2em] text-accent-main font-semibold mb-3.5 uppercase">STEP 03</div>
              <h3 className="font-serif font-semibold text-[18px] text-text-main tracking-[-0.005em] mb-2.5">스스로 풀어 보기</h3>
              <p className="font-sans text-[14px] text-text-soft leading-[1.7]">OX 퀴즈와 짧은 서술 과제를 통해 학습자가 자기 말로 개념을 풀어 내도록 돕습니다.</p>
            </div>
          </div>
        </section>

        {/* 라이선스 */}
        <section className="bg-water-card rounded-2xl p-6 md:p-[32px_36px] mb-14">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-[18px] mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-line-light rounded-lg font-mono text-[11px] font-bold text-text-main tracking-[0.05em] w-fit">
              <span className="w-[18px] h-[18px] rounded-full bg-accent-deep text-white inline-flex items-center justify-center text-[11px] font-bold">CC</span>
              BY-NC-SA 4.0
            </div>
            <h3 className="font-serif font-semibold text-[18px] text-text-main tracking-[-0.005em]">자유롭게 인쇄·공유·수정하실 수 있습니다</h3>
          </div>

          <p className="font-sans text-[14.5px] text-text-soft leading-[1.8] mb-3.5">
            이 자료는 Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International 라이선스로 배포됩니다. 다음 조건을 지키시면 누구나 자유롭게 사용·수정·재배포할 수 있습니다.
          </p>

          <div className="flex flex-col gap-1.5 mb-3.5">
            <div className="font-sans text-[14px] text-text-main pl-[22px] relative before:content-['✓'] before:absolute before:left-0 before:text-accent-main before:font-bold">
              <strong>출처 표기</strong> — "고요의 경제나루"와 라이선스를 표시해 주세요
            </div>
            <div className="font-sans text-[14px] text-text-main pl-[22px] relative before:content-['✓'] before:absolute before:left-0 before:text-accent-main before:font-bold">
              <strong>비상업적 사용</strong> — 자료 자체로 수익을 얻는 활동에는 쓰지 마세요
            </div>
            <div className="font-sans text-[14px] text-text-main pl-[22px] relative before:content-['✓'] before:absolute before:left-0 before:text-accent-main before:font-bold">
              <strong>동일 조건 변경 허락</strong> — 수정·재배포 시 동일 라이선스(CC BY-NC-SA 4.0)를 적용해 주세요
            </div>
          </div>

          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ko" className="font-sans text-[13px] text-accent-deep underline hover:text-accent-main" target="_blank" rel="noopener noreferrer">
            라이선스 전문 보기 →
          </a>
        </section>

      </main>

      <footer className="bg-water-light text-center px-10 py-[50px] mt-10">
        <div className="font-sans text-[12.5px] text-text-soft leading-[1.95]">결제 정보를 받지 않습니다 · 광고 없음</div>
        <div className="font-sans text-[12.5px] text-text-soft leading-[1.95]">CC BY-NC-SA 4.0 라이선스로 배포됩니다</div>
        <div className="font-sans text-[12.5px] text-text-soft leading-[1.95]">제작 · ELLA PARK</div>
      </footer>
    </div>
  );
}
