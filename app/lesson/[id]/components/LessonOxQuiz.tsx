// OX 퀴즈 + 완료 모달 — 하드코딩 프로토타입(FW-OX-001·W11-T8 소관, 이 슬라이스 스코프 밖).
// page.tsx 를 Server Component 로 전환하며 상태 보유 부분을 이 클라이언트 아일랜드로
// "그대로" 이전했을 뿐, 동작·마크업은 변경하지 않는다(진척 저장/재개와 무관).
"use client";

import { useState } from "react";

export default function LessonOxQuiz() {
  // OX Quiz State
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOptionChange = (qId: string, value: string) => {
    if (!isSubmitted) {
      setAnswers((prev) => ({ ...prev, [qId]: value }));
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
    <>
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
    </>
  );
}
