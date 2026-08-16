import { Suspense, lazy, useEffect, useState } from 'react';
import { Menu, Moon, Search, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getChapterById } from '@/data/chapters';
import { useTheme } from '@/context/ThemeContext';

const SearchModal = lazy(() => import('@/components/SearchModal'));

interface TopBarProps {
  onMenuClick: () => void;
}

function usePageTitle(): string {
  const { pathname } = useLocation();
  if (pathname === '/') return '首页';
  if (pathname === '/practice') return '练习';
  if (pathname === '/knowledge') return '知识库';
  if (pathname.startsWith('/knowledge/')) {
    const id = pathname.split('/')[2];
    const chapter = getChapterById(id);
    return chapter ? `第 ${chapter.order} 章 · ${chapter.title}` : '知识库';
  }
  return 'MCP Learning Hub';
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const title = usePageTitle();
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // 全局快捷键 ⌘K / Ctrl+K 唤起搜索
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 lg:hidden"
          aria-label="打开导航"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* 全文搜索入口 */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 transition hover:border-primary-200 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">搜索</span>
          <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 md:inline">
            ⌘K
          </kbd>
        </button>

        {/* 明暗主题切换 */}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
          title={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>

      {searchOpen && (
        <Suspense fallback={null}>
          <SearchModal onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}
    </header>
  );
}
