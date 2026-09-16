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

export type ProgressState = {
  questions: Record<string, QuestionRecord>;
};

type ProgressContextValue = {
  progress: ProgressState;
  ready: boolean;
  submit: (questionId: string, answer: string, correct: boolean) => void;
  reveal: (questionId: string) => void;
  exportBackup: () => string;
  importBackup: (serialized: string) => void;
};

const STORAGE_KEY = "amc8-cn-progress-v1";
const EMPTY_PROGRESS: ProgressState = { questions: {} };

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProgress(JSON.parse(stored) as ProgressState);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
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

  const exportBackup = useCallback(
    () => exportProgressBackup(progress),
    [progress],
  );

  const importBackup = useCallback((serialized: string) => {
    setProgress(importProgressBackup(serialized));
  }, []);

  const value = useMemo(
    () => ({ progress, ready, submit, reveal, exportBackup, importBackup }),
    [progress, ready, submit, reveal, exportBackup, importBackup],
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
