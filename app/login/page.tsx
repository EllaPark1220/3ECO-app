'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signInWithKakao, signUp, signIn } from '@/app/auth/actions';

function callbackErrorMessage(code: string): string {
  switch (code) {
    case 'oauth_canceled': return '카카오 로그인이 취소되었습니다. 다시 시도해 주세요.';
    case 'sync_failed': return '로그인 처리 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.';
    case 'confirm_failed': return '인증 링크가 만료되었거나 이미 사용되었습니다.';
    case 'missing_code': return '로그인 정보를 확인하지 못했어요. 다시 시도해 주세요.';
    default: return '로그인 중 문제가 발생했어요.';
  }
}

// 이메일 가입/로그인 서버 액션(signUp/signIn)의 ErrorResponse.error_code → 사용자 문구.
// 열거 방지 원칙(actions.ts) 정합: 미가입/오답을 구분 노출하지 않음(INVALID_CREDENTIALS 단일).
function formErrorMessage(code: string): string {
  switch (code) {
    case 'INVALID_EMAIL': return '이메일 형식을 확인해 주세요.';
    case 'INVALID_INPUT': return '입력한 정보를 확인해 주세요.';
    case 'INVALID_CREDENTIALS': return '이메일 또는 비밀번호가 올바르지 않습니다.';
    case 'EMAIL_NOT_CONFIRMED': return '이메일 인증이 아직 완료되지 않았어요. 받은 메일의 링크를 눌러 주세요.';
    default: return '처리 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.';
  }
}

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signupSentTo, setSignupSentTo] = useState<string | null>(null);

  // 콜백(/login?error=...)에서 돌아온 경우만 마운트 후 1회 URL 을 읽어 배너 노출.
  // window 는 클라이언트 전용이라 렌더 중 읽으면 SSR/하이드레이션이 깨진다 → 서버는 항상
  // null 을 렌더하고, 마운트 후 effect 에서 URL 을 state 로 동기화하는 것이 유일하게 안전한 위치.
  useEffect(() => {
    const err = new URLSearchParams(window.location.search).get('error');
    if (err) {
      // 규칙(set-state-in-effect)은 렌더-구동 setState 의 연쇄 리렌더를 경고하나, 여기는 deps=[]
      // 로 마운트 시 딱 1회만 실행되는 외부 시스템(URL)→state 동기화라 연쇄가 없다. 렌더 중
      // window 접근은 하이드레이션 불일치를 유발하므로 effect 가 정당한 유일 위치 → 국소 예외.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOauthError(callbackErrorMessage(err));
    }
  }, []);

  const handleKakao = async () => {
    setOauthError(null);
    // next 는 클릭 시점에 URL 에서 직접 읽음(상태 불필요). 서버 액션이 safeInternalPath 로 재검증.
    const next =
      new URLSearchParams(window.location.search).get('next') ?? undefined;
    // 성공 시 서버가 카카오로 redirect → 아래 도달 안 함. 실패(ErrorResponse)만 반환.
    const res = await signInWithKakao(next);
    if (res?.error_code) {
      setOauthError('카카오 로그인을 시작할 수 없어요. 잠시 후 다시 시도해 주세요.');
    }
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsMatch = password === passwordConfirm && passwordConfirm.length > 0;
  const passwordLongEnough = password.length >= 8;

  let isFormValid = false;
  if (mode === 'login') {
    isFormValid = isEmailValid && password.length >= 1;
  } else {
    isFormValid = 
      isEmailValid &&
      nickname.trim().length >= 1 &&
      passwordLongEnough &&
      passwordsMatch &&
      agreeTerms &&
      agreePrivacy;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;
    setFormError(null);
    setSubmitting(true);
    try {
      // strict 스키마 정합: 정의된 필드만 담는다(agree/passwordConfirm 제외 → PII 구조적 거부 회피).
      const fd = new FormData();
      fd.set('email', email);
      fd.set('password', password);
      if (mode === 'signup') {
        fd.set('nickname', nickname);
        const res = await signUp(fd);
        if (res && 'error_code' in res) {
          setFormError(formErrorMessage(res.error_code));
          return;
        }
        // 자동 로그인 아님 — 이메일 확인 안내 화면으로 전환(폼 언마운트).
        setSignupSentTo(email);
      } else {
        // 로그인 후 복귀 경로: ?next= 를 서버 액션에 그대로 넘겨 safeInternalPath 재검증.
        const next = new URLSearchParams(window.location.search).get('next');
        if (next) fd.set('to', next);
        const res = await signIn(fd);
        if (res && 'error_code' in res) {
          setFormError(formErrorMessage(res.error_code));
          return;
        }
        // 세션 쿠키가 확실히 실리도록 전체 내비게이션으로 이동.
        window.location.assign(res.redirect_to);
      }
    } catch {
      setFormError('처리 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const copy = {
    login: {
      title: '다시 오신 것을 환영합니다',
      sub: '학습 흔적을 이어 가시려면 로그인해 주세요.'
    },
    signup: {
      title: '천천히 시작해 봅시다',
      sub: '이메일과 닉네임만으로 계정을 만들 수 있습니다.'
    }
  };

  return (
    <div className="min-h-screen bg-bg-light text-text-main flex flex-col font-sans relative" style={{
      backgroundImage: `
        radial-gradient(circle at 15% 10%, rgba(26, 142, 156, 0.04) 0%, transparent 50%),
        radial-gradient(circle at 85% 90%, rgba(134, 208, 214, 0.05) 0%, transparent 50%)
      `
    }}>
      <a href="#main" className="absolute -top-10 left-0 bg-accent-deep text-white px-4 py-2 text-sm z-[200] focus:top-0 outline-none">
        본문으로 건너뛰기
      </a>

      <nav className="p-[22px_40px] flex justify-center items-center md:justify-between">
        <Link href="/" className="font-serif font-semibold text-[17px] text-text-main tracking-[-0.01em]">
          고요의 경제나루
        </Link>
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-sm text-text-soft font-medium hover:text-accent-deep transition-colors">HOME</Link>
          <Link href="/dictionary" className="text-sm text-text-soft font-medium hover:text-accent-deep transition-colors">INDEX</Link>
          <Link href="/stamp-map" className="text-sm text-text-soft font-medium hover:text-accent-deep transition-colors">STAMP MAP</Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-[30px_20px_60px] md:p-[40px_20px_80px]" id="main">
        <div className="w-full max-w-[440px] bg-white rounded-[22px] p-[44px_40px_36px] border border-line-light shadow-[0_12px_40px_-20px_rgba(13,95,109,0.18)]">
          {signupSentTo ? (
            <div className="text-center py-2">
              <div className="mb-6">
                <h1 className="font-serif font-semibold text-[26px] text-text-main tracking-[-0.01em] mb-3">
                  확인 메일을 보냈어요
                </h1>
                <p className="font-sans text-[14px] text-text-soft leading-[1.8]">
                  <span className="text-text-main font-semibold break-all">{signupSentTo}</span>로 인증 메일을 보냈습니다.
                  메일의 링크를 눌러 가입을 완료해 주세요. 메일이 안 보이면 스팸함도 확인해 주세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSignupSentTo(null);
                  setFormError(null);
                  setMode('login');
                  setPassword('');
                  setPasswordConfirm('');
                }}
                className="w-full p-3.5 bg-accent-main text-white border-none rounded-[11px] font-sans font-semibold text-[15px] cursor-pointer transition-all hover:bg-accent-deep hover:-translate-y-[1px] hover:shadow-[0_8px_20px_-8px_rgba(26,142,156,0.5)]"
              >
                로그인 화면으로
              </button>
            </div>
          ) : (
          <>
          <div className="text-center mb-7">
            <h1 className="font-serif font-semibold text-[26px] text-text-main tracking-[-0.01em] mb-1.5">
              {copy[mode].title}
            </h1>
            <p className="font-sans text-[13.5px] text-text-soft leading-[1.7]">
              {copy[mode].sub}
            </p>
          </div>

          {oauthError && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-error/40 bg-error/5 p-[12px_14px] font-sans text-[13px] text-error leading-[1.6]"
            >
              {oauthError}
            </div>
          )}

          {/* Mode Tabs */}
          <div className="flex bg-water-card rounded-xl p-1 mb-7" role="tablist">
            <button
              type="button"
              className={`flex-1 p-2.5 rounded-[9px] font-sans text-[14px] transition-all cursor-pointer border-none ${mode === 'login' ? 'bg-white text-text-main font-semibold shadow-[0_2px_8px_-3px_rgba(13,95,109,0.2)]' : 'bg-transparent text-text-soft font-medium hover:text-text-main'}`}
              onClick={() => {
                setMode('login');
                setPasswordConfirm('');
                setAgreeTerms(false);
                setAgreePrivacy(false);
                setFormError(null);
              }}
              role="tab"
              aria-selected={mode === 'login'}
            >
              로그인
            </button>
            <button
              type="button"
              className={`flex-1 p-2.5 rounded-[9px] font-sans text-[14px] transition-all cursor-pointer border-none ${mode === 'signup' ? 'bg-white text-text-main font-semibold shadow-[0_2px_8px_-3px_rgba(13,95,109,0.2)]' : 'bg-transparent text-text-soft font-medium hover:text-text-main'}`}
              onClick={() => { setMode('signup'); setFormError(null); }}
              role="tab"
              aria-selected={mode === 'signup'}
            >
              회원가입
            </button>
          </div>

          <button
            type="button"
            className="w-full p-[13px] bg-[#FEE500] text-[#3C1E1E] border-none rounded-[11px] font-sans font-semibold text-[14.5px] cursor-pointer flex items-center justify-center gap-2 mb-4.5 transition-all hover:bg-[#F5DC00] hover:-translate-y-[1px] hover:shadow-[0_6px_18px_-6px_rgba(254,229,0,0.55)]"
            onClick={handleKakao}
            aria-label="카카오 계정으로 로그인"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.85 5.34 4.65 6.78l-1.18 4.31c-.1.37.3.66.62.46l5.18-3.4c.24.02.48.04.73.04 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
            </svg>
            {mode === 'login' ? '카카오로 로그인' : '카카오로 시작하기'}
          </button>

          <div className="text-center my-2 mb-[22px] relative h-3 before:content-[''] before:absolute before:top-1/2 before:left-0 before:w-[calc(50%-56px)] before:h-px before:bg-line-light after:content-[''] after:absolute after:top-1/2 after:right-0 after:w-[calc(50%-56px)] after:h-px after:bg-line-light">
            <span className="font-sans text-[11.5px] text-text-mute tracking-[0.02em] bg-white px-2">또는 이메일로</span>
          </div>

          {formError && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-error/40 bg-error/5 p-[12px_14px] font-sans text-[13px] text-error leading-[1.6]"
            >
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block font-sans font-semibold text-[13px] text-text-main mb-1.5" htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                className="w-full p-[13px_16px] border-[1.5px] border-line-light rounded-[11px] bg-bg-light font-sans text-[15px] text-text-main transition-all placeholder:text-text-mute focus:outline-none focus:border-accent-main focus:bg-white focus:ring-[3px] focus:ring-accent-main/15"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {mode === 'signup' && (
              <div className="mb-4">
                <label className="block font-sans font-semibold text-[13px] text-text-main mb-1.5" htmlFor="nickname">닉네임</label>
                <input
                  type="text"
                  id="nickname"
                  className="w-full p-[13px_16px] border-[1.5px] border-line-light rounded-[11px] bg-bg-light font-sans text-[15px] text-text-main transition-all placeholder:text-text-mute focus:outline-none focus:border-accent-main focus:bg-white focus:ring-[3px] focus:ring-accent-main/15"
                  placeholder="다른 학습자에게 보이는 이름"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  autoComplete="nickname"
                />
                <small className="block mt-1.5 font-sans text-[12px] text-text-mute leading-[1.5]">실명이 아닌 닉네임을 적어 주세요.</small>
              </div>
            )}

            <div className="mb-4">
              <label className="block font-sans font-semibold text-[13px] text-text-main mb-1.5" htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                className="w-full p-[13px_16px] border-[1.5px] border-line-light rounded-[11px] bg-bg-light font-sans text-[15px] text-text-main transition-all placeholder:text-text-mute focus:outline-none focus:border-accent-main focus:bg-white focus:ring-[3px] focus:ring-accent-main/15"
                placeholder="8자 이상"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? "current-password" : "new-password"}
              />
              {mode === 'signup' && (
                <small className="block mt-1.5 font-sans text-[12px] text-text-mute leading-[1.5]">영문과 숫자를 섞은 8자 이상이 안전합니다.</small>
              )}
            </div>

            {mode === 'signup' && (
              <div className="mb-4">
                <label className="block font-sans font-semibold text-[13px] text-text-main mb-1.5" htmlFor="passwordConfirm">비밀번호 확인</label>
                <input
                  type="password"
                  id="passwordConfirm"
                  className={`w-full p-[13px_16px] border-[1.5px] rounded-[11px] bg-bg-light font-sans text-[15px] text-text-main transition-all placeholder:text-text-mute focus:outline-none focus:bg-white focus:ring-[3px] focus:ring-accent-main/15 ${passwordConfirm.length > 0 && !passwordsMatch ? 'border-error' : 'border-line-light focus:border-accent-main'}`}
                  placeholder="비밀번호 한 번 더"
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  autoComplete="new-password"
                />
                {passwordConfirm.length > 0 && !passwordsMatch && (
                  <small className="block mt-1.5 font-sans text-[12px] text-error leading-[1.5]">비밀번호가 일치하지 않습니다.</small>
                )}
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-between items-center mb-[22px] mt-[-4px]">
                <label className="flex items-center gap-2 font-sans text-[13px] text-text-soft cursor-pointer select-none">
                  <input type="checkbox" className="w-4 h-4 accent-accent-main shrink-0 cursor-pointer" />
                  <span>로그인 유지</span>
                </label>
                <Link href="#" className="font-sans text-[13px] text-text-soft no-underline hover:text-accent-deep hover:underline">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            )}

            {mode === 'signup' && (
              <div className="bg-water-card rounded-xl p-[14px_16px] mb-5 flex flex-col gap-2.5">
                <label className="flex items-center gap-2 font-sans text-[13px] text-text-soft cursor-pointer select-none">
                  <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="w-4 h-4 accent-accent-main shrink-0 cursor-pointer" />
                  <span><span className="text-accent-main font-semibold mr-[2px]">필수</span> 이용약관에 동의합니다</span>
                  <Link href="#" className="ml-auto font-sans text-[12px] text-accent-deep underline">보기</Link>
                </label>
                <label className="flex items-center gap-2 font-sans text-[13px] text-text-soft cursor-pointer select-none">
                  <input type="checkbox" checked={agreePrivacy} onChange={e => setAgreePrivacy(e.target.checked)} className="w-4 h-4 accent-accent-main shrink-0 cursor-pointer" />
                  <span><span className="text-accent-main font-semibold mr-[2px]">필수</span> 개인정보 처리방침에 동의합니다</span>
                  <Link href="#" className="ml-auto font-sans text-[12px] text-accent-deep underline">보기</Link>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className={`w-full p-3.5 border-none rounded-[11px] font-sans font-semibold text-[15px] tracking-[0.01em] transition-all
                ${isFormValid && !submitting
                  ? 'bg-accent-main text-white cursor-pointer hover:bg-accent-deep hover:-translate-y-[1px] hover:shadow-[0_8px_20px_-8px_rgba(26,142,156,0.5)]'
                  : 'bg-line-light text-text-mute cursor-not-allowed'}`}
            >
              {submitting ? '처리 중…' : mode === 'login' ? '로그인' : '계정 만들기'}
            </button>
          </form>
          </>
          )}

          <div className="mt-7 pt-5 border-t border-line-soft text-center">
            <p className="font-sans text-[11.5px] text-text-mute leading-[1.85]">결제 정보를 받지 않습니다 · 광고 없음</p>
            <p className="font-sans text-[11.5px] text-text-mute leading-[1.85]">이메일과 닉네임 외에는 어떤 정보도 받지 않습니다</p>
          </div>
        </div>
      </main>

      <footer className="text-center p-[30px_20px] mt-10">
        <Link href="#" className="font-sans text-[12px] text-text-mute hover:text-accent-deep transition-colors mx-2.5">고요의 경제나루 소개</Link>
        <Link href="#" className="font-sans text-[12px] text-text-mute hover:text-accent-deep transition-colors mx-2.5">이용약관</Link>
        <Link href="#" className="font-sans text-[12px] text-text-mute hover:text-accent-deep transition-colors mx-2.5">개인정보 처리방침</Link>
      </footer>
    </div>
  );
}
