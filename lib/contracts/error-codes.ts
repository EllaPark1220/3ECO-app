// CT-API-001 — 에러 코드 단일 출처. 매직 스트링 금지, 반드시 import 사용.
// 메시지는 한국어(REQ-NF-007). 개발자용 영문/디테일은 details 에 별도.

export const ERROR_CODES = {
  // 인증·권한 (4xx)
  UNAUTHORIZED: { http: 401, message: "로그인이 필요합니다." },
  FORBIDDEN: { http: 403, message: "권한이 없습니다." },
  EMAIL_NOT_CONFIRMED: { http: 403, message: "이메일 확인이 필요합니다." },
  ACCOUNT_LOCKED: { http: 423, message: "계정이 일시 잠금되었습니다." },

  // 검증 (400)
  INVALID_LESSON_ID: { http: 400, message: "lesson_id 포맷이 올바르지 않습니다." },
  INVALID_EMAIL: { http: 400, message: "이메일 형식이 올바르지 않습니다." },
  INVALID_PASSWORD: { http: 400, message: "비밀번호가 보안 정책을 충족하지 않습니다." },
  INVALID_ANSWER_FORMAT: { http: 400, message: "OX 답안 형식이 올바르지 않습니다." },
  INVALID_ANSWER_COUNT: { http: 400, message: "OX 답안 개수가 일치하지 않습니다." },
  INVALID_POSITION: { http: 400, message: "position_sec 값이 올바르지 않습니다." },
  INVALID_MEDIA_PREFERENCE: { http: 400, message: "매체 선호도 값이 올바르지 않습니다." },
  EMPTY_UPDATE: { http: 400, message: "변경할 필드가 없습니다." },
  PASSWORD_TOO_SHORT: { http: 400, message: "비밀번호는 8자 이상이어야 합니다." },
  COMMENT_TOO_LONG: { http: 400, message: "의견은 2000자 이하여야 합니다." },

  // 리소스 (404)
  LESSON_NOT_FOUND: { http: 404, message: "레슨을 찾을 수 없습니다." },
  USER_NOT_FOUND: { http: 404, message: "사용자를 찾을 수 없습니다." },

  // 설문 (CT-API-008)
  INVALID_QUARTER: { http: 400, message: "분기 값이 올바르지 않습니다." },
  INVALID_SCORE: { http: 400, message: "점수는 1~5 사이여야 합니다." },
  FREE_RESPONSE_TOO_LONG: { http: 400, message: "자유 응답은 2000자 이하여야 합니다." },

  // 충돌 (409)
  EMAIL_ALREADY_EXISTS: { http: 409, message: "이미 사용 중인 이메일입니다." },
  SURVEY_ALREADY_SUBMITTED: { http: 409, message: "이번 분기 설문에 이미 응답하셨습니다." },

  // 인증 (401 — 자격증명 불일치)
  INVALID_CREDENTIALS: { http: 401, message: "이메일 또는 비밀번호가 잘못되었습니다." },

  // Rate Limit (429)
  RATE_LIMIT_EXCEEDED: { http: 429, message: "요청이 너무 많습니다. 잠시 후 다시 시도하세요." },

  // 서버 (5xx)
  INTERNAL_ERROR: { http: 500, message: "서버 오류가 발생했습니다." },
  PDF_GENERATION_FAILED: { http: 500, message: "PDF 생성에 실패했습니다." },
  STORAGE_UNAVAILABLE: { http: 503, message: "일시적으로 서비스를 사용할 수 없습니다." },
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
