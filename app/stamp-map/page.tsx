'use client';

import Link from 'next/link';

// Full 133 episodes mock data based on stamp_map_v3.html
const volumesData = [
  {
    num: 1, title: '돈의 언어', question: '경제가 뭔지 말할 수 있나?', count: 27,
    episodes: [
      { n: 1, title: '다 가질 수 없다는 것 — 희소성과 선택' },
      { n: 2, title: '고르지 못한 쪽의 가치 — 기회비용' },
      { n: 3, title: '이미 쓴 돈은 잊어야 한다 — 매몰비용과 인센티브' },
      { n: 4, title: '가격은 누가 정할까 — 가격의 정체' },
      { n: 5, title: '가격을 움직이는 두 힘 — 수요와 공급' },
      { n: 6, title: '사고팔 수 있는 곳이라면 어디든 — 시장의 정체' },
      { n: 7, title: '종이 한 장이 가치를 갖는 이유 — 돈이란 무엇인가' },
      { n: 8, title: '돈의 가치가 녹는다는 것 — 인플레이션' },
      { n: 9, title: '안 사는 게 더 무서운 이유 — 디플레이션' },
      { n: 10, title: '빌린 돈에 붙는 값 — 금리와 이자' },
      { n: 11, title: '이자에 이자가 붙는다는 것 — 복리' },
      { n: 12, title: '보이지 않는 이력서 — 신용과 대출' },
      { n: 13, title: '영수증 맨 아래의 작은 숫자 — 부가가치세' },
      { n: 14, title: '가격표 안에 무엇이 들어 있나 — 원가·마진과 할인의 정체' },
      { n: 15, title: '받기로 한 돈과 통장에 들어온 돈 — 세전과 세후' },
      { n: 16, title: '많이 벌수록 더 떼어가는 이유 — 소득세 구조' },
      { n: 17, title: '월급에서 미리 빠지는 안전망 — 4대보험' },
      { n: 18, title: '노동에도 가격이 있다 — 최저임금' },
      { n: 19, title: '월급에서 출발해 어디로 흘러가나 — 명세서 한 장 통합 읽기' },
      { n: 20, title: '가진 것과 갚을 것 — 자산과 부채' },
      { n: 21, title: '모으고, 지키고, 나누는 도구들 — 예금·적금·보험·연금' },
      { n: 22, title: '한 나라의 1년 성적표 — GDP' },
      { n: 23, title: '돈의 외국 가격 — 환율' },
      { n: 24, title: '경제에도 계절이 있다 — 경기와 호황·불황' },
      { n: 25, title: '평균 너머의 한 단위를 보다 — 평균과 한계' },
      { n: 26, title: '돈의 언어 — 1권 정리 ①' },
      { n: 27, title: '돈의 언어 — 1권 정리 ②' }
    ]
  },
  { num: 2, title: '돈의 흐름', question: '세상이 어떻게 돌아가나?', count: 25, episodes: [
      { n: 1, title: 'GDP를 분해해서 다시 본다 — 네 개의 항목' },
      { n: 2, title: '경기는 왜 순환하는가 — 호황과 불황의 사이클' },
      { n: 3, title: '경기를 재는 신호들 — 선행·동행·후행' },
      { n: 4, title: '중앙은행은 왜 존재하는가 — 한국은행의 정체' },
      { n: 5, title: '기준금리가 모든 금리의 어머니인 이유' },
      { n: 6, title: '금리를 올리고 내릴 때 무슨 일이 벌어지나' },
      { n: 7, title: '통화정책 — 돈을 풀고 조이는 두 가지 방향' },
      { n: 8, title: '물가는 왜 오르는가 — 인플레이션의 세 가지 원인' },
      { n: 9, title: '디플레이션이 더 무서운 이유 — 1권 9편 심화' },
      { n: 10, title: '스태그플레이션 — 불황과 인플레이션이 함께 올 때' },
      { n: 11, title: '환율은 어떻게 정해지는가 — 외환 시장의 수요와 공급' },
      { n: 12, title: '환율이 오르면 누가 웃고 누가 우는가' },
      { n: 13, title: '외환위기란 무엇인가 — 1997년 한국 이야기' },
      { n: 14, title: '채권 — 국가·회사에 돈을 빌려준다는 것' },
      { n: 15, title: '금리와 채권 가격은 왜 시소인가' },
      { n: 16, title: '주식 — 회사를 조각내 사고판다는 것' },
      { n: 17, title: '부동산 가격은 왜 움직이는가 — 수요·공급·심리' },
      { n: 18, title: '전세는 왜 한국에만 있는가 — 한국 주거의 특수성' },
      { n: 19, title: '무역 — 왜 모든 걸 직접 만들지 않는가' },
      { n: 20, title: '글로벌 공급망 — 지구 반대편이 멈추면 내 택배가 멈추는 이유' },
      { n: 21, title: '미국 경제가 기침하면 한국이 감기 걸리는 이유' },
      { n: 22, title: '버블이란 무엇인가 — 가격이 현실을 잃을 때' },
      { n: 23, title: '양적완화 — 위기 때 중앙은행이 꺼내는 카드' },
      { n: 24, title: '정부도 경제를 움직인다 — 재정정책의 이해' },
      { n: 25, title: '2권 총정리 — 뉴스 한 꼭지를 시작부터 끝까지 따라가기' }
    ] },
  { num: 3, title: '돈의 구조', question: '회사와 시장을 읽을 수 있나?', count: 25, episodes: [
      { n: 1, title: '회사는 왜 만들어졌나 — 주식회사의 등장' },
      { n: 2, title: '매출과 이익은 같은 말이 아니다' },
      { n: 3, title: '회사를 보는 세 개의 창 — 재무제표 입문' },
      { n: 4, title: '손익계산서를 펼친다 — 위에서 아래로 읽는 법' },
      { n: 5, title: '매출원가와 판매관리비 — 돈은 어디로 빠져나갔나' },
      { n: 6, title: '영업이익과 당기순이익 — 본업과 전체의 차이' },
      { n: 7, title: '매출은 늘었는데 이익이 줄어드는 회사' },
      { n: 8, title: '재무상태표를 펼친다 — 자산 = 부채 + 자본' },
      { n: 9, title: '자산 안을 들여다보기 — 유동자산과 비유동자산' },
      { n: 10, title: '부채와 자본 — 누구 돈으로 회사가 굴러가나' },
      { n: 11, title: '이익은 났는데 현금이 없다? 흑자 도산 이야기' },
      { n: 12, title: '영업·투자·재무 활동 — 현금이 어디서 들어오고 나가나' },
      { n: 13, title: '안정성 지표 — 부채비율과 유동비율' },
      { n: 14, title: '수익성 지표 — 영업이익률과 ROE' },
      { n: 15, title: '활동성 지표 — 회사가 자산을 얼마나 잘 굴리나' },
      { n: 16, title: '성장성 지표 — 매출과 이익은 늘고 있나' },
      { n: 17, title: '지표는 혼자 보면 거짓말한다 — 시계열·동종업종 비교' },
      { n: 18, title: '주가는 무엇으로 정해지나 — 가격과 가치 (1권 4편 심화)' },
      { n: 19, title: 'PER — 이 주가가 비싼지 싼지 묻는 첫 질문' },
      { n: 20, title: 'PBR — 장부가치 대비 주가는 어떤가' },
      { n: 21, title: '배당과 배당수익률 — 회사가 주주에게 돌려주는 몫' },
      { n: 22, title: '좋은 회사와 좋은 주식은 다르다 — 가격이 핵심' },
      { n: 23, title: '산업의 차이가 지표의 의미를 바꾼다' },
      { n: 24, title: '사업보고서를 펼치는 법 — 어디를 먼저 봐야 하나' },
      { n: 25, title: '3권 총정리 — 한 회사를 처음부터 끝까지 읽어보기' }
    ] },
  { num: 4, title: '돈의 결정', question: '내 재정을 스스로 설계할 수 있나?', count: 31, episodes: [
      { n: 1, title: '결정이 어려운 이유 — 머릿속 함정의 정체' },
      { n: 2, title: '손실회피 — 잃지 않으려다 더 잃는 이유' },
      { n: 3, title: '군중심리와 심리적 회계 — 남 따라가다 길 잃기' },
      { n: 4, title: '결정의 메타 도구 — 기준 세우기와 체크리스트' },
      { n: 5, title: '사고 싶은 것과 사야 할 것의 분별' },
      { n: 6, title: '통장 쪼개기 — 한 통장에 다 두지 않는 이유' },
      { n: 7, title: '할인·할부·구독의 진짜 비용 (1권 14편 심화)' },
      { n: 8, title: '왜 저축만으로는 부족한가 — 인플레이션을 이기기 위해' },
      { n: 9, title: '비상금 — 3개월치라는 안전망' },
      { n: 10, title: '예금·적금을 고르는 기준 (1권 21편 심화)' },
      { n: 11, title: '좋은 빚과 나쁜 빚 — 빚의 두 얼굴' },
      { n: 12, title: '고정금리와 변동금리 — 무엇으로 갈까' },
      { n: 13, title: '신용점수를 관리한다는 것 (1권 12편 심화)' },
      { n: 14, title: '보험은 어디까지 들어야 하나 — 위험과 비용 사이' },
      { n: 15, title: '실손의료보험 — 가장 먼저 짚어야 할 보험' },
      { n: 16, title: '보험 가입 전 점검 5가지' },
      { n: 17, title: '연말정산 — 받는 돈이 아니라 돌려받는 내 돈' },
      { n: 18, title: '프리랜서·1인 사업자의 세금 — 매년 2월과 5월의 정산' },
      { n: 19, title: 'ISA·연금저축·IRP — 세금을 아끼는 그릇들' },
      { n: 20, title: '세금을 합법적으로 줄이는 큰 그림' },
      { n: 21, title: '저축에서 투자로 넘어가는 다리' },
      { n: 22, title: '분산투자 — 달걀을 한 바구니에 담지 않는다는 것의 진짜 의미' },
      { n: 23, title: '실질수익률과 복리의 시간 — 투자의 두 엔진' },
      { n: 24, title: '인덱스 펀드와 ETF — 시장 전체를 사는 도구' },
      { n: 25, title: '채권을 자산에 넣는다는 것 (2권 14편·3권 13편 연결)' },
      { n: 26, title: '달러 자산 — 위기 때 무게중심' },
      { n: 27, title: '내 기준으로 종목을 거르는 법 (3권 지표 적용)' },
      { n: 28, title: '노후 자금 3층 — 국민연금·퇴직연금·개인연금' },
      { n: 29, title: '은퇴 후 현금흐름 설계 — 4% 룰의 직관' },
      { n: 30, title: '길어진 노후, 짧아진 일 — 시간의 재배치' },
      { n: 31, title: '4권 총정리 — 한 사람의 재정 설계도 그려보기' }
    ] },
  { num: 5, title: '돈의 인생', question: '경제로 삶의 방향을 잡을 수 있나?', count: 25, episodes: [
      { n: 1, title: '시장은 나보다 똑똑하다 — 인덱스가 액티브를 이긴다는 것' },
      { n: 2, title: '운과 실력을 구분한다는 것 — 성공한 뒤 더 조심해야 하는 이유' },
      { n: 3, title: '예측은 왜 자주 빗나가는가 — 전문가 예측의 한계' },
      { n: 4, title: '모른다는 말의 무게 — 솔직한 무지가 자산이 되는 이유' },
      { n: 5, title: '복리는 시간으로 만드는 자산 (1권 11편 심화)' },
      { n: 6, title: '일찍 시작한 사람과 많이 넣은 사람 — 누가 이기는가' },
      { n: 7, title: '인내가 자산이 되는 메커니즘' },
      { n: 8, title: '시간이 줄여주는 것 — 변동성과 불확실성의 차이' },
      { n: 9, title: '비교라는 함정 — SNS 시대의 소비' },
      { n: 10, title: '충분함의 선을 긋는다는 것 — 내 기준의 무게' },
      { n: 11, title: '소비와 자존감 — 물건이 나를 증명할 수 없는 이유' },
      { n: 12, title: '인구가 줄어든다는 것 — 한국 경제의 큰 변수' },
      { n: 13, title: '고령화 사회와 노후 — 길어진 노후의 의미' },
      { n: 14, title: 'AI와 일의 미래 — 노동 가치의 재정의' },
      { n: 15, title: '기후와 경제 — 새로운 게임 규칙' },
      { n: 16, title: '자본주의는 무엇인가 — 우리가 사는 시스템의 본질' },
      { n: 17, title: '빈부격차는 왜 생기는가 — 구조와 개인의 책임 사이' },
      { n: 18, title: '복지국가 — 세금으로 안전망을 만드는 사회' },
      { n: 19, title: '자본주의의 그림자와 빛 — 균형 잡힌 시선' },
      { n: 20, title: '뉴스를 다루는 법 — 흔들리지 않는 시민의 거리' },
      { n: 21, title: '가족과 돈 — 투명함이 만드는 신뢰' },
      { n: 22, title: '위기가 왔을 때 — 지난 50년의 기록이 가르치는 것' },
      { n: 23, title: '시스템으로 사는 법 — 의지에 기대지 않는 자동화' },
      { n: 24, title: '책 읽기는 끝나도 공부는 끝나지 않는다 — 평생 학습자' },
      { n: 25, title: '5권 총정리 — 자립인이 된다는 것' }
    ] }
];

