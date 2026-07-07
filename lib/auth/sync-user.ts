// FW-AUTH-004/006 — 확인된 사용자만 public.User 등록. 이메일/카카오 공용. P2002 멱등.
import "server-only";
import type { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/db";

export async function syncConfirmedUser(authUser: User): Promise<void> {
  const email = authUser.email;
  if (!email) throw new Error("auth user missing email");

  // 닉네임은 화이트리스트 후보에서만 추출. 카카오는 Supabase 가 프로필을 metadata 에
  // 넣는 키가 provider 마다 다름(nickname/name/full_name/user_name/preferred_username).
  // 이 5개 외(생일·성별·전화 등)는 절대 읽지 않음 → PII 최소(카카오도 이메일·닉네임만).
  const m = authUser.user_metadata ?? {};
  const nickCandidate = [
    m.nickname,
    m.name,
    m.full_name,
    m.user_name,
    m.preferred_username,
  ].find((v): v is string => typeof v === "string" && v.trim().length > 0);
  const nickname = (nickCandidate || email.split("@")[0]).slice(0, 40);

  try {
    await prisma.user.create({
      data: {
        id: authUser.id, // = auth.users.id (identity linking 시 기존 id 유지)
        email,
        nickname,
        role: "LEARNER",
        // accessibilityMode·mediaPreference·fontSize → CT-DB-002 DB 기본값
      },
    });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") {
      // 같은 계정 재동기화(PK 충돌)면 멱등 skip. 그러나 '다른 id' 가 이메일을 선점한
      // 경우(=identity linking 미작동)를 조용히 넘기면 세션에 대응 User 가 없어 이후 500.
      // → authUser.id 존재 확인 후, 없으면 재던져 콜백이 sync_failed 로 안전 복귀.
      const existing = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { id: true },
      });
      if (existing) return;
      throw new Error(
        `email 이 다른 계정에 선점됨(identity linking 미작동?) authId=${authUser.id}`,
      );
    }
    throw e;
  }
}
