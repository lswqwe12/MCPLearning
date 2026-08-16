import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layers, Rocket, Sparkles } from 'lucide-react';
import {
  LAYER_GROUPS,
  getChaptersByLayer,
  type ChapterLayer,
} from '@/data/chapters';
import { useProgress } from '@/context/ProgressContext';

const LAYER_ICONS: Record<ChapterLayer, typeof Sparkles> = {
  intro: Sparkles,
  core: Layers,
  advanced: Rocket,
};

export default function KnowledgePage() {
  const { progress } = useProgress();
  return (
    <div className="content-container">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">知识库</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          MCP 协议完整知识体系，按「入门 → 核心 → 进阶」三个层级组织，建议依序学习。
        </p>
      </header>

      <div className="space-y-10">
        {LAYER_GROUPS.map((group) => {
          const Icon = LAYER_ICONS[group.layer];
          const items = getChaptersByLayer(group.layer);
          return (
            <section key={group.layer}>
              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary-500" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{group.label}</h3>
                <span className="text-sm text-slate-400 dark:text-slate-500">{group.description}</span>
              </div>
              <div className="space-y-3">
                {items.map((chapter) => {
                  const completed = progress.completedChapters.includes(chapter.id);
                  return (
                    <Link
                      key={chapter.id}
                      to={`/knowledge/${chapter.id}`}
                      className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                          completed
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
                        }`}
                      >
                        {chapter.order}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 group-hover:text-primary-600 dark:text-slate-100 dark:group-hover:text-primary-400">
                            {chapter.title}
                          </h4>
                          {completed && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                          {chapter.summary}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary-500 dark:text-slate-600" />
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
