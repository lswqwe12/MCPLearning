/**
 * 章节正文映射（id → Markdown 文本）
 * 内容以 .md 文件硬编码于 src/data/content/，通过 Vite 的 ?raw 导入为字符串。
 * 单独拆出此文件（而非放进 chapters.ts），避免首页/侧边栏等轻量页面打包全部正文。
 */

import basicIntro from './content/01-basic-intro.md?raw';
import architecture from './content/02-architecture.md?raw';
import coreComponents from './content/03-core-components.md?raw';
import tools from './content/04-tools.md?raw';
import prompts from './content/05-prompts.md?raw';
import resources from './content/06-resources.md?raw';
import notifications from './content/07-notifications.md?raw';
import workflow from './content/08-workflow.md?raw';
import communication from './content/09-communication.md?raw';
import sampling from './content/10-sampling-elicitation.md?raw';
import buildServer from './content/11-build-server.md?raw';
import examples from './content/12-examples.md?raw';

export const chapterContents: Record<string, string> = {
  'basic-intro': basicIntro,
  architecture,
  'core-components': coreComponents,
  tools,
  prompts,
  resources,
  notifications,
  workflow,
  communication,
  sampling,
  'build-server': buildServer,
  examples,
};

export const getChapterContent = (id: string): string | undefined =>
  chapterContents[id];
