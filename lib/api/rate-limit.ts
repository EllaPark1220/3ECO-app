// CT-API-001 — Rate Limit (Vercel KV / Upstash Redis 기반).
// 지연 초기화: 환경변수(UPSTASH_*)는 IF-KV-001 에서 주입. 빌드 시 인스턴스화하지 않는다.
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitType = "general" | "auth" | "ox";

/** Rate Limit 정책 (req / 1분) — CT-API-001 명세 */
export const RATE_LIMIT_POLICY: Record<RateLimitType, number> = {
  general: 60, // 일반 API: IP 당 분당 60
  auth: 10, //   인증 API: IP 당 분당 10 (사용자 열거 방지)
  ox: 30, //     OX 제출: IP+user 당 분당 30
};

export class RateLimitError extends Error {
  constructor(public readonly reset: number) {
    super("RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";
  }
}

let _limits: Record<RateLimitType, Ratelimit> | null = null;

function getLimits(): Record<RateLimitType, Ratelimit> {
  if (_limits) return _limits;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL/TOKEN 미설정 — IF-KV-001(Vercel KV) 활성화 필요",
    );
  }
  const redis = new Redis({ url, token });
  _limits = {
    general: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(RATE_LIMIT_POLICY.general, "1 m") }),
    auth: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(RATE_LIMIT_POLICY.auth, "1 m") }),
    ox: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(RATE_LIMIT_POLICY.ox, "1 m") }),
  };
  return _limits;
}

/** key(IP 또는 IP+user)에 대해 type 정책으로 Rate Limit 적용 */
export async function enforceRateLimit(key: string, type: RateLimitType) {
  const { success, limit, remaining, reset } = await getLimits()[type].limit(key);
  if (!success) throw new RateLimitError(reset);
  return { limit, remaining, reset };
}
