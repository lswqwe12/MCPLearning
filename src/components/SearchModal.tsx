import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CornerDownLeft, Dumbbell, Search, X } from 'lucide-react';
import { search, type SearchResult } from '@/lib/search';

interface SearchModalProps {
  onClose: () => void;
}

/** 高亮命中关键词（大小写不敏感） */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-primary-100 px-0.5 text-primary-700">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function ResultIcon({ type }: { type: SearchResult['type'] }) {
  return type === 'chapter' ? (
    <BookOpen className="h-4 w-4 text-primary-500" />
  ) : (
    <Dumbbell className="h-4 w-4 text-emerald-500" />
  );
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => search(query), [query]);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = (href: string) => {
    navigate(href);
    onClose();
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[active]) go(results[active].href);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 p-4 pt-[12vh] backdrop-blur-sm dark:bg-slate-950/70"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 输入框 */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
          <Search className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索章节、概念、练习题…"
            className="flex-1 bg-transparent py-4 text-base text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="关闭搜索"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 结果列表 */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === '' ? (
            <p className="px-3 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
              输入关键词搜索章节正文与练习题
            </p>
          ) : results.length === 0 ? (
            <p className="px-3 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
              未找到与「{query}」相关的内容
            </p>
          ) : (
            <ul ref={listRef} className="space-y-1">
              {results.map((r, i) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => go(r.href)}
                    onMouseEnter={() => setActive(i)}
                    data-active={i === active}
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                      i === active
                        ? 'bg-primary-50 dark:bg-primary-500/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      <ResultIcon type={r.type} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            r.type === 'chapter'
                              ? 'bg-primary-50 text-primary-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {r.type === 'chapter' ? '章节' : '练习'}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{r.category}</span>
                      </span>
                      <span className="mt-1 block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                        <Highlight text={r.title} query={query} />
                      </span>
                      {r.snippet && (
                        <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
                          <Highlight text={r.snippet} query={query} />
                        </span>
                      )}
                    </span>
                    {i === active && (
                      <CornerDownLeft className="mt-1 h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 底部提示 */}
        <div className="flex items-center gap-4 border-t border-slate-200 px-4 py-2 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <span>↑↓ 选择</span>
          <span>Enter 打开</span>
          <span>Esc 关闭</span>
        </div>
      </div>
    </div>
  );
}
