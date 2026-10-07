import assert from "node:assert/strict";
import test from "node:test";

import { evaluateLessonMastery } from "../lib/domain/lesson-mastery.js";

const exercises = ["a", "b", "c", "d", "e"].map((id) => ({ id }));

function records(entries) {
  return Object.fromEntries(
    entries.map(([id, correct]) => [id, { answer: "A", correct, submittedAt: "2026-10-08T08:00:00.000Z" }]),
  );
}

test("章节题目全部未提交时未达标", () => {
  assert.deepEqual(evaluateLessonMastery(exercises), {
    total: 5,
    submitted: 0,
    correct: 0,
    accuracy: 0,
    allSubmitted: false,
    mastered: false,
  });
});

test("部分提交即使已全对也未达标", () => {
  const result = evaluateLessonMastery(exercises, records([["a", true], ["b", true], ["c", true], ["d", true]]));
  assert.equal(result.submitted, 4);
  assert.equal(result.accuracy, 1);
  assert.equal(result.allSubmitted, false);
  assert.equal(result.mastered, false);
});

test("全部提交且恰好八成正确时达标", () => {
  const result = evaluateLessonMastery(exercises, records([["a", true], ["b", true], ["c", true], ["d", true], ["e", false]]));
  assert.equal(result.accuracy, 0.8);
  assert.equal(result.allSubmitted, true);
  assert.equal(result.mastered, true);
});

test("全部提交但低于八成正确时未达标", () => {
  const result = evaluateLessonMastery(exercises, records([["a", true], ["b", true], ["c", true], ["d", false], ["e", false]]));
  assert.equal(result.accuracy, 0.6);
  assert.equal(result.mastered, false);
});
