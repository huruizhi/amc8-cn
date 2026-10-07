"use client";

import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { learningResources, lessons } from "@/lib/content/lessons";

export default function LearnPage() {
  const { progress } = useProgress();
  const completed = lessons.filter((lesson) => progress.lessons[lesson.id]?.completedAt);
  const nextLesson = lessons.find((lesson) => !progress.lessons[lesson.id]?.completedAt) ?? lessons[0];
  const percent = Math.round((completed.length / lessons.length) * 100);

  return (
    <div className="mx-auto max-w-[1120px]">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-teal">AMC 8 学习路径</p>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">先学会方法，再去做真题</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">每一章都包含知识点、例题分步讲解、分层练习和对应真题，适合按自己的节奏学习。</p>
        </div>
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1.5">四年级自学路线</Badge>
      </header>

      <section className="mb-6 overflow-hidden rounded-[28px] border border-primary/10 bg-primary p-6 text-white shadow-[0_20px_50px_rgba(17,63,103,0.16)] sm:p-8">
        <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-white/70"><Sparkles className="size-4 text-amber" />推荐从这里开始</div>
            <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">{nextLesson.title}</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-white/75">{nextLesson.summary}</p>
            <Button asChild className="mt-6 bg-teal text-white hover:bg-teal/90"><Link href={`/learn/${nextLesson.id}`}>{completed.length ? "继续学习" : "开始第一章"}<ArrowRight className="size-4" /></Link></Button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5">
            <div className="flex items-end justify-between"><span className="text-sm text-white/65">学习路径进度</span><strong className="font-serif text-3xl">{completed.length}/{lessons.length}</strong></div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-amber transition-all" style={{ width: `${percent}%` }} /></div>
            <p className="mt-4 text-sm leading-6 text-white/65">完成每章的分层练习后，就可以标记本章完成。进度会保存在当前浏览器。</p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-sm font-semibold text-teal">循序渐进</p><h2 className="mt-1 font-serif text-2xl font-bold text-ink">{lessons.length} 个学习章节</h2></div><span className="text-sm text-muted-foreground">每章约 25–45 分钟 · 练习数量按章节安排</span></div>
        <div className="grid gap-4 md:grid-cols-2">
          {lessons.map((lesson) => {
            const isDone = Boolean(progress.lessons[lesson.id]?.completedAt);
            return (
              <article key={lesson.id} className={`rounded-[24px] border bg-card p-5 shadow-sm transition-transform hover:-translate-y-0.5 sm:p-6 ${isDone ? "border-teal/25" : "border-border"}`}>
                <div className="flex items-start gap-4">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-2xl font-serif text-lg font-bold ${isDone ? "bg-teal-soft text-teal" : "bg-secondary text-primary"}`}>{isDone ? <CheckCircle2 className="size-5" /> : lesson.order}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h3 className="font-serif text-xl font-bold text-ink">{lesson.title}</h3><Badge variant="outline">{lesson.level}</Badge></div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{lesson.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">{lesson.concepts.map((concept) => <span key={concept} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">{concept}</span>)}</div>
                    <div className="mt-5 flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{lesson.minutes} 分钟 · {lesson.exercises.length} 道分层练习</span><Button asChild size="sm" variant={isDone ? "outline" : "default"}><Link href={`/learn/${lesson.id}`}>{isDone ? "复习本章" : "开始学习"}<ArrowRight className="size-3.5" /></Link></Button></div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><BookOpen className="size-5" /></span><div><h2 className="font-serif text-xl font-bold text-ink">更多学习资料</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">外部教材只做资料索引；只有获得授权的内容才会放入站内。</p></div></div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {learningResources.map((resource) => <a key={resource.title} href={resource.href} target="_blank" rel="noreferrer" className="group rounded-2xl border border-border/80 bg-secondary/30 p-4 transition-colors hover:border-primary/30 hover:bg-secondary"><div className="flex items-center justify-between gap-2"><Badge variant="outline">{resource.type}</Badge><ExternalLink className="size-4 text-muted-foreground transition-colors group-hover:text-primary" /></div><h3 className="mt-4 font-semibold text-ink">{resource.title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{resource.description}</p></a>)}
        </div>
      </section>
    </div>
  );
}
