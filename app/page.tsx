"use client";

import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Hash,
  PieChart,
  Sigma,
  Target,
  Triangle,
} from "lucide-react";
import Link from "next/link";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getYearQuestions, questions, type Topic } from "@/lib/content/questions";
import { lessons } from "@/lib/content/lessons";

const topicIcons = {
  几何: Triangle,
  数论: Hash,
  代数: Sigma,
  "计数与组合": PieChart,
} as const;

const topicTones = {
  几何: "coral",
  数论: "blue",
  代数: "teal",
  "计数与组合": "amber",
} as const;

const focusTopics = ["几何", "数论", "代数", "计数与组合"] as const;

export default function HomePage() {
  const { progress, ready } = useProgress();
  const newestQuestions = getYearQuestions(2026);
  const completedNewest = newestQuestions.filter((question) => {
    const record = progress.questions[question.id];
    return record?.firstAttempt || record?.viewedAnswerAt;
  });
  const correctNewest = completedNewest.filter(
    (question) => progress.questions[question.id]?.firstAttempt?.correct,
  );
  const nextQuestion =
    newestQuestions.find((question) => !progress.questions[question.id]) ??
    newestQuestions[0];
  const progressPercent = newestQuestions.length
    ? Math.round((completedNewest.length / newestQuestions.length) * 100)
    : 0;
  const completedLessons = lessons.filter(
    (lesson) => progress.lessons[lesson.id]?.completedAt,
  );
  const nextLesson =
    lessons.find((lesson) => !progress.lessons[lesson.id]?.completedAt) ?? lessons[0];

  return (
    <div className="mx-auto max-w-[1120px]">
      <section className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-teal">学习工作台</p>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {completedNewest.length > 0 ? "今天从哪里继续？" : "从一套真题开始"}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {ready && completedNewest.length > 0
            ? `已完成 ${completedNewest.length} 道 2026 真题`
            : "2026 年整卷 25 题已开放"}
        </p>
      </section>

      <section className="mb-6 overflow-hidden rounded-[28px] border border-primary/10 bg-primary text-primary-foreground shadow-[0_20px_50px_rgba(17,63,103,0.16)]">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div>
            <Badge className="mb-5 rounded-full border-white/15 bg-white/10 px-3 py-1 text-white hover:bg-white/10">
              {completedNewest.length > 0 ? "继续练习" : "推荐开始"}
            </Badge>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">2026 AMC 8</h2>
            <p className="mt-3 max-w-lg text-base leading-7 text-white/72">
              已整理 {newestQuestions.length} 道整卷真题。中文译题优先，随时可以展开英文原题与双语解析。
            </p>
            <Button asChild size="lg" className="mt-6 rounded-xl bg-teal text-white hover:bg-teal/90">
              <Link href={`/practice/${nextQuestion.year}/${nextQuestion.number}`}>
                {completedNewest.length > 0
                  ? `继续第 ${nextQuestion.number} 题`
                  : "开始第 1 题"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 sm:p-6">
            <div className="mb-3 flex items-end justify-between">
              <span className="text-sm text-white/64">2026 整卷进度</span>
              <strong className="font-serif text-2xl">
                {completedNewest.length} / {newestQuestions.length}
              </strong>
            </div>
            <Progress value={progressPercent} className="h-2.5 bg-white/12 [&>div]:bg-amber" />
            <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
              <div>
                <dt className="text-xs text-white/55">首次正确</dt>
                <dd className="mt-1 font-serif text-xl font-bold">
                  {completedNewest.length
                    ? `${Math.round((correctNewest.length / completedNewest.length) * 100)}%`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-white/55">已订正</dt>
                <dd className="mt-1 font-serif text-xl font-bold">
                  {
                    completedNewest.filter(
                      (question) => progress.questions[question.id]?.corrected,
                    ).length
                  }
                </dd>
              </div>
              <div>
                <dt className="text-xs text-white/55">待完成</dt>
                <dd className="mt-1 font-serif text-xl font-bold">
                  {newestQuestions.length - completedNewest.length}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-[24px] border border-teal/20 bg-teal-soft/65 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-teal"><GraduationCap className="size-5" /></span>
            <div>
              <p className="text-sm font-semibold text-teal-ink">四年级自学路线</p>
              <h2 className="mt-1 font-serif text-xl font-bold text-ink">{nextLesson.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">每课都有例题、分步讲解、分层练习和对应真题。已完成 {completedLessons.length} / {lessons.length} 课。</p>
            </div>
          </div>
          <Button asChild variant="outline" className="shrink-0 bg-white"><Link href={`/learn/${nextLesson.id}`}>进入学习路径 <ArrowRight className="size-4" /></Link></Button>
        </div>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-2">
        <article className="group rounded-2xl border border-coral/20 bg-card p-6 shadow-sm transition-transform hover:-translate-y-0.5">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-coral-soft text-coral">
              <Target className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-xl font-bold text-ink">薄弱项练习</h2>
                <ArrowRight className="size-5 text-coral transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                每个分类至少完成 5 道不同真题后，系统才会判断薄弱项。
              </p>
              <Link href="/analysis" className="mt-4 inline-flex text-sm font-semibold text-coral">
                查看数据积累情况 →
              </Link>
            </div>
          </div>
        </article>

        <article className="group rounded-2xl border border-teal/20 bg-card p-6 shadow-sm transition-transform hover:-translate-y-0.5">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-soft text-teal">
              <BookOpen className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-xl font-bold text-ink">自选专项练习</h2>
                <ArrowRight className="size-5 text-teal transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                每天一组混合练习，也可以按主题、能力、难度和年份组合真题。
              </p>
              <Link href="/practice" className="mt-4 inline-flex text-sm font-semibold text-teal-ink">
                进入练习中心 →
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal">按主题浏览</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-ink">找到想强化的数学主题</h2>
          </div>
          <Link href="/analysis" className="text-sm font-semibold text-primary hover:text-teal">
            查看完整学习分析 →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {focusTopics.map((name) => {
            const Icon = topicIcons[name];
            const count = questions.filter(
              (question) =>
                question.primaryTopic === name ||
                question.secondaryTopics?.includes(name as Topic),
            ).length;
            return (
              <Link
                key={name}
                href={`/custom?topic=${encodeURIComponent(name)}`}
                className="topic-card rounded-2xl border border-border/80 bg-secondary/45 p-4 transition-colors hover:border-primary/25 hover:bg-secondary"
                data-tone={topicTones[name]}
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="topic-icon grid size-10 place-items-center rounded-xl">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xs text-muted-foreground">已发布 {count} 题</span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-lg font-bold text-ink">{name}</h3>
                  <span className="text-xs font-semibold text-muted-foreground">开始练习</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
