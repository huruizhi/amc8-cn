import assert from "node:assert/strict";
import test from "node:test";

import { calculateCategoryMastery } from "../lib/domain/mastery.js";

const geometryQuestions = [1, 2, 3, 4, 5].map((difficulty) => ({
  id: `geometry-${difficulty}`,
  status: "published",
  primaryTopic: "几何",
  secondaryTopics: [],
  skills: ["空间想象"],
  difficulty,
}));

function attempt(correct, submittedAt = "2026-09-15T08:00:00.000Z") {
  return {
    firstAttempt: { correct, submittedAt, assisted: false },
    attempts: [],
    viewedAnswerAt: null,
    corrected: false,
  };
}

test("不足五道不同真题时不判定薄弱项", () => {
  const progress = {
    questions: {
      "geometry-1": attempt(false),
      "geometry-2": attempt(false),
      "geometry-3": attempt(false),
      "geometry-4": attempt(false),
    },
  };

  assert.deepEqual(
    calculateCategoryMastery(geometryQuestions, progress, {
      dimension: "topic",
      value: "几何",
      now: "2026-09-16T08:00:00.000Z",
    }),
    {
      sampleSize: 4,
      score: null,
      status: "insufficient",
    },
  );
});

test("掌握度采用首次作答并按难度加权", () => {
  const progress = {
    questions: {
      "geometry-1": attempt(false),
      "geometry-2": attempt(false),
      "geometry-3": attempt(true),
      "geometry-4": attempt(true),
      "geometry-5": attempt(true),
    },
  };

  assert.deepEqual(
    calculateCategoryMastery(geometryQuestions, progress, {
      dimension: "topic",
      value: "几何",
      now: "2026-09-16T08:00:00.000Z",
    }),
    {
      sampleSize: 5,
      score: 67,
      status: "developing",
    },
  );
});

test("直接查看答案会作为尚未掌握的样本", () => {
  const progress = {
    questions: Object.fromEntries(
      geometryQuestions.map((question) => [
        question.id,
        {
          firstAttempt: null,
          attempts: [],
          viewedAnswerAt: "2026-09-15T08:00:00.000Z",
          corrected: false,
        },
      ]),
    ),
  };

  assert.deepEqual(
    calculateCategoryMastery(geometryQuestions, progress, {
      dimension: "topic",
      value: "几何",
      now: "2026-09-16T08:00:00.000Z",
    }),
    {
      sampleSize: 5,
      score: 0,
      status: "weak",
    },
  );
});
