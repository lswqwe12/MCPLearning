import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// 代码高亮主题（rehype-highlight / highlight.js）
import 'highlight.js/styles/github.css';
import './index.css';

// 站点部署在 GitHub Pages 项目子路径下（base = /MCPLearning/），
// React Router 需要相同的 basename 才能正确匹配路由。
// 开发环境下 BASE_URL 为 '/'，去掉尾部斜杠后为空串，等价于无 basename。
const basename = import.meta.env.BASE_URL.replace(/\/+$/, '');

// GitHub Pages SPA 回退：直接访问深层路由（如 /MCPLearning/knowledge/tools）时，
// 静态托管会返回 public/404.html，其脚本把原路径暂存到 sessionStorage。
// 这里在挂载前还原完整路径（含 base 前缀），React Router 再按 basename 解析。
const savedPath = sessionStorage.getItem('gh-pages-redirect');
if (savedPath) {
  sessionStorage.removeItem('gh-pages-redirect');
  window.history.replaceState(null, '', savedPath);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
