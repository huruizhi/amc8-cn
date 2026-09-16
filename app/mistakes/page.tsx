"use client";

import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import Link from "next/link";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { questionsByNewest } from "@/lib/content/questions";

export default function MistakesPage() {
  const { progress } = useProgress();
  const mistakes = questionsByNewest.filter(
    (question) => progress.questions[question.id]?.firstAttempt?.correct === false,
  );
  const pending = mistakes.filter((question) => !progress.questions[question.id]?.corrected);

  return (
    <div className="mx-auto max-w-[980px]">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold text-teal">错题本</p>
        <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">把错误变成已经掌握</h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          首次做错的题会自动保留。重做正确后标记为已订正，但不会抹去原始记录。
        </p>
      </header>

      {mistakes.length === 0 ? (
        <section className="rounded-[24px] border border-dashed border-border bg-card p-10 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-teal-soft text-teal"><CheckCircle2 className="size-6" /></span>
          <h2 className="mt-5 font-serif text-xl font-bold text-ink">错题本还是空的</h2>
          <p className="mt-2 text-sm text-muted-foreground">完成几道真题后，这里会自动整理首次作答错误的题目。</p>
          <Button asChild className="mt-6"><Link href="/years">开始做题 <ArrowRight className="size-4" /></Link></Button>
        </section>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">共 {mistakes.length} 道错题，{pending.length} 道待订正</p>
            <Badge className="bg-coral-soft text-coral hover:bg-coral-soft">待订正 {pending.length}</Badge>
          </div>
          <div className="space-y-3">
            {mistakes.map((question) => {
              const corrected = progress.questions[question.id]?.corrected;
              return (
                <article key={question.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${corrected ? "bg-teal-soft text-teal" : "bg-coral-soft text-coral"}`}>
                    {corrected ? <CheckCircle2 className="size-5" /> : <RotateCcw className="size-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-serif text-lg font-bold text-ink">{question.year} AMC 8 · 第 {question.number} 题</h2>
                      <Badge variant="outline">{question.primaryTopic}</Badge>
                      <Badge variant="outline">难度 {question.difficulty}</Badge>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{question.promptZh}</p>
                  </div>
                  <Button asChild variant={corrected ? "outline" : "default"}>
                    <Link href={`/practice/${question.year}/${question.number}`}>{corrected ? "再次练习" : "立即订正"}<ArrowRight className="size-4" /></Link>
                  </Button>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
