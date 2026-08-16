import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Inbox } from 'lucide-react';
import { chapters, getChapterById } from '@/data/chapters';
import { getChapterContent } from '@/data/chapterContents';
import MarkdownContent from '@/components/MarkdownContent';
import TableOfContents from '@/components/TableOfContents';
import { extractHeadings } from '@/lib/markdown';
import { useProgress } from '@/context/ProgressContext';

export default function KnowledgeDetailPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const chapter = chapterId ? getChapterById(chapterId) : undefined;
  const { markChapterRead, toggleChapterCompleted, progress } = useProgress();

  const content = chapter ? getChapterContent(chapter.id) : undefined;
  const headings = useMemo(
    () => (content ? extractHeadings(content) : []),
    [content],
  );
  const [activeId, setActiveId] = useState<string | undefined>(headings[0]?.id);

  // 访问即标记为已读
  useEffect(() => {
    if (chapterId) markChapterRead(chapterId);
  }, [chapterId, markChapterRead]);

  // 章节切换：滚动到顶部，并重置当前小节
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterId]);

  useEffect(() => {
    setActiveId(headings[0]?.id);
  }, [headings]);

  // 滚动高亮当前目录项
  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!chapter) {
    return (
      <div className="content-container">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-900">
          <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200">未找到该章节</p>
          <Link
            to="/knowledge"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <ArrowLeft className="h-4 w-4" />
            返回知识库
          </Link>
        </div>
      </div>
    );
  }

  const index = chapters.findIndex((c) => c.id === chapter.id);
  const prev = index > 0 ? chapters[index - 1] : undefined;
  const next = index < chapters.length - 1 ? chapters[index + 1] : undefined;
  const isCompleted = progress.completedChapters.includes(chapter.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 移动端 / 平板：折叠目录 */}
      {headings.length > 0 && (
        <details className="mb-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 xl:hidden">
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            本节目录
          </summary>
          <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
            <TableOfContents headings={headings} activeId={activeId} />
          </div>
        </details>
      )}

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_16rem] xl:gap-10">
        {/* 正文 */}
        <article className="min-w-0">
          <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-primary-500">
                  第 {chapter.order} 章
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
                  {chapter.title}
                </h2>
                <p className="mt-3 text-base text-slate-500 dark:text-slate-400">{chapter.summary}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleChapterCompleted(chapter.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-primary-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                {isCompleted ? '已完成' : '标记完成'}
              </button>
            </div>
          </header>

          {content ? (
            <MarkdownContent content={content} headings={headings} />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <Inbox className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                本章内容暂未填充
              </p>
            </div>
          )}

          {/* 上一章 / 下一章 */}
          <nav className="mt-10 flex items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
            {prev ? (
              <Link
                to={`/knowledge/${prev.id}`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-primary-400"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">上一章 ·</span>
                {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to={`/knowledge/${next.id}`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-primary-400"
              >
                <span className="hidden sm:inline">下一章 ·</span>
                {next.title}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>

        {/* 桌面端右侧 sticky 目录 */}
        <aside className="hidden xl:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <TableOfContents headings={headings} activeId={activeId} />
          </div>
        </aside>
      </div>
    </div>
  );
}
