'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [viewMode, setViewMode] = useState<'video' | 'text'>('video');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // OX Quiz State
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Resume toast
  const [showToast, setShowToast] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowToast(false), 3400);
    return () => clearTimeout(t);
  }, []);

  const handleOptionChange = (qId: string, value: string) => {
    if (!isSubmitted) {
      setAnswers(prev => ({ ...prev, [qId]: value }));
    }
  };

  const allAnswered = Object.keys(answers).length === 5;

  const handleSubmit = () => {
    if (allAnswered) {
      setIsSubmitted(true);
      // Show modal after 1.5s
      setTimeout(() => setIsModalOpen(true), 1500);
    }
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg-light)', color: 'var(--text-main)', lineHeight: 1.78, fontSize: '16px' }}>
      <a href="#main" className="absolute -top-10 left-0 bg-accent-deep text-white px-4 py-2 text-sm z-[200] focus:top-0 outline-none">
        본문으로 건너뛰기
      </a>

      {/* Nav */}
      <nav className="sticky top-0 z-[100] px-5 py-4 md:px-10 flex justify-between items-center bg-[#F8FCFC]/85 backdrop-blur-md saturate-150 border-b border-line-soft">
        <Link href="/" className="font-serif font-semibold text-base text-text-main tracking-tight">
          고요의 경제나루
        </Link>
        <div className="flex gap-4 md:gap-[26px] items-center">
          <Link href="/" className="text-[13px] md:text-[14px] text-text-soft font-medium hover:text-accent-deep transition-colors">HOME</Link>
          <Link href="/dictionary" className="text-[13px] md:text-[14px] text-text-soft font-medium hover:text-accent-deep transition-colors">INDEX</Link>
          <Link href="/stamp-map" className="text-[13px] md:text-[14px] text-text-soft font-medium hover:text-accent-deep transition-colors">STAMP MAP</Link>
          <Link href="/login" className="text-[13px] md:text-[14px] text-text-soft font-medium hover:text-accent-deep transition-colors">로그인</Link>
        </div>
      </nav>

      <main className="max-w-[820px] w-full mx-auto px-6 py-[50px] pb-[100px]" id="main">
        
        {/* Breadcrumb */}
        <div className="font-mono text-[11px] tracking-[0.1em] text-accent-deep mb-[26px] font-semibold uppercase">
          <Link href="#" className="text-text-mute hover:text-accent-deep transition-colors">1권 · 돈의 언어</Link>
          <span className="text-text-mute mx-2 font-normal">/</span>
          <Link href="/lesson/1-1" className="text-text-mute hover:text-accent-deep transition-colors">1편</Link>
          <span className="text-text-mute mx-2 font-normal">/</span>
          <span>학습하기</span>
        </div>

        {/* Lesson Header */}
        <header className="mb-[44px]">
          <div className="font-mono text-[12px] tracking-[0.2em] text-accent-main font-semibold uppercase mb-3.5">1권 1편</div>
          <h1 className="font-serif font-bold text-[28px] md:text-[clamp(28px,4vw,40px)] leading-[1.3] text-text-main tracking-[-0.015em] mb-2">다 가질 수 없다는 것</h1>
          <p className="font-serif font-normal text-[18px] md:text-[clamp(18px,2.2vw,22px)] leading-[1.4] text-text-soft tracking-[-0.005em] mb-7">— 희소성과 선택</p>

          <div className="bg-water-card rounded-[14px] p-[22px_26px]">
            <div className="font-mono text-[10px] tracking-[0.25em] text-accent-deep font-semibold uppercase mb-3">학습 목표</div>
            <ol className="list-none m-0 p-0" style={{ counterReset: 'obj' }}>
              <li className="relative pl-8 pt-1 pb-1 font-sans text-[14.5px] text-text-main leading-[1.7] before:content-[counter(obj)] before:absolute before:left-0 before:top-1 before:w-[22px] before:h-[22px] before:rounded-full before:bg-accent-soft before:text-text-main before:font-mono before:text-[11px] before:font-semibold before:flex before:items-center before:justify-center before:leading-none" style={{ counterIncrement: 'obj' }}>
                자원이 한정될 때 모든 욕구를 다 채울 수 없음을 설명할 수 있다
              </li>
              <li className="relative pl-8 pt-1 pb-1 font-sans text-[14.5px] text-text-main leading-[1.7] before:content-[counter(obj)] before:absolute before:left-0 before:top-1 before:w-[22px] before:h-[22px] before:rounded-full before:bg-accent-soft before:text-text-main before:font-mono before:text-[11px] before:font-semibold before:flex before:items-center before:justify-center before:leading-none" style={{ counterIncrement: 'obj' }}>
                '경제는 선택의 학문'이라는 정의를 자기 말로 풀 수 있다
              </li>
            </ol>
          </div>
        </header>

        {/* Media Toggle */}
        <div className="inline-flex bg-water-card rounded-xl p-1 mb-[22px]" role="tablist">
          <button 
            className={`flex items-center gap-2 p-[10px_22px] rounded-[9px] font-sans text-[14px] transition-all cursor-pointer border-none ${viewMode === 'video' ? 'bg-white text-text-main font-semibold shadow-[0_2px_8px_-3px_rgba(13,95,109,0.2)]' : 'bg-transparent text-text-soft font-medium hover:text-text-main'}`}
            onClick={() => setViewMode('video')}
            role="tab"
            aria-selected={viewMode === 'video'}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-[1.6]">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            영상으로 보기
          </button>
          <button 
            className={`flex items-center gap-2 p-[10px_22px] rounded-[9px] font-sans text-[14px] transition-all cursor-pointer border-none ${viewMode === 'text' ? 'bg-white text-text-main font-semibold shadow-[0_2px_8px_-3px_rgba(13,95,109,0.2)]' : 'bg-transparent text-text-soft font-medium hover:text-text-main'}`}
            onClick={() => setViewMode('text')}
            role="tab"
            aria-selected={viewMode === 'text'}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-[1.6]">
              <path d="M4 6h16M4 12h16M4 18h7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            글로 읽기
          </button>
        </div>

        {/* Media Area */}
        <div className="mb-[60px] relative">
          {viewMode === 'video' && (
  <>
    <div className="relative aspect-video bg-water-card rounded-2xl overflow-hidden border border-line-light">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src="https://www.youtube-nocookie.com/embed/oLPoeKtsvXc?cc_load_policy=1&modestbranding=1&rel=0"
        title="다 가질 수 없다는 것 — 희소성과 선택"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        frameBorder={0}
      />
    </div>
    <p className="mt-3 font-sans text-[13px] text-text-mute">
      영상이 보이지 않나요?{' '}
      <a
        href="https://youtu.be/oLPoeKtsvXc"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent-deep font-medium underline underline-offset-2 hover:text-accent-main"
      >
        YouTube에서 바로 보기 →
      </a>
    </p>
  </>
)}

          {viewMode === 'text' && (
            <div className="font-sans text-[17px] leading-[1.95] text-text-main">
              <h3 className="font-serif font-semibold text-[22px] text-text-main mt-0 mb-3.5 tracking-[-0.01em]">선택의 대가</h3>
              <p className="mb-4">모든 것을 다 가질 수 있다면 경제학은 필요 없습니다. 하지만 우리의 시간, 돈, 자원은 한정되어 있습니다.</p>
              <p className="mb-4">이것을 <strong>희소성(Scarcity)</strong>이라고 부릅니다. 희소하기 때문에 우리는 무언가를 선택해야만 합니다.</p>
            </div>
          )}
        </div>

        {/* OX Quiz */}
        <section className="mt-14 p-[40px_36px] bg-white border border-line-light rounded-[18px]">
          <div className="font-mono text-[11px] tracking-[0.25em] text-accent-deep font-semibold uppercase mb-2.5">이해의 확인</div>
          <h2 className="font-serif font-semibold text-[24px] text-text-main mb-1.5 tracking-[-0.005em]">다섯 문항의 O/X</h2>
          <p className="font-sans text-[14px] text-text-soft mb-8 leading-[1.7]">방금 본 내용을 내 것으로 만듭니다. 점수나 등수는 없으니 편안하게 풀어 보세요.</p>

          <div className="flex flex-col">
            {[
              { id: 'q1', text: '자원이 한정되어 있기 때문에 우리는 선택을 해야만 한다.' },
              { id: 'q2', text: '모든 사람의 욕구를 완벽히 채울 수 있는 사회가 존재한다.' },
              { id: 'q3', text: '경제학은 결국 선택의 문제를 다루는 학문이다.' },
              { id: 'q4', text: '희소성은 절대적인 자원의 양이 부족할 때만 발생한다.' },
              { id: 'q5', text: '시간 역시 희소한 자원의 하나로 볼 수 있다.' }
            ].map((q, idx) => (
              <div key={q.id} className="py-[22px] border-b border-line-soft last:border-b-0">
                <div className="font-mono text-[11px] tracking-[0.1em] text-accent-deep font-semibold mb-1.5 uppercase">QUESTION 0{idx + 1}</div>
                <div className="font-sans text-[15.5px] leading-[1.7] text-text-main mb-3.5">{q.text}</div>
                <div className="flex gap-2.5">
                  <div className="flex-1 max-w-[140px] relative">
                    <input type="radio" name={q.id} id={`${q.id}-o`} className="absolute opacity-0 pointer-events-none peer" checked={answers[q.id] === 'O'} onChange={() => handleOptionChange(q.id, 'O')} disabled={isSubmitted} />
                    <label htmlFor={`${q.id}-o`} className="flex items-center justify-center gap-2 p-[12px_18px] border-[1.5px] border-line-light rounded-[10px] bg-bg-light font-sans font-semibold text-[15px] text-text-soft cursor-pointer transition-all select-none hover:border-accent-soft hover:text-text-main peer-checked:border-accent-main peer-checked:bg-water-light peer-checked:text-accent-deep peer-focus-visible:outline-accent-main peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                      <span className="text-[18px] leading-none mb-[2px]">O</span> 그렇다
                    </label>
                  </div>
                  <div className="flex-1 max-w-[140px] relative">
                    <input type="radio" name={q.id} id={`${q.id}-x`} className="absolute opacity-0 pointer-events-none peer" checked={answers[q.id] === 'X'} onChange={() => handleOptionChange(q.id, 'X')} disabled={isSubmitted} />
                    <label htmlFor={`${q.id}-x`} className="flex items-center justify-center gap-2 p-[12px_18px] border-[1.5px] border-line-light rounded-[10px] bg-bg-light font-sans font-semibold text-[15px] text-text-soft cursor-pointer transition-all select-none hover:border-accent-soft hover:text-text-main peer-checked:border-accent-main peer-checked:bg-water-light peer-checked:text-accent-deep peer-focus-visible:outline-accent-main peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                      <span className="text-[18px] leading-none mb-[2px]">X</span> 아니다
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col items-start gap-3.5">
            <div className="font-mono text-[11px] tracking-[0.1em] text-text-mute uppercase">
              {Object.keys(answers).length} / 5 문항 완료
            </div>
            {!isSubmitted ? (
              <button 
                onClick={handleSubmit} 
                disabled={!allAnswered}
                className="font-sans font-semibold text-[15px] p-[14px_36px] rounded-xl border-none cursor-pointer transition-all bg-accent-main text-white hover:-translate-y-[1px] hover:bg-accent-deep disabled:bg-line-light disabled:text-text-mute disabled:cursor-not-allowed disabled:transform-none"
              >
                제출하고 학습 완료하기
              </button>
            ) : (
              <div className="mt-6 p-[22px_26px] rounded-[14px] text-[15px] leading-[1.7] bg-water-card text-accent-deep border-l-[3px] border-l-accent-main animate-[toastFade_0.4s_ease_forwards]">
                <div className="font-serif font-semibold text-[17px] mb-1">모두 맞히셨습니다!</div>
                희소성과 선택의 관계를 정확히 이해하셨네요. 1편 학습을 완료했습니다.
              </div>
            )}
          </div>
        </section>

        {/* Next Lesson */}
        <section className="mt-14 pt-8 border-t border-line-light flex flex-col md:flex-row justify-between md:items-center gap-5">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-text-mute uppercase mb-1">NEXT</div>
            <div className="font-serif font-medium text-[17px] text-text-main tracking-[-0.005em]">1권 2편 — 고르지 못한 쪽의 가치</div>
          </div>
          <Link href="/lesson/1-2" className="font-sans font-semibold text-[14px] p-[12px_24px] rounded-[10px] bg-transparent text-accent-deep border-[1.5px] border-accent-soft cursor-pointer no-underline transition-all inline-flex items-center gap-1.5 whitespace-nowrap hover:bg-accent-main hover:text-white hover:border-accent-main w-fit">
            다음 편 읽기 →
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-water-light text-center p-[50px_40px] mt-20">
        <div className="font-sans text-[12.5px] text-text-soft leading-[1.95]">결제 정보를 받지 않습니다 · 광고 없음</div>
        <div className="font-sans text-[12.5px] text-text-soft leading-[1.95]">CC BY-NC-SA 4.0 라이선스로 배포됩니다</div>
        <div className="font-sans text-[12.5px] text-text-soft leading-[1.95]">제작 · ELLA PARK</div>
      </footer>

      {/* Completion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5 bg-[rgba(14,43,48,0.5)] backdrop-blur-md">
          <div className="w-full max-w-[440px] bg-white rounded-[22px] p-[38px_34px_28px] border border-line-light shadow-[0_24px_48px_-16px_rgba(13,95,109,0.3)] text-center animate-[fadeUp_0.3s_ease_forwards]">
            <div className="font-mono text-[11px] tracking-[0.25em] text-accent-deep font-semibold uppercase mb-4.5">1권 1편 완료</div>
            
            <div className="flex justify-center mb-5">
              <div className="relative w-[200px] h-[200px] flex items-center justify-center bg-bg-light rounded-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] border border-line-soft">
                {/* 1권 진주 - 푸른빛 */}
                <div className="w-[80px] h-[80px] rounded-full shadow-[inset_-6px_-6px_12px_rgba(0,0,0,0.1),_inset_4px_4px_12px_rgba(255,255,255,0.9),_0_10px_20px_-5px_rgba(120,180,220,0.4)]" style={{ background: 'radial-gradient(circle at 30% 30%, #FFFFFF 0%, #DCE7E8 40%, #A0C8D2 80%, #78B4DC 100%)' }}></div>
              </div>
            </div>

            <h2 className="font-serif font-semibold text-[22px] text-text-main leading-[1.4] tracking-[-0.01em] mb-1">첫 진주를 얻었습니다</h2>
            <p className="font-serif font-normal text-[17px] text-text-soft mb-5">다 가질 수 없다는 것</p>

            <div className="font-sans text-[14.5px] leading-[1.85] text-text-soft mb-5 text-left bg-water-card p-[18px_20px] rounded-xl">
              경제의 시작점, 희소성을 배웠습니다. 이제 당신의 지도에 첫 번째 작은 빛이 켜졌습니다.
            </div>

            <div className="font-mono text-[11px] tracking-[0.08em] text-text-mute mb-[26px]">
              2026.05.13 완료
            </div>

            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => alert('학습 기록이 저장되었습니다.')}
                className="inline-flex items-center justify-center gap-2 p-[13px_18px] bg-[#FEE500] text-[#3C1E1E] border-none rounded-[11px] font-sans font-semibold text-[14.5px] cursor-pointer transition-all hover:bg-[#F5DC00] hover:-translate-y-[1px]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.85 5.34 4.65 6.78l-1.18 4.31c-.1.37.3.66.62.46l5.18-3.4c.24.02.48.04.73.04 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
                </svg>
                카카오로 로그인하여 기록 남기기
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-transparent text-text-soft border border-line-light rounded-[11px] font-sans font-medium text-[14px] cursor-pointer transition-all hover:bg-bg-light hover:text-text-main"
              >
                로그인 없이 그냥 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
