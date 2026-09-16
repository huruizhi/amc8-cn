"use client";

import { ArrowRight, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { availableYears, getYearQuestions } from "@/lib/content/questions";

export default function YearsPage() {
  const { progress } = useProgress();

  return (
    <div className="mx-auto max-w-[1080px]">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold text-teal">历年真题</p>
        <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">按年份保持原题顺序练习</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          2018–2020、2022–2026 年整卷各 25 题已经开放，可按年份连续练习，也可跨年度筛选同类题。
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {availableYears.map((year) => {
          const yearQuestions = getYearQuestions(year);
          const completed = yearQuestions.filter((question) => {
            const record = progress.questions[question.id];
            return record?.firstAttempt || record?.viewedAnswerAt;
          });
          const next =
            yearQuestions.find((question) => !progress.questions[question.id]) ??
            yearQuestions[0];
          const percent = yearQuestions.length
            ? Math.round((completed.length / yearQuestions.length) * 100)
            : 0;

          return (
            <article key={year} className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary text-white">
                  <FileText className="size-5" />
                </span>
                <Badge variant="outline">{yearQuestions.length} 道已发布</Badge>
              </div>
              <h2 className="mt-7 font-serif text-2xl font-bold text-ink">{year} AMC 8</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                已完成 {completed.length} 道，保持原试卷题号顺序。
              </p>
              <Progress value={percent} className="mt-5 h-2 [&>div]:bg-teal" />
              <div className="mt-6 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-3.5" />
                  {percent}%
                </span>
                <Link
                  href={`/practice/${next.year}/${next.number}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-teal"
                >
                  {completed.length ? "继续练习" : "开始练习"}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-6 rounded-2xl border border-dashed border-border bg-secondary/40 p-5 text-sm leading-6 text-muted-foreground">
        2021 年资料当前缺失，因此暂不显示。其他年份会从较新的试卷开始分批整理、核对和发布。
      </section>
    </div>
  );
}
