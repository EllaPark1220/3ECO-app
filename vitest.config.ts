import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Playwright E2E(별도 러너)는 제외
    exclude: ["**/node_modules/**", "**/tests/e2e/**", "**/.next/**"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      // Next 전용 "server-only" 가드를 vitest 에서 no-op 으로 대체(서버 모듈 단위 테스트용)
      "server-only": fileURLToPath(
        new URL("./test/server-only-stub.ts", import.meta.url),
      ),
    },
  },
});
