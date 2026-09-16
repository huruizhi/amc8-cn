import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPracticeSet,
  filterPublishedQuestions,
  listPublishedYears,
  getPublishedQuestion,
} from "../lib/domain/question-catalog.js";

const catalog = [
  {
    id: "2026-01",
    year: 2026,
    number: 1,
    status: "published",
    primaryTopic: "算术",
    skills: ["计算"],
    formats: ["文字应用题"],
    difficulty: 1,
  },
  {
    id: "2026-02",
    year: 2026,
    number: 2,
    status: "draft",
    primaryTopic: "几何",
    skills: ["空间想象"],
    formats: ["几何图"],
    difficulty: 2,
  },
  {
    id: "2025-13",
    year: 2025,
    number: 13,
    status: "published",
    primaryTopic: "数据与统计",
    secondaryTopics: ["算术"],
    skills: ["建模", "逻辑推理"],
    formats: ["统计图"],
    difficulty: 4,
  },
];

test("题目目录只返回已经发布的指定真题", () => {
  assert.equal(getPublishedQuestion(catalog, "2026-01")?.number, 1);
  assert.equal(getPublishedQuestion(catalog, "2026-02"), undefined);
  assert.equal(getPublishedQuestion(catalog, "missing"), undefined);
});

test("学习者可以组合年份、主题、能力和难度筛选真题", () => {
  assert.deepEqual(
    filterPublishedQuestions(catalog, {
      years: [2025],
      topics: ["数据与统计"],
      skills: ["逻辑推理"],
      difficulty: [3, 4],
    }).map((question) => question.id),
    ["2025-13"],
  );
});

test("次要数学主题也可用于筛选", () => {
  assert.deepEqual(
    filterPublishedQuestions(catalog, { topics: ["算术"] }).map(
      (question) => question.id,
    ),
    ["2026-01", "2025-13"],
  );
});

test("年份目录从已发布真题中自动生成并按新到旧排列", () => {
  const expandedCatalog = [
    ...catalog,
    {
      id: "1985-01",
      year: 1985,
      number: 1,
      status: "published",
      primaryTopic: "算术",
      skills: ["计算"],
      formats: ["文字应用题"],
      difficulty: 1,
    },
    {
      ...catalog[0],
      id: "2025-01",
      year: 2025,
    },
  ];

  assert.deepEqual(listPublishedYears(expandedCatalog), [2026, 2025, 1985]);
});

test("专项练习优先选择未作答，其次选择尚未订正的错题", () => {
  const practiceCatalog = [
    ...catalog,
    {
      id: "2024-04",
      year: 2024,
      number: 4,
      status: "published",
      primaryTopic: "算术",
      skills: ["计算"],
      formats: ["文字应用题"],
      difficulty: 1,
    },
  ];
  const progress = {
    questions: {
      "2026-01": {
        firstAttempt: { correct: true },
        viewedAnswerAt: null,
        corrected: false,
      },
      "2025-13": {
        firstAttempt: { correct: false },
        viewedAnswerAt: null,
        corrected: false,
      },
    },
  };

  assert.deepEqual(
    buildPracticeSet(practiceCatalog, progress, {}, { limit: 3 }).map(
      (question) => question.id,
    ),
    ["2024-04", "2025-13", "2026-01"],
  );
});
