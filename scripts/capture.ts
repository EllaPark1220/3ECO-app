// PlayBoard 하이브리드 캡처 파이프라인 (스펙 §8) — 실행은 후순위(Playwright 도입 시).
//
// 사용: 1) dev 서버 기동 (npm run dev — 로컬 자동 노출, PROTOTYPE_ENABLED 불필요)
//       2) npm i -D playwright && npx playwright install chromium  (최초 1회)
//       3) npm run capture
//
// 동작: 각 산출물 화면의 데모 라우트(/playboard/screens/:plane/:slug)를 고정 뷰포트로 열어
//       fullPage 스크린샷을 public/playboard/captures/:plane/:slug.png 로 저장한다.
//
// SoT: 화면 키 목록은 레지스트리(playboard/registry/screens.ts)의 allScreenKeys 에서
//      **직접 파생**한다. 손으로 동기화하는 목록을 두지 않는다(제1원칙).

import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { allScreenKeys } from "../playboard/registry/screens";

const BASE = process.env.PLAYBOARD_BASE ?? "http://localhost:3000";
const VIEWPORT = { width: 1280, height: 900 };

async function main() {
  console.log(`[capture] 레지스트리 파생 화면 ${allScreenKeys.length}개:`);
  for (const k of allScreenKeys) console.log(`  - ${k}`);

  // playwright 는 선택적 devDep(후순위). 정적 타입 의존을 피하려 비리터럴 specifier 로 동적 로드.
  let chromium: { launch: () => Promise<any> };
  try {
    const pw = (await import("playwright" as string)) as { chromium: typeof chromium };
    chromium = pw.chromium;
  } catch {
    console.error(
      "[capture] Playwright 미설치. `npm i -D playwright && npx playwright install chromium` 후 재실행.",
    );
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page: any = await browser.newPage({ viewport: VIEWPORT });

  for (const key of allScreenKeys) {
    const url = `${BASE}/playboard/screens/${key}`;
    const out = resolve("public/playboard/captures", `${key}.png`);
    await mkdir(dirname(out), { recursive: true });
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
      // 개발 인디케이터 숨김 (결과물 오염 방지)
      await page.addStyleTag({
        content: "nextjs-portal,#__next-build-watcher{display:none!important}",
      });
      await page.screenshot({ path: out, fullPage: true });
      console.log(`[capture] ✓ ${key}`);
    } catch (e) {
      console.warn(`[capture] ✗ ${key} — ${(e as Error).message}`);
    }
  }

  await browser.close();
}

main();
