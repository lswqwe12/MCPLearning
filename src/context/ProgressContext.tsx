import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  defaultProgress,
  loadProgress,
  saveProgress,
  type ProgressState,
} from '@/lib/progress';
import { totalChapters } from '@/data/chapters';
import { totalExercises } from '@/data/exercises';

interface ProgressContextValue {
  progress: ProgressState;
  /** 标记章节为已读（并记录为最近访问） */
  markChapterRead: (id: string) => void;
  /** 切换章节「已完成」状态 */
  toggleChapterCompleted: (id: string) => void;
  /** 记录某道练习的答题结果 */
  recordExerciseResult: (id: string, correct: boolean) => void;
  /** 清空全部进度 */
  resetProgress: () => void;
  /** 整体学习进度百分比（0-100） */
  overallProgress: number;
  chaptersRead: number;
  exercisesCorrect: number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  // 进度变化时自动持久化
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const markChapterRead = useCallback((id: string) => {
    setProgress((prev) => {
      if (prev.readChapters.includes(id)) {
        return prev.lastVisitedChapter === id ? prev : { ...prev, lastVisitedChapter: id };
      }
      return {
        ...prev,
        readChapters: [...prev.readChapters, id],
        lastVisitedChapter: id,
      };
    });
  }, []);

  const toggleChapterCompleted = useCallback((id: string) => {
    setProgress((prev) => {
      const isCompleted = prev.completedChapters.includes(id);
      return {
        ...prev,
        completedChapters: isCompleted
          ? prev.completedChapters.filter((c) => c !== id)
          : [...prev.completedChapters, id],
      };
    });
  }, []);

  const recordExerciseResult = useCallback((id: string, correct: boolean) => {
    setProgress((prev) => ({
      ...prev,
      exerciseResults: {
        ...prev.exerciseResults,
        [id]: { correct, submittedAt: new Date().toISOString() },
      },
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress());
  }, []);

  const chaptersRead = progress.readChapters.length;
  const exercisesCorrect = Object.values(progress.exerciseResults).filter(
    (r) => r.correct,
  ).length;

  const overallProgress = useMemo(() => {
    const chapterRatio = totalChapters ? chaptersRead / totalChapters : 0;
    const exerciseRatio = totalExercises ? exercisesCorrect / totalExercises : 0;
    return Math.round(((chapterRatio + exerciseRatio) / 2) * 100);
  }, [chaptersRead, exercisesCorrect]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      markChapterRead,
      toggleChapterCompleted,
      recordExerciseResult,
      resetProgress,
      overallProgress,
      chaptersRead,
      exercisesCorrect,
    }),
    [
      progress,
      markChapterRead,
      toggleChapterCompleted,
      recordExerciseResult,
      resetProgress,
      overallProgress,
      chaptersRead,
      exercisesCorrect,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress 必须在 ProgressProvider 内使用');
  return ctx;
}
