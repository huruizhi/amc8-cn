import { notFound } from "next/navigation";

import { LessonDetail } from "@/components/lesson-detail";
import { getLesson } from "@/lib/content/lessons";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();

  return <LessonDetail lesson={lesson} />;
}
