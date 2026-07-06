// FW-AUTH-004 — 이메일 확인 완료 사용자만 public.User 등록. P2002 멱등(이미 있으면 스킵).
import "server-only";
import type { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/db";

export async function syncConfirmedUser(authUser: User): Promise<void> {
  const email = authUser.email;
  if (!email) throw new Error("auth user missing email");
  const metaNickname =
    typeof authUser.user_metadata?.nickname === "string"
      ? authUser.user_metadata.nickname
      : undefined;
  const nickname = (metaNickname || email.split("@")[0]).slice(0, 40);

  try {
    await prisma.user.create({
      data: {
        id: authUser.id, // = auth.users.id
        email,
        nickname,
        role: "LEARNER",
        // accessibilityMode·mediaPreference·fontSize → CT-DB-002 DB 기본값
      },
    });
  } catch (e) {
    // 이미 존재(PK/email UNIQUE 충돌) → 멱등 스킵. 그 외는 재던짐.
    if ((e as { code?: string }).code === "P2002") return;
    throw e;
  }
}
