/**
 * 全文搜索：基于章节正文与练习题干构建索引，返回带片段与跳转链接的结果。
 * 注意：本模块引用了全部章节正文（chapterContents），仅在 SearchModal（懒加载）中导入，
 * 以保证首屏主包不被打大。
 */
import { chapters } from '@/data/chapters';
import { getChapterContent } from '@/data/chapterContents';
import { exercises, EXERCISE_CATEGORY_LABELS } from '@/data/exercises';

export interface SearchResult {
  id: string;
  type: 'chapter' | 'exercise';
  title: string;
  /** 命中片段（已清洗 Markdown 符号） */
  snippet: string;
  href: string;
  category: string;
}

interface SearchEntry {
  id: string;
  type: 'chapter' | 'exercise';
  title: string;
  text: string;
  href: string;
  category: string;
}

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const ch of chapters) {
    const content = getChapterContent(ch.id) ?? '';
    entries.push({
      id: `chapter:${ch.id}`,
      type: 'chapter',
      title: `${ch.order}. ${ch.title}`,
      text: `${ch.title}\n${ch.summary}\n${content}`,
      href: `/knowledge/${ch.id}`,
      category: '章节',
    });
  }

  for (const ex of exercises) {
    const optionText = ex.type === 'choice' ? ex.options.join('\n') : '';
    entries.push({
      id: `exercise:${ex.id}`,
      type: 'exercise',
      title: ex.question,
      text: `${ex.question}\n${optionText}`,
      href: '/practice',
      category: EXERCISE_CATEGORY_LABELS[ex.category] ?? ex.category,
    });
  }

  return entries;
}

let indexCache: SearchEntry[] | null = null;

function getIndex(): SearchEntry[] {
  if (!indexCache) indexCache = buildIndex();
  return indexCache;
}

/** 清洗片段中的 Markdown 符号 */
function cleanSnippet(text: string): string {
  return text
    .replace(/`{3}[\s\S]*?`{3}/g, ' ')
    .replace(/[`#*_>~|[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeSnippet(text: string, hitIndex: number, queryLen: number): string {
  const context = 32;
  const start = Math.max(0, hitIndex - context);
  const end = Math.min(text.length, hitIndex + queryLen + context);
  const raw = text.slice(start, end);
  const cleaned = cleanSnippet(raw);
  return `${start > 0 ? '…' : ''}${cleaned}${end < text.length ? '…' : ''}`;
}

/** 执行搜索：大小写不敏感的子串匹配，标题命中优先排序 */
export function search(query: string, limit = 10): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const entry of getIndex()) {
    const lowerText = entry.text.toLowerCase();
    const hitIndex = lowerText.indexOf(q);
    if (hitIndex === -1) continue;
    results.push({
      id: entry.id,
      type: entry.type,
      title: entry.title,
      snippet: makeSnippet(entry.text, hitIndex, q.length),
      href: entry.href,
      category: entry.category,
    });
  }

  // 标题命中优先，其次保持文档顺序
  results.sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(q) ? 0 : 1;
    const bTitle = b.title.toLowerCase().includes(q) ? 0 : 1;
    return aTitle - bTitle;
  });

  return results.slice(0, limit);
}
