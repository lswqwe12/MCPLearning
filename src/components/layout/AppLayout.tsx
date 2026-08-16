import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

function PageFallback() {
  return (
    <div className="content-container py-20 text-center text-sm text-slate-400 dark:text-slate-500">
      加载中…
    </div>
  );
}

/**
 * 应用整体布局：左侧固定导航 + 顶部栏 + 主内容区
 * 响应式：
 *  - 桌面 >1024px：侧边栏常驻（lg:pl-72）
 *  - 平板 768-1024px / 移动 <768px：侧边栏抽屉化，由汉堡菜单唤起
 */
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // 路由切换时在移动端自动收起抽屉
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface dark:bg-slate-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 移动端抽屉遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 主内容列：桌面端为侧边栏留出 72 宽度 */}
      <div className="flex min-h-screen flex-col lg:pl-72">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
