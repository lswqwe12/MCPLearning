import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { childrenToText, type Heading } from '@/lib/markdown';

interface MarkdownContentProps {
  /** Markdown 源文本 */
  content: string;
  /** 预提取的标题（用于给 h2/h3 加锚点 id），由 extractHeadings 生成 */
  headings?: Heading[];
}

/**
 * Markdown 渲染组件：支持 GFM（表格/任务列表等）+ 代码高亮
 * 正文样式见 index.css 的 .markdown-body；代码高亮主题在 main.tsx 引入
 * 通过 headings 给 h2/h3 添加与目录一致的 id 锚点
 */
export default function MarkdownContent({
  content,
  headings = [],
}: MarkdownContentProps) {
  // 标题文本 → id 映射（当前内容标题均唯一）
  const headingIdMap = new Map(headings.map((h) => [h.text, h.id]));

  const renderHeading = (Tag: 'h2' | 'h3') =>
    function Heading({ children }: { children?: ReactNode }) {
      const text = childrenToText(children);
      const id = headingIdMap.get(text);
      return (
        <Tag id={id} className="scroll-mt-24">
          {children}
        </Tag>
      );
    };

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h2: renderHeading('h2'),
          h3: renderHeading('h3'),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
