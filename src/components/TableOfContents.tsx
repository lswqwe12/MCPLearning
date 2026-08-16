import type { Heading } from '@/lib/markdown';

interface TableOfContentsProps {
  headings: Heading[];
  activeId?: string;
}

/**
 * 章节目录：展示 h2/h3 标题，点击平滑滚动到对应锚点，并高亮当前阅读位置。
 */
export default function TableOfContents({
  headings,
  activeId,
}: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <nav aria-label="章节目录">
      <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">本节目录</p>
      <ul className="space-y-0.5">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const isSub = heading.level === 3;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block rounded-md border-l-2 py-1 pr-2 text-sm leading-snug transition-colors ${
                  isSub ? 'pl-7' : 'pl-4'
                } ${
                  isActive
                    ? 'border-primary-500 font-medium text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-100'
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
