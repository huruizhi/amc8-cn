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

function daySeed(value) {
  return Array.from(value).reduce(
    (seed, character) => (seed * 31 + character.charCodeAt(0)) % 1000003,
    7,
  );
}

function questionSeed(questionId, dateKey) {
  return daySeed(`${dateKey}:${questionId}`);
}

/**
 * Builds a deterministic daily set. Priority keeps unfinished or unmastered
 * questions near the front while the date seed changes the mix each day.
 */
export function buildDailyPracticeSet(
  catalog,
  progress,
  options = {},
) {
  const limit = options.limit ?? 8;
  const dateKey = options.dateKey ?? new Date().toISOString().slice(0, 10);
  const candidates = filterPublishedQuestions(catalog)
    .map((question, catalogIndex) => ({
      question,
      catalogIndex,
      priority: practicePriority(progress.questions[question.id]),
      seed: questionSeed(question.id, dateKey),
    }))
    .sort(
      (left, right) =>
        left.priority - right.priority ||
        left.seed - right.seed ||
        left.catalogIndex - right.catalogIndex,
    );

  const topicBuckets = new Map();
  for (const candidate of candidates) {
    const bucket = topicBuckets.get(candidate.question.primaryTopic) ?? [];
    bucket.push(candidate);
    topicBuckets.set(candidate.question.primaryTopic, bucket);
  }
  const topics = [...topicBuckets.keys()].sort(
    (left, right) =>
      questionSeed(left, dateKey) - questionSeed(right, dateKey),
  );
  const selected = [];
  let topicIndex = 0;
  while (selected.length < limit && topics.length > 0) {
    const topic = topics[topicIndex % topics.length];
    const bucket = topicBuckets.get(topic);
    const next = bucket?.shift();
    if (next) selected.push(next.question);
    if (!bucket?.length) {
      topics.splice(topicIndex % topics.length, 1);
      if (topics.length === 0) break;
      topicIndex %= topics.length;
    } else {
      topicIndex = (topicIndex + 1) % topics.length;
    }
  }

  return selected;
}
