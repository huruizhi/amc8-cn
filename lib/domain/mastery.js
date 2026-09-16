import { getFirstAttemptCorrectness } from "./learning-record.js";

function matchesCategory(question, dimension, value) {
  if (dimension === "topic") {
    return [question.primaryTopic, ...(question.secondaryTopics ?? [])].includes(
      value,
    );
  }
  if (dimension === "skill") return question.skills?.includes(value) ?? false;
  if (dimension === "format") return question.formats?.includes(value) ?? false;
  if (dimension === "difficulty") return question.difficulty === value;
  return false;
}

function difficultyWeight(difficulty) {
  return 1 + (Math.max(1, Math.min(5, difficulty)) - 1) * 0.15;
}

function recencyWeight(record, now) {
  const occurredAt = record.firstAttempt?.submittedAt ?? record.viewedAnswerAt;
  if (!occurredAt || !now) return 1;
  const ageInDays = Math.max(
    0,
    (new Date(now).getTime() - new Date(occurredAt).getTime()) / 86_400_000,
  );
  if (ageInDays <= 30) return 1.2;
  if (ageInDays <= 90) return 1;
  return 0.8;
}

function masteryStatus(score) {
  if (score < 60) return "weak";
  if (score < 80) return "developing";
  return "strong";
}

export function calculateCategoryMastery(catalog, progress, options) {
  const samples = catalog
    .filter((question) =>
      matchesCategory(question, options.dimension, options.value),
    )
    .map((question) => ({
      question,
      record: progress.questions[question.id],
    }))
    .filter(({ record }) => record?.firstAttempt || record?.viewedAnswerAt);

  if (samples.length < 5) {
    return {
      sampleSize: samples.length,
      score: null,
      status: "insufficient",
    };
  }

  let earned = 0;
  let available = 0;
  for (const { question, record } of samples) {
    const weight =
      difficultyWeight(question.difficulty) * recencyWeight(record, options.now);
    available += weight;
    if (getFirstAttemptCorrectness(record) === true) earned += weight;
  }

  const score = Math.round((earned / available) * 100);
  return {
    sampleSize: samples.length,
    score,
    status: masteryStatus(score),
  };
}
