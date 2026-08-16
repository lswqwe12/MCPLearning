import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// 代码高亮主题（rehype-highlight / highlight.js）
import 'highlight.js/styles/github.css';
import './index.css';

// GitHub Pages SPA 回退：直接访问深层路由（如 /knowledge/tools）时，
// 静态托管会返回 public/404.html，其脚本把原路径暂存到 sessionStorage。
// 这里在挂载前还原路径，使 React Router 直接命中对应页面。
const savedPath = sessionStorage.getItem('gh-pages-redirect');
if (savedPath) {
  sessionStorage.removeItem('gh-pages-redirect');
  window.history.replaceState(null, '', savedPath);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
