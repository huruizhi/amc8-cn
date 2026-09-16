import type { Metadata } from "next";
import { ProgressProvider } from "@/components/progress-provider";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMC 8 中文真题练习",
  description: "中英双语 AMC 8 历年真题、专项练习与学习分析。",
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
