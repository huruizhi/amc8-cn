"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLesson, type Lesson } from "@/lib/content/lessons";
import { evaluateLessonMastery } from "@/lib/domain/lesson-mastery.js";
import { getQuestion } from "@/lib/content/questions";

export function LessonDetail({ lesson }: { lesson: Lesson }) {
  const { progress, submitLessonExercise, completeLesson } = useProgress();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [completedNow, setCompletedNow] = useState(false);

  const allExercises = [...lesson.exercises, ...(lesson.checkpointExercises ?? [])];
  const storedExerciseRecords = progress.lessons[lesson.id]?.exercises ?? {};
  const answeredCount = allExercises.filter(
    (exercise) => submitted[exercise.id] || storedExerciseRecords[exercise.id],
  ).length;
  const mastery = evaluateLessonMastery(allExercises, {
    ...storedExerciseRecords,
    ...Object.fromEntries(
      Object.entries(submitted).map(([exerciseId]) => [exerciseId, {
        answer: answers[exerciseId] ?? "",
        correct: answers[exerciseId] === allExercises.find((exercise) => exercise.id === exerciseId)?.answer,
        submittedAt: new Date().toISOString(),
      }]),
    ),
  });
  const isComplete = Boolean(progress.lessons[lesson.id]?.completedAt || completedNow);
  const linkedQuestions = useMemo(
    () => lesson.linkedQuestionIds.map((id) => getQuestion(...id.split("-").map(Number) as [number, number])).filter(Boolean),
    [lesson.linkedQuestionIds],
  );
  const prerequisiteLessons = (lesson.prerequisites ?? [])
    .map((id) => getLesson(id))
    .filter((item): item is Lesson => Boolean(item));

  function submitExercise(exerciseId: string) {
    if (!answers[exerciseId]) return;
    setSubmitted((current) => ({ ...current, [exerciseId]: true }));
    const exercise = allExercises.find((item) => item.id === exerciseId);
    if (exercise) {
      submitLessonExercise(lesson.id, exerciseId, answers[exerciseId], answers[exerciseId] === exercise.answer);
    }
  }

  function markComplete() {
    completeLesson(lesson.id);
    setCompletedNow(true);
  }

  return (
    <div className="mx-auto max-w-[980px]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link href="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> 返回学习路径
        </Link>
        {isComplete ? <Badge className="bg-teal-soft text-teal-ink hover:bg-teal-soft"><CheckCircle2 className="mr-1 size-3.5" />已完成</Badge> : null}
      </div>

      <header className="mb-6 overflow-hidden rounded-[28px] border border-primary/10 bg-primary p-6 text-white shadow-[0_18px_50px_rgba(17,63,103,0.16)] sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
          <span>第 {lesson.order} 章</span>
          <span>·</span>
          <span>{lesson.minutes} 分钟</span>
          <Badge className="bg-white/10 text-white hover:bg-white/10">{lesson.level}</Badge>
        </div>
        <h1 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">{lesson.title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/75">{lesson.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {lesson.concepts.map((concept) => <Badge key={concept} className="bg-white/10 text-white hover:bg-white/10">{concept}</Badge>)}
        </div>
      </header>

      {prerequisiteLessons.length ? (
        <section className="mb-5 rounded-[24px] border border-amber/25 bg-amber/10 p-5 sm:p-7">
          <p className="text-sm font-semibold text-[#80520b]">建议先掌握</p>
          <p className="mt-2 text-sm leading-6 text-[#80520b]/80">如果下面的内容还不熟，可以先复习前置章节，再回来学习本章。</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {prerequisiteLessons.map((item) => (
              <Button asChild key={item.id} variant="outline" size="sm" className="border-amber/40 bg-white/70">
                <Link href={`/learn/${item.id}`}>第 {item.order} 章 · {item.title}<ArrowRight className="size-3.5" /></Link>
              </Button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-5 rounded-[24px] border border-teal/15 bg-teal-soft/70 p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-teal"><Lightbulb className="size-5" /></span>
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">这一章学会什么</h2>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-3">
              {lesson.goals.map((goal) => <li key={goal} className="flex gap-2"><span className="text-teal">✓</span>{goal}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {lesson.keyPoints?.length ? (
        <section className="mb-5 rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-7">
          <p className="text-sm font-semibold text-teal">先记住这些</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {lesson.keyPoints.map((point) => (
              <article key={point.term} className="rounded-2xl bg-secondary/45 p-4">
                <h2 className="font-semibold text-ink">{point.term}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{point.explanation}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-5 rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-7">
        <p className="text-sm font-semibold text-teal">第一步 · 看懂例题</p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-ink">{lesson.example.title}</h2>
        <p className="mt-4 text-base leading-8 text-foreground">{lesson.example.prompt}</p>
        <div className="mt-5 space-y-3">
          {lesson.example.steps.map((step, index) => (
            <div key={step} className="flex gap-3 rounded-xl bg-secondary/55 p-4 text-sm leading-6">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm font-semibold text-[#80520b]">答案：{lesson.example.answer}</p>
      </section>

      <section className="mb-5 rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal">第二步 · 试一试</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-ink">分层练习</h2>
          </div>
          <span className="text-sm text-muted-foreground">已提交 {answeredCount} / {allExercises.length} · 正确率 {Math.round(mastery.accuracy * 100)}%</span>
        </div>
        <div className="space-y-5">
          {allExercises.map((exercise, index) => {
            const storedRecord = storedExerciseRecords[exercise.id];
            const isSubmitted = Boolean(submitted[exercise.id] || storedRecord);
            const selectedAnswer = answers[exercise.id] ?? storedRecord?.answer;
            const isCorrect = storedRecord?.correct ?? selectedAnswer === exercise.answer;
            const isCheckpoint = index >= lesson.exercises.length;
            const exerciseLevel = isCheckpoint ? "学完检查" : (exercise.level ?? (index < 3 ? "基础" : "提升"));
            return (
              <article key={exercise.id} className="rounded-2xl border border-border/80 bg-secondary/25 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold leading-7 text-ink">{index + 1}. {exercise.prompt}</p>
                  <Badge variant="outline" className="shrink-0">{exerciseLevel}</Badge>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {exercise.options.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => !isSubmitted && setAnswers((current) => ({ ...current, [exercise.id]: item.label }))}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${selectedAnswer === item.label ? "border-primary bg-primary/10 text-primary" : "border-border bg-white hover:border-primary/40"} ${isSubmitted && item.label === exercise.answer ? "border-teal bg-teal-soft text-teal-ink" : ""}`}
                    >
                      <span className="mr-2 font-semibold">{item.label}.</span>{item.value}
                    </button>
                  ))}
                </div>
                {!isSubmitted ? (
                  <Button className="mt-4" size="sm" onClick={() => submitExercise(exercise.id)} disabled={!answers[exercise.id]}>提交这题</Button>
                ) : (
                  <div className={`mt-4 rounded-xl p-4 text-sm leading-6 ${isCorrect ? "bg-teal-soft text-teal-ink" : "bg-coral-soft text-coral"}`}>
                    <p className="font-semibold">{isCorrect ? "答对了！" : `再想一想，正确答案是 ${exercise.answer}。`}</p>
                    <p className="mt-1">{exercise.explanation}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="mb-5 rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal">第三步 · 迁移练习</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-ink">做几道真实 AMC 8 题</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">把刚学的方法用到正式真题中，遇到不会的题可以先标记，再回来看解析。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {linkedQuestions.map((question) => question ? (
              <Button asChild key={question.id} variant="outline" size="sm">
                <Link href={`/practice/${question.year}/${question.number}`}>{question.year}·{question.number}<ArrowRight className="size-3.5" /></Link>
              </Button>
            ) : null)}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-[24px] border border-primary/15 bg-primary p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="font-semibold">完成本章后，学习路径会记住你的进度。</p>
          <p className="mt-1 text-sm text-white/70">你可以随时回来复习，不会影响真题的首次作答记录。</p>
        </div>
        <Button onClick={markComplete} disabled={!mastery.mastered || isComplete} className="shrink-0 bg-teal text-white hover:bg-teal/90">
          {isComplete ? "本章已完成" : mastery.mastered ? "标记本章完成" : mastery.allSubmitted ? "请订正错题后再完成本章" : `还需完成 ${allExercises.length - answeredCount} 题`}
        </Button>
      </div>
    </div>
  );
}
