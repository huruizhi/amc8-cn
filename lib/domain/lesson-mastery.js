const MASTERY_THRESHOLD = 0.8;

function isSubmitted(record) {
  return Boolean(record?.submittedAt);
}

export function evaluateLessonMastery(exercises, records = {}) {
  const total = exercises.length;
  const submitted = exercises.filter((exercise) =>
    isSubmitted(records[exercise.id]),
  ).length;
  const correct = exercises.filter(
    (exercise) =>
      isSubmitted(records[exercise.id]) && records[exercise.id].correct === true,
  ).length;
  const accuracy = submitted === 0 ? 0 : correct / submitted;
  const allSubmitted = submitted === total;

  return {
    total,
    submitted,
    correct,
    accuracy,
    allSubmitted,
    mastered: allSubmitted && accuracy >= MASTERY_THRESHOLD,
  };
}

export { MASTERY_THRESHOLD };
