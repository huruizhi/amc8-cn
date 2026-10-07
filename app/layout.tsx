import type { Metadata } from "next";
import { ProgressProvider } from "@/components/progress-provider";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMC 8 中文学习站",
  description: "面向中文学习者的 AMC 8 学习路径、例题讲解、双语真题与学习分析。",
  robots: {
    index: false,
    follow: false,
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <ProgressProvider>
          <SiteShell>{children}</SiteShell>
        </ProgressProvider>
      </body>
    </html>
  );
}
