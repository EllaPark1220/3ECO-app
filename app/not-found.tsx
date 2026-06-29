import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen font-sans flex flex-col bg-bg-light text-text-main" style={{ background: 'var(--bg-light)', color: 'var(--text-main)', lineHeight: 1.78, fontSize: '16px' }}>
      <nav className="p-[18px_40px] flex justify-center items-center border-b border-line-soft bg-white/90 backdrop-blur-md">
        <Link href="/" className="font-serif font-semibold text-[16px] text-text-main tracking-[-0.01em]">
          고요의 경제나루
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-[40px_20px]">
        <div className="bg-white border border-line-light rounded-[20px] p-[80px_60px] min-h-[420px] w-full max-w-[980px] flex flex-col items-center justify-center text-center shadow-sm">
          <div className="font-hahmlet font-bold text-[clamp(72px,12vw,110px)] leading-none text-water-light tracking-[-0.02em] mb-[18px]">
            404
          </div>
          <h2 className="font-serif font-semibold text-[clamp(22px,3vw,28px)] leading-[1.4] text-text-main tracking-[-0.015em] mb-3.5">
            찾으시는 페이지가 없어요
          </h2>
          <p className="font-sans text-[15px] text-text-soft leading-[1.85] max-w-[440px] mb-8">
            주소를 다시 확인해 보시거나, 처음으로 돌아가 천천히 둘러보세요.
          </p>
          <div className="flex gap-2.5 flex-wrap justify-center mb-5">
            <Link href="/" className="inline-flex items-center px-[26px] py-[13px] bg-accent-main text-white border-none rounded-[11px] font-sans font-semibold text-[14.5px] transition-all hover:bg-accent-deep hover:-translate-y-[1px] hover:shadow-[0_8px_20px_-8px_rgba(26,142,156,0.5)]">
              홈으로
            </Link>
            <Link href="/lesson/1-1" className="inline-flex items-center px-[22px] py-[13px] bg-transparent text-text-main border-[1.5px] border-line-light rounded-[11px] font-sans font-medium text-[14px] transition-all hover:border-accent-soft hover:bg-water-card hover:text-accent-deep">
              1권 1편부터 시작
            </Link>
          </div>
          <div className="font-sans text-[13px] text-text-soft">
            계속 같은 문제가 생기면 <a href="mailto:contact@example.com" className="text-accent-deep underline">알려주세요</a>
          </div>
        </div>
      </main>

      <footer className="text-center p-[40px_20px] border-t border-line-soft bg-water-card">
        <div className="font-sans text-[12px] text-text-soft leading-[1.85]">결제 정보를 받지 않습니다 · 광고 없음</div>
        <div className="font-sans text-[12px] text-text-soft leading-[1.85]">CC BY-NC-SA 4.0 라이선스로 배포됩니다</div>
      </footer>
    </div>
  );
}
