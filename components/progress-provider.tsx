"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  revealAnswer as revealAnswerRecord,
  submitAnswer as submitAnswerRecord,
} from "@/lib/domain/learning-record.js";
import {
  exportProgressBackup,
  importProgressBackup,
} from "@/lib/domain/progress-backup.js";

export type Attempt = {
  answer: string;
  correct: boolean;
  submittedAt: string;
  assisted: boolean;
};

export type QuestionRecord = {
  firstAttempt: Attempt | null;
  attempts: Attempt[];
  viewedAnswerAt: string | null;
  corrected: boolean;
};

export type LessonRecord = {
  completedAt: string | null;
  exercises?: Record<string, LessonExerciseRecord>;
};

export type LessonExerciseRecord = {
  answer: string;
  correct: boolean;
  submittedAt: string;
};

export type ProgressState = {
  questions: Record<string, QuestionRecord>;
  lessons: Record<string, LessonRecord>;
};

type ProgressContextValue = {
  progress: ProgressState;
  ready: boolean;
  submit: (questionId: string, answer: string, correct: boolean) => void;
  reveal: (questionId: string) => void;
  submitLessonExercise: (lessonId: string, exerciseId: string, answer: string, correct: boolean) => void;
  completeLesson: (lessonId: string) => void;
  exportBackup: () => string;
  importBackup: (serialized: string) => void;
};

const STORAGE_KEY = "amc8-cn-progress-v1";
const EMPTY_PROGRESS: ProgressState = { questions: {}, lessons: {} };

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const timer = window.setTimeout(() => {
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Partial<ProgressState>;
          setProgress({
            questions: parsed.questions ?? {},
            lessons: parsed.lessons ?? {},
          });
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, ready]);

  const submit = useCallback(
    (questionId: string, answer: string, correct: boolean) => {
      setProgress((current) =>
        submitAnswerRecord(current, {
          questionId,
          answer,
          correct,
          submittedAt: new Date().toISOString(),
        }),
      );
    },
    [],
  );

  const reveal = useCallback((questionId: string) => {
    setProgress((current) =>
      revealAnswerRecord(current, questionId, new Date().toISOString()),
    );
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setProgress((current) => ({
      ...current,
      lessons: {
        ...current.lessons,
        [lessonId]: {
          completedAt:
            current.lessons[lessonId]?.completedAt ?? new Date().toISOString(),
        },
      },
    }));
  }, []);

  const submitLessonExercise = useCallback(
    (lessonId: string, exerciseId: string, answer: string, correct: boolean) => {
      setProgress((current) => {
        const lesson = current.lessons[lessonId] ?? { completedAt: null };
        return {
          ...current,
          lessons: {
            ...current.lessons,
            [lessonId]: {
              ...lesson,
              exercises: {
                ...(lesson.exercises ?? {}),
                [exerciseId]: {
                  answer,
                  correct,
                  submittedAt: new Date().toISOString(),
                },
              },
            },
          },
        };
      });
    },
    [],
  );

  const exportBackup = useCallback(
    () => exportProgressBackup(progress),
    [progress],
  );

  const importBackup = useCallback((serialized: string) => {
    const restored = importProgressBackup(serialized) as {
      questions: ProgressState["questions"];
      lessons?: ProgressState["lessons"];
    };
    setProgress({
      questions: restored.questions,
      lessons: restored.lessons ?? {},
    });
  }, []);

  const value = useMemo(
    () => ({
      progress,
      ready,
      submit,
      reveal,
      submitLessonExercise,
      completeLesson,
      exportBackup,
      importBackup,
    }),
    [progress, ready, submit, reveal, submitLessonExercise, completeLesson, exportBackup, importBackup],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return value;
}
