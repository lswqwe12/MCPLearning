import { useState } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  Send,
  XCircle,
} from 'lucide-react';
import {
  EXERCISE_CATEGORY_LABELS,
  type ChoiceExercise,
  type CodeExercise,
  type Exercise,
  type ExerciseType,
  type FillExercise,
} from '@/data/exercises';

interface ExerciseCardProps {
  exercise: Exercise;
  number: number;
  /** 提交后回调，用于上层统计得分 */
  onResult?: (id: string, correct: boolean) => void;
}

const TYPE_BADGE: Record<ExerciseType, { label: string; className: string }> = {
  choice: {
    label: '选择题',
    className: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400',
  },
  fill: {
    label: '填空题',
    className: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  },
  code: {
    label: '代码补全',
    className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
};

/** 归一化答案：去首尾空格、转小写、合并连续空白 */
const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

function CardHeader({
  number,
  type,
  category,
}: {
  number: number;
  type: ExerciseType;
  category: string;
}) {
  const badge = TYPE_BADGE[type];
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-300 dark:text-slate-600">#{number}</span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>
      <span className="text-xs text-slate-400 dark:text-slate-500">
        {EXERCISE_CATEGORY_LABELS[category] ?? category}
      </span>
    </div>
  );
}

function ResultPanel({
  correct,
  explanation,
  correctAnswer,
  onReset,
}: {
  correct: boolean;
  explanation: string;
  correctAnswer?: string;
  onReset: () => void;
}) {
  return (
    <div
      className={`mt-4 rounded-lg border p-4 ${
        correct
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10'
          : 'border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10'
      }`}
    >
      <div className="flex items-center gap-2">
        {correct ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <XCircle className="h-5 w-5 shrink-0 text-red-500 dark:text-red-400" />
        )}
        <span
          className={`font-semibold ${
            correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {correct ? '回答正确' : '回答错误'}
        </span>
      </div>
      {!correct && correctAnswer && (
        <p className="mt-2 text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">正确答案：</span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">{correctAnswer}</span>
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {explanation}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 transition hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        <RotateCcw className="h-4 w-4" />
        重新作答
      </button>
    </div>
  );
}

function SubmitButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Send className="h-4 w-4" />
      提交答案
    </button>
  );
}

/* ---------------- 选择题 ---------------- */

function ChoiceCard({
  exercise,
  number,
  onResult,
}: {
  exercise: ChoiceExercise;
  number: number;
  onResult?: (id: string, correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    onResult?.(exercise.id, selected === exercise.correct);
  };

  const handleReset = () => {
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <CardHeader number={number} type="choice" category={exercise.category} />
      <p className="text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-100">
        {exercise.question}
      </p>

      <div className="mt-4 space-y-2">
        {exercise.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectOpt = i === exercise.correct;
          let cls =
            'border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-500/50 dark:hover:bg-primary-500/5';
          if (submitted) {
            if (isCorrectOpt)
              cls =
                'border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10';
            else if (isSelected)
              cls = 'border-red-300 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10';
            else
              cls =
                'border-slate-200 bg-white opacity-60 dark:border-slate-800 dark:bg-slate-900';
          } else if (isSelected) {
            cls =
              'border-primary-500 bg-primary-50 dark:border-primary-500 dark:bg-primary-500/10';
          }
          return (
            <button
              key={i}
              type="button"
              disabled={submitted}
              onClick={() => setSelected(i)}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm text-slate-700 transition dark:text-slate-200 ${cls}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs font-medium text-slate-500 dark:border-slate-600 dark:text-slate-400">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {submitted && isCorrectOpt && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              )}
              {submitted && isSelected && !isCorrectOpt && (
                <XCircle className="h-5 w-5 shrink-0 text-red-500 dark:text-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {submitted ? (
        <ResultPanel
          correct={selected === exercise.correct}
          explanation={exercise.explanation}
          correctAnswer={exercise.options[exercise.correct]}
          onReset={handleReset}
        />
      ) : (
        <SubmitButton
          disabled={selected === null}
          onClick={handleSubmit}
        />
      )}
    </div>
  );
}

/* ---------------- 填空题 ---------------- */

function FillCard({
  exercise,
  number,
  onResult,
}: {
  exercise: FillExercise;
  number: number;
  onResult?: (id: string, correct: boolean) => void;
}) {
  const [answers, setAnswers] = useState<string[]>(() =>
    Array(exercise.correct.length).fill(''),
  );
  const [submitted, setSubmitted] = useState(false);

  const parts = exercise.question.split('_____');
  const isCorrectBlanks = answers.map(
    (a, i) => normalize(a) === normalize(exercise.correct[i]),
  );
  const isAllCorrect = isCorrectBlanks.every(Boolean);

  const update = (i: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  };

  const handleSubmit = () => {
    if (answers.some((a) => a.trim() === '')) return;
    setSubmitted(true);
    onResult?.(exercise.id, isAllCorrect);
  };

  const handleReset = () => {
    setAnswers(Array(exercise.correct.length).fill(''));
    setSubmitted(false);
  };

  const inputClass = (correct: boolean) =>
    `mx-1 inline-block rounded border px-2 py-0.5 text-center font-medium outline-none transition ${
      submitted
        ? correct
          ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300'
          : 'border-red-400 bg-red-50 text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300'
        : 'border-slate-300 bg-white text-slate-800 focus:border-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-primary-400'
    }`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <CardHeader number={number} type="fill" category={exercise.category} />
      <p className="text-sm font-medium leading-loose text-slate-800 dark:text-slate-100">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <input
                type="text"
                value={answers[i]}
                disabled={submitted}
                onChange={(e) => update(i, e.target.value)}
                className={inputClass(isCorrectBlanks[i])}
                style={{
                  width: `${Math.max(exercise.correct[i].length, 3) + 2}ch`,
                }}
                aria-label={`第 ${i + 1} 个空`}
              />
            )}
          </span>
        ))}
      </p>

      {submitted ? (
        <ResultPanel
          correct={isAllCorrect}
          explanation={exercise.explanation}
          correctAnswer={exercise.correct.join('、')}
          onReset={handleReset}
        />
      ) : (
        <SubmitButton
          disabled={answers.some((a) => a.trim() === '')}
          onClick={handleSubmit}
        />
      )}
    </div>
  );
}

/* ---------------- 代码补全 ---------------- */

function CodeCard({
  exercise,
  number,
  onResult,
}: {
  exercise: CodeExercise;
  number: number;
  onResult?: (id: string, correct: boolean) => void;
}) {
  const [answers, setAnswers] = useState<string[]>(() =>
    Array(exercise.correct.length).fill(''),
  );
  const [submitted, setSubmitted] = useState(false);

  // 解析代码模板：`____n____` 占位符 → 文本/填空片段
  const segments = exercise.codeTemplate.split(/____(\d+)____/);
  const blankIndexOf = (n: number) => exercise.fillIndex.indexOf(n);

  const isCorrectBlanks = answers.map(
    (a, i) => normalize(a) === normalize(exercise.correct[i]),
  );
  const isAllCorrect = isCorrectBlanks.every(Boolean);

  const update = (i: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  };

  const handleSubmit = () => {
    if (answers.some((a) => a.trim() === '')) return;
    setSubmitted(true);
    onResult?.(exercise.id, isAllCorrect);
  };

  const handleReset = () => {
    setAnswers(Array(exercise.correct.length).fill(''));
    setSubmitted(false);
  };

  const inputClass = (correct: boolean) =>
    `inline-block rounded border px-1 text-center font-mono outline-none transition ${
      submitted
        ? correct
          ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300'
          : 'border-red-400 bg-red-50 text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300'
        : 'border-slate-300 bg-white text-slate-800 focus:border-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-primary-400'
    }`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <CardHeader number={number} type="code" category={exercise.category} />
      <p className="text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-100">
        {exercise.question}
      </p>

      <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-50 p-4 font-mono text-[13px] leading-relaxed text-slate-700 dark:bg-slate-950 dark:text-slate-300">
        {segments.map((seg, i) => {
          if (i % 2 === 0) return <span key={i}>{seg}</span>;
          const blankNumber = Number(seg);
          const answerIndex = blankIndexOf(blankNumber);
          if (answerIndex === -1) return <span key={i}>____{seg}____</span>;
          return (
            <input
              key={i}
              type="text"
              value={answers[answerIndex]}
              disabled={submitted}
              onChange={(e) => update(answerIndex, e.target.value)}
              className={inputClass(isCorrectBlanks[answerIndex])}
              style={{
                width: `${Math.max(exercise.correct[answerIndex].length, 3) + 2}ch`,
              }}
              aria-label={`填空 ${blankNumber}`}
            />
          );
        })}
      </pre>

      {submitted ? (
        <ResultPanel
          correct={isAllCorrect}
          explanation={exercise.explanation}
          correctAnswer={exercise.correct.join('、')}
          onReset={handleReset}
        />
      ) : (
        <SubmitButton
          disabled={answers.some((a) => a.trim() === '')}
          onClick={handleSubmit}
        />
      )}
    </div>
  );
}

/* ---------------- 分发 ---------------- */

export default function ExerciseCard({
  exercise,
  number,
  onResult,
}: ExerciseCardProps) {
  if (exercise.type === 'choice') {
    return <ChoiceCard exercise={exercise} number={number} onResult={onResult} />;
  }
  if (exercise.type === 'fill') {
    return <FillCard exercise={exercise} number={number} onResult={onResult} />;
  }
  return <CodeCard exercise={exercise} number={number} onResult={onResult} />;
}
