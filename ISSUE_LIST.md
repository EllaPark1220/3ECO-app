# Issue 발행 목록

> `tasks/*.md` 의 각 Task 를 GitHub Issue 로 자동 발행한 결과입니다.
> 저장소: [EllaPark1220/3ECO-app](https://github.com/EllaPark1220/3ECO-app) · 라벨: `Issue Automation` (grill-it 도출/정정 항목은 `grill-it` 라벨 추가)

- 총 발행: **193 건** (초기 190 + grill-it 신규 3: 카카오 OAuth·학습 흔적 모달·교사 경량 will_reuse)
- 개요 문서(`0. TASK_LIST.md`, `0. TASK_DEPENDENCY_GRAPH.md`)는 개별 Task 가 아니므로 제외

| # | Issue | Task 파일 | 제목 |
|---|-------|-----------|------|
| 1 | [#1](https://github.com/EllaPark1220/3ECO-app/issues/1) | `CT-API-001_API_Spec_Common_Response_RateLimit.md` | [Feature] CT-API-001: 공통 응답·오류 포맷 + Rate Limit 미들웨어 (모든 API 의 기반) |
| 2 | [#2](https://github.com/EllaPark1220/3ECO-app/issues/2) | `CT-API-002_API_Spec_Lesson_Detail_DTO.md` | [Feature] CT-API-002: GET /api/lesson/{id} 단건 조회 Route Handler DTO + 7필드 응답 + ETag 캐시 |
| 3 | [#3](https://github.com/EllaPark1220/3ECO-app/issues/3) | `CT-API-003_API_Spec_Progress_Save_DTO.md` | [Feature] CT-API-003: saveProgress() Server Action DTO + Zod {lesson_id, position_sec} + UPSERT 응답 |
| 4 | [#4](https://github.com/EllaPark1220/3ECO-app/issues/4) | `CT-API-004_API_Spec_OX_Submit_Idempotency_DTO.md` | [Feature] CT-API-004: submitOx() Server Action DTO + P2002 처리 명세 (멱등 응답 계약) |
| 5 | [#5](https://github.com/EllaPark1220/3ECO-app/issues/5) | `CT-API-005_API_Spec_Stamp_Map_DTO.md` | [Feature] CT-API-005: GET /api/stamp/map 응답 DTO + revalidate 60 캐시 + StampMapResponse 정의 |
| 6 | [#6](https://github.com/EllaPark1220/3ECO-app/issues/6) | `CT-API-006_API_Spec_Teacher_Kit_Streaming_DTO.md` | [Feature] CT-API-006: GET /api/teacher/kit/{id} Route Handler 스트리밍 DTO + 구버전 301 리디렉트 시그니처 |
| 7 | [#7](https://github.com/EllaPark1220/3ECO-app/issues/7) | `CT-API-007_API_Spec_Teacher_Feedback_DTO.md` | [DEPRECATED] [Feature] CT-API-007: submitTeacherFeedback() Server Action DTO |
| 8 | [#8](https://github.com/EllaPark1220/3ECO-app/issues/8) | `CT-API-008_API_Spec_Survey_Submit_DTO.md` | [Feature] CT-API-008: submitSurvey() Server Action DTO + 분기당 1회 제한 + 익명 토큰 + 거부 응답 코드 |
| 9 | [#9](https://github.com/EllaPark1220/3ECO-app/issues/9) | `CT-API-009_API_Spec_Newsletter_Subscribe_DTO.md` | [Feature] CT-API-009: POST /api/newsletter/subscribe DTO + 더블 옵트인 + 토큰 발급 시그니처 |
| 10 | [#10](https://github.com/EllaPark1220/3ECO-app/issues/10) | `CT-API-010_API_Spec_Cron_Endpoints_DTO.md` | [Feature] CT-API-010: Cron 엔드포인트 3종 시그니처 — warmup + supabase-ping + pg-dump 통합 Contract |
| 11 | [#11](https://github.com/EllaPark1220/3ECO-app/issues/11) | `CT-API-011_API_Spec_ShareStampMap_Token_DTO.md` | [Contract] CT-API-011: shareStampMap() 토큰 발급 DTO |
| 12 | [#12](https://github.com/EllaPark1220/3ECO-app/issues/12) | `CT-DB-001_Schema_Prisma_Init_DB_URL.md` | [Feature] CT-DB-001: Prisma 초기화 + DATABASE_URL 환경 분리 (로컬 SQLite ↔ Supabase PostgreSQL) |
| 13 | [#13](https://github.com/EllaPark1220/3ECO-app/issues/13) | `CT-DB-002_Schema_User_Role_Preferences.md` | [Feature] CT-DB-002: User 모델 + Role enum + 환경설정 컬럼 (Auth 데이터 기반) |
| 14 | [#14](https://github.com/EllaPark1220/3ECO-app/issues/14) | `CT-DB-003_Schema_Lesson_3Media_NotNull.md` | [Feature] CT-DB-003: Lesson 모델 + 3매체 NOT NULL 제약 + Module relation |
| 15 | [#15](https://github.com/EllaPark1220/3ECO-app/issues/15) | `CT-DB-004_Schema_LessonProgress_Model.md` | [Feature] CT-DB-004: LessonProgress 모델 + 복합 UNIQUE + 진도 상태 컬럼 |
| 16 | [#16](https://github.com/EllaPark1220/3ECO-app/issues/16) | `CT-DB-005_Schema_Stamp_Idempotency_Unique.md` | [Feature] CT-DB-005: Stamp 모델 정의 (영구 멱등 키 UNIQUE 제약 포함) |
| 17 | [#17](https://github.com/EllaPark1220/3ECO-app/issues/17) | `CT-DB-006_Schema_OxQuestion_ScrollAnchor.md` | [Feature] CT-DB-006: OxQuestion 모델 + scrollAnchor 컬럼 + Lesson cascade |
| 18 | [#18](https://github.com/EllaPark1220/3ECO-app/issues/18) | `CT-DB-007_Schema_TeacherFeedback_TeacherKit.md` | [DEPRECATED] [Feature] CT-DB-007: TeacherFeedback + TeacherKit 모델 |
| 19 | [#19](https://github.com/EllaPark1220/3ECO-app/issues/19) | `CT-DB-008_Schema_SurveyResponse_Quarterly.md` | [Feature] CT-DB-008: SurveyResponse 모델 — 분기 1회 제한 UNIQUE + 익명 토큰 분리 + Likert 컬럼 |
| 20 | [#20](https://github.com/EllaPark1220/3ECO-app/issues/20) | `CT-DB-009_Schema_EventLog_AppendOnly.md` | [Feature] CT-DB-009: EventLog 모델 — append-only + JSON payload + 90일 retention |
| 21 | [#21](https://github.com/EllaPark1220/3ECO-app/issues/21) | `CT-DB-010_Schema_Migration_Seed_Setup.md` | [Feature] CT-DB-010: 초기 마이그레이션 + 시드 통합 스크립트 + Vercel build hook |
| 22 | [#22](https://github.com/EllaPark1220/3ECO-app/issues/22) | `CT-DB-011_Schema_Supabase_RLS_Policies.md` | [Feature] CT-DB-011: Supabase RLS 정책 — defense-in-depth 의 데이터 레이어 마지막 방어선 |
| 23 | [#23](https://github.com/EllaPark1220/3ECO-app/issues/23) | `CT-MOCK-001_Mock_Lesson_10_Seed.md` | [Feature] CT-MOCK-001: Lesson 133편 시드 + 총 5권 구성 + OxQuestion 665건 + 콘텐츠 무결성 검증 |
| 24 | [#24](https://github.com/EllaPark1220/3ECO-app/issues/24) | `CT-MOCK-002_Mock_User_3Roles_Persona_Seed.md` | [Feature] CT-MOCK-002: 학습자/교사/관리자 3역할 시드 + 가입 검증·접근성 토글 테스트 페르소나 |
| 25 | [#25](https://github.com/EllaPark1220/3ECO-app/issues/25) | `CT-MOCK-003_Mock_Progress_Stamp_Seed.md` | [Feature] CT-MOCK-003: 진도·스탬프 시드 — 5개·10개 시나리오 사용자 2명 + INV-04 정합 검증 |
| 26 | [#26](https://github.com/EllaPark1220/3ECO-app/issues/26) | `CT-MOCK-004_Mock_MSW_Handler_4Routes.md` | [Feature] CT-MOCK-004: MSW 핸들러 — 프론트엔드 개발용 4종 API mock |
| 27 | [#27](https://github.com/EllaPark1220/3ECO-app/issues/27) | `FR-AUTH-001_Logic_Read_Current_User_Session.md` | [Feature] FR-AUTH-001: getCurrentUser() 헬퍼 — Supabase 세션 → User 객체 조회 + React.cache |
| 28 | [#28](https://github.com/EllaPark1220/3ECO-app/issues/28) | `FR-AUTH-002_Logic_Read_RBAC_Guards_3Roles.md` | [Feature] FR-AUTH-002: RBAC 가드 미들웨어 — learner/teacher/admin 라우트 분리 |
| 29 | [#29](https://github.com/EllaPark1220/3ECO-app/issues/29) | `FR-AUTH-005_Logic_Read_User_Preferences_GET.md` | [Feature] FR-AUTH-005: GET /api/auth/preferences — 환경설정 조회 (FW-AUTH-005 의 Read 짝) |
| 30 | [#30](https://github.com/EllaPark1220/3ECO-app/issues/30) | `FR-DICT-001_Logic_Read_Term_Index.md` | [Feature] FR-DICT-001: 용어 인덱스 (Term Index) 데이터 API |
| 31 | [#31](https://github.com/EllaPark1220/3ECO-app/issues/31) | `FR-EXP-001_Logic_Read_EXP1_StampMap_Visibility.md` | [Feature] FR-EXP-001: EXP-1 스탬프맵 노출 vs 숨김 — n≥500 카이제곱 + 완주율 비교 |
| 32 | [#32](https://github.com/EllaPark1220/3ECO-app/issues/32) | `FR-EXP-002_Logic_Read_EXP2_Plain_Intro_Completion.md` | [Feature] FR-EXP-002: EXP-2 후킹 없는 도입부 vs 짧은 후킹 — n≥200 + 95% CI ≥55% 완시청률 |
| 33 | [#33](https://github.com/EllaPark1220/3ECO-app/issues/33) | `FR-EXP-003_Logic_Read_EXP3_Short_Session.md` | [Feature] FR-EXP-003: EXP-3 단편 세션 vs 전체 lesson — 완주율 비교 + 격차 ≤2pp |
| 34 | [#34](https://github.com/EllaPark1220/3ECO-app/issues/34) | `FR-EXP-004_Logic_Read_EXP4_Text_Mode.md` | [Feature] FR-EXP-004: EXP-4 글로 읽기 전환자 완주율 ≥15% — n≥100 + 페르소나 SH-04 한정숙 |
| 35 | [#35](https://github.com/EllaPark1220/3ECO-app/issues/35) | `FR-KPI-001_Logic_Read_Signups_KPI.md` | [Feature] FR-KPI-001: 가입자 수 KPI 집계 — 누적·일별·주별 + ADMIN role 가드 |
| 36 | [#36](https://github.com/EllaPark1220/3ECO-app/issues/36) | `FR-KPI-002_Logic_Read_L4_Completion_KPI.md` | [Feature] FR-KPI-002: L4 완주율 KPI — 북극성 KPI 추적 (300~1000명 목표) |
| 37 | [#37](https://github.com/EllaPark1220/3ECO-app/issues/37) | `FR-KPI-003_Logic_Read_OX_Accuracy_KPI.md` | [Feature] FR-KPI-003: OX 평균 정답률 KPI — lesson 별 + 전체 평균 + 난이도 outlier 감지 |
| 38 | [#38](https://github.com/EllaPark1220/3ECO-app/issues/38) | `FR-KPI-004_Logic_Read_Media_Preference_KPI.md` | [Feature] FR-KPI-004: 매체 선호도 분포 KPI — VIDEO/TEXT/MIXED 비율 + 매체 전환 빈도 |
| 39 | [#39](https://github.com/EllaPark1220/3ECO-app/issues/39) | `FR-KPI-005_Logic_Read_DAU_KPI.md` | [Feature] FR-KPI-005: 일일 활성 사용자 (DAU/WAU/MAU) KPI — 30일 시계열 + sticky factor |
| 40 | [#40](https://github.com/EllaPark1220/3ECO-app/issues/40) | `FR-KPI-006_Logic_Read_TeacherKit_Usage_KPI.md` | [Feature] FR-KPI-006: 교안 실사용률 KPI — 다운로드 카운트 + used_in_class=true 비율 + REQ-NF-045 추적 |
| 41 | [#41](https://github.com/EllaPark1220/3ECO-app/issues/41) | `FR-KPI-007_Logic_Read_Teacher_Reuse_KPI.md` | [Feature] FR-KPI-007: 교사 재사용 의사 누적 KPI — REQ-NF-046 추적 (≥10명 목표) + Private Beta Exit 진척도 |
| 42 | [#42](https://github.com/EllaPark1220/3ECO-app/issues/42) | `FR-KPI-008_Logic_Read_Accessibility_KPI.md` | [Feature] FR-KPI-008: 접근성 체크리스트 100% KPI — axe CI 빌드별 + Stage 0 Exit 게이트 |
| 43 | [#43](https://github.com/EllaPark1220/3ECO-app/issues/43) | `FR-KPI-010_Logic_Read_Isumin_Segment_KPI.md` | [Feature] FR-KPI-010: 이수민 세그먼트 첫 영상 완시청률 ≥60% — hooking-averse 페르소나 KPI |
| 44 | [#44](https://github.com/EllaPark1220/3ECO-app/issues/44) | `FR-KPI-011_Logic_Read_Landing_Funnel_KPI.md` | [Feature] FR-KPI-011: 랜딩→첫 영상 전환율 ≥20% 퍼널 KPI — S2(랜딩) → S3(첫 영상) |
| 45 | [#45](https://github.com/EllaPark1220/3ECO-app/issues/45) | `FR-KPI-012_Logic_Read_ShortSession_Completion_8pct.md` | [Feature] FR-KPI-012: 단편 세션(<8분) 완주율 ≥8% — EXP-3 검증 KPI |
| 46 | [#46](https://github.com/EllaPark1220/3ECO-app/issues/46) | `FR-LES-001_Logic_Read_Lesson_Detail_API_Cache.md` | [Feature] FR-LES-001: 레슨 단건 조회 Route Handler — 3매체 메타 + 캐시 |
| 47 | [#47](https://github.com/EllaPark1220/3ECO-app/issues/47) | `FR-LES-002_Logic_Read_Lesson_List_API.md` | [Feature] FR-LES-002: GET /api/lessons — 레슨 목록 조회 + 모듈 그룹화 + 진도 매핑 |
| 48 | [#48](https://github.com/EllaPark1220/3ECO-app/issues/48) | `FR-LINT-001_Logic_Read_Content_Report_Trigger.md` | [Feature] FR-LINT-001: 사용자 "과장됨" 리포트 5% 초과 시 게시 중단 트리거 + 운영자 알림 |
| 49 | [#49](https://github.com/EllaPark1220/3ECO-app/issues/49) | `FR-PDF-001_Logic_Read_PDF_Download_Cache.md` | [Feature] FR-PDF-001: GET /api/teacher/kit/{id} Route Handler — 2단 캐시 + 스트리밍 |
| 50 | [#50](https://github.com/EllaPark1220/3ECO-app/issues/50) | `FR-PDF-002_Logic_Read_PDF_OldVersion_301_Redirect.md` | [Feature] FR-PDF-002: 구버전 PDF URL 301 리디렉트 |
| 51 | [#51](https://github.com/EllaPark1220/3ECO-app/issues/51) | `FR-STAMP-001_Logic_Read_Stamp_Map_API.md` | [Feature] FR-STAMP-001: GET /api/stamp/map — 사용자별 모든 lesson 스탬프 + 모듈 그룹화 |
| 52 | [#52](https://github.com/EllaPark1220/3ECO-app/issues/52) | `FR-STAMP-003_Logic_Read_StampMap_DwellTime_15_60sec.md` | [Feature] FR-STAMP-003: 스탬프 맵 체류 시간 — 중앙값 15~60초 (게임화 방지) |
| 53 | [#53](https://github.com/EllaPark1220/3ECO-app/issues/53) | `FR-TF-001_Logic_Read_Teacher_Feedback_Summary.md` | [DEPRECATED] [Feature] FR-TF-001: 교사 will_reuse 누적 집계 |
| 54 | [#54](https://github.com/EllaPark1220/3ECO-app/issues/54) | `FW-AUTH-001_Infra_Auth_Supabase_SSR_Setup.md` | [Feature] FW-AUTH-001: Supabase Auth 설치 및 환경 변수 구성 (D-AUTH 결정 적용) |
| 55 | [#55](https://github.com/EllaPark1220/3ECO-app/issues/55) | `FW-AUTH-002_Logic_Write_Signup_PII_Minimal.md` | [Feature] FW-AUTH-002: 회원가입 Server Action — 이메일·닉네임만, 결제 필드 영구 거부 (PII 최소) |
| 56 | [#56](https://github.com/EllaPark1220/3ECO-app/issues/56) | `FW-AUTH-003_Logic_Write_Login_Session_Cookie.md` | [Feature] FW-AUTH-003: 로그인 Server Action + Supabase 세션 쿠키 |
| 57 | [#57](https://github.com/EllaPark1220/3ECO-app/issues/57) | `FW-AUTH-004_Logic_Write_Auth_Callback_PasswordReset.md` | [Feature] FW-AUTH-004: 가입 확인 메일 콜백 + 비밀번호 재설정 흐름 + Resend 통합 |
| 58 | [#58](https://github.com/EllaPark1220/3ECO-app/issues/58) | `FW-AUTH-005_Logic_Write_User_Preferences_PATCH.md` | [Feature] FW-AUTH-005: updateUserPreferences() Server Action — accessibility_mode + media_preference + font_size 묶음 영속화 |
| 59 | [#59](https://github.com/EllaPark1220/3ECO-app/issues/59) | `FW-EXP-001_Logic_Write_Experiment_Assignment.md` | [Feature] FW-EXP-001: 페르소나 매칭 태그 + A/B 격리 미들웨어 — 이수민 후킹 변형 차단 + 결정적 분배 |
| 60 | [#60](https://github.com/EllaPark1220/3ECO-app/issues/60) | `FW-LINT-001_Logic_Write_Hooking_Linter_Regex.md` | [Feature] FW-LINT-001: 정규식 기반 Hooking Linter 1차 — 제목·설명·도입부 자막 키워드 검증 |
| 61 | [#61](https://github.com/EllaPark1220/3ECO-app/issues/61) | `FW-LINT-002_Logic_Write_Hooking_Linter_LLM.md` | [Feature] FW-LINT-002: Vercel AI SDK + Gemini API LLM 2차 후킹 검증 — 숨은 후킹·수익 약속 LLM 판정 |
| 62 | [#62](https://github.com/EllaPark1220/3ECO-app/issues/62) | `FW-LINT-003_Logic_Write_Definition_Korean_Context.md` | [Feature] FW-LINT-003: Hooking Linter 정의 검증 — 30초 개념 정의 + 한국 맥락 예시 자막 키워드 매칭 |
| 63 | [#63](https://github.com/EllaPark1220/3ECO-app/issues/63) | `FW-LINT-004_Logic_Write_CC_License_Verification.md` | [Feature] FW-LINT-004: CC BY-NC-SA 4.0 명시 자동 검증 — PDF 푸터 + 영상 설명 + 웹 푸터 3곳 |
| 64 | [#64](https://github.com/EllaPark1220/3ECO-app/issues/64) | `FW-NL-001_Logic_Write_Newsletter_Subscribe.md` | [Feature] FW-NL-001: Newsletter 구독 Route Handler — 더블 옵트인 토큰 발행 + Resend 메일 발송 + 확인 라우트 |
| 65 | [#65](https://github.com/EllaPark1220/3ECO-app/issues/65) | `FW-OX-001_Logic_Write_OX_Grading_Transaction.md` | [Feature] FW-OX-001: submitOx() Server Action 본체 — 정답 판정 + 트랜잭션 INSERT |
| 66 | [#66](https://github.com/EllaPark1220/3ECO-app/issues/66) | `FW-OX-002_Logic_Write_OX_P2002_Idempotent_Convert.md` | [Feature] FW-OX-002: Prisma P2002 catch → 200 동일 페이로드 변환 (영구 멱등 핵심 로직) |
| 67 | [#67](https://github.com/EllaPark1220/3ECO-app/issues/67) | `FW-OX-003_Logic_Write_OX_EventLog_Emit.md` | [Feature] FW-OX-003: EventLog 발행 분리 — stamp.earned + ox.duplicate_idempotent + lesson.completed |
| 68 | [#68](https://github.com/EllaPark1220/3ECO-app/issues/68) | `FW-OX-004_Logic_Write_OX_Stamp10_Trigger.md` | [Feature] FW-OX-004: 권 완주(권별 실제 편수) 트리거 — 체감 변화 설문 발송 |
| 69 | [#69](https://github.com/EllaPark1220/3ECO-app/issues/69) | `FW-PDF-001_Infra_PDF_Renderer_Korean_Fonts.md` | [Feature] FW-PDF-001: @react-pdf/renderer + 나눔바른고딕·나눔명조 폰트 등록 (Vercel 번들 한도 검증) |
| 70 | [#70](https://github.com/EllaPark1220/3ECO-app/issues/70) | `FW-PDF-003_Logic_Write_PDF_Fallback_Cache.md` | [Feature] FW-PDF-003: PDF 생성 5xx 실패 시 최신 캐시 PDF 폴백 + 에러 로그 |
| 71 | [#71](https://github.com/EllaPark1220/3ECO-app/issues/71) | `FW-PROG-001_Logic_Write_Progress_Save_Throttle_Upsert.md` | [Feature] FW-PROG-001: saveProgress() Server Action — 10초 간격 병합 + UPSERT |
| 72 | [#72](https://github.com/EllaPark1220/3ECO-app/issues/72) | `FW-PROG-003_Logic_Write_Offline_Queue_IndexedDB.md` | [Feature] FW-PROG-003: IndexedDB 오프라인 큐잉 + 재연결 30초 내 배치 동기화 |
| 73 | [#73](https://github.com/EllaPark1220/3ECO-app/issues/73) | `FW-PROG-004_Logic_Write_MultiDevice_LWW_Realtime.md` | [Feature] FW-PROG-004: 다기기 동시 재생 Last-Write-Wins UPSERT + 알림 배너 |
| 74 | [#74](https://github.com/EllaPark1220/3ECO-app/issues/74) | `FW-STAMP-001_Logic_Write_ShareStampMap_Token.md` | [Feature] FW-STAMP-001: shareStampMap() 토큰 발급 — 공유 URL 생성 |
| 75 | [#75](https://github.com/EllaPark1220/3ECO-app/issues/75) | `FW-SUR-001_Logic_Write_Survey_Submit.md` | [Feature] FW-SUR-001: submitSurvey() Server Action 본체 — 분기당 1회 + 익명 토큰 + P2002 → 409 변환 |
| 76 | [#76](https://github.com/EllaPark1220/3ECO-app/issues/76) | `FW-TF-001_Logic_Write_Teacher_Feedback_Submit.md` | [DEPRECATED] [Feature] FW-TF-001: submitTeacherFeedback() Server Action |
| 77 | [#77](https://github.com/EllaPark1220/3ECO-app/issues/77) | `FW-TF-002_Logic_Write_Teacher_PrepTime_Survey.md` | [DEPRECATED] [Feature] FW-TF-002: 교사 사전-사후 설문 |
| 78 | [#78](https://github.com/EllaPark1220/3ECO-app/issues/78) | `FW-TF-003_Logic_Write_Print_Request_Spec.md` | [Feature] FW-TF-003: 교안 PDF 묶음 우편 발송 신청 (Could Have, MVP-DEFER) — Stage 2 검토 |
| 79 | [#79](https://github.com/EllaPark1220/3ECO-app/issues/79) | `IF-AN-001_Infra_Vercel_Analytics_Privacy.md` | [Infra] IF-AN-001: Vercel Analytics + Plausible(선택) — privacy-first 분석 통합 |
| 80 | [#80](https://github.com/EllaPark1220/3ECO-app/issues/80) | `IF-CACHE-001_Infra_PDF_2Tier_Cache.md` | [Infra] IF-CACHE-001: PDF 2단 캐시 — Vercel Edge Cache + Supabase Storage |
| 81 | [#81](https://github.com/EllaPark1220/3ECO-app/issues/81) | `IF-CACHE-002_Infra_PDF_Cache_HIT_95_Validation.md` | [Infra] IF-CACHE-002: PDF 캐시 HIT ≥95% 측정 검증 |
| 82 | [#82](https://github.com/EllaPark1220/3ECO-app/issues/82) | `IF-CI-001_Infra_CI_Quality_Yml_5Jobs.md` | [Infra] IF-CI-001: GitHub Actions quality.yml 단일 파일 + Vercel Preview 병렬 + 5종 Job 구조 |
| 83 | [#83](https://github.com/EllaPark1220/3ECO-app/issues/83) | `IF-CI-002_Infra_CI_Axe_Lighthouse_Alpha_Gate.md` | [Infra] IF-CI-002: GitHub Actions 품질 게이트 — axe-core + Lighthouse CI (Alpha 필수 2종) |
| 84 | [#84](https://github.com/EllaPark1220/3ECO-app/issues/84) | `IF-CI-003_Infra_CI_Hooking_Lint_Job.md` | [Feature] IF-CI-003: 후킹 린터 CI Job — FW-LINT-001~004 통합 + 변경 lesson 만 LLM + main 차단 |
| 85 | [#85](https://github.com/EllaPark1220/3ECO-app/issues/85) | `IF-CI-004_Infra_CI_Branch_Protection.md` | [Feature] IF-CI-004: GitHub Branch Protection — main 직접 push 차단 + required status check |
| 86 | [#86](https://github.com/EllaPark1220/3ECO-app/issues/86) | `IF-CI-005_Infra_Husky_Pre_Commit.md` | [Feature] IF-CI-005: Husky Pre-commit Hook — 로컬 lint + type-check + 빠른 실패 |
| 87 | [#87](https://github.com/EllaPark1220/3ECO-app/issues/87) | `IF-CI-006_Infra_CI_Gemini_Call_Gate.md` | [Feature] IF-CI-006: Gemini 호출 게이트 — 변경 lesson 만 + Free 한도 보호 + fork PR skip |
| 88 | [#88](https://github.com/EllaPark1220/3ECO-app/issues/88) | `IF-CRON-001_Infra_Vercel_Cron_Warmup.md` | [Infra] IF-CRON-001: Vercel Cron 5분 간격 warmup + Supabase keepalive |
| 89 | [#89](https://github.com/EllaPark1220/3ECO-app/issues/89) | `IF-CRON-002_Infra_Cron_Supabase_Ping.md` | [Feature] IF-CRON-002: Supabase Ping Cron — 주 1회 SELECT 1 + R10 pause 방지 |
| 90 | [#90](https://github.com/EllaPark1220/3ECO-app/issues/90) | `IF-CRON-003_Infra_Cron_PgDump_Backup.md` | [Feature] IF-CRON-003: pg-dump 백업 Cron — 일 1회 Supabase Storage 저장 + RPO 24h + 7일 retention |
| 91 | [#91](https://github.com/EllaPark1220/3ECO-app/issues/91) | `IF-CRON-004_Infra_DR_Restore_SOP.md` | [Feature] IF-CRON-004: Disaster Recovery 절차 — RTO ≤4h pg_restore + 검증 + 훈련 SOP |
| 92 | [#92](https://github.com/EllaPark1220/3ECO-app/issues/92) | `IF-FONT-001_Infra_Google_Fonts_Korean_Subset.md` | [Infra] IF-FONT-001: next/font/google 한글 폰트 서브셋 + Vercel Functions 번들 검증 |
| 93 | [#93](https://github.com/EllaPark1220/3ECO-app/issues/93) | `IF-GEM-001_Infra_Gemini_API_AI_SDK.md` | [Feature] IF-GEM-001: Gemini API 키 + Vercel AI SDK 통합 + 모델 교체 가능 인터페이스 |
| 94 | [#94](https://github.com/EllaPark1220/3ECO-app/issues/94) | `IF-RES-001_Infra_Resend_Email_Setup.md` | [Infra] IF-RES-001: Resend Free 셋업 — 가입 확인 메일 + Teacher will_reuse 알림 |
| 95 | [#95](https://github.com/EllaPark1220/3ECO-app/issues/95) | `IF-SCALE-001_Infra_Lesson_125_Expansion_Validation.md` | [Infra] IF-SCALE-001: Lesson 1→133편 확장 검증 — 데이터 모델·API 변경 0건 |
| 96 | [#96](https://github.com/EllaPark1220/3ECO-app/issues/96) | `IF-SCALE-002_Infra_Lesson_Add_30min_Template.md` | [Infra] IF-SCALE-002: 신규 레슨 1편 추가 30분 내 완료 검증 |
| 97 | [#97](https://github.com/EllaPark1220/3ECO-app/issues/97) | `IF-SUP-001_Infra_Supabase_Free_Auth_Storage.md` | [Infra] IF-SUP-001: Supabase Free 프로젝트 + Auth 활성화 + Storage 버킷 + DB 연결 |
| 98 | [#98](https://github.com/EllaPark1220/3ECO-app/issues/98) | `IF-SUP-002_Infra_Supabase_Pro_Upgrade.md` | [Infra] IF-SUP-002: Supabase Free → Pro 전환 + event_log 90일 + 감사 로그 |
| 99 | [#99](https://github.com/EllaPark1220/3ECO-app/issues/99) | `IF-VC-001_Infra_Vercel_Hobby_Project.md` | [Infra] IF-VC-001: Vercel Hobby 프로젝트 + Git Push 자동 배포 + 환경 분리 |
| 100 | [#100](https://github.com/EllaPark1220/3ECO-app/issues/100) | `IF-VC-002_Infra_Vercel_Pro_Trigger_Monitor.md` | [Infra] IF-VC-002: Vercel Pro 전환 트리거 — D-TIER 5건 모니터링 + 자동 알림 |
| 101 | [#101](https://github.com/EllaPark1220/3ECO-app/issues/101) | `NF-COST-001_NF_Infra_Cost_0_10man.md` | [NF] NF-COST-001: 인프라 비용 0~10만원 — 청구서 자동 알림 |
| 102 | [#102](https://github.com/EllaPark1220/3ECO-app/issues/102) | `NF-COST-002_NF_Tool_Subscription_30man.md` | [NF] NF-COST-002: 외부 도구 구독 ≤30만원 회계 리뷰 정책 |
| 103 | [#103](https://github.com/EllaPark1220/3ECO-app/issues/103) | `NF-COST-003_NF_NewFeature_Cost_10pct.md` | [NF] NF-COST-003: 신규 기능 운영비 증가 ≤10% 체크리스트 |
| 104 | [#104](https://github.com/EllaPark1220/3ECO-app/issues/104) | `NF-COST-004_NF_VideoHosting_0won.md` | [NF] NF-COST-004: 영상 호스팅 0원 검증 — 비유튜브 호스팅 0건 정적 분석 |
| 105 | [#105](https://github.com/EllaPark1220/3ECO-app/issues/105) | `NF-FINAL-001_NF_Stage1to2_Transition_Gate.md` | [Feature] NF-FINAL-001: Stage 1 → Stage 2 전환 게이트 — 8 Criteria 자동 + 수동 검증 + admin 대시보드 |
| 106 | [#106](https://github.com/EllaPark1220/3ECO-app/issues/106) | `NF-FINAL-002_NF_Final_Operations_Runbook.md` | [Feature] NF-FINAL-002: 운영 SOP 통합 + 단일 제작자 위임 가이드 — runbook 카탈로그 + 비상 연락 + 인계 절차 |
| 107 | [#107](https://github.com/EllaPark1220/3ECO-app/issues/107) | `NF-OBS-001_NF_Sentry_Setup_Sampling.md` | [NF] NF-OBS-001: Sentry Free 통합 + Next.js SDK + 에러 샘플링 정책 |
| 108 | [#108](https://github.com/EllaPark1220/3ECO-app/issues/108) | `NF-OBS-002_NF_Sev1_Availability_ErrorRate.md` | [NF] NF-OBS-002: Severity Router · Sev1 — 가용성 <99% OR 오류율 >2% |
| 109 | [#109](https://github.com/EllaPark1220/3ECO-app/issues/109) | `NF-OBS-003_NF_Sev2_Latency_ErrorRate.md` | [NF] NF-OBS-003: Severity Router · Sev2 — p95 +20% OR 오류율 >1% |
| 110 | [#110](https://github.com/EllaPark1220/3ECO-app/issues/110) | `NF-OBS-004_NF_Sev3_KPI_Budget.md` | [NF] NF-OBS-004: Severity Router · Sev3 — KPI -20% OR 예산 80% 소진 |
| 111 | [#111](https://github.com/EllaPark1220/3ECO-app/issues/111) | `NF-OBS-005_NF_ErrorBudget_Freeze.md` | [NF] NF-OBS-005: Error Budget — 월간 80% 소진 시 검토 / 100% 시 출시 동결 |
| 112 | [#112](https://github.com/EllaPark1220/3ECO-app/issues/112) | `NF-OBS-006_NF_VercelLogs_14day.md` | [NF] NF-OBS-006: Vercel Logs 14일 — 서버 로그 중앙 집계 |
| 113 | [#113](https://github.com/EllaPark1220/3ECO-app/issues/113) | `NF-OBS-007_NF_EventLog_Retention_30_90day.md` | [NF] NF-OBS-007: event_log 보관 정책 — MVP 30일 → Pro 전환 시 90일 |
| 114 | [#114](https://github.com/EllaPark1220/3ECO-app/issues/114) | `NF-OBS-008_NF_Uptime_99_5pct.md` | [NF] NF-OBS-008: 가용성 모니터링 — 외부 업타임 월 99.5% |
| 115 | [#115](https://github.com/EllaPark1220/3ECO-app/issues/115) | `NF-OBS-009_NF_5Flow_ErrorRate_0_5pct.md` | [NF] NF-OBS-009: 핵심 5플로 오류율 ≤0.5% 모니터링 |
| 116 | [#116](https://github.com/EllaPark1220/3ECO-app/issues/116) | `NF-OBS-010_NF_OX_Progress_FailRate.md` | [NF] NF-OBS-010: OX→진도 반영 실패율 ≤0.5% 모니터링 |
| 117 | [#117](https://github.com/EllaPark1220/3ECO-app/issues/117) | `NF-OBS-011_NF_Resume_Position_FailRate.md` | [NF] NF-OBS-011: 재개 위치 복원 실패율 ≤1% 모니터링 |
| 118 | [#118](https://github.com/EllaPark1220/3ECO-app/issues/118) | `NF-RISK-001_NF_Risk_SingleCreator_SOP.md` | [NF] NF-RISK-001: R3 단일 제작자 페이스 완화를 위한 외주 편집 SOP 및 콘텐츠 템플릿 표준화 |
| 119 | [#119](https://github.com/EllaPark1220/3ECO-app/issues/119) | `NF-RISK-002_NF_Risk_TeacherPilot_SOP.md` | [NF] NF-RISK-002: R5 교사 모드 실사용 모니터링 — 인디스쿨 파일럿 교사 모집 및 will_reuse 지표 추적 |
| 120 | [#120](https://github.com/EllaPark1220/3ECO-app/issues/120) | `NF-RISK-004_NF_Risk_Financial_Sustainability.md` | [NF] NF-RISK-004: R7 재정 지속성 — 후원 채널 + 자체 자본 2~3년 트랙 운영 계획 |
| 121 | [#121](https://github.com/EllaPark1220/3ECO-app/issues/121) | `NF-RISK-005_NF_Risk_Vercel_Hobby_Commercial.md` | [NF] NF-RISK-005: R8 Vercel Hobby non-commercial — 수익 시점 Pro 전환 트리거 |
| 122 | [#122](https://github.com/EllaPark1220/3ECO-app/issues/122) | `NF-SEC-001_NF_Security_TLS_HSTS.md` | [NF] NF-SEC-001: TLS 1.2+ 강제 및 HSTS 활성화 |
| 123 | [#123](https://github.com/EllaPark1220/3ECO-app/issues/123) | `NF-SEC-002_NF_Security_Pseudonymization_Pipeline.md` | [NF] NF-SEC-002: 가명처리 파이프라인 구축 (user_id → pseudo_id) |
| 124 | [#124](https://github.com/EllaPark1220/3ECO-app/issues/124) | `NF-SEC-003_NF_Security_External_Script_Audit.md` | [NF] NF-SEC-003: 외부 폰트 및 스크립트 최소화 자동 감사 |
| 125 | [#125](https://github.com/EllaPark1220/3ECO-app/issues/125) | `NF-SEC-004_NF_Security_AuditLog_90day.md` | [NF] NF-SEC-004: 감사 로그 90일 보관 (EventLog 확장 및 방어) |
| 126 | [#126](https://github.com/EllaPark1220/3ECO-app/issues/126) | `NF-SEC-005_NF_Security_RateLimit_Middleware.md` | [NF] NF-SEC-005: Rate Limit 미들웨어 적용 |
| 127 | [#127](https://github.com/EllaPark1220/3ECO-app/issues/127) | `NF-STAGE-001_NF_Stage0_Exit_All_Criteria.md` | [Feature] NF-STAGE-001: Stage 0 Exit Criteria 통합 검증 — 5개 게이트 자동 + admin 대시보드 + 운영자 알림 |
| 128 | [#128](https://github.com/EllaPark1220/3ECO-app/issues/128) | `TS-E2E-001_Test_E2E_Jihoon_Story1_Full_Loop.md` | [Test] TS-E2E-001: 박지훈 시나리오 E2E (Playwright) — Story 1 전체 학습 루프 |
| 129 | [#129](https://github.com/EllaPark1220/3ECO-app/issues/129) | `TS-E2E-002_Test_E2E_Seeun_Resume_Position.md` | [Test] TS-E2E-002: 오세은 시나리오 E2E (Playwright) — 시청 중단 → 재진입 → 5초 오차 복원 |
| 130 | [#130](https://github.com/EllaPark1220/3ECO-app/issues/130) | `TS-E2E-003_Test_E2E_Hanjeongsuk_Media_Switch_FontSize.md` | [Test] TS-E2E-003: 한정숙 시나리오 E2E (Playwright) — 매체 전환 + 글자 크기 + 영속화 |
| 131 | [#131](https://github.com/EllaPark1220/3ECO-app/issues/131) | `TS-E2E-004_Test_E2E_Kimsungho_Caption_Keyboard.md` | [Test] TS-E2E-004: 김성호 시나리오 E2E (Playwright) — 자막 ON 검증 + 키보드 100% 네비게이션 |
| 132 | [#132](https://github.com/EllaPark1220/3ECO-app/issues/132) | `TS-E2E-005_Test_E2E_Keyboard_100pct_Navigation.md` | [Test] TS-E2E-005: 키보드 100% 네비게이션 — Tab/Enter/Esc 전 화면 |
| 133 | [#133](https://github.com/EllaPark1220/3ECO-app/issues/133) | `TS-E2E-006_Test_E2E_28px_200pct_NoHorizontalScroll.md` | [Test] TS-E2E-006: 28px + 200% 확대 가로 스크롤 0건 — 반응형 회귀 |
| 134 | [#134](https://github.com/EllaPark1220/3ECO-app/issues/134) | `TS-E2E-007_Test_E2E_Jangeunhye_Teacher_PDF_Feedback.md` | [Test] TS-E2E-007: 장은혜 시나리오 E2E (Playwright) — 교사 로그인 → PDF 다운로드 → 피드백 제출 |
| 135 | [#135](https://github.com/EllaPark1220/3ECO-app/issues/135) | `TS-E2E-008_Test_E2E_PDF_QR_ScanResolution.md` | [Test] TS-E2E-008: PDF QR 코드 스캔 가능 해상도 검증 |
| 136 | [#136](https://github.com/EllaPark1220/3ECO-app/issues/136) | `TS-IT-001_Test_Integration_OX_Stamp_Flow.md` | [Feature] TS-IT-001: OX 통과 → Stamp INSERT → stamp_count → 클라이언트 반영 통합 (동시 100명) |
| 137 | [#137](https://github.com/EllaPark1220/3ECO-app/issues/137) | `TS-IT-002_Test_Integration_EventLog_Consistency.md` | [Feature] TS-IT-002: ox.submitted vs progress.updated 누락률 <0.5% — 일간 EventLog 정합 모니터링 |
| 138 | [#138](https://github.com/EllaPark1220/3ECO-app/issues/138) | `TS-IT-003_Test_Integration_Stamp10_Email_Survey.md` | [Feature] TS-IT-003: 10번째 stamp 도달 → Resend Survey 메일 E2E 통합 |
| 139 | [#139](https://github.com/EllaPark1220/3ECO-app/issues/139) | `TS-IT-004_Test_Integration_PDF_Load_50Concurrent.md` | [Test] TS-IT-004: PDF 다운로드 부하 테스트 — 동시 50명 → p95 ≤2초 + 캐시 HIT ≥95% |
| 140 | [#140](https://github.com/EllaPark1220/3ECO-app/issues/140) | `TS-IT-005_Test_Integration_PDF_URL_Redirect.md` | [Feature] TS-IT-005: 구버전 PDF URL 301 리디렉트 — HTTP 검증 + 콘텐츠 갱신 후 호환성 |
| 141 | [#141](https://github.com/EllaPark1220/3ECO-app/issues/141) | `TS-IT-006_Test_Integration_PDF_5xx_Cache_Fallback.md` | [Feature] TS-IT-006: PDF 5xx 카오스 — 캐시 폴백 동작 검증 |
| 142 | [#142](https://github.com/EllaPark1220/3ECO-app/issues/142) | `TS-IT-007_Test_Integration_Resume_100_Times.md` | [Feature] TS-IT-007: 100회 재개 복원 시나리오 — 실패 <2건 + ≤5초 오차 |
| 143 | [#143](https://github.com/EllaPark1220/3ECO-app/issues/143) | `TS-IT-008_Test_Integration_Multi_Device_Realtime.md` | [Feature] TS-IT-008: 2기기 동시 재생 충돌 — Realtime 알림 배너 노출 |
| 144 | [#144](https://github.com/EllaPark1220/3ECO-app/issues/144) | `TS-IT-009_Test_Integration_IndexedDB_Offline_Sync.md` | [Feature] TS-IT-009: IndexedDB 큐잉 오프라인 동기화 — Chrome DevTools throttling 시뮬레이션 |
| 145 | [#145](https://github.com/EllaPark1220/3ECO-app/issues/145) | `TS-IT-010_Test_Integration_OX_Idempotent_Concurrent.md` | [Test] TS-IT-010: OX 멱등 통합 테스트 — 동시 100 req → 단일 stamp 보장 |
| 146 | [#146](https://github.com/EllaPark1220/3ECO-app/issues/146) | `TS-LOAD-001_Test_Load_StampRender_100Users_p95.md` | [Test] TS-LOAD-001: 스탬프 렌더 동시 100명 — p95 ≤500ms (k6) |
| 147 | [#147](https://github.com/EllaPark1220/3ECO-app/issues/147) | `TS-LOAD-002_Test_Load_PDF_50Users_p95.md` | [Test] TS-LOAD-002: PDF 다운로드 동시 50명 — p95 ≤2s (k6) |
| 148 | [#148](https://github.com/EllaPark1220/3ECO-app/issues/148) | `TS-LOAD-003_Test_Load_LighthouseCI_LCP_MediaSwitch.md` | [Test] TS-LOAD-003: Lighthouse CI — LCP p95 ≤1.5s + 매체 전환 p95 ≤300ms |
| 149 | [#149](https://github.com/EllaPark1220/3ECO-app/issues/149) | `TS-LOAD-004_Test_Load_PositionSave_10sec_Sampling.md` | [Test] TS-LOAD-004: 위치 저장 주기 ≤10초 — 서버 로그 샘플링 |
| 150 | [#150](https://github.com/EllaPark1220/3ECO-app/issues/150) | `TS-LOAD-005_Test_Load_YouTube_FirstPlay_p95.md` | [Test] TS-LOAD-005: YouTube 임베디드 첫 재생 p95 ≤2s — 합성 모니터링 |
| 151 | [#151](https://github.com/EllaPark1220/3ECO-app/issues/151) | `TS-STATIC-001_Test_Static_Hooking_Keywords_CI.md` | [Test] TS-STATIC-001: 후킹 키워드 정적 분석 (CI grep) — PRD 원칙 1 영구 회귀 방지 |
| 152 | [#152](https://github.com/EllaPark1220/3ECO-app/issues/152) | `TS-STATIC-002_Test_Static_Docs_CC_License.md` | [Feature] TS-STATIC-002: 문서 린터 — CC BY-NC-SA 4.0 명시 + 후킹 키워드 + 모든 .md/.tsx 정적 검증 |
| 153 | [#153](https://github.com/EllaPark1220/3ECO-app/issues/153) | `TS-UT-001_Test_Unit_Signup_PII_Minimal_GWT.md` | [Test] TS-UT-001: 회원가입 단위 테스트 — PII 최소 + 결제 필드 거부 GWT |
| 154 | [#154](https://github.com/EllaPark1220/3ECO-app/issues/154) | `TS-UT-002_Test_Unit_Login_Session_Cookie_GWT.md` | [Test] TS-UT-002: 로그인 세션 단위 테스트 — HttpOnly·Secure·SameSite=Lax 쿠키 검증 |
| 155 | [#155](https://github.com/EllaPark1220/3ECO-app/issues/155) | `TS-UT-003_Test_Unit_OX_Idempotency_GWT.md` | [Test] TS-UT-003: OX 멱등 GWT 단위 테스트 — P2002 catch → 200 변환 검증 (TC-006) |
| 156 | [#156](https://github.com/EllaPark1220/3ECO-app/issues/156) | `TS-UT-004_Test_Unit_OX_Wrong_ScrollToSection.md` | [Feature] TS-UT-004: OX 오답 시 scroll_to_section 앵커 반환 단위 테스트 |
| 157 | [#157](https://github.com/EllaPark1220/3ECO-app/issues/157) | `TS-UT-005_Test_Unit_SaveProgress_Throttle.md` | [Feature] TS-UT-005: saveProgress 10초 간격 병합 단위 테스트 — 10초 내 3회 → 1회 UPSERT 검증 |
| 158 | [#158](https://github.com/EllaPark1220/3ECO-app/issues/158) | `TS-UT-006_Test_Unit_LessonProgress_LWW.md` | [Feature] TS-UT-006: LessonProgress LWW 다기기 충돌 단위 테스트 — updatedAt 최신값 우선 |
| 159 | [#159](https://github.com/EllaPark1220/3ECO-app/issues/159) | `TS-UT-007_Test_Unit_Stamp_Unique_Constraint.md` | [Feature] TS-UT-007: Stamp UNIQUE 제약 단위 테스트 — 직접 INSERT 시 P2002 + Option B 영구 멱등 |
| 160 | [#160](https://github.com/EllaPark1220/3ECO-app/issues/160) | `TS-UT-008_Test_Unit_LessonId_Format_Immutable.md` | [Feature] TS-UT-008: lessonId 포맷 L001~L133 UNIQUE·불변 단위 테스트 |
| 161 | [#161](https://github.com/EllaPark1220/3ECO-app/issues/161) | `TS-UT-009_Test_Unit_Lesson_3Media_NotNull.md` | [Feature] TS-UT-009: 3매체 NOT NULL 단위 테스트 — youtube + script + pdf_kit 누락 시 Fail |
| 162 | [#162](https://github.com/EllaPark1220/3ECO-app/issues/162) | `TS-UT-010_Test_Unit_Survey_Quarterly_Unique.md` | [Feature] TS-UT-010: Survey 분기당 1회 제한 단위 테스트 — INV-09 + P2002 변환 |
| 163 | [#163](https://github.com/EllaPark1220/3ECO-app/issues/163) | `TS-UT-011_Test_Unit_Hooking_Linter_Regex.md` | [Feature] TS-UT-011: Hooking Linter 정규식 단위 테스트 — 통과 100% / 위반 시 Fail GWT |
| 164 | [#164](https://github.com/EllaPark1220/3ECO-app/issues/164) | `TS-UT-012_Test_Unit_PDF_Metadata.md` | [Feature] TS-UT-012: PDF 메타 검증 단위 테스트 — revision_last_updated + notes + CC 라이선스 100% 삽입 |
| 165 | [#165](https://github.com/EllaPark1220/3ECO-app/issues/165) | `TS-UT-013_Test_Unit_RBAC_Guard_Learner_403.md` | [Test] TS-UT-013: RBAC 가드 단위 테스트 — LEARNER의 TeacherFeedback 생성 403 차단 |
| 166 | [#166](https://github.com/EllaPark1220/3ECO-app/issues/166) | `TS-UT-014_Test_Unit_EventLog_AppendOnly.md` | [Feature] TS-UT-014: EventLog append-only 단위 테스트 — UPDATE/DELETE 시도 시 거부 |
| 167 | [#167](https://github.com/EllaPark1220/3ECO-app/issues/167) | `UI_FR-AUTH-003_UI_Color_Mode_Auto_Detect.md` | [Feature] FR-AUTH-003: 시스템 색 모드 자동 감지 (prefers-color-scheme) + 사용자 override |
| 168 | [#168](https://github.com/EllaPark1220/3ECO-app/issues/168) | `UI_FR-DICT-001_UI_Term_Index_Page.md` | [Feature] UI_FR-DICT-001: 용어 인덱스 (Term Index) 페이지 구현 |
| 169 | [#169](https://github.com/EllaPark1220/3ECO-app/issues/169) | `UI_FR-KPI-009_UI_KPI_Dashboard_8Metrics.md` | [Feature] FR-KPI-009: 8개 KPI 통합 대시보드 — Supabase SQL + Vercel Analytics + Sentry |
| 170 | [#170](https://github.com/EllaPark1220/3ECO-app/issues/170) | `UI_FR-LES-003_UI_Lesson_Watch_YouTube_Toggle.md` | [Feature] FR-LES-003: 레슨 시청 페이지 — YouTube iframe + 매체 전환 UI |
| 171 | [#171](https://github.com/EllaPark1220/3ECO-app/issues/171) | `UI_FR-LES-004_UI_Font_Size_Toggle.md` | [Feature] FR-LES-004: 글자 크기 조절 토글 — 14 / 18 / 22 / 28px 4단계 (저시력 대응) |
| 172 | [#172](https://github.com/EllaPark1220/3ECO-app/issues/172) | `UI_FR-LES-005_UI_Anchor_Scroll_Wrong_Answer.md` | [Feature] FR-LES-005: OX 오답 시 스크립트 앵커 자동 스크롤 |
| 173 | [#173](https://github.com/EllaPark1220/3ECO-app/issues/173) | `UI_FR-OX-001_UI_OX_Quiz_RadioGroup_Submit.md` | [Feature] FR-OX-001: OX 문항 UI — RadioGroup + 제출 + 정답 노출 0건 |
| 174 | [#174](https://github.com/EllaPark1220/3ECO-app/issues/174) | `UI_FR-PROG-001_UI_Lesson_Resume_5sec_Restore.md` | [Feature] FR-PROG-001: 재진입 시 last_position_sec 조회 → ≤5초 오차 복원 |
| 175 | [#175](https://github.com/EllaPark1220/3ECO-app/issues/175) | `UI_FR-STAMP-002_UI_StampMap_Visualization_NoGamification.md` | [Feature] FR-STAMP-002: 진주 스탬프 맵 시각화 — p95 ≤500ms + 자율 선택 + 게임화 방지 |
| 176 | [#176](https://github.com/EllaPark1220/3ECO-app/issues/176) | `UI_FR-TF-002_UI_Teacher_Cases_Public_Page.md` | [DEPRECATED] [Feature] FR-TF-002: 교사 실사용 사례 공개 페이지 |
| 177 | [#177](https://github.com/EllaPark1220/3ECO-app/issues/177) | `UI_FW-PDF-002_UI_PDF_Template_A4_QR_Revision.md` | [Feature] FW-PDF-002: A4 2~3p 교안 PDF 템플릿 + QR 코드 + 개정이력 자동 삽입 |
| 178 | [#178](https://github.com/EllaPark1220/3ECO-app/issues/178) | `UI_FW-PROG-002_UI_Position_Sync_10sec_Hook.md` | [Feature] FW-PROG-002: usePositionSync() 훅 — YouTube iframe API 활용 10초 간격 위치 송신 |
| 179 | [#179](https://github.com/EllaPark1220/3ECO-app/issues/179) | `UI_NF-A11Y-001_NF_Stage0_Exit_Gate.md` | [Feature] NF-A11Y-001: Stage 0 Exit 접근성 100% Gate — axe + Lighthouse + 연속 7일 + NVDA 수동 |
| 180 | [#180](https://github.com/EllaPark1220/3ECO-app/issues/180) | `UI_NF-A11Y-002_NF_Caption_Default_ON_QA.md` | [NF] NF-A11Y-002: 자막 기본 ON — 영상 + 차트·수치 자막 100% (편집 QA 체크리스트) |
| 181 | [#181](https://github.com/EllaPark1220/3ECO-app/issues/181) | `UI_NF-A11Y-003_NF_FontSize_14_28px_Toggle.md` | [NF] NF-A11Y-003: 글자 크기 14~28px — Tailwind 토글 + UI 회귀 테스트 |
| 182 | [#182](https://github.com/EllaPark1220/3ECO-app/issues/182) | `UI_NF-A11Y-004_NF_Keyboard_100pct_Radix.md` | [NF] NF-A11Y-004: 키보드 100% — shadcn/ui Radix 기본 + E2E 키보드 검증 |
| 183 | [#183](https://github.com/EllaPark1220/3ECO-app/issues/183) | `UI_NF-A11Y-005_NF_ScreenReader_NVDA_QA.md` | [NF] NF-A11Y-005: 스크린 리더 NVDA 수동 QA + axe 보완 |
| 184 | [#184](https://github.com/EllaPark1220/3ECO-app/issues/184) | `UI_NF-A11Y-006_NF_TextMode_100pct_Lessons.md` | [NF] NF-A11Y-006: 글로 읽기 100% — 매체 전환 100% 레슨 제공 검증 |
| 185 | [#185](https://github.com/EllaPark1220/3ECO-app/issues/185) | `UI_NF-RISK-003_NF_Risk_A11Y_Stage0_Gate.md` | [NF] NF-RISK-003: R6 접근성 미충족 — Stage 0 Exit 100% 게이트 부재 시 Alpha 차단 |
| 186 | [#186](https://github.com/EllaPark1220/3ECO-app/issues/186) | `UI_TS-A11Y-001_Test_A11Y_Axe_CI_WCAG_AA.md` | [Test] TS-A11Y-001: axe-core CI 자동 검증 — 색 대비 4.5:1 + WCAG 2.1 AA + 빌드 차단 |
| 187 | [#187](https://github.com/EllaPark1220/3ECO-app/issues/187) | `UI_TS-A11Y-002_Test_A11Y_NVDA_ScreenReader_QA.md` | [TS] TS-A11Y-002: NVDA 스크린 리더 수동 QA 시나리오 및 검증 |
| 188 | [#188](https://github.com/EllaPark1220/3ECO-app/issues/188) | `UI_TS-E2E-009_Test_E2E_Sumin_NoHooking_VisualRegression.md` | [Test] TS-E2E-009: 이수민 시나리오 E2E — 후킹 톤·게임화 부재 시각 회귀 (Story 2 폐쇄) |
| 189 | [#189](https://github.com/EllaPark1220/3ECO-app/issues/189) | `UI_TS-E2E-010_Test_E2E_NoPayment_Fields_VisualRegression.md` | [Test] TS-E2E-010: 결제 폼 필드 부재 시각 회귀 — PRD 원칙 2 영구 회귀 방지 |
| 190 | [#190](https://github.com/EllaPark1220/3ECO-app/issues/190) | `FR-SUR-001_Logic_Read_Survey_KPI.md` | [Feature] FR-SUR-001: 설문 응답 집계 — "덜 두렵다" ≥60% 검증 + 분기별 시계열 |
| 191 | [#191](https://github.com/EllaPark1220/3ECO-app/issues/191) | `FW-AUTH-006_Infra_Auth_Kakao_OAuth.md` | [Feature] FW-AUTH-006: 카카오 OAuth 로그인 (Supabase Kakao provider) — 이메일/비번 병행 + PII 최소 |
| 192 | [#192](https://github.com/EllaPark1220/3ECO-app/issues/192) | `UI_FR-OX-002_UI_Learning_Trace_Modal.md` | [Feature] UI_FR-OX-002: OX 통과 학습 흔적 모달 (4조건 게이미피케이션 예외) + in-page 메시지 |
| 193 | [#193](https://github.com/EllaPark1220/3ECO-app/issues/193) | `FW-TF-004_Logic_Write_Teacher_WillReuse_Lite.md` | [Feature] FW-TF-004: 교사 will_reuse 경량 수집 — TeacherFeedback(will_reuse+comment) 최소 모델 + Server Action |

