"use client";

import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { questions, topicLabels } from "@/lib/content/questions";
import { lessons } from "@/lib/content/lessons";
import { calculateCategoryMastery } from "@/lib/domain/mastery.js";

const skills = ["计算", "建模", "找规律", "逻辑推理", "分类枚举", "空间想象"];

const statusLabels: Record<string, string> = {
  insufficient: "继续练习",
  weak: "薄弱项",
  developing: "正在形成",
  strong: "掌握良好",
};

export default function AnalysisPage() {
  const { progress, exportBackup, importBackup } = useProgress();
  const [backupMessage, setBackupMessage] = useState("");
  const records = Object.values(progress.questions);
  const answered = records.filter((record) => record.firstAttempt || record.viewedAnswerAt);
  const firstCorrect = answered.filter(
    (record) => record.firstAttempt?.correct && !record.firstAttempt.assisted,
  );
  const corrected = answered.filter((record) => record.corrected);
  const now = new Date().toISOString();
  const completedLessons = lessons.filter(
    (lesson) => progress.lessons[lesson.id]?.completedAt,
  );

  function downloadBackup() {
    const blob = new Blob([exportBackup()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `amc8-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setBackupMessage("进度备份已导出");
  }

  async function handleImport(file: File | undefined) {
    if (!file) return;
    try {
      importBackup(await file.text());
      setBackupMessage("进度已恢复");
    } catch (error) {
      setBackupMessage(error instanceof Error ? error.message : "无法导入进度");
    }
  }

  return (
    <div className="mx-auto max-w-[1120px]">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold text-teal">学习分析</p>
        <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">看见真正需要加强的地方</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          掌握度只采用每道题的首次作答，并结合难度和近期表现。少于 5 道不同真题时不会仓促判断薄弱项。
        </p>
      </header>

      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <MetricCard label="已完成" value={`${answered.length}`} suffix={` / ${questions.length} 题`} />
        <MetricCard
          label="首次正确率"
          value={answered.length ? `${Math.round((firstCorrect.length / answered.length) * 100)}%` : "—"}
          suffix={answered.length ? `${firstCorrect.length} 题首次答对` : "完成题目后显示"}
        />
        <MetricCard label="已订正" value={`${corrected.length}`} suffix="保留首次错误记录" />
      </section>

      <section className="mb-5 flex flex-col gap-4 rounded-[24px] border border-teal/15 bg-teal-soft/65 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-semibold text-teal-ink">学习路径</p>
          <h2 className="mt-1 font-serif text-xl font-bold text-ink">已完成 {completedLessons.length} / {lessons.length} 章</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">完成章节中的分层练习后再标记本章，方便家长了解孩子是否真正走完学习步骤。</p>
        </div>
        <Button asChild variant="outline" className="shrink-0 bg-white"><Link href="/learn">查看学习路径 <ArrowRight className="size-4" /></Link></Button>
      </section>

      <section className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-7">
        <Tabs defaultValue="topic">
          <TabsList className="mb-6 h-auto w-full justify-start overflow-x-auto rounded-xl bg-secondary p-1">
            <TabsTrigger value="topic" className="px-4 py-2.5">数学主题</TabsTrigger>
            <TabsTrigger value="skill" className="px-4 py-2.5">解题能力</TabsTrigger>
            <TabsTrigger value="difficulty" className="px-4 py-2.5">难度等级</TabsTrigger>
          </TabsList>

          <TabsContent value="topic" className="space-y-3">
            {topicLabels.map((topic) => (
              <MasteryRow
                key={topic}
                label={topic}
                href={`/custom?topic=${encodeURIComponent(topic)}`}
                result={calculateCategoryMastery(questions, progress, {
                  dimension: "topic",
                  value: topic,
                  now,
                })}
              />
            ))}
          </TabsContent>

          <TabsContent value="skill" className="space-y-3">
            {skills.map((skill) => (
              <MasteryRow
                key={skill}
                label={skill}
                href={`/custom?skill=${encodeURIComponent(skill)}`}
                result={calculateCategoryMastery(questions, progress, {
                  dimension: "skill",
                  value: skill,
                  now,
                })}
              />
            ))}
          </TabsContent>

          <TabsContent value="difficulty" className="space-y-3">
            {[1, 2, 3, 4, 5].map((difficulty) => (
              <MasteryRow
                key={difficulty}
                label={`难度 ${difficulty}`}
                href={`/custom?difficulty=${difficulty}`}
                result={calculateCategoryMastery(questions, progress, {
                  dimension: "difficulty",
                  value: difficulty,
                  now,
                })}
              />
            ))}
          </TabsContent>
        </Tabs>
      </section>

      <section className="mt-5 grid gap-4 rounded-[24px] border border-teal/15 bg-teal-soft/65 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
        <div className="flex gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-teal"><ShieldCheck className="size-5" /></span>
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">备份当前设备的学习进度</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">备份文件只包含作答、错题和订正记录，不含姓名、邮箱或其他身份信息。</p>
            {backupMessage ? <p className="mt-2 text-sm font-semibold text-teal-ink" role="status">{backupMessage}</p> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button variant="outline" onClick={downloadBackup} className="bg-white"><ArrowDownToLine className="size-4" />导出进度</Button>
          <Button asChild variant="outline" className="bg-white">
            <label htmlFor="progress-file" className="cursor-pointer"><ArrowUpFromLine className="size-4" />导入进度</label>
          </Button>
          <input
            id="progress-file"
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(event) => handleImport(event.target.files?.[0])}
          />
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{suffix}</p>
    </article>
  );
}

function MasteryRow({
  label,
  href,
  result,
}: {
  label: string;
  href: string;
  result: { sampleSize: number; score: number | null; status: string };
}) {
  const score = result.score ?? 0;
  const weak = result.status === "weak";
  return (
    <article className="grid gap-4 rounded-2xl border border-border bg-secondary/30 p-4 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:items-center">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-serif font-bold text-ink">{label}</h3>
          {weak ? <Badge className="bg-coral-soft text-coral hover:bg-coral-soft">薄弱项</Badge> : null}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">已完成 {result.sampleSize} 道不同题</p>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{statusLabels[result.status] ?? result.status}</span>
          <strong className="text-ink">{result.score === null ? "数据不足" : `${result.score}%`}</strong>
        </div>
        <Progress value={score} className={`h-2 ${weak ? "[&>div]:bg-coral" : "[&>div]:bg-teal"}`} />
      </div>
      <Button asChild variant="ghost" size="sm">
        <Link href={href}>练习此类 <ArrowRight className="size-4" /></Link>
      </Button>
    </article>
  );
}
