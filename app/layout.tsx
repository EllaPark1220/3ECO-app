import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "경제 판단력 교과서",
  description: "후킹 없는 체계적 경제 학습 — 무료 공공 인프라",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
