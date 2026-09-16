function emptyQuestionRecord() {
  return {
    firstAttempt: null,
    attempts: [],
    viewedAnswerAt: null,
    corrected: false,
  };
}

export function submitAnswer(progress, submission) {
  const previous =
    progress.questions[submission.questionId] ?? emptyQuestionRecord();
  const attempt = {
    answer: submission.answer,
    correct: submission.correct,
    submittedAt: submission.submittedAt,
    assisted: Boolean(previous.viewedAnswerAt && !previous.firstAttempt),
  };
  const firstAttempt = previous.firstAttempt ?? attempt;
  const wasUnmastered =
    Boolean(previous.viewedAnswerAt) || firstAttempt.correct === false;

  return {
    ...progress,
    questions: {
      ...progress.questions,
      [submission.questionId]: {
        ...previous,
        firstAttempt,
        attempts: [...previous.attempts, attempt],
        corrected:
          previous.corrected || (wasUnmastered && submission.correct === true),
      },
    },
  };
}

export function revealAnswer(progress, questionId, revealedAt) {
  const previous = progress.questions[questionId] ?? emptyQuestionRecord();

  return {
    ...progress,
    questions: {
      ...progress.questions,
      [questionId]: {
        ...previous,
        viewedAnswerAt: previous.viewedAnswerAt ?? revealedAt,
      },
    },
  };
}

export function getFirstAttemptCorrectness(record) {
  if (!record) return undefined;
  if (record.viewedAnswerAt && !record.firstAttempt) return false;
  if (!record.firstAttempt) return undefined;
  if (record.firstAttempt.assisted) return false;
  return record.firstAttempt.correct;
}
