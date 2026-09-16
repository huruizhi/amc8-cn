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

function isProgress(value) {
  return (
    isPlainObject(value) &&
    isPlainObject(value.questions) &&
    Object.entries(value.questions).every(
      ([questionId, record]) =>
        /^\d{4}-\d{2}$/.test(questionId) && isQuestionRecord(record),
    )
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

  return { questions: backup.progress.questions };
}