export default function StampMapPage() {
  const completedSet = new Set(['1-1', '1-2', '1-3', '1-4']);
  const totalDone = volumesData.reduce((sum, vol) => {
    return sum + vol.episodes.filter(ep => completedSet.has(`${vol.num}-${ep.n}`)).length;
  }, 0);

  return (
    <div className="min-h-screen text-text-main flex flex-col font-sans relative" style={{
      background: 'var(--bg-light)',
      backgroundImage: `
        radial-gradient(circle at 10% 5%, rgba(26, 142, 156, 0.04) 0%, transparent 40%),
        radial-gradient(circle at 90% 95%, rgba(241, 233, 219, 0.3) 0%, transparent 50%)
      `
    }}>
      <a href="#main" className="absolute -top-10 left-0 bg-accent-deep text-white px-4 py-2 text-sm z-[200] focus:top-0 outline-none">
        본문으로 건너뛰기
      </a>

      {/* Nav matching mockup */}
      <nav className="sticky top-0 z-[100] px-5 py-4 md:px-10 flex justify-between items-center bg-[#F8FCFC]/85 backdrop-blur-md saturate-150 border-b border-line-soft">
        <Link href="/" className="font-serif font-semibold text-base text-text-main tracking-tight">
          고요의 경제나루
        </Link>
        <div className="flex gap-4 md:gap-6 items-center">
          <Link href="/" className="text-[13px] md:text-sm text-text-soft font-medium hover:text-accent-deep transition-colors">HOME</Link>
          <Link href="/dictionary" className="text-[13px] md:text-sm text-text-soft font-medium hover:text-accent-deep transition-colors">INDEX</Link>
          <Link href="/stamp-map" className="text-[13px] md:text-sm text-accent-deep font-semibold transition-colors">STAMP MAP</Link>
          <Link href="/login" className="text-[13px] md:text-sm text-text-soft font-medium hover:text-accent-deep transition-colors">로그인</Link>
        </div>
      </nav>

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-6 py-16 md:px-10 md:py-20" id="main">
        <header className="text-center mb-16 md:mb-20">
          <div className="font-mono text-[11px] tracking-[0.3em] text-accent-deep font-semibold uppercase mb-4">STAMP MAP</div>
          <h1 className="font-serif font-semibold text-3xl md:text-[min(4.5vw,44px)] text-text-main tracking-tight leading-tight mb-3.5">
            여기, 당신이 걸어온 길
          </h1>
          <p className="font-sans text-[15px] md:text-base text-text-soft leading-relaxed max-w-[520px] mx-auto">
            학습한 편마다 작은 진주가 켜집니다.<br/>점수도, 등수도, 자극도 없이.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3.5 bg-water-card border border-line-light rounded-full mt-6" role="status">
            <span className="font-serif font-bold text-lg text-accent-deep">{totalDone}</span>
            <span className="font-sans text-sm text-text-soft">/ 133편 학습 완료</span>
          </div>
        </header>

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-5 px-6 py-4 bg-white border border-line-light rounded-2xl" aria-label="진주 상태 범례">
            <div className="flex items-center gap-2 font-sans text-[13px] text-text-soft">
              <span className="w-4 h-4 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0)_25%),radial-gradient(circle_at_55%_55%,rgba(184,218,235,0.4)_30%,rgba(184,218,235,0.12)_70%),radial-gradient(circle_at_38%_30%,#FFFFFF_0%,#FBF7F0_50%,#ECDFCC_95%)] shrink-0"></span>
              <span>학습 완료</span>
            </div>
            <div className="flex items-center gap-2 font-sans text-[13px] text-text-soft">
              <span className="w-4 h-4 rounded-full border-[1.5px] border-dashed border-[#B8D2E5]/65 shrink-0"></span>
              <span>아직 보지 않음</span>
            </div>
          </div>
        </div>

        <div>
          {volumesData.map((vol) => {
            const volDone = vol.episodes.filter(ep => completedSet.has(`${vol.num}-${ep.n}`)).length;

            return (
              <section key={vol.num} className="mb-16" aria-labelledby={`vol-${vol.num}-label`}>
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-5 pb-4 mb-7 border-b border-line-light">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`w-[18px] h-[18px] rounded-full volume-color-marker vol-${vol.num} shadow-sm`} aria-hidden="true"></span>
                    <span id={`vol-${vol.num}-label`} className="font-serif font-bold text-[22px] text-accent-deep tracking-tight">{vol.num}권</span>
                    <span className="font-serif font-medium text-[20px] text-text-main tracking-tight">{vol.title}</span>
                    <span className="font-sans text-[13.5px] text-text-mute ml-1.5 italic hidden sm:inline">{vol.question}</span>
                  </div>
                  <div className="font-mono text-[12px] text-text-soft tracking-wider whitespace-nowrap mt-2 md:mt-0">
                    <strong className="text-accent-deep font-sans font-bold">{volDone}</strong> / {vol.count}편 완료
                  </div>
                </div>

                {/* Specific custom pearl CSS in globals.css maps pearl-vol-1 etc */}
                <div className="flex flex-wrap gap-y-4 gap-x-[14px] px-1 md:px-0" id={`pearls-${vol.num}`}>
                  {vol.episodes.map((ep) => {
                    const id = `${vol.num}-${ep.n}`;
                    const isDone = completedSet.has(id);
                    return (
                      <Link 
                        key={id} 
                        href={`/lesson/${id}`} 
                        className={`pearl pearl-vol-${vol.num} ${isDone ? 'pearl-done' : 'pearl-todo'} group`}
                        aria-label={`${vol.num}권 ${ep.n}편 ${isDone ? '학습 완료' : '아직 보지 않음'} — ${ep.title}`}
                      >
                          <span className="pearl-circle"></span>
                          <span className="pearl-tip" role="tooltip">
                            <span className="pearl-tip-meta">{vol.num}권 {ep.n}편</span>
                            <span className="pearl-tip-title">{ep.title}</span>
                            <span className={`pearl-tip-status ${isDone ? 'done' : ''}`}>{isDone ? '학습 완료' : '아직 보지 않음'}</span>
                          </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="bg-water-light text-center px-10 py-12 mt-20">
        <div className="font-sans text-[12.5px] text-text-soft leading-loose">결제 정보를 받지 않습니다 · 광고 없음</div>
        <div className="font-sans text-[12.5px] text-text-soft leading-loose">CC BY-NC-SA 4.0 라이선스로 배포됩니다</div>
        <div className="font-sans text-[12.5px] text-text-soft leading-loose">제작 · ELLA PARK</div>
      </footer>
    </div>
  );
}
