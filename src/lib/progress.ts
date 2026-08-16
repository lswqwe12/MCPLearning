/**
 * 学习进度数据结构与 localStorage 持久化
 * 对应《MCP全面知识学习网站.md》§6.2 进度追踪功能
 */

export interface ExerciseResult {
  correct: boolean;
  submittedAt: string; // ISO 时间戳
}

export interface ProgressState {
  /** 已阅读的章节 id */
  readChapters: string[];
  /** 用户标记为「已完成」的章节 id */
  completedChapters: string[];
  /** 练习答题记录（key = 题目 id） */
  exerciseResults: Record<string, ExerciseResult>;
  /** 最近访问的章节 id（用于「继续学习」） */
  lastVisitedChapter?: string;
}

export const PROGRESS_STORAGE_KEY = 'mcp-learning-hub:progress';

export function defaultProgress(): ProgressState {
  return {
    readChapters: [],
    completedChapters: [],
    exerciseResults: {},
  };
}

/** 从 localStorage 读取进度，异常或缺失时返回默认值 */
export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

/** 保存进度到 localStorage（失败时静默忽略） */
export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 忽略写入失败（如隐私模式配额）
  }
}
