'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

interface Term {
  word: string;
  def: string;
  vol: number;
  ep: number;
  epTitle: string;
}

// Full Dictionary data extracted from dictionary_v1.html
const allTerms: Term[] = [
  { word: '가격', def: '누군가의 의지가 아니라 사고파는 만남의 결과로 정해지는 값.', vol: 1, ep: 4, epTitle: '가격은 누가 정할까 — 가격의 정체' },
  { word: '가치', def: '가격과 다를 수 있는, 물건이나 행위가 가진 의미.', vol: 1, ep: 4, epTitle: '가격은 누가 정할까 — 가격의 정체' },
  { word: '간접세', def: '소비자가 부담하지만 사업자가 대신 납부하는 세금. 부가가치세가 대표적.', vol: 1, ep: 13, epTitle: '영수증 맨 아래의 작은 숫자 — 부가가치세' },
  { word: '거래', def: '사고파는 행위. 시장이 성립하는 가장 기본 단위.', vol: 1, ep: 6, epTitle: '사고팔 수 있는 곳이라면 어디든 — 시장의 정체' },
  { word: '건강보험', def: '의료비를 함께 부담하는 4대보험 중 하나.', vol: 1, ep: 17, epTitle: '월급에서 미리 빠지는 안전망 — 4대보험' },
  { word: '경기', def: '경제 전반의 활동이 활발한 정도. 호황과 불황으로 순환함.', vol: 1, ep: 24, epTitle: '경제에도 계절이 있다 — 경기와 호황·불황' },
  { word: '경제 규모', def: '한 나라가 1년 동안 만들어낸 가치의 총합. 흔히 GDP로 측정.', vol: 1, ep: 22, epTitle: '한 나라의 1년 성적표 — GDP' },
  { word: '고용보험', def: '실직이나 휴직 시 생활을 돕는 4대보험 중 하나.', vol: 1, ep: 17, epTitle: '월급에서 미리 빠지는 안전망 — 4대보험' },
  { word: '공급', def: '팔려는 힘. 수요와 만나 가격을 정함.', vol: 1, ep: 5, epTitle: '가격을 움직이는 두 힘 — 수요와 공급' },
  { word: '공제', def: '월급에서 미리 빠지는 항목. 세금과 4대보험으로 구성.', vol: 1, ep: 15, epTitle: '받기로 한 돈과 통장에 들어온 돈 — 세전과 세후' },
  { word: '과세표준', def: '세금을 매기는 기준이 되는 금액.', vol: 1, ep: 16, epTitle: '많이 벌수록 더 떼어가는 이유 — 소득세 구조' },
  { word: '국민연금', def: '노후를 대비해 가입하는 4대보험 중 하나.', vol: 1, ep: 17, epTitle: '월급에서 미리 빠지는 안전망 — 4대보험' },
  { word: '금리', def: '돈을 빌리는 값. 시간과 위험에 대한 대가.', vol: 1, ep: 10, epTitle: '빌린 돈에 붙는 값 — 금리와 이자' },
  { word: '기회비용', def: '어떤 선택을 했을 때 포기한 대안 중 가장 좋았던 것의 가치.', vol: 1, ep: 2, epTitle: '고르지 못한 쪽의 가치 — 기회비용' },
  { word: '누진세', def: '소득이 늘수록 단계별로 다른(높은) 세율을 적용하는 세금 구조.', vol: 1, ep: 16, epTitle: '많이 벌수록 더 떼어가는 이유 — 소득세 구조' },
  { word: '단리', def: '원금에만 이자가 붙는 방식. 복리와 반대.', vol: 1, ep: 11, epTitle: '이자에 이자가 붙는다는 것 — 복리' },
  { word: '대출', def: '미래의 돈을 현재로 당겨오는 거래.', vol: 1, ep: 12, epTitle: '보이지 않는 이력서 — 신용과 대출' },
  { word: '돈', def: '종이나 금속 자체의 가치가 아니라 사회적 약속으로 가치를 갖는 매개.', vol: 1, ep: 7, epTitle: '종이 한 장이 가치를 갖는 이유 — 돈이란 무엇인가' },
  { word: '돈의 기능', def: '교환·가치 저장·가치 척도 — 돈이 사회에서 하는 세 가지 일.', vol: 1, ep: 7, epTitle: '종이 한 장이 가치를 갖는 이유 — 돈이란 무엇인가' },
  { word: '디플레이션', def: '물가가 내리면서 경제 전반이 얼어붙는 신호. 인플레보다 다루기 어려움.', vol: 1, ep: 9, epTitle: '안 사는 게 더 무서운 이유 — 디플레이션' },
  { word: '마진', def: '원가 위에 붙는 이윤. 가격을 구성하는 한 축.', vol: 1, ep: 14, epTitle: '가격표 안에 무엇이 들어 있나 — 원가·마진과 할인의 정체' },
  { word: '매몰비용', def: '이미 지출해 회수할 수 없는 비용. 의사결정에서 빼야 함.', vol: 1, ep: 3, epTitle: '이미 쓴 돈은 잊어야 한다 — 매몰비용과 인센티브' },
  { word: '명세서 구조', def: '월급명세서를 이루는 지급·공제·실수령액의 구성.', vol: 1, ep: 19, epTitle: '월급에서 출발해 어디로 흘러가나 — 명세서 한 장 통합 읽기' },
  { word: '물가', def: '물건과 서비스 가격의 전반적인 평균 수준.', vol: 1, ep: 8, epTitle: '돈의 가치가 녹는다는 것 — 인플레이션' },
  { word: '보험', def: '위험을 함께 나누는 금융 도구. 미리 조금씩 모아 큰 위험에 대비.', vol: 1, ep: 21, epTitle: '모으고, 지키고, 나누는 도구들 — 예금·적금·보험·연금' },
  { word: '복리', def: '이자에 다시 이자가 붙는 구조. 시간이 길어질수록 단리와 격차가 큼.', vol: 1, ep: 11, epTitle: '이자에 이자가 붙는다는 것 — 복리' },
  { word: '부가가치세', def: '거의 모든 물건값에 포함된 10%의 간접세. VAT라고도 함.', vol: 1, ep: 13, epTitle: '영수증 맨 아래의 작은 숫자 — 부가가치세' },
  { word: '부채', def: '갚아야 할 것. 자산의 반대편에 있는 개념.', vol: 1, ep: 20, epTitle: '가진 것과 갚을 것 — 자산과 부채' },
  { word: '불황', def: '경기가 침체된 시기. 거래와 생산이 줄어드는 구간.', vol: 1, ep: 24, epTitle: '경제에도 계절이 있다 — 경기와 호황·불황' },
  { word: '산재보험', def: '일하다 다쳤을 때 보장하는 4대보험. 사용자(회사)가 전액 부담.', vol: 1, ep: 17, epTitle: '월급에서 미리 빠지는 안전망 — 4대보험' },
  { word: '선택', def: '자원이 한정되어 있을 때 무엇을 가질지·포기할지 정하는 일.', vol: 1, ep: 1, epTitle: '다 가질 수 없다는 것 — 희소성과 선택' },
  { word: '세전', def: '세금이 떼이기 전의 금액. 명세서의 지급 총액.', vol: 1, ep: 15, epTitle: '받기로 한 돈과 통장에 들어온 돈 — 세전과 세후' },
  { word: '세후', def: '세금이 떼인 후의 금액. 실제 통장에 들어오는 액수에 가까움.', vol: 1, ep: 15, epTitle: '받기로 한 돈과 통장에 들어온 돈 — 세전과 세후' },
  { word: '소득세', def: '소득에 대해 매겨지는 세금. 한국은 누진세 구조.', vol: 1, ep: 16, epTitle: '많이 벌수록 더 떼어가는 이유 — 소득세 구조' },
  { word: '수요', def: '사려는 힘. 공급과 만나 가격을 정함.', vol: 1, ep: 5, epTitle: '가격을 움직이는 두 힘 — 수요와 공급' },
  { word: '순자산', def: '자산에서 부채를 뺀 진짜 내 것.', vol: 1, ep: 20, epTitle: '가진 것과 갚을 것 — 자산과 부채' },
  { word: '시급', def: '시간당 노동의 가격. 한 시간 일하면 받는 돈.', vol: 1, ep: 18, epTitle: '노동에도 가격이 있다 — 최저임금' },
  { word: '시장', def: '사고팔 수 있는 만남의 자리. 물리적 장소가 아니라 거래의 자리.', vol: 1, ep: 6, epTitle: '사고팔 수 있는 곳이라면 어디든 — 시장의 정체' },
  { word: '신용', def: '돈을 빌려줘도 되는지에 대한 사회적 평가.', vol: 1, ep: 12, epTitle: '보이지 않는 이력서 — 신용과 대출' },
  { word: '신용점수', def: '신용을 수치로 나타낸 것. 대출 조건에 큰 영향.', vol: 1, ep: 12, epTitle: '보이지 않는 이력서 — 신용과 대출' },
  { word: '실수령액', def: '공제 후 통장에 실제 들어오는 금액.', vol: 1, ep: 15, epTitle: '받기로 한 돈과 통장에 들어온 돈 — 세전과 세후' },
  { word: '연금', def: '노후를 위해 미리 모아두는 돈. 국민연금·퇴직연금·개인연금 등.', vol: 1, ep: 21, epTitle: '모으고, 지키고, 나누는 도구들 — 예금·적금·보험·연금' },
  { word: '예금', def: '돈을 맡기는 가장 기본적인 금융 도구. 자유롭게 입출금 가능.', vol: 1, ep: 21, epTitle: '모으고, 지키고, 나누는 도구들 — 예금·적금·보험·연금' },
  { word: '원가', def: '물건을 만드는 데 든 비용. 가격에서 마진을 뺀 부분.', vol: 1, ep: 14, epTitle: '가격표 안에 무엇이 들어 있나 — 원가·마진과 할인의 정체' },
  { word: '이자', def: '돈을 빌렸을 때 붙는 값. 시간과 위험에 대한 대가.', vol: 1, ep: 10, epTitle: '빌린 돈에 붙는 값 — 금리와 이자' },
  { word: '인센티브', def: '사람의 행동을 움직이는 동기 구조. 보상이나 처벌도 포함.', vol: 1, ep: 3, epTitle: '이미 쓴 돈은 잊어야 한다 — 매몰비용과 인센티브' },
  { word: '인플레이션', def: '물가가 오르며 같은 돈으로 살 수 있는 것이 줄어드는 현상.', vol: 1, ep: 8, epTitle: '돈의 가치가 녹는다는 것 — 인플레이션' },
  { word: '자산', def: '내가 가진 가치 있는 것. 부채의 반대편.', vol: 1, ep: 20, epTitle: '가진 것과 갚을 것 — 자산과 부채' },
  { word: '적금', def: '매달 일정 금액을 모아두는 도구. 예금과 달리 약속한 기간 동안 모음.', vol: 1, ep: 21, epTitle: '모으고, 지키고, 나누는 도구들 — 예금·적금·보험·연금' },
  { word: '지급', def: '월급명세서에서 받기로 한 총 금액. 공제 전 금액.', vol: 1, ep: 19, epTitle: '월급에서 출발해 어디로 흘러가나 — 명세서 한 장 통합 읽기' },
  { word: '최저임금', def: '시장 가격에 하한선을 두는 노동 가격 제도.', vol: 1, ep: 18, epTitle: '노동에도 가격이 있다 — 최저임금' },
  { word: '한계', def: '추가 한 단위가 가져오는 효과. 평균과는 다른 시각.', vol: 1, ep: 25, epTitle: '평균 너머의 한 단위를 보다 — 평균과 한계' },
  { word: '한계효용', def: '한 단위 더 소비할 때 얻는 만족.', vol: 1, ep: 25, epTitle: '평균 너머의 한 단위를 보다 — 평균과 한계' },
  { word: '할부', def: '가격을 나눠서 내는 방식. 무이자라 해도 다른 비용이 있을 수 있음.', vol: 1, ep: 14, epTitle: '가격표 안에 무엇이 들어 있나 — 원가·마진과 할인의 정체' },
  { word: '할인율', def: '가격에서 깎아주는 비율.', vol: 1, ep: 14, epTitle: '가격표 안에 무엇이 들어 있나 — 원가·마진과 할인의 정체' },
  { word: '호황', def: '경기가 활기찬 시기. 거래와 생산이 활발한 구간.', vol: 1, ep: 24, epTitle: '경제에도 계절이 있다 — 경기와 호황·불황' },
  { word: '화폐', def: '돈의 다른 표현. 교환·저장·척도의 기능을 가진 매개.', vol: 1, ep: 7, epTitle: '종이 한 장이 가치를 갖는 이유 — 돈이란 무엇인가' },
  { word: '환율', def: '다른 나라 돈을 사는 가격. 환율이 오르면 외국 돈이 비싸짐.', vol: 1, ep: 23, epTitle: '돈의 외국 가격 — 환율' },
  { word: '희소성', def: '원하는 만큼 충분히 있지 않다는 것. 경제학의 출발점.', vol: 1, ep: 1, epTitle: '다 가질 수 없다는 것 — 희소성과 선택' }
];

