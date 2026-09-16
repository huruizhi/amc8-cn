function overlaps(values = [], selected = []) {
  return selected.length === 0 || values.some((value) => selected.includes(value));
}

export function getPublishedQuestion(catalog, questionId) {
  return catalog.find(
    (question) => question.id === questionId && question.status === "published",
  );
}

export function filterPublishedQuestions(catalog, filters = {}) {
  const {
    years = [],
    topics = [],
    skills = [],
    formats = [],
    difficulty = [],
  } = filters;

  return catalog.filter((question) => {
    if (question.status !== "published") return false;
    if (years.length > 0 && !years.includes(question.year)) return false;
    if (
      !overlaps(
        [question.primaryTopic, ...(question.secondaryTopics ?? [])],
        topics,
      )
    ) {
      return false;
    }
    if (!overlaps(question.skills, skills)) return false;
    if (!overlaps(question.formats, formats)) return false;
    if (difficulty.length > 0 && !difficulty.includes(question.difficulty)) {
      return false;
    }

    return true;
  });
}

export function listPublishedYears(catalog) {
  return Array.from(
    new Set(
      catalog
        .filter((question) => question.status === "published")
        .map((question) => question.year),
    ),
  ).sort((left, right) => right - left);
}

function practicePriority(record) {
  if (!record) return 0;
  if (!record.firstAttempt && !record.viewedAnswerAt) return 0;
  if (record.corrected) return 2;
  if (record.viewedAnswerAt || record.firstAttempt?.correct === false) return 1;
  return 3;
}

export function buildPracticeSet(
  catalog,
  progress,
  filters = {},
  options = {},
) {
  const limit = options.limit ?? 10;
  return filterPublishedQuestions(catalog, filters)
    .map((question, catalogIndex) => ({
      question,
      catalogIndex,
      priority: practicePriority(progress.questions[question.id]),
    }))
    .sort(
      (left, right) =>
        left.priority - right.priority ||
        left.catalogIndex - right.catalogIndex,
    )
    .slice(0, limit)
    .map(({ question }) => question);
}
