"use client";

import { ArrowRight, CalendarDays, Shuffle, Target } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { questions, topicLabels } from "@/lib/content/questions";
import {
  buildDailyPracticeSet,
  buildPracticeSet,
} from "@/lib/domain/question-catalog.js";

function queueHref(
  label: string,
  practiceSet: (typeof questions)[number][],
) {
  const first = practiceSet[0];
  if (!first) return "/custom";
  const queue = practiceSet.map((question) => question.id).join(",");
  return `/practice/${first.year}/${first.number}?queue=${queue}&title=${encodeURIComponent(label)}`;
}

export default function PracticeHubPage() {
  const { progress } = useProgress();
  const dateKey = new Date().toISOString().slice(0, 10);
  const dailySet = useMemo(
    () => buildDailyPracticeSet(questions, progress, { dateKey, limit: 8 }),
    [dateKey, progress],
  );
  const topicSets = useMemo(
    () =>
      topicLabels.map((topic) => ({
        topic,
        count: questions.filter(
          (question) =>
            question.primaryTopic === topic || question.secondaryTopics?.includes(topic),
        ).length,
        set: buildPracticeSet(
          questions,
          progress,
          { topics: [topic] },
          { limit: 6 },
        ),
      })),
    [progress],
  );

  return (
    <div className="mx-auto max-w-[1120px]">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold text-teal">练习中心</p>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          每天练一点，把方法变成能力
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          先做当天的混合练习，再按薄弱主题补练。系统会优先安排未作答和还没有掌握的真题。
        </p>
      </header>

      <section className="mb-6 overflow-hidden rounded-[28px] border border-primary/10 bg-primary p-6 text-white shadow-[0_20px_50px_rgba(17,63,103,0.16)] sm:p-8">
        <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <CalendarDays className="size-4 text-amber" />
              {dateKey} · 今日推荐
            </div>
            <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">每日混合练习</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-white/75">
              {dailySet.length} 道不同主题的真题，适合用 15–25 分钟完成。每天打开时会换一组题，已经做错的题会优先回来复习。
            </p>
            <Button asChild className="mt-6 bg-teal text-white hover:bg-teal/90" disabled={!dailySet.length}>
              <Link href={queueHref("每日混合练习", dailySet)}>
                开始今日练习 <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
              <Shuffle className="size-4 text-amber" />
              练习建议
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/70">
              <li>1. 先独立思考，再提交答案。</li>
              <li>2. 做错后读完解析，用自己的话复述方法。</li>
              <li>3. 仍然不熟的主题，回到学习路径复习对应章节。</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal">按主题补练</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-ink">选择一个薄弱主题</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/custom">自定义更多条件 <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topicSets.map(({ topic, count, set }) => (
            <article key={topic} className="rounded-2xl border border-border/80 bg-secondary/25 p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="grid size-10 place-items-center rounded-xl bg-teal-soft text-teal"><Target className="size-5" /></span>
                <Badge variant="outline">{count} 题</Badge>
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-ink">{topic}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">先练 {Math.min(set.length, 6)} 道，系统会优先安排未掌握题目。</p>
              <Button asChild size="sm" variant="outline" className="mt-4 w-full">
                <Link href={queueHref(`${topic}专项练习`, set)}>开始补练 <ArrowRight className="size-3.5" /></Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
