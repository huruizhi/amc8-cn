import { notFound } from "next/navigation";

import { QuestionPractice } from "@/components/question-practice";
import { getQuestion, getYearQuestions } from "@/lib/content/questions";

export default async function PracticeQuestionPage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string; number: string }>;
  searchParams: Promise<{ queue?: string; title?: string }>;
}) {
  const { year: yearValue, number: numberValue } = await params;
  const year = Number(yearValue);
  const number = Number(numberValue);
  const question = getQuestion(year, number);
  const { queue: queueValue, title: queueTitle } = await searchParams;

  if (!question) notFound();

  const queue = (queueValue ?? "")
    .split(",")
    .map((id) => {
      const [itemYear, itemNumber] = id.split("-").map(Number);
      return getQuestion(itemYear, itemNumber);
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <QuestionPractice
      question={question}
      publishedNumbers={getYearQuestions(year).map((item) => item.number)}
      queue={queue.map((item) => ({
        id: item.id,
        year: item.year,
        number: item.number,
      }))}
      queueLabel={queueTitle ?? "专项练习"}
    />
  );
}
