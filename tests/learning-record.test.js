import assert from "node:assert/strict";
import test from "node:test";

import {
  getFirstAttemptCorrectness,
  revealAnswer,
  submitAnswer,
} from "../lib/domain/learning-record.js";

test("重做会新增记录但不会改写首次作答", () => {
  const afterFirst = submitAnswer(
    { questions: {} },
    {
      questionId: "2026-01",
      answer: "B",
      correct: false,
      submittedAt: "2026-09-16T08:00:00.000Z",
    },
  );
  const afterRedo = submitAnswer(afterFirst, {
    questionId: "2026-01",
    answer: "C",
    correct: true,
    submittedAt: "2026-09-16T08:05:00.000Z",
  });

  const record = afterRedo.questions["2026-01"];
  assert.equal(record.firstAttempt.answer, "B");
  assert.equal(record.firstAttempt.correct, false);
  assert.equal(record.attempts.length, 2);
  assert.equal(record.corrected, true);
  assert.equal(getFirstAttemptCorrectness(record), false);
});

test("先查看答案再提交时仍视为尚未掌握", () => {
  const afterReveal = revealAnswer(
    { questions: {} },
    "2025-13",
    "2026-09-16T09:00:00.000Z",
  );
  const afterSubmit = submitAnswer(afterReveal, {
    questionId: "2025-13",
    answer: "D",
    correct: true,
    submittedAt: "2026-09-16T09:03:00.000Z",
  });

  const record = afterSubmit.questions["2025-13"];
  assert.equal(record.viewedAnswerAt, "2026-09-16T09:00:00.000Z");
  assert.equal(record.firstAttempt.assisted, true);
  assert.equal(record.corrected, true);
  assert.equal(getFirstAttemptCorrectness(record), false);
});
