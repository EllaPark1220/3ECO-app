import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        // FR-LES-004 / NF-A11Y-003 / CLAUDE.md 규칙 4 — 14/18/22/28px 4단계
        "a11y-xs": "14px",
        "a11y-s": "18px",
        "a11y-l": "22px",
        "a11y-xl": "28px",
      },
    },
  },
  plugins: [],
};

export default config;
