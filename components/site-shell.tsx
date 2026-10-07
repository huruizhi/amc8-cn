"use client";

import {
  BarChart3,
  CheckCircle2,
  FileText,
  GraduationCap,
  Home,
  RotateCcw,
  Target,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";

const navigation = [
  { label: "首页", icon: Home, href: "/" },
  { label: "学习路径", icon: GraduationCap, href: "/learn" },
  { label: "练习中心", icon: Target, href: "/practice" },
  { label: "按年份", icon: FileText, href: "/years" },
  { label: "学习分析", icon: BarChart3, href: "/analysis" },
  { label: "错题本", icon: RotateCcw, href: "/mistakes" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary font-serif text-lg font-bold text-primary-foreground shadow-[0_8px_24px_rgba(17,63,103,0.18)]">
              8
            </span>
            <span className="truncate font-serif text-lg font-bold tracking-tight text-ink sm:text-xl">
              AMC 8 中文学习站
            </span>
          </Link>
          <Badge variant="outline" className="ml-auto hidden rounded-full px-3 py-1.5 text-xs sm:inline-flex">
            公开试用版
          </Badge>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] border-r border-border/80 px-4 py-7 lg:block">
          <nav aria-label="主要导航" className="space-y-1.5">
            {navigation.map(({ label, icon: Icon, href }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="size-[18px]" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 rounded-2xl border border-teal/15 bg-teal-soft p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-teal-ink">
              <CheckCircle2 className="size-4" />
              数据留在本机
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              作答与掌握度仅保存在当前浏览器，可在学习分析页导出备份。
            </p>
          </div>
        </aside>

        <main id="main" className="paper-grid min-w-0 px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-border bg-card/96 px-2 py-2 backdrop-blur-xl lg:hidden"
        aria-label="移动端导航"
      >
        {navigation.map(({ label, icon: Icon, href }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={label}
              href={href}
              className={`flex min-w-0 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-5" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
