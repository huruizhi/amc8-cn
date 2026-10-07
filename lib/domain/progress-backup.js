function isPlainObject(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function isAttempt(value) {
  return (
    isPlainObject(value) &&
    typeof value.answer === "string" &&
    typeof value.correct === "boolean" &&
    typeof value.submittedAt === "string" &&
    typeof value.assisted === "boolean"
  );
}

function isQuestionRecord(value) {
  return (
    isPlainObject(value) &&
    (value.firstAttempt === null || isAttempt(value.firstAttempt)) &&
    Array.isArray(value.attempts) &&
    value.attempts.every(isAttempt) &&
    (value.viewedAnswerAt === null ||
      typeof value.viewedAnswerAt === "string") &&
    typeof value.corrected === "boolean"
  );
}

function isLessonRecord(value) {
  return (
    isPlainObject(value) &&
    (value.completedAt === null || typeof value.completedAt === "string") &&
    (value.exercises === undefined ||
      (isPlainObject(value.exercises) &&
        Object.values(value.exercises).every(
          (exercise) =>
            isPlainObject(exercise) &&
            typeof exercise.answer === "string" &&
            typeof exercise.correct === "boolean" &&
            typeof exercise.submittedAt === "string",
        )))
  );
}

function isProgress(value) {
  return (
    isPlainObject(value) &&
    isPlainObject(value.questions) &&
    Object.entries(value.questions).every(
      ([questionId, record]) =>
        /^\d{4}-\d{2}$/.test(questionId) && isQuestionRecord(record),
    ) &&
    (value.lessons === undefined ||
      (isPlainObject(value.lessons) &&
        Object.entries(value.lessons).every(
          ([lessonId, record]) =>
            typeof lessonId === "string" && isLessonRecord(record),
        )))
  );
}

export function exportProgressBackup(progress, options = {}) {
  if (!isProgress(progress)) throw new Error("学习记录无效");
  return JSON.stringify({
    version: 1,
    exportedAt: options.exportedAt ?? new Date().toISOString(),
    progress,
  });
}

export function importProgressBackup(serialized) {
  let backup;
  try {
    backup = JSON.parse(serialized);
  } catch {
    throw new Error("备份内容无效");
  }

  if (!isPlainObject(backup) || backup.version !== 1) {
    throw new Error("无法识别的备份版本");
  }
  if (!isProgress(backup.progress)) {
    throw new Error("备份内容无效");
  }

  const restored = { questions: backup.progress.questions };
  if (backup.progress.lessons) restored.lessons = backup.progress.lessons;
  return restored;
}
