import type { Screen, ScreenKey } from "../types";
import { screenKey } from "../types";

/**
 * 산출물 화면 레지스트리 — 8화면 (학습자 5 / 운영자 2 / 시스템 1).
 * engineering 계약은 빈칸 없이 채운다(빈 계약 = 기재 누락).
 * controlAreaNotes 의 키 = 정의된 8 제어영역 집합 내에서만.
 */
export const SCREENS: Screen[] = [
  // ───────────────────────── learner ─────────────────────────
  {
    plane: "learner",
    slug: "landing",
    title: "랜딩 — 고요의 경제나루",
    route: "/",
    designSpecType: "콘텐츠형",
    flowNote: "서비스 철학·핵심 기능·5권 커리큘럼을 소개하고 학습 시작으로 유도.",
    status: "implemented",
    workItems: ["W02"],
    requirementRefs: ["VDS v3.1", "서비스 정체성: 광고·결제 없음"],
    implLocation: "app/page.tsx",
    engineering: {
      authGate: "없음(공개). 미인증 사용자 대상 마케팅 진입점.",
      clientActions: [
        "뉴스레터 이메일 구독 폼(클라이언트 검증)",
        "IntersectionObserver 스크롤 reveal 애니메이션",
        "벤토 기능 카드 → 각 기능 라우트 네비게이션",
      ],
      serverActions: [],
      dataReads: [],
      dataWrites: ["(미연동) 뉴스레터 구독 이메일"],
      telemetryEvents: ["(미계측) 뉴스레터 구독 전환"],
      exceptionStates: [],
      controlAreaNotes: {
        content: "CC BY-NC-SA·광고/결제 없음 카피, 커리큘럼 소개, 후킹 금지 어조.",
        a11y: "prefers-reduced-motion 모션 차단, 본문 건너뛰기 링크.",
        privacy: "뉴스레터 이메일 수집(백엔드 미연동).",
        observability: "구독 전환 이벤트(미계측).",
        cost: "뉴스레터 발송은 무료 티어(Resend) 한도 내 운영.",
      },
    },
  },
  {
    plane: "learner",
    slug: "lesson",
    title: "레슨 학습 화면",
    route: "/lesson/[id]",
    designSpecType: "콘텐츠형",
    flowNote: "영상/글 토글로 강의를 보고 OX 5문항으로 이해를 확인, 완료 시 기록 권유.",
    status: "implemented",
    workItems: ["W03"],
    requirementRefs: ["PRD 1권 1편 — 희소성과 선택"],
    implLocation: "app/lesson/[id]/page.tsx",
    engineering: {
      authGate: "없음(완료 시 카카오 로그인 권유, 미인증도 학습 가능).",
      clientActions: [
        "영상/글 보기 모드 토글(role=tablist)",
        "OX 5문항 답안 상태·제출",
        "완료 모달 + 글자 크기 토글",
      ],
      serverActions: [],
      dataReads: [],
      dataWrites: ["(미연동) 학습 완료 기록"],
      telemetryEvents: ["(미계측) 퀴즈 완료"],
      exceptionStates: ["not-found"],
      controlAreaNotes: {
        content: "youtube-nocookie 임베드·CC 라이선스·폴백 링크.",
        a11y: "글자 크기 토글·본문 건너뛰기·aria 탭.",
        observability: "퀴즈 완료 이벤트(미계측).",
        privacy: "완료 기록을 위한 카카오 로그인 권유(데모).",
        performance: "스탬프 응답 p95 ≤ 500ms 목표(TS-LOAD-001).",
        cost: "영상은 YouTube 임베드 단독 — 자체 호스팅 비용 0원(ADR-005).",
      },
    },
  },
  {
    plane: "learner",
    slug: "dictionary",
    title: "핵심 용어 사전",
    route: "/dictionary",
    designSpecType: "콘텐츠형",
    flowNote: "60개 경제 용어를 초성 그룹·전문 검색으로 찾고 출처 에피소드로 연결.",
    status: "implemented",
    workItems: ["W04"],
    requirementRefs: ["용어집 60선"],
    implLocation: "app/dictionary/page.tsx",
    engineering: {
      authGate: "없음(공개).",
      clientActions: [
        "검색어 필터링(useMemo)",
        "초성 인덱스 점프",
        "용어 → 출처 에피소드 링크",
      ],
      serverActions: [],
      dataReads: ["(정적) 60 용어 배열"],
      dataWrites: [],
      telemetryEvents: ["(미계측) 용어 검색"],
      exceptionStates: [],
      controlAreaNotes: {
        content: "용어 정의 출처·에피소드 링크.",
        a11y: "검색 입력 레이블·초성 내비게이션.",
      },
    },
  },
  {
    plane: "learner",
    slug: "stamp-map",
    title: "스탬프 맵(학습 진척)",
    route: "/stamp-map",
    designSpecType: "콘텐츠형",
    flowNote: "133편 전체를 진주로 시각화해 완료/미완 진척을 권별로 보여준다.",
    status: "partial",
    statusNote: "completedSet mock(4/133), 사용자별 진척 영속화 미구현(W11).",
    workItems: ["W05", "W11"],
    requirementRefs: ["진척 시각화 — 진주 메타포(VDS §13)"],
    implLocation: "app/stamp-map/page.tsx",
    engineering: {
      authGate: "없음(사용자별 진척은 로그인 필요 — 현재 mock).",
      clientActions: ["진주 호버 툴팁", "진주 → 해당 레슨 링크"],
      serverActions: ["(미연동) 사용자 진척 조회"],
      dataReads: ["(mock) completedSet 4/133"],
      dataWrites: [],
      telemetryEvents: [],
      exceptionStates: [],
      controlAreaNotes: {
        a11y: "진주 포커스·툴팁 aria.",
        observability: "(미계측) 진척 조회.",
        privacy: "사용자별 학습 진척 데이터.",
        performance: "133 진주 렌더 p95 ≤ 500ms 목표(TS-LOAD-001).",
      },
    },
  },
  {
    plane: "learner",
    slug: "auth",
    title: "로그인·회원가입",
    route: "/login",
    designSpecType: "서비스형",
    flowNote: "로그인/회원가입 듀얼 모드. 카카오 OAuth + 이메일 폴백, 동의 수집.",
    status: "partial",
    statusNote: "UI만 구현, 실제 인증 백엔드 없음(W10).",
    workItems: ["W06", "W10"],
    requirementRefs: ["계정·동의 흐름"],
    implLocation: "app/login/page.tsx",
    engineering: {
      authGate: "미인증 진입점(로그인/회원가입).",
      clientActions: [
        "로그인/회원가입 모드 토글",
        "폼 검증(이메일·비밀번호·약관/개인정보 동의)",
        "카카오 버튼(데모)",
      ],
      serverActions: ["(미연동) 인증·세션 발급"],
      dataReads: [],
      dataWrites: ["(미연동) 계정 생성·동의 로그"],
      telemetryEvents: ["(미계측) 로그인 시도"],
      exceptionStates: [],
      controlAreaNotes: {
        security: "카카오 OAuth·이메일/비밀번호 인증(미연동), 세션 발급.",
        privacy: "이메일·닉네임·약관/개인정보 동의 수집.",
        a11y: "폼 레이블·검증 메시지.",
      },
    },
  },
  // ───────────────────────── operator ─────────────────────────
  {
    plane: "operator",
    slug: "teacher-kit",
    title: "교사용 자료 배포",
    route: "/teacher-kit",
    designSpecType: "서비스형",
    flowNote: "PDF 교안을 메타데이터·사용 가이드·라이선스와 함께 계정 없이 배포.",
    status: "partial",
    statusNote: "PDF 다운로드 백엔드 없음(alert 데모) — W13.",
    workItems: ["W07", "W13"],
    requirementRefs: ["교사 자료 배포 — CC BY-NC-SA"],
    implLocation: "app/teacher-kit/page.tsx",
    engineering: {
      authGate: "없음(계정 없이 다운로드 가능 명시).",
      clientActions: [
        "PDF 다운로드 버튼(데모 alert)",
        "온라인 미리보기",
        "3단계 사용 가이드",
      ],
      serverActions: ["(미연동) PDF 파일 제공"],
      dataReads: ["(정적) 샘플 교안 메타데이터"],
      dataWrites: [],
      telemetryEvents: ["(미계측) PDF 다운로드"],
      exceptionStates: [],
      controlAreaNotes: {
        content: "CC BY-NC-SA 4.0 표기·교사 자료 배포.",
        observability: "(미계측) 다운로드 카운트.",
        delivery: "정적 PDF 자산 배포 경로.",
        performance: "PDF 생성/응답 p95 ≤ 2s 목표(TS-LOAD-002).",
        cost: "PDF 2-tier 캐시로 생성 비용 절감(IF-CACHE-001).",
      },
    },
  },
  {
    plane: "operator",
    slug: "admin-dashboard",
    title: "운영 대시보드",
    route: "/admin/dashboard",
    designSpecType: "서비스형",
    flowNote: "회원·완료·다운로드 지표와 콘텐츠 상태·활동 로그를 한눈에 보는 운영 화면.",
    status: "partial",
    statusNote: "지표 전부 하드코딩, 운영자 인증 게이트 없음(W12·W14).",
    workItems: ["W08", "W12", "W14"],
    requirementRefs: ["운영 대시보드 지표 정의"],
    implLocation: "app/admin/dashboard/page.tsx",
    engineering: {
      authGate: "운영자 전용(현재 게이트 없음 — W12 필요).",
      clientActions: ["지표 카드", "콘텐츠 표(상태 배지)", "활동 로그"],
      serverActions: ["(미연동) 지표 집계·콘텐츠 CRUD"],
      dataReads: ["(mock) 회원/완료/다운로드 지표·콘텐츠 6행"],
      dataWrites: ["(미연동) 콘텐츠 공개/비공개 전환"],
      telemetryEvents: ["(미계측) 운영 액션"],
      exceptionStates: [],
      controlAreaNotes: {
        security: "운영자 역할 게이트(미구현, W12/TS-UT-013).",
        observability: "운영 지표 집계(현재 하드코딩).",
        content: "콘텐츠 공개 상태 관리.",
        delivery: "관리자 라우트 노출 정책.",
      },
    },
  },
  // ───────────────────────── system ─────────────────────────
  {
    plane: "system",
    slug: "not-found",
    title: "404 — 페이지 없음",
    route: "(catch-all)",
    designSpecType: "서비스형",
    flowNote: "잘못된 경로 진입 시 복구 링크를 제공하는 시스템 상태 화면.",
    status: "implemented",
    workItems: ["W09"],
    requirementRefs: ["에러 상태 — 복구 경로"],
    implLocation: "app/not-found.tsx",
    engineering: {
      authGate: "없음.",
      clientActions: [],
      serverActions: [],
      dataReads: [],
      dataWrites: [],
      telemetryEvents: [],
      exceptionStates: [],
      controlAreaNotes: {
        a11y: "복구 링크·명확한 안내 카피.",
        delivery: "404 상태코드·noindex.",
      },
    },
  },
];

export const getScreen = (
  plane: string,
  slug: string,
): Screen | undefined =>
  SCREENS.find((s) => s.plane === plane && s.slug === slug);

export const getScreenByKey = (key: string): Screen | undefined =>
  SCREENS.find((s) => screenKey(s) === key);

export const screensInPlane = (plane: string): Screen[] =>
  SCREENS.filter((s) => s.plane === plane);

export const allScreenKeys: ScreenKey[] = SCREENS.map(screenKey);
