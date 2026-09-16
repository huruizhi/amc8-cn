"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Flag,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { HistogramOption } from "@/components/histogram-option";
import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { Question } from "@/lib/content/questions";
import { getModelContext } from "@/lib/webmcp";

const reportTypes = ["翻译", "公式", "图形", "答案", "解析", "分类"];

function saveLocalReport(questionId: string, type: string, detail: string) {
  const key = "amc8-cn-pending-reports";
  const current = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown[];
  current.push({ questionId, type, detail, createdAt: new Date().toISOString() });
  window.localStorage.setItem(key, JSON.stringify(current));
}

export function QuestionPractice({
  question,
  publishedNumbers,
  queue,
}: {
  question: Question;
  publishedNumbers: number[];
  queue: { id: string; year: number; number: number }[];
}) {
  const { progress, submit, reveal } = useProgress();
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [englishOpen, setEnglishOpen] = useState(false);
  const [reportType, setReportType] = useState("翻译");
  const [reportDetail, setReportDetail] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  useEffect(() => {
    setSelected("");
    setSubmitted(null);
    setShowSolution(false);
    setEnglishOpen(false);
  }, [question.id]);

  const record = progress.questions[question.id];
  const isCorrect = submitted === question.answer;
  const index = publishedNumbers.indexOf(question.number);
  const queueIndex = queue.findIndex((item) => item.id === question.id);
  const previousQuestion =
    queueIndex > 0
      ? queue[queueIndex - 1]
      : index > 0
        ? { year: question.year, number: publishedNumbers[index - 1] }
        : null;
  const nextQuestion =
    queueIndex >= 0 && queueIndex < queue.length - 1
      ? queue[queueIndex + 1]
      : queue.length === 0 && index >= 0 && index < publishedNumbers.length - 1
        ? { year: question.year, number: publishedNumbers[index + 1] }
        : null;
  const queueParam = queue.length
    ? `?queue=${queue.map((item) => item.id).join(",")}`
    : "";
  const historyLabel = useMemo(() => {
    if (!record?.firstAttempt && !record?.viewedAnswerAt) return null;
    if (record.corrected) return "已订正";
    if (record.firstAttempt?.correct) return "首次答对";
    if (record.viewedAnswerAt && !record.firstAttempt) return "已查看答案";
    return "待订正";
  }, [record]);

  function handleSubmit() {
    if (!selected || submitted) return;
    submit(question.id, selected, selected === question.answer);
    setSubmitted(selected);
    setShowSolution(false);
  }

  function handleReveal() {
    if (!submitted) return;
    reveal(question.id);
    setShowSolution(true);
  }

  function handleRedo() {
    setSelected("");
    setSubmitted(null);
    setShowSolution(false);
  }

  useEffect(() => {
    const context = getModelContext();
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    const register = (tool: Parameters<typeof context.registerTool>[0]) => {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch((error) => console.warn("WebMCP tool registration failed", error));
      } catch (error) {
        console.warn("WebMCP tool registration failed", error);
      }
    };

    register({
      name: "read_amc8_question_state",
      title: "读取当前 AMC 8 题目状态",
      description: "读取当前题目的编号、选项和作答状态，不会改变学习进度。",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute() {
        return {
          questionId: question.id,
          year: question.year,
          number: question.number,
          selectedAnswer: selected || null,
          submittedAnswer: submitted,
          solutionVisible: showSolution,
        };
      },
    });

    register({
      name: "submit_amc8_answer",
      title: "提交当前 AMC 8 题目的答案",
      description: "选择并提交当前题目的一个选项，同时更新页面和本机学习进度。",
      inputSchema: {
        type: "object",
        properties: {
          answer: { type: "string", enum: ["A", "B", "C", "D", "E"] },
        },
        required: ["answer"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const answer =
          typeof input === "object" && input !== null && "answer" in input
            ? (input as { answer?: unknown }).answer
            : undefined;
        if (typeof answer !== "string" || !["A", "B", "C", "D", "E"].includes(answer)) {
          throw new Error("answer 必须是 A、B、C、D 或 E。");
        }
        if (submitted) {
          throw new Error("当前题目已经提交；请先在页面中选择重做。 ");
        }
        submit(question.id, answer, answer === question.answer);
        setSelected(answer);
        setSubmitted(answer);
        setShowSolution(false);
        return {
          questionId: question.id,
          submittedAnswer: answer,
          correct: answer === question.answer,
          solutionVisible: false,
          nextAction: "提交完成；现在可以调用 reveal_amc8_solution 查看答案与解析。",
        };
      },
    });

    register({
      name: "reveal_amc8_solution",
      title: "查看当前 AMC 8 题目的答案与解析",
      description: "仅在当前题目已经提交答案后，显示正确答案与双语解析。",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute() {
        if (!submitted) {
          throw new Error("请先提交当前题目的答案，再查看答案与解析。");
        }
        reveal(question.id);
        setShowSolution(true);
        return {
          questionId: question.id,
          correctAnswer: question.answer,
          solutionVisible: true,
        };
      },
    });

    return () => lifecycle.abort();
  }, [question, record?.firstAttempt, reveal, selected, showSolution, submit, submitted]);

  async function handleReport() {
    const detail = reportDetail.trim();
    if (!detail || reportSubmitting) return;
    setReportSubmitting(true);
    setReportMessage("");

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ questionId: question.id, type: reportType, detail }),
      });
      if (!response.ok) throw new Error("report request failed");
      setReportMessage("已匿名提交，谢谢你的反馈。");
    } catch {
      saveLocalReport(question.id, reportType, detail);
      setReportMessage("提交服务暂不可用，报告已安全保存在当前浏览器，可稍后重试。");
    } finally {
      setReportSubmitting(false);
      setReportSent(true);
    }
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link href="/years" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" />
          返回年份列表
        </Link>
        {historyLabel ? <Badge variant="outline">{historyLabel}</Badge> : null}
      </div>

      <div className="grid gap-5 xl:grid-cols-[190px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-border bg-card p-4 shadow-sm xl:sticky xl:top-24 xl:self-start">
          <p className="mb-3 font-serif text-lg font-bold text-ink">{question.year} AMC 8</p>
          <div className="scrollbar-none grid max-h-28 grid-flow-col grid-rows-2 gap-2 overflow-x-auto pb-2 xl:max-h-none xl:grid-flow-row xl:grid-cols-5 xl:overflow-visible">
            {Array.from({ length: 25 }, (_, indexValue) => indexValue + 1).map((number) => {
              const published = publishedNumbers.includes(number);
              const active = number === question.number;
              const numberRecord = progress.questions[`${question.year}-${String(number).padStart(2, "0")}`];
              const answered = numberRecord?.firstAttempt || numberRecord?.viewedAnswerAt;
              if (!published) {
                return (
                  <span
                    key={number}
                    className="grid size-8 place-items-center rounded-lg border border-dashed border-border text-xs text-muted-foreground/45"
                    aria-label={`第 ${number} 题待发布`}
                  >
                    {number}
                  </span>
                );
              }
              return (
                <Link
                  key={number}
                  href={`/practice/${question.year}/${number}`}
                  className={`grid size-8 place-items-center rounded-lg border text-xs font-semibold transition-colors ${
                    active
                      ? "border-primary bg-primary text-white"
                      : answered
                        ? "border-teal/30 bg-teal-soft text-teal-ink"
                        : "border-border bg-white hover:border-primary/40"
                  }`}
                  aria-label={`打开第 ${number} 题`}
                >
                  {number}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 hidden border-t border-border pt-4 text-xs leading-5 text-muted-foreground xl:block">
            选择题号可在当前年度的 25 道真题之间快速切换。
          </div>
        </aside>

        <article className="overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_18px_50px_rgba(16,46,74,0.08)]">
          <header className="border-b border-border bg-secondary/45 px-5 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-teal">
                  {queueIndex >= 0
                    ? `专项练习 ${queueIndex + 1} / ${queue.length}`
                    : `${question.year} AMC 8`}
                </p>
                <h1 className="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl">第 {question.number} 题</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-teal-soft text-teal-ink hover:bg-teal-soft">{question.primaryTopic}</Badge>
                {question.skills.slice(0, 2).map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
                <Badge className="bg-amber/20 text-[#8a5708] hover:bg-amber/20">难度 {question.difficulty}</Badge>
              </div>
            </div>
          </header>

          <div className="p-5 sm:p-8">
            <div className="max-w-3xl text-[17px] leading-8 text-foreground sm:text-lg">
              <p>{question.promptZh}</p>
              {question.expression ? (
                <div className="my-6 rounded-xl bg-secondary/60 px-4 py-5 text-center font-serif text-xl font-semibold leading-10 text-ink sm:text-2xl">
                  {question.expression.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              ) : null}
              {question.figure ? (
                <figure className="my-6 flex justify-center rounded-2xl border border-border bg-white p-4 sm:p-6">
                  <img
                    src={question.figure.src}
                    alt={question.figure.altZh}
                    className="h-auto max-h-[390px] w-auto max-w-full object-contain"
                  />
                </figure>
              ) : null}
            </div>

            <RadioGroup
              value={selected}
              onValueChange={setSelected}
              className={`mt-7 grid gap-3 ${question.options.some((option) => option.histogram) ? "lg:grid-cols-2" : "sm:grid-cols-2"}`}
              disabled={Boolean(submitted)}
              aria-label="答案选项"
            >
              {question.options.map((option) => {
                const chosen = selected === option.label;
                const showCorrect = showSolution && option.label === question.answer;
                const showWrong = Boolean(submitted) && chosen && option.label !== question.answer;
                return (
                  <label
                    key={option.label}
                    className={`flex cursor-pointer flex-col rounded-2xl border p-4 transition-colors ${
                      showCorrect
                        ? "border-teal bg-teal-soft/70"
                        : showWrong
                          ? "border-coral bg-coral-soft"
                          : chosen
                            ? "border-primary bg-primary/5"
                            : "border-border bg-white hover:border-primary/35"
                    } ${submitted ? "cursor-default" : ""}`}
                  >
                    <span className="flex items-center gap-3">
                      <RadioGroupItem value={option.label} aria-label={`选择 ${option.label}`} />
                      <span className="grid size-8 place-items-center rounded-lg bg-secondary font-serif font-bold text-ink">
                        {option.label}
                      </span>
                      <span className="text-base font-medium">{option.valueZh}</span>
                      {showCorrect ? <CheckCircle2 className="ml-auto size-5 text-teal" /> : null}
                      {showWrong ? <AlertCircle className="ml-auto size-5 text-coral" /> : null}
                    </span>
                    <HistogramOption option={option} />
                  </label>
                );
              })}
            </RadioGroup>

            {submitted ? (
              <div
                className={`mt-5 flex items-start gap-3 rounded-2xl border p-4 ${
                  isCorrect ? "border-teal/25 bg-teal-soft" : "border-coral/25 bg-coral-soft"
                }`}
                role="status"
              >
                {isCorrect ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal" />
                ) : (
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-coral" />
                )}
                <div>
                  <p className="font-semibold text-ink">
                    {isCorrect
                      ? "回答正确"
                      : showSolution
                        ? `回答错误，正确选项是 ${question.answer}`
                        : "回答错误，可查看答案与解析"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">首次作答会用于掌握度；后续重做结果用于判断是否已经订正。</p>
                </div>
              </div>
            ) : null}

            <Collapsible open={englishOpen} onOpenChange={setEnglishOpen} className="mt-6 rounded-2xl border border-border bg-secondary/35">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-ink">
                <span>{englishOpen ? "收起英文原题" : "查看英文原题"}</span>
                <ChevronDown className={`size-4 transition-transform ${englishOpen ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t border-border px-4 py-4 text-sm leading-7 text-muted-foreground">
                <p>{question.promptEn}</p>
                {question.options.some((option) => option.valueEn) ? (
                  <ul className="mt-3 space-y-1">
                    {question.options.map((option) => (
                      <li key={option.label}><strong>{option.label}.</strong> {option.valueEn ?? option.valueZh}</li>
                    ))}
                  </ul>
                ) : null}
              </CollapsibleContent>
            </Collapsible>

            {showSolution ? (
              <section className="mt-6 rounded-2xl border border-teal/20 bg-[#f4fbfa] p-5 sm:p-6" aria-labelledby="solution-title">
                <div className="flex items-center justify-between gap-4">
                  <h2 id="solution-title" className="font-serif text-xl font-bold text-ink">中文解析</h2>
                  <Badge variant="outline">答案 {question.answer}</Badge>
                </div>
                <ol className="mt-4 space-y-3 text-base leading-7 text-foreground">
                  {question.solutionZh.map((line, solutionIndex) => (
                    <li key={line} className="flex gap-3">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-teal text-xs font-bold text-white">{solutionIndex + 1}</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ol>
                <details className="mt-5 border-t border-teal/15 pt-4 text-sm text-muted-foreground">
                  <summary className="cursor-pointer font-semibold text-teal-ink">查看英文原解析</summary>
                  <div className="mt-3 space-y-2 leading-6">
                    {question.solutionEn.map((line) => <p key={line}>{line}</p>)}
                  </div>
                </details>
              </section>
            ) : null}

            <footer className="mt-7 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <Dialog onOpenChange={(open) => {
                  if (!open) {
                    setReportSent(false);
                    setReportMessage("");
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm"><Flag className="size-4" />报告问题</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>报告 {question.year} AMC 8 · 第 {question.number} 题的问题</DialogTitle>
                      <DialogDescription>选择问题类型并补充说明；无需登录或填写个人信息。</DialogDescription>
                    </DialogHeader>
                    {reportSent ? (
                      <div className="rounded-xl bg-teal-soft p-4 text-sm text-teal-ink">{reportMessage}</div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {reportTypes.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setReportType(type)}
                              className={`rounded-full border px-3 py-1.5 text-sm ${reportType === type ? "border-primary bg-primary text-white" : "border-border bg-white"}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                        <Textarea value={reportDetail} onChange={(event) => setReportDetail(event.target.value)} placeholder="请描述你发现的问题" rows={4} />
                        <Button onClick={handleReport} disabled={!reportDetail.trim() || reportSubmitting} className="w-full">
                          {reportSubmitting ? "正在提交…" : "匿名提交报告"}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <a href={question.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary">
                  来源说明 <ExternalLink className="size-3.5" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleReveal}
                  disabled={!submitted || showSolution}
                >
                  {!submitted
                    ? "提交后可查看答案"
                    : showSolution
                      ? "答案与解析已显示"
                      : "查看答案与解析"}
                </Button>
                {submitted ? (
                  <Button variant="outline" onClick={handleRedo}><RotateCcw className="size-4" />重做</Button>
                ) : null}
                <Button onClick={handleSubmit} disabled={!selected || Boolean(submitted)} className="min-w-32 bg-teal text-white hover:bg-teal/90">
                  提交答案
                </Button>
              </div>
            </footer>

            <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
              {previousQuestion ? (
                <Button asChild variant="ghost"><Link href={`/practice/${previousQuestion.year}/${previousQuestion.number}${queueParam}`}><ArrowLeft className="size-4" />上一题</Link></Button>
              ) : <span />}
              {nextQuestion ? (
                <Button asChild variant="ghost"><Link href={`/practice/${nextQuestion.year}/${nextQuestion.number}${queueParam}`}>下一题<ArrowRight className="size-4" /></Link></Button>
              ) : <Button asChild variant="ghost"><Link href="/years">返回年份列表<ArrowRight className="size-4" /></Link></Button>}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
