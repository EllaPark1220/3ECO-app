'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Home() {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-accent-darkest text-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-5 py-4 md:px-10 md:py-5 flex justify-between items-center backdrop-blur-md bg-[rgba(10,58,66,0.28)] border-b border-white/10 saturate-150">
        <div className="font-serif font-semibold text-[17px] tracking-tight drop-shadow-md">
          고요의 경제나루
        </div>
        <div className="flex gap-4 md:gap-7 items-center">
          <Link href="/" className="text-[13px] md:text-sm text-white/90 font-medium hover:text-white hover:-translate-y-[1px] transition-all drop-shadow-md">HOME</Link>
          <Link href="/dictionary" className="text-[13px] md:text-sm text-white/90 font-medium hover:text-white hover:-translate-y-[1px] transition-all drop-shadow-md">INDEX</Link>
          <Link href="/stamp-map" className="text-[13px] md:text-sm text-white/90 font-medium hover:text-white hover:-translate-y-[1px] transition-all drop-shadow-md">STAMP MAP</Link>
          <Link href="/login" className="text-[13px] md:text-sm text-white/90 font-medium hover:text-white hover:-translate-y-[1px] transition-all drop-shadow-md">로그인</Link>
        </div>
      </nav>

      {/* STAGE 1 */}
      <section className="relative min-h-screen overflow-hidden bg-[#0A3A42] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden z-0">
          <img
            src="https://images.unsplash.com/photo-1742075292207-0b480220556d?fm=jpg&q=85&w=2400&auto=format&fit=crop"
            alt="햇빛에 반짝이는 물 표면의 윤슬"
            className="w-full h-full object-cover object-center"
            style={{ animation: 'kenBurnsClose 36s ease-in-out infinite alternate', willChange: 'transform' }}
          />
        </div>
        <div className="absolute inset-0 z-10 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 60% at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.35) 100%), linear-gradient(180deg, rgba(10,58,66,0.25) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 60%, rgba(220,234,238,0.85) 100%)'
        }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-[880px] h-[380px] md:h-[460px] z-20 pointer-events-none blur-[40px]" style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)'
        }}></div>

        <div className="relative z-30 flex flex-col items-center text-center px-6 md:px-10 max-w-[860px]">
          <div className="font-mono text-[11px] tracking-[0.32em] text-white/90 uppercase font-semibold mb-8 drop-shadow-lg opacity-0" style={{ animation: 'fadeUp 1.4s ease-out 0.4s forwards' }}>
            고요의 경제나루
          </div>
          <h1 className="font-serif font-bold text-[34px] md:text-[min(5.5vw,60px)] leading-tight tracking-tight mb-7 drop-shadow-xl opacity-0" style={{ animation: 'fadeUp 1.4s ease-out 0.6s forwards' }}>
            광고도 결제도 없이,<br/>차근차근 경제를 배우다
          </h1>
          <p className="font-sans text-[15px] md:text-[min(1.5vw,17px)] text-white/95 leading-relaxed mb-11 max-w-[520px] drop-shadow-lg opacity-0" style={{ animation: 'fadeUp 1.4s ease-out 0.8s forwards' }}>
            5권 133편으로 천천히 흐르는 경제 강의.<br/>당신의 속도에 맞춰 시작하세요.
          </p>
          <div className="flex flex-col md:flex-row gap-3 opacity-0 w-full md:w-auto max-w-[280px] md:max-w-none" style={{ animation: 'fadeUp 1.4s ease-out 1.0s forwards' }}>
            <Link href="/lesson/L001" className="flex items-center justify-center px-8 py-4 bg-accent-main text-white font-semibold rounded-xl transition-all hover:bg-accent-deep hover:-translate-y-0.5 shadow-[0_10px_28px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_18px_40px_-14px_rgba(26,142,156,0.7)] tracking-wide group">
              <span className="mr-2">1권 1편 시작하기</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            <Link href="#stage-3" className="flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border-2 border-white/45 backdrop-blur-md transition-all hover:bg-white/20 hover:border-white hover:-translate-y-0.5 tracking-wide">
              커리큘럼 여정 보기
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[15] flex flex-col items-center gap-2.5 opacity-0" style={{ animation: 'fadeIn 1s ease-out 1.6s forwards, gentleBob 3s ease-in-out 2.6s infinite' }}>
          <div className="font-mono text-[10px] tracking-[0.3em] text-white/85 uppercase drop-shadow-md">SCROLL</div>
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/75"></div>
        </div>

        <div className="absolute bottom-3.5 right-4 md:right-5 z-10 font-mono text-[9px] text-white/45 uppercase tracking-widest">
          Photo · <a href="https://unsplash.com/@neoleephoto" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white">Neo Lee</a> · Unsplash
        </div>
      </section>

      {/* STAGE 2 - Feature Showcase (B Type / Show Don't Tell) */}
      <section className="relative px-6 py-20 md:px-10 md:py-32 text-text-main" style={{
        background: 'linear-gradient(180deg, var(--water-light) 0%, var(--bg-light) 30%, var(--water-card) 100%)'
      }}>
        <div className="max-w-[1200px] mx-auto">
          <div ref={addToRefs} className="opacity-0 translate-y-8 transition-all duration-1000 ease-out mb-16">
            <div className="font-mono text-[11px] tracking-[0.3em] text-accent-deep uppercase font-semibold mb-5 text-center">INTERFACE</div>
            <h2 className="font-serif font-semibold text-[28px] md:text-[min(4.2vw,44px)] leading-tight tracking-tight mb-4 text-center">방해 없는 화면에서<br/>학습에만 몰입하세요</h2>
            <p className="font-sans text-[15px] md:text-[min(1.4vw,16.5px)] text-text-soft leading-relaxed max-w-[580px] mx-auto text-center">
              알림도, 배너도, 재촉하는 타이머도 없습니다.<br/>오직 당신과 지식만 남는 투명한 인터페이스를 경험하세요.
            </p>
          </div>

          <div ref={addToRefs} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-100">
            {/* Bento Box 1: Video & Text Toggle (Span 2) */}
            <div className="lg:col-span-2 bg-white border border-line-light rounded-[24px] p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:border-accent-soft hover:shadow-[0_30px_60px_-15px_rgba(26,142,156,0.15)] overflow-hidden relative group min-h-[360px] flex flex-col justify-center">
              <div className="relative z-10 w-full md:w-1/2 md:pr-6">
                <div className="inline-block px-3 py-1 rounded-full bg-accent-light/30 text-accent-deep text-[11px] uppercase tracking-wider font-bold mb-4">Core Feature</div>
                <h3 className="font-serif font-semibold text-[24px] text-text-main tracking-tight mb-3">영상과 글, 원클릭 전환</h3>
                <p className="font-sans text-[15px] text-text-soft leading-relaxed mb-6">
                  영상이 부담스러운 날엔 글로, 글이 눈에 안 들어오는 날엔 영상으로. 당신의 컨디션에 맞춰 언제든 학습 방식을 전환합니다.
                </p>
              </div>
              
              {/* UI Mockup Positioned Absolutely to the right */}
              <div className="mt-8 md:mt-0 md:absolute md:-right-8 md:top-1/2 md:-translate-y-1/2 w-full md:w-[55%] lg:w-[50%] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-lg p-5 transform transition-transform duration-500 group-hover:scale-[1.03] group-hover:-translate-x-3">
                {/* Browser header */}
                <div className="flex gap-1.5 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]"></div>
                </div>
                {/* Toggle UI */}
                <div className="flex justify-end mb-3">
                  <div className="bg-white rounded-full p-1 shadow-sm flex gap-1 border border-gray-100">
                    <div className="px-4 py-1.5 bg-accent-soft rounded-full text-[11px] text-white font-bold transition-all">영상</div>
                    <div className="px-4 py-1.5 text-gray-400 text-[11px] font-bold transition-all hover:text-gray-600">글</div>
                  </div>
                </div>
                {/* Video Skeleton */}
                <div className="w-full h-36 bg-[#E2E8F0] rounded-lg mb-4 flex items-center justify-center relative overflow-hidden group/video">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent-soft/20 to-transparent"></div>
                  <svg className="w-10 h-10 text-white drop-shadow-md transform transition-transform group-hover/video:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                {/* Text Skeleton */}
                <div className="space-y-2.5">
                  <div className="h-2 bg-[#CBD5E1] rounded w-3/4"></div>
                  <div className="h-2 bg-[#E2E8F0] rounded w-full"></div>
                </div>
              </div>
            </div>

            {/* Bento Box 2: Dictionary (Span 1) */}
            <div className="bg-white border border-line-light rounded-[24px] p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:border-accent-soft hover:shadow-[0_30px_60px_-15px_rgba(26,142,156,0.15)] overflow-hidden relative group flex flex-col min-h-[360px]">
              <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] uppercase tracking-wider font-bold mb-4 w-max">Quick Tool</div>
              <h3 className="font-serif font-semibold text-[24px] text-text-main tracking-tight mb-3">즉시 찾는 용어 사전</h3>
              <p className="font-sans text-[15px] text-text-soft leading-relaxed mb-8">흐름을 끊지 마세요. 모르는 단어는 그 자리에서 바로 확인하고 넘어갈 수 있습니다.</p>
              
              {/* UI Mockup */}
              <div className="mt-auto bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5 transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_15px_35px_rgba(26,142,156,0.12)]">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-3">
                  <svg className="w-4 h-4 text-accent-main" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <div className="text-[15px] font-bold text-text-main">매몰비용</div>
                </div>
                <div className="text-[13px] text-text-soft leading-relaxed">
                  이미 지출해서 회수할 수 없는 비용. 합리적인 의사결정에서는 매몰비용을 고려하지 않아야 합니다.
                </div>
              </div>
            </div>

            {/* Bento Box 3: OX Quiz (Span 1) */}
            <div className="bg-white border border-line-light rounded-[24px] p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:border-accent-soft hover:shadow-[0_30px_60px_-15px_rgba(26,142,156,0.15)] overflow-hidden relative group flex flex-col min-h-[360px]">
              <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] uppercase tracking-wider font-bold mb-4 w-max">Check-up</div>
              <h3 className="font-serif font-semibold text-[24px] text-text-main tracking-tight mb-3">점수 없는 OX 퀴즈</h3>
              <p className="font-sans text-[15px] text-text-soft leading-relaxed mb-8">각 편이 끝날 때마다 5문항의 퀴즈가 제공됩니다. 오직 나만의 이해도를 조용히 점검합니다.</p>
              
              {/* UI Mockup */}
              <div className="mt-auto flex justify-center gap-4 transform transition-transform duration-500 group-hover:scale-105">
                <div className="w-20 h-20 rounded-2xl bg-[#F8FAFC] border-2 border-transparent shadow-sm flex items-center justify-center text-4xl font-bold text-gray-300 hover:border-accent-main hover:text-accent-main hover:bg-white transition-all cursor-pointer">O</div>
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-accent-main shadow-md flex items-center justify-center text-4xl font-bold text-accent-main transition-all cursor-pointer relative">
                  X
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-main rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Box 4: Stamp Map (Span 2) */}
            <div className="lg:col-span-2 bg-[#0A3A42] rounded-[24px] p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(10,58,66,0.4)] overflow-hidden relative group min-h-[360px] flex flex-col justify-center">
              <div className="relative z-10 w-full md:w-1/2">
                <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-[11px] uppercase tracking-wider font-bold mb-4 backdrop-blur-sm border border-white/20">Motivation</div>
                <h3 className="font-serif font-semibold text-[24px] text-white tracking-tight mb-3">고요하게 채워가는 진주 스탬프</h3>
                <p className="font-sans text-[15px] text-white/80 leading-relaxed mb-6">
                  현란한 폭죽 애니메이션이나 등수 표시는 없습니다. 강의를 하나 마칠 때마다 나만의 심해 지도에 조용히 진주 하나가 켜집니다.
                </p>
                <Link href="/stamp-map" className="inline-flex items-center text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer">
                  스탬프 맵 살펴보기 <svg className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
              
              {/* UI Mockup Map */}
              <div className="mt-10 md:mt-0 md:absolute md:-right-4 md:top-1/2 md:-translate-y-1/2 w-full md:w-[60%] h-48 md:h-full opacity-70 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                 <div className="relative w-full max-w-sm h-full flex items-center justify-center pointer-events-none">
                   <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" viewBox="0 0 200 100">
                     {/* Paths */}
                     <path d="M20,50 Q40,30 60,40 T100,50 T140,60 T180,40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4"/>
                     <path d="M20,50 Q40,30 60,40" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"/>
                     <path d="M60,40 Q80,50 100,50" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"/>
                     
                     {/* Pearls */}
                     <circle cx="20" cy="50" r="7" fill="#FFF" className="animate-[pulse_3s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"/>
                     <circle cx="60" cy="40" r="7" fill="#FFF" className="animate-[pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }}/>
                     <circle cx="100" cy="50" r="7" fill="#FFF" className="animate-[pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}/>
                     
                     {/* Next step indicator */}
                     <circle cx="100" cy="50" r="14" fill="transparent" stroke="rgba(255,255,255,0.4)" strokeWidth="1" className="animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"/>
                     
                     {/* Upcoming Pearls */}
                     <circle cx="140" cy="60" r="5" fill="rgba(255,255,255,0.2)" />
                     <circle cx="180" cy="40" r="5" fill="rgba(255,255,255,0.2)" />
                   </svg>
                 </div>
              </div>
            </div>

            {/* Bento Box 5: Kakao Share (Span 1) */}
            <div className="bg-white border border-line-light rounded-[24px] p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:border-accent-soft hover:shadow-[0_30px_60px_-15px_rgba(26,142,156,0.15)] overflow-hidden relative group flex flex-col min-h-[360px]">
              <div className="inline-block px-3 py-1 rounded-full bg-[#FAE100]/20 text-[#3A2929] text-[11px] uppercase tracking-wider font-bold mb-4 w-max">Social</div>
              <h3 className="font-serif font-semibold text-[24px] text-text-main tracking-tight mb-3">가볍게 공유하기</h3>
              <p className="font-sans text-[15px] text-text-soft leading-relaxed mb-8">혼자 알기 아까운 인사이트를 발견했나요? 카카오톡으로 쉽게 배움을 나누세요.</p>
              
              {/* UI Mockup */}
              <div className="mt-auto bg-[#FAE100] rounded-xl shadow-[0_8px_30px_rgba(250,225,0,0.2)] p-4 transform transition-transform duration-500 group-hover:-translate-y-2 flex items-center justify-center cursor-pointer">
                <svg className="w-7 h-7 text-[#3A2929]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c-5.52 0-10 3.58-10 8 0 2.86 1.83 5.37 4.6 6.84-.23.82-.82 2.9-.88 3.12-.08.28.1.28.26.17.13-.1.88-.6 2.45-1.68 1.13.31 2.33.48 3.57.48 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
                </svg>
                <span className="ml-3 font-bold text-[#3A2929] text-sm">카카오톡 공유하기</span>
              </div>
            </div>

            {/* Bento Box 6: Teacher PDF (Span 2) */}
            <div className="lg:col-span-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[24px] p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:border-accent-soft hover:shadow-[0_30px_60px_-15px_rgba(26,142,156,0.15)] overflow-hidden relative group min-h-[360px] flex flex-col justify-center">
              <div className="relative z-10 w-full md:w-1/2 md:pr-6">
                <div className="inline-block px-3 py-1 rounded-full bg-accent-deep/10 text-accent-deep text-[11px] uppercase tracking-wider font-bold mb-4">For Educators</div>
                <h3 className="font-serif font-semibold text-[24px] text-text-main tracking-tight mb-3">교사용 PDF 교안 제공</h3>
                <p className="font-sans text-[15px] text-text-soft leading-relaxed mb-6">
                  학교 수업이나 독서 모임에서 함께 경제를 공부하시나요? 모든 에피소드의 핵심을 담은 깔끔한 교안을 누구나 다운로드할 수 있습니다.
                </p>
                <Link href="/teacher-kit" className="inline-flex items-center text-sm font-semibold text-accent-main hover:text-accent-deep transition-colors cursor-pointer">
                  교안 자료실 가기 <svg className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
              
              {/* UI Mockup Positioned Absolutely to the right */}
              <div className="mt-8 md:mt-0 md:absolute md:-right-8 md:top-1/2 md:-translate-y-1/2 w-full md:w-[55%] lg:w-[45%] transform transition-transform duration-500 group-hover:scale-[1.03] group-hover:-translate-x-3 flex gap-4">
                <div className="w-full bg-white border border-gray-200 rounded-xl shadow-xl p-5 aspect-[1/1.4] relative">
                   <div className="w-10 h-12 bg-red-100 rounded flex items-center justify-center mb-4">
                     <span className="text-red-500 font-bold text-[10px]">PDF</span>
                   </div>
                   <div className="space-y-2">
                     <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                     <div className="h-2.5 bg-gray-200 rounded w-5/6"></div>
                   </div>
                   <div className="mt-5 space-y-1.5">
                     <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                     <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                     <div className="h-1.5 bg-gray-100 rounded w-3/4"></div>
                   </div>
                   <div className="absolute bottom-4 right-4 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 shadow-sm text-gray-400">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   </div>
                </div>
                <div className="hidden sm:block w-full bg-white border border-gray-200 rounded-xl shadow-md p-5 aspect-[1/1.4] relative opacity-50 transform translate-y-4">
                   <div className="w-10 h-12 bg-gray-100 rounded mb-4"></div>
                   <div className="space-y-2"><div className="h-2.5 bg-gray-200 rounded w-full"></div></div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* STAGE 3 - Workflow (A Type) */}
      <section id="stage-3" className="relative px-6 py-20 md:px-10 md:py-36 text-white overflow-hidden" style={{
        background: 'linear-gradient(180deg, var(--water-card) 0%, var(--water-mid) 18%, var(--accent-soft) 40%, var(--accent-main) 75%, var(--accent-deep) 100%)'
      }}>
        <div className="max-w-[1100px] mx-auto relative z-10">
          <div ref={addToRefs} className="opacity-0 translate-y-8 transition-all duration-1000 ease-out text-center mb-20">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 font-mono text-[11px] tracking-[0.2em] text-white/90 uppercase font-semibold mb-6 backdrop-blur-md">
              Step-by-Step Workflow
            </div>
            <h2 className="font-serif font-semibold text-[28px] md:text-[min(4.2vw,44px)] leading-tight tracking-tight mb-5 text-white drop-shadow-md">
              완결을 향한 5단계 여정
            </h2>
            <p className="font-sans text-[15px] md:text-[min(1.4vw,16.5px)] text-white/90 leading-relaxed drop-shadow-sm max-w-[600px] mx-auto">
              길을 잃을 걱정은 없습니다. 1권부터 5권까지,<br/>제시된 흐름만 따라오면 경제 판단력이 완성됩니다.
            </p>
          </div>

          <div ref={addToRefs} className="relative max-w-[800px] mx-auto opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-100">
            {/* 세로 연결 선 */}
            <div className="absolute left-[39px] md:left-1/2 top-10 bottom-10 w-0.5 bg-white/20 -translate-x-1/2 rounded-full hidden sm:block"></div>
            
            <div className="flex flex-col gap-12 sm:gap-16">
              {/* STEP 1 */}
              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-0 group">
                <div className="sm:w-1/2 sm:pr-12 flex sm:justify-end w-full">
                  <div className="bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-7 backdrop-blur-md transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40 group-hover:-translate-y-1 w-full text-left relative overflow-hidden">
                    <div className="font-mono text-[12px] text-accent-light tracking-wider mb-2">기초 어휘 학습</div>
                    <div className="font-serif font-semibold text-[22px] text-white tracking-tight mb-3">1권. 돈의 언어</div>
                    <div className="font-sans text-[14.5px] text-white/80 leading-relaxed">
                      뉴스, 영수증, 월급명세서의 단어가 들리기 시작합니다. 기초적인 경제 용어의 장벽을 허뭅니다.
                    </div>
                    <div className="mt-5 inline-flex items-center text-sm font-semibold text-white/90 bg-white/10 px-3 py-1.5 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-accent-light mr-2"></span> 27편 완독
                    </div>
                  </div>
                </div>
                {/* Node */}
                <div className="hidden sm:flex absolute left-1/2 top-8 -translate-x-1/2 w-16 h-16 rounded-full bg-[#0A3A42] border-4 border-white/30 items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110 group-hover:border-accent-light shadow-lg">
                  <span className="font-serif font-bold text-xl text-white">1</span>
                </div>
                <div className="sm:w-1/2 sm:pl-12 w-full hidden sm:flex items-center text-white/50 text-sm font-medium">
                </div>
              </div>

              {/* STEP 2 */}
              <div className="relative flex flex-col sm:flex-row-reverse items-center sm:items-start gap-6 sm:gap-0 group">
                <div className="sm:w-1/2 sm:pl-12 flex sm:justify-start w-full">
                  <div className="bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-7 backdrop-blur-md transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40 group-hover:-translate-y-1 w-full text-left relative overflow-hidden">
                    <div className="font-mono text-[12px] text-accent-light tracking-wider mb-2">거시 경제 이해</div>
                    <div className="font-serif font-semibold text-[22px] text-white tracking-tight mb-3">2권. 돈의 흐름</div>
                    <div className="font-sans text-[14.5px] text-white/80 leading-relaxed">
                      환율과 금리 뉴스가 내 삶과 어떻게 연결되는지 깨닫습니다. 세상의 돈이 흐르는 길을 봅니다.
                    </div>
                    <div className="mt-5 inline-flex items-center text-sm font-semibold text-white/90 bg-white/10 px-3 py-1.5 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-accent-light mr-2"></span> 25편 완독
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex absolute left-1/2 top-8 -translate-x-1/2 w-16 h-16 rounded-full bg-[#0A3A42] border-4 border-white/30 items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110 group-hover:border-accent-light shadow-lg">
                  <span className="font-serif font-bold text-xl text-white">2</span>
                </div>
                <div className="sm:w-1/2 sm:pr-12 w-full hidden sm:flex items-center justify-end text-white/50 text-sm font-medium">
                </div>
              </div>

              {/* STEP 3 */}
              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-0 group">
                <div className="sm:w-1/2 sm:pr-12 flex sm:justify-end w-full">
                  <div className="bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-7 backdrop-blur-md transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40 group-hover:-translate-y-1 w-full text-left relative overflow-hidden">
                    <div className="font-mono text-[12px] text-accent-light tracking-wider mb-2">기업 가치 분석</div>
                    <div className="font-serif font-semibold text-[22px] text-white tracking-tight mb-3">3권. 돈의 구조</div>
                    <div className="font-sans text-[14.5px] text-white/80 leading-relaxed">
                      회사의 건강을 지표로 판단하는 법을 배웁니다. 투자의 근간이 되는 재무적 시각을 기릅니다.
                    </div>
                    <div className="mt-5 inline-flex items-center text-sm font-semibold text-white/90 bg-white/10 px-3 py-1.5 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-accent-light mr-2"></span> 25편 완독
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex absolute left-1/2 top-8 -translate-x-1/2 w-16 h-16 rounded-full bg-[#0A3A42] border-4 border-white/30 items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110 group-hover:border-accent-light shadow-lg">
                  <span className="font-serif font-bold text-xl text-white">3</span>
                </div>
                <div className="sm:w-1/2 sm:pl-12 w-full hidden sm:flex items-center text-white/50 text-sm font-medium">
                </div>
              </div>

              {/* STEP 4 */}
              <div className="relative flex flex-col sm:flex-row-reverse items-center sm:items-start gap-6 sm:gap-0 group">
                <div className="sm:w-1/2 sm:pl-12 flex sm:justify-start w-full">
                  <div className="bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-7 backdrop-blur-md transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40 group-hover:-translate-y-1 w-full text-left relative overflow-hidden">
                    <div className="font-mono text-[12px] text-accent-light tracking-wider mb-2">실전 경제 의사결정</div>
                    <div className="font-serif font-semibold text-[22px] text-white tracking-tight mb-3">4권. 돈의 결정</div>
                    <div className="font-sans text-[14.5px] text-white/80 leading-relaxed">
                      소비, 저축, 대출, 보험, 세금, 투자의 순간에 타인에게 휘둘리지 않고 스스로 결정합니다.
                    </div>
                    <div className="mt-5 inline-flex items-center text-sm font-semibold text-white/90 bg-white/10 px-3 py-1.5 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-accent-light mr-2"></span> 31편 완독
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex absolute left-1/2 top-8 -translate-x-1/2 w-16 h-16 rounded-full bg-[#0A3A42] border-4 border-white/30 items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110 group-hover:border-accent-light shadow-lg">
                  <span className="font-serif font-bold text-xl text-white">4</span>
                </div>
                <div className="sm:w-1/2 sm:pr-12 w-full hidden sm:flex items-center justify-end text-white/50 text-sm font-medium">
                </div>
              </div>

              {/* STEP 5 */}
              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-0 group">
                <div className="sm:w-1/2 sm:pr-12 flex sm:justify-end w-full">
                  <div className="bg-accent-main/20 border border-accent-light/50 rounded-2xl p-6 sm:p-7 backdrop-blur-md transition-all duration-300 group-hover:bg-accent-main/30 group-hover:border-accent-light group-hover:-translate-y-1 w-full text-left relative overflow-hidden shadow-[0_0_30px_rgba(26,142,156,0.15)]">
                    <div className="font-mono text-[12px] text-white tracking-wider mb-2 font-semibold">최종 완성</div>
                    <div className="font-serif font-semibold text-[22px] text-white tracking-tight mb-3">5권. 돈의 인생</div>
                    <div className="font-sans text-[14.5px] text-white/90 leading-relaxed">
                      단순한 지식을 넘어, 인생에서 돈이 가지는 의미를 정립하고 흔들리지 않는 태도를 완성합니다.
                    </div>
                    <div className="mt-5 inline-flex items-center text-sm font-semibold text-[#0A3A42] bg-accent-light px-4 py-2 rounded-lg shadow-md">
                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      경제 판단력 완성 (133편)
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex absolute left-1/2 top-8 -translate-x-1/2 w-16 h-16 rounded-full bg-accent-main border-4 border-accent-light items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_20px_rgba(110,210,220,0.4)]">
                  <span className="font-serif font-bold text-xl text-white">5</span>
                </div>
                <div className="sm:w-1/2 sm:pl-12 w-full hidden sm:flex items-center text-white/50 text-sm font-medium">
                </div>
              </div>
            </div>
            
            <div className="mt-20 text-center">
              <Link href="/lesson/L001" className="inline-flex items-center justify-center px-10 py-5 bg-white text-accent-deep font-bold rounded-full transition-all hover:bg-accent-light hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)] tracking-wide group text-[17px]">
                <span className="mr-3">안전한 여정 시작하기</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 4 */}
      <section className="relative px-6 py-24 md:px-10 md:py-36 pb-12 overflow-hidden text-white" style={{
        background: 'linear-gradient(180deg, var(--accent-deep) 0%, #08434F 30%, var(--accent-darkest) 100%)'
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute w-[1.5px] h-[1.5px] bg-white/70 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.5)] top-[10%] left-[15%] animate-[deepTwinkle_5s_ease-in-out_infinite]" style={{ animationDelay: '0s' }}></div>
          <div className="absolute w-[1.5px] h-[1.5px] bg-white/70 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.5)] top-[18%] left-[38%] animate-[deepTwinkle_5s_ease-in-out_infinite]" style={{ animationDelay: '1.2s' }}></div>
          <div className="absolute w-[1.5px] h-[1.5px] bg-white/70 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.5)] top-[8%] left-[62%] animate-[deepTwinkle_5s_ease-in-out_infinite]" style={{ animationDelay: '2.5s' }}></div>
          <div className="absolute w-[1.5px] h-[1.5px] bg-white/70 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.5)] top-[22%] left-[82%] animate-[deepTwinkle_5s_ease-in-out_infinite]" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute w-[1.5px] h-[1.5px] bg-white/70 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.5)] top-[30%] left-[25%] animate-[deepTwinkle_5s_ease-in-out_infinite]" style={{ animationDelay: '1.8s' }}></div>
          <div className="absolute w-[1.5px] h-[1.5px] bg-white/70 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.5)] top-[35%] left-[70%] animate-[deepTwinkle_5s_ease-in-out_infinite]" style={{ animationDelay: '3.2s' }}></div>
          <div className="absolute w-[1.5px] h-[1.5px] bg-white/70 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.5)] top-[14%] left-[92%] animate-[deepTwinkle_5s_ease-in-out_infinite]" style={{ animationDelay: '2.1s' }}></div>
          <div className="absolute w-[1.5px] h-[1.5px] bg-white/70 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.5)] top-[25%] left-[6%] animate-[deepTwinkle_5s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }}></div>
        </div>

        <div className="relative z-10">
          {/* CTA */}
          <div className="max-w-[700px] mx-auto text-center">
            <div ref={addToRefs} className="opacity-0 translate-y-8 transition-all duration-1000 ease-out">
              <h2 className="font-serif font-semibold text-[30px] md:text-[min(4.5vw,48px)] leading-tight tracking-tight mb-5 drop-shadow-xl">
                지금, 천천히<br/>첫 편을 펼쳐 보세요
              </h2>
              <p className="font-sans text-base text-white/85 leading-relaxed mb-12">
                계정 없이도 둘러볼 수 있습니다.<br/>학습 흔적을 남기고 싶을 때만 가입하세요.
              </p>
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <Link href="/lesson/L001" className="flex items-center justify-center px-8 py-4 bg-accent-main text-white font-semibold rounded-xl transition-all hover:bg-accent-deep hover:-translate-y-0.5 shadow-[0_10px_28px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_18px_40px_-14px_rgba(26,142,156,0.7)] tracking-wide w-full md:w-auto max-w-[280px] md:max-w-none mx-auto md:mx-0">
                  강의 둘러보기
                </Link>
                <Link href="/signup" className="flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border-2 border-white/45 backdrop-blur-md transition-all hover:bg-white/20 hover:border-white hover:-translate-y-0.5 tracking-wide w-full md:w-auto max-w-[280px] md:max-w-none mx-auto md:mx-0">
                  계정 만들기
                </Link>
              </div>
            </div>
          </div>

          {/* 푸터 — 둘러보기 · 채널 */}
          <footer className="max-w-[1100px] mx-auto mt-20 md:mt-28 pt-12 border-t border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr] gap-10 md:gap-8">
              <div className="col-span-2 md:col-span-1">
                <div className="font-serif font-medium text-lg text-white/90 mb-4 tracking-tight">고요의 경제나루</div>
                <p className="font-sans text-[13.5px] text-white/55 leading-relaxed max-w-[28em]">
                  일상 경제 판단력을 갖춘 자립인을 위한 경제 판단력 교과서. 차근차근 함께, 스스로 결정하는 곳에 도착하는 것을 목표로 합니다.
                </p>
              </div>
              <div>
                <h4 className="font-mono text-[11px] tracking-[0.2em] text-white/45 uppercase font-semibold mb-4">둘러보기</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/lesson/L001" className="font-sans text-[14px] text-white/65 hover:text-white transition-colors">강의 시작</Link></li>
                  <li><Link href="/dictionary" className="font-sans text-[14px] text-white/65 hover:text-white transition-colors">용어 사전</Link></li>
                  <li><Link href="/stamp-map" className="font-sans text-[14px] text-white/65 hover:text-white transition-colors">스탬프 맵</Link></li>
                  <li><Link href="/teacher-kit" className="font-sans text-[14px] text-white/65 hover:text-white transition-colors">교사용 교안</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-mono text-[11px] tracking-[0.2em] text-white/45 uppercase font-semibold mb-4">채널</h4>
                <ul className="space-y-2.5">
                  <li><a href="#" className="font-sans text-[14px] text-white/65 hover:text-white transition-colors">유튜브</a></li>
                  <li><a href="#" className="font-sans text-[14px] text-white/65 hover:text-white transition-colors">인스타그램</a></li>
                  <li><a href="#nl-email" className="font-sans text-[14px] text-white/65 hover:text-white transition-colors">뉴스레터</a></li>
                  <li><a href="#" className="font-sans text-[14px] text-white/65 hover:text-white transition-colors">문의</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-7 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3">
              <p className="font-sans text-[12.5px] text-white/45 leading-relaxed max-w-[44em]">
                본 콘텐츠는 <strong className="text-white/70 font-semibold">CC BY-NC-SA 4.0</strong> 라이선스로 제공됩니다. 결제 정보를 받지 않으며 광고가 없습니다.
              </p>
              <p className="font-sans text-[12.5px] text-white/45 whitespace-nowrap">© 2026 고요의 경제나루 · 제작 ELLA PARK</p>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
