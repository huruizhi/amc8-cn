"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  availableYears,
  formatLabels,
  questions,
  topicLabels,
} from "@/lib/content/questions";
import { buildPracticeSet } from "@/lib/domain/question-catalog.js";

const skillLabels = ["计算", "建模", "找规律", "逻辑推理", "分类枚举", "空间想象"];

function toggleValue<T>(values: T[], value: T, checked: boolean) {
  return checked ? [...values, value] : values.filter((item) => item !== value);
}

export default function CustomPracticePage() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic");
  const initialSkill = searchParams.get("skill");
  const initialDifficulty = Number(searchParams.get("difficulty"));
  const { progress } = useProgress();
  const [topics, setTopics] = useState<string[]>(
    initialTopic && topicLabels.includes(initialTopic as (typeof topicLabels)[number])
      ? [initialTopic]
      : [],
  );
  const [skills, setSkills] = useState<string[]>(
    initialSkill && skillLabels.includes(initialSkill) ? [initialSkill] : [],
  );
  const [years, setYears] = useState<number[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<number[]>(
    initialDifficulty >= 1 && initialDifficulty <= 5 ? [initialDifficulty] : [],
  );
  const [size, setSize] = useState("10");

  const practiceSet = useMemo(
    () =>
      buildPracticeSet(
        questions,
        progress,
        { topics, skills, formats, years, difficulty },
        { limit: Number(size) },
      ),
    [progress, topics, skills, formats, years, difficulty, size],
  );

  return (
    <div className="mx-auto max-w-[1120px]">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold text-teal">专项练习</p>
        <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">组合一组真正需要的题</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          系统会优先选择未作答的题，其次选择做错且尚未订正的题。同组题目来自历年真题，不含生成题。
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <section className="space-y-5 rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-7">
          <FilterGroup title="数学主题">
            {topicLabels.map((topic) => (
              <FilterCheckbox
                key={topic}
                label={topic}
                checked={topics.includes(topic)}
                onChange={(checked) => setTopics((current) => toggleValue(current, topic, checked))}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="解题能力">
            {skillLabels.map((skill) => (
              <FilterCheckbox
                key={skill}
                label={skill}
                checked={skills.includes(skill)}
                onChange={(checked) => setSkills((current) => toggleValue(current, skill, checked))}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="呈现形式">
            {formatLabels.map((format) => (
              <FilterCheckbox
                key={format}
                label={format}
                checked={formats.includes(format)}
                onChange={(checked) => setFormats((current) => toggleValue(current, format, checked))}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="难度等级">
            {[1, 2, 3, 4, 5].map((level) => (
              <FilterCheckbox
                key={level}
                label={`难度 ${level}`}
                checked={difficulty.includes(level)}
                onChange={(checked) => setDifficulty((current) => toggleValue(current, level, checked))}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="竞赛年份">
            {availableYears.map((year) => (
              <FilterCheckbox
                key={year}
                label={`${year}`}
                checked={years.includes(year)}
                onChange={(checked) => setYears((current) => toggleValue(current, year, checked))}
              />
            ))}
          </FilterGroup>

          <div className="border-t border-border pt-5">
            <h2 className="mb-3 font-serif text-lg font-bold text-ink">练习题数</h2>
            <RadioGroup value={size} onValueChange={setSize} className="flex flex-wrap gap-3">
              {["5", "10", "20"].map((value) => (
                <label key={value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium">
                  <RadioGroupItem value={value} />
                  {value} 题
                </label>
              ))}
            </RadioGroup>
          </div>
        </section>

        <aside className="rounded-[24px] border border-primary/15 bg-primary p-6 text-white shadow-[0_18px_45px_rgba(17,63,103,0.16)] lg:sticky lg:top-24 lg:self-start">
          <span className="grid size-11 place-items-center rounded-xl bg-white/10"><Sparkles className="size-5" /></span>
          <h2 className="mt-6 font-serif text-2xl font-bold">已找到 {practiceSet.length} 道题</h2>
          <p className="mt-3 text-sm leading-6 text-white/68">
            当前共 {questions.length} 道已发布真题，2018–2020、2022–2026 八个年度的整卷 25 题均已开放。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {topics.map((topic) => <Badge key={topic} className="bg-white/10 text-white hover:bg-white/10">{topic}</Badge>)}
            {skills.slice(0, 2).map((skill) => <Badge key={skill} className="bg-white/10 text-white hover:bg-white/10">{skill}</Badge>)}
            {formats.slice(0, 2).map((format) => <Badge key={format} className="bg-white/10 text-white hover:bg-white/10">{format}</Badge>)}
          </div>
          {practiceSet[0] ? (
            <Button asChild className="mt-7 w-full bg-teal text-white hover:bg-teal/90">
              <Link
                href={`/practice/${practiceSet[0].year}/${practiceSet[0].number}?queue=${practiceSet.map((question: (typeof questions)[number]) => question.id).join(",")}`}
              >
                开始专项练习 <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <p className="mt-7 rounded-xl bg-white/10 p-3 text-sm text-white/80">没有符合全部条件的已发布题目，请减少筛选条件。</p>
          )}
        </aside>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 font-serif text-lg font-bold text-ink">{title}</legend>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </fieldset>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${checked ? "border-primary bg-primary/5 text-primary" : "border-border bg-white text-foreground hover:border-primary/30"}`}>
      <Checkbox checked={checked} onCheckedChange={(value) => onChange(value === true)} />
      {label}
    </label>
  );
}
