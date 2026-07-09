// FW-AUTH-004 — 리다이렉트 경로 화이트리스트. 내부 경로만 허용(오픈 리다이렉트 차단).

// 제어문자(U+0000~U+001F, U+007F) 포함 여부 — 정규식에 제어바이트를 넣지 않도록 charCode 검사.
function hasControlChar(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c <= 0x1f || c === 0x7f) return true;
  }
  return false;
}

export function safeInternalPath(
  raw: string | null | undefined,
  fallback = "/", // 로그인·가입확인 후 착지(홈). `/lessons` 인덱스는 아직 없음(404) → 홈으로.
): string {
  if (!raw || !raw.startsWith("/")) return fallback;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return fallback; // 프로토콜-상대·백슬래시
  if (raw !== raw.trim() || hasControlChar(raw)) return fallback; // 공백·제어문자
  return raw;
}
