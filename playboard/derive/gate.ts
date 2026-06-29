// 노출 게이트 (스펙 §7.4)
// 로컬/프리뷰 노출, production 기본 비공개(404).
// Vercel 환경 구분: NODE_ENV 대신 VERCEL_ENV 사용(preview도 production NODE_ENV이므로).

export function isEnabled(): boolean {
  const vercelEnv = process.env.VERCEL_ENV; // 'production' | 'preview' | 'development' | undefined(로컬)
  const flag = process.env.PROTOTYPE_ENABLED === "true";
  // 로컬(undefined)·preview·development 자동 노출, production은 플래그로만.
  return vercelEnv !== "production" || flag;
}
