/**
 * Markdown 处理工具：标题提取与 slug 生成
 * 用于章节目录（TOC）与标题锚点，保证二者 id 一致。
 */

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** 生成 URL 安全的 slug（保留中英文、数字，其余转为连字符） */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/** 递归提取 React children 的纯文本（用于标题文字匹配） */
export function childrenToText(children: unknown): string {
  if (children == null) return '';
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join('');
  if (typeof children === 'object' && 'props' in (children as object)) {
    const props = (children as { props?: { children?: unknown } }).props;
    return childrenToText(props?.children);
  }
  return '';
}

/** 去除标题行内的行内 Markdown 语法 */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

/**
 * 从 Markdown 源文本提取 h2/h3 标题（跳过代码块），生成带唯一 id 的目录项。
 * id 生成规则与 MarkdownContent 中的标题锚点保持一致。
 */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  const lines = markdown.split('\n');
  let inFence = false;

  for (const line of lines) {
    const fence = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fence) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!m) continue;

    const level = m[1].length as 2 | 3;
    const text = stripInlineMarkdown(m[2]);
    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;

    headings.push({ id, text, level });
  }

  return headings;
}
