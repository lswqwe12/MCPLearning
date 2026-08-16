import { useMemo, useState } from 'react';
import { CheckCircle2, Code2, ListChecks, PenLine } from 'lucide-react';
import { exercises, type ExerciseType } from '@/data/exercises';
import ExerciseCard from '@/components/practice/ExerciseCard';
import { useProgress } from '@/context/ProgressContext';

type Filter = 'all' | ExerciseType;

const FILTERS: { key: Filter; label: string; icon: typeof ListChecks }[] = [
  { key: 'all', label: '全部', icon: ListChecks },
  { key: 'choice', label: '选择题', icon: CheckCircle2 },
  { key: 'fill', label: '填空题', icon: PenLine },
  { key: 'code', label: '代码补全', icon: Code2 },
];

export default function PracticePage() {
  const [filter, setFilter] = useState<Filter>('all');
  const { progress, recordExerciseResult } = useProgress();

  const visible = useMemo(
    () => (filter === 'all' ? exercises : exercises.filter((e) => e.type === filter)),
    [filter],
  );

  const results = progress.exerciseResults;
  const submittedCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter((r) => r.correct).length;

  const handleResult = (id: string, correct: boolean) => {
    recordExerciseResult(id, correct);
  };

  return (
    <div className="content-container">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">练习</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          三种题型巩固知识点，提交后即时判分并显示解析。
        </p>
      </header>

      {/* 得分概览 */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">已提交</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {submittedCount} / {exercises.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">答对</span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            {correctCount}
          </span>
        </div>
        {/* 进度条 */}
        <div className="ml-auto h-2 w-full max-w-[240px] overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-primary-600 transition-all"
            style={{
              width: `${exercises.length ? (submittedCount / exercises.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* 题型筛选 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
              filter === key
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-primary-400'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* 题目列表 */}
      <div className="space-y-4">
        {visible.map((exercise, i) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            number={i + 1}
            onResult={handleResult}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
          该题型暂无题目
        </div>
      )}
    </div>
  );
}
