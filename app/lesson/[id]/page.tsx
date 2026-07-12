// FR-LES-003 / W11-T6 — 레슨 시청 페이지(Server Component).
// 라우트 파라미터를 정규 lessonId 로 정규화(접근 ②, resolveLessonId) → 미존재는 notFound.
// getLesson seam 으로 youtube_video_id 확보, getResumePosition 으로 재개 위치를 서버에서 조회해
// initialPositionSec 을 client player 에 주입(SSR 첫 페인트 반영, fetch 왕복 0).
// 진척 저장/재개만 이 슬라이스의 대상 — OX·완료모달·헤더/브레드크럼은 프로토타입 유지(스코프 밖).
import { notFound } from "next/navigation";
import Link from "next/link";
import { resolveLessonId } from "@/lib/data/curriculum";
import { getLesson } from "@/lib/data/lesson";
import { getResumePosition } from "@/lib/services/progress";
import { getCurrentUser } from "@/lib/auth/session";
import LessonPlayerClient from "./components/LessonPlayerClient";
import LessonOxQuiz from "./components/LessonOxQuiz";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lessonId = resolveLessonId(id);
  if (!lessonId) notFound();

  const lesson = await getLesson(lessonId);
  if (!lesson) notFound();

  // 재개 위치(서버 조회) + 세션 여부. getCurrentUser 는 React.cache 로 getResumePosition 과 dedupe.
  const [initialPositionSec, user] = await Promise.all([
    getResumePosition(lessonId),
    getCurrentUser(),
  ]);
  const sessionActive = user !== null;

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
                &apos;경제는 선택의 학문&apos;이라는 정의를 자기 말로 풀 수 있다
              </li>
            </ol>
          </div>
        </header>

        {/* Media Area (client island) — 영상/글 토글 + YT 플레이어 + 재개 + 10초 저장 */}
        <LessonPlayerClient
          lessonId={lessonId}
          youtubeVideoId={lesson.youtube_video_id}
          initialPositionSec={initialPositionSec}
          sessionActive={sessionActive}
        />

        {/* OX 퀴즈 + 완료 모달 (client island) — 프로토타입 유지, 이 슬라이스 스코프 밖 */}
        <LessonOxQuiz />

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
    </div>
  );
}
