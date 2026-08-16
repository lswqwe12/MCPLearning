import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Dumbbell,
  Home,
  Layers,
  Rocket,
  Sparkles,
  X,
} from 'lucide-react';
import {
  LAYER_GROUPS,
  getChaptersByLayer,
  totalChapters,
  type ChapterLayer,
} from '@/data/chapters';
import { totalExercises } from '@/data/exercises';
import { useProgress } from '@/context/ProgressContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const LAYER_ICONS: Record<ChapterLayer, typeof Sparkles> = {
  intro: Sparkles,
  core: Layers,
  advanced: Rocket,
};

const topNavClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
  }`;

const chapterNavClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? 'bg-primary-50 font-medium text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
  }`;

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const {
    progress,
    overallProgress,
    chaptersRead,
    exercisesCorrect,
    resetProgress,
  } = useProgress();

  // 章节详情页时，自动滚动当前章节链接到可见区域
  useEffect(() => {
    const match = location.pathname.match(/^\/knowledge\/(.+)$/);
    if (!match || !navRef.current) return;
    // href 含 basename 前缀，用「以…结尾」匹配以兼容子路径部署
    const link = navRef.current.querySelector<HTMLAnchorElement>(
      `a[href$="/knowledge/${match[1]}"]`,
    );
    link?.scrollIntoView({ block: 'nearest' });
  }, [location.pathname]);

  const handleReset = () => {
    if (window.confirm('确定要清空全部学习进度吗？此操作不可恢复。')) {
      resetProgress();
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-900 ${
        open ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      {/* 头部 */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
        <NavLink to="/" className="flex items-center gap-2.5" onClick={onClose}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold leading-tight text-slate-900 dark:text-slate-100">
            MCP Learning Hub
          </span>
        </NavLink>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 lg:hidden"
          aria-label="关闭导航"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 导航 */}
      <nav ref={navRef} className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <NavLink to="/" end className={topNavClass}>
          <Home className="h-4 w-4 shrink-0" />
          首页
        </NavLink>
        <NavLink to="/practice" className={topNavClass}>
          <Dumbbell className="h-4 w-4 shrink-0" />
          练习
        </NavLink>

        {/* 知识库分组章节 */}
        <div className="pt-3">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            知识库
          </p>
          <div className="space-y-3">
            {LAYER_GROUPS.map((group) => {
              const Icon = LAYER_ICONS[group.layer];
              const items = getChaptersByLayer(group.layer);
              return (
                <div key={group.layer}>
                  <div className="flex items-center gap-2 px-3 pb-1.5">
                    <Icon className="h-3.5 w-3.5 text-primary-500" />
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      {group.label}
                    </span>
                    <span className="text-xs text-slate-300 dark:text-slate-600">{items.length}</span>
                  </div>
                  <ul className="space-y-0.5">
                    {items.map((chapter) => {
                      const isCompleted = progress.completedChapters.includes(
                        chapter.id,
                      );
                      const isRead = progress.readChapters.includes(chapter.id);
                      return (
                        <li key={chapter.id}>
                          <NavLink
                            to={`/knowledge/${chapter.id}`}
                            className={chapterNavClass}
                          >
                            <span className="w-5 shrink-0 text-right text-xs tabular-nums text-slate-400 dark:text-slate-500">
                              {chapter.order}
                            </span>
                            <span className="truncate">
                              {chapter.shortTitle ?? chapter.title}
                            </span>
                            {isCompleted ? (
                              <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-500" />
                            ) : isRead ? (
                              <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                            ) : null}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 底部：学习进度 */}
      <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500 dark:text-slate-400">学习进度</span>
          <span className="font-semibold text-primary-600 dark:text-primary-400">{overallProgress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-primary-600 transition-all"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>
            已读 {chaptersRead}/{totalChapters} 章 · 答对 {exercisesCorrect}/
            {totalExercises} 题
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="mt-2 text-xs text-slate-300 transition hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400"
        >
          重置进度
        </button>
      </div>
    </aside>
  );
}
