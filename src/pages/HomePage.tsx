import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Dumbbell,
  ExternalLink,
  Layers,
  Play,
  Rocket,
  Sparkles,
} from 'lucide-react';
import {
  LAYER_GROUPS,
  getChapterById,
  getChaptersByLayer,
  totalChapters,
  type ChapterLayer,
} from '@/data/chapters';
import { totalExercises } from '@/data/exercises';
import { useProgress } from '@/context/ProgressContext';

const LAYER_ICONS: Record<ChapterLayer, typeof Sparkles> = {
  intro: Sparkles,
  core: Layers,
  advanced: Rocket,
};

const LEARNING_PATHS = [
  {
    title: '快速入门',
    duration: '1-2 小时',
    steps: ['MCP 基本介绍', '技术架构', '核心组件', '完成入门练习'],
  },
  {
    title: '系统学习',
    duration: '4-6 小时',
    steps: ['1-12 章按顺序学习', '贯通全部知识点', '完成所有练习'],
  },
  {
    title: '实战导向',
    duration: '3-4 小时',
    steps: ['基本介绍', 'Tools', 'Resources', '综合示例 + 代码练习'],
  },
];

const OFFICIAL_LINKS = [
  { label: 'MCP 官方网站', href: 'https://modelcontextprotocol.io' },
  { label: 'MCP 规范（最新版）', href: 'https://modelcontextprotocol.io/specification/latest' },
  { label: 'MCP GitHub 仓库', href: 'https://github.com/modelcontextprotocol' },
  { label: 'MCP Python SDK', href: 'https://pypi.org/project/mcp/' },
  { label: 'MCPMarket（市场）', href: 'https://mcpmarket.cn/' },
  { label: 'bilibili MCP 教学视频', href: 'https://www.bilibili.com/video/BV1uronYREWR' },
];

export default function HomePage() {
  const { progress, overallProgress, chaptersRead, exercisesCorrect } =
    useProgress();
  const lastChapter = progress.lastVisitedChapter
    ? getChapterById(progress.lastVisitedChapter)
    : undefined;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="content-container relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
          {/* 左侧文案 */}
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Model Context Protocol
            </p>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              MCP 全面知识学习网站
            </h2>
            <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
              从入门到进阶的 MCP 协议学习平台，涵盖概念讲解、技术架构、核心组件与实战练习，
              一次构建，随处集成。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {lastChapter ? (
                <Link
                  to={`/knowledge/${lastChapter.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 shadow-sm transition hover:bg-primary-50"
                >
                  <Play className="h-4 w-4" />
                  继续学习 · 第 {lastChapter.order} 章
                </Link>
              ) : (
                <Link
                  to="/knowledge"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 shadow-sm transition hover:bg-primary-50"
                >
                  <BookOpen className="h-4 w-4" />
                  开始学习
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                to="/practice"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Dumbbell className="h-4 w-4" />
                进入练习
              </Link>
            </div>
          </div>

          {/* 右侧进度卡 */}
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm font-medium text-white/80">学习进度</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-4xl font-bold">{overallProgress}%</span>
              <span className="mb-1 text-sm text-white/70">整体完成</span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-white/60">已读章节</dt>
                <dd className="mt-0.5 font-semibold">
                  {chaptersRead}/{totalChapters}
                </dd>
              </div>
              <div>
                <dt className="text-white/60">答对练习</dt>
                <dd className="mt-0.5 font-semibold">
                  {exercisesCorrect}/{totalExercises}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* 快速统计 */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="content-container grid grid-cols-2 gap-4 py-8 sm:grid-cols-4">
          {[
            { value: totalChapters, label: '知识章节' },
            { value: totalExercises, label: '练习题' },
            { value: 3, label: '学习层级' },
            { value: 4, label: '核心原语' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 学习路径 */}
      <section className="content-container">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">学习路径</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">选择适合你的路线，从入门到精通</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {LEARNING_PATHS.map((path) => (
            <div
              key={path.title}
              className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-primary-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{path.title}</h4>
                <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                  {path.duration}
                </span>
              </div>
              <ol className="mt-4 space-y-2">
                {path.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* 知识地图 */}
      <section className="content-container">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">知识地图</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">全部知识点按层级组织，点击进入章节</p>
        <div className="mt-6 space-y-6">
          {LAYER_GROUPS.map((group) => {
            const Icon = LAYER_ICONS[group.layer];
            const items = getChaptersByLayer(group.layer);
            return (
              <div key={group.layer}>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary-500" />
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{group.label}</h4>
                  <span className="text-sm text-slate-400 dark:text-slate-500">{group.description}</span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((chapter) => {
                    const completed = progress.completedChapters.includes(chapter.id);
                    const read = progress.readChapters.includes(chapter.id);
                    return (
                      <Link
                        key={chapter.id}
                        to={`/knowledge/${chapter.id}`}
                        className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-primary-500">
                            第 {chapter.order} 章
                          </span>
                          {completed ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" />
                              已完成
                            </span>
                          ) : read ? (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              已读
                            </span>
                          ) : (
                            <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary-500 dark:text-slate-600" />
                          )}
                        </div>
                        <h5 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{chapter.title}</h5>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                          {chapter.summary}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 外部资源 */}
      <section className="content-container pb-16">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">外部资源</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">官方文档与规范入口</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {OFFICIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:text-primary-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-primary-400"
            >
              {link.label}
              <ExternalLink className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