const CHOSUNG = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

function getChosung(word: string) {
  const code = word.charCodeAt(0) - 44032;
  if (code > -1 && code < 11172) return CHOSUNG[Math.floor(code / 588)];
  // Check if it's an English letter or number
  if (/^[A-Za-z0-9]/.test(word)) return 'A-Z';
  return word.charAt(0).toUpperCase();
}

export default function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return allTerms;
    const q = searchQuery.toLowerCase();
    return allTerms.filter(t => t.word.toLowerCase().includes(q) || t.def.toLowerCase().includes(q));
  }, [searchQuery]);

  const groupedTerms = useMemo(() => {
    const sorted = [...filteredTerms].sort((a, b) => a.word.localeCompare(b.word));
    const groups: Record<string, Term[]> = {};
    sorted.forEach((term) => {
      let initial = getChosung(term.word);
      if (!CHOSUNG.includes(initial)) initial = '기타';
      if (!groups[initial]) groups[initial] = [];
      groups[initial].push(term);
    });
    return groups;
  }, [filteredTerms]);

  // To display all existing chosungs even if empty, or just the ones in data
  const chosungList = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ", "기타"];

  const handleChosungClick = (e: React.MouseEvent<HTMLAnchorElement>, letter: string) => {
    e.preventDefault();
    const el = document.getElementById(`group-${letter}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 180;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen text-text-main flex flex-col font-sans relative" style={{ background: 'var(--bg-light)' }}>
      <main className="flex-1 max-w-[820px] w-full mx-auto px-6 py-12 md:px-10 md:py-16" id="main">
        <header className="mb-10">
          <div className="font-mono text-[11px] tracking-[0.3em] text-accent-deep font-semibold uppercase mb-4">INDEX</div>
          <h1 className="font-serif font-semibold text-3xl md:text-[min(4.5vw,42px)] text-text-main tracking-tight leading-tight mb-3">
            핵심 용어 사전
          </h1>
          <p className="font-sans text-[15px] text-text-soft leading-relaxed max-w-[520px]">
            학습 중에 만난 단어를 찾아보세요. 단어를 누르면 처음 등장한 영상으로 바로 이동합니다.
          </p>
          <div className="inline-flex items-center gap-2.5 px-[18px] py-2.5 bg-water-card border border-line-light rounded-full mt-4.5">
            <span className="font-serif font-bold text-base text-accent-deep">{allTerms.length}</span>
            <span className="font-sans text-[13px] text-text-soft">개의 용어 · 5권 133편 전체 기준</span>
          </div>
        </header>

        {/* Search & Jamo Index (sticky) */}
        <div className="sticky top-[60px] z-50 bg-[#F8FCFC]/95 backdrop-blur-md px-2 -mx-2 pt-4 pb-4 mb-7 border-b border-line-soft">
          <div className="relative mb-3.5">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-mute pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              className="w-full py-3.5 pl-11 pr-4 bg-white border-[1.5px] border-line-light rounded-xl font-sans text-[15px] text-text-main focus:outline-none focus:border-accent-main focus:ring-[3px] focus:ring-accent-main/15 transition-all placeholder:text-text-mute"
              placeholder="용어 또는 정의 안의 단어를 검색해 보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="용어 검색"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {chosungList.map(letter => {
              const isActive = groupedTerms[letter] && groupedTerms[letter].length > 0;
              return (
                <a
                  key={letter}
                  href={`#group-${letter}`}
                  onClick={(e) => isActive && handleChosungClick(e, letter)}
                  className={`inline-flex items-center justify-center min-w-[32px] h-[32px] px-2 rounded-lg font-sans text-[13.5px] font-semibold border transition-all
                    ${isActive ? 'border-line-light bg-transparent text-text-main hover:bg-water-card hover:border-accent-soft hover:text-accent-deep' : 'border-line-soft text-line-light pointer-events-none'}`}
                >
                  {letter}
                </a>
              );
            })}
          </div>
        </div>

        {filteredTerms.length === 0 ? (
          <div className="text-center py-[60px] px-6 text-text-mute">
            <div className="font-serif font-medium text-lg text-text-soft mb-1.5">찾으시는 용어가 없습니다</div>
            <div className="font-sans text-sm">다른 단어로 검색해 보세요.</div>
          </div>
        ) : (
          <div>
            {chosungList.map(letter => {
              const terms = groupedTerms[letter];
              if (!terms || terms.length === 0) return null;
              
              return (
                <div key={letter} id={`group-${letter}`} className="mb-10 scroll-mt-[200px]">
                  <h2 className="inline-block font-serif font-bold text-[28px] text-accent-deep mb-4 pb-2 border-b-2 border-accent-soft min-w-[50px] text-center">
                    {letter}
                  </h2>
                  <div className="flex flex-col gap-1">
                    {terms.map(term => (
                      <div key={term.word} className="p-4 md:p-[20px_22px] rounded-xl hover:bg-water-card transition-colors">
                        <h3 className="font-serif font-semibold text-[18px] md:text-[20px] text-text-main mb-2 tracking-tight">
                          {term.word}
                        </h3>
                        <p className="font-sans text-[14px] md:text-[15px] text-text-soft leading-[1.75] mb-3">
                          {term.def}
                        </p>
                        <Link href={`/lesson/${term.vol}-${term.ep}`} className="inline-flex items-center gap-2 px-[12px] py-[8px] bg-white border border-line-light rounded-full text-text-soft hover:border-accent-main hover:bg-water-light hover:text-accent-deep hover:translate-x-0.5 transition-all w-fit">
                          <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                          <span className="font-mono font-semibold text-[12.5px] tracking-[0.05em] text-accent-deep uppercase">
                            {term.vol}권 {term.ep}편
                          </span>
                          <span className="font-sans text-[12.5px] max-w-[200px] md:max-w-[360px] truncate group-hover:text-text-main">
                            {term.epTitle}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-water-light text-center px-10 py-12 mt-20">
        <div className="font-sans text-[12.5px] text-text-soft leading-loose">결제 정보를 받지 않습니다 · 광고 없음</div>
        <div className="font-sans text-[12.5px] text-text-soft leading-loose">CC BY-NC-SA 4.0 라이선스로 배포됩니다</div>
        <div className="font-sans text-[12.5px] text-text-soft leading-loose">제작 · ELLA PARK</div>
      </footer>
    </div>
  );
}
