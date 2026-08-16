import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { ProgressProvider } from '@/context/ProgressContext';
import { ThemeProvider } from '@/context/ThemeContext';

// 路由级代码分割：各页面按需加载，减小首屏体积
const HomePage = lazy(() => import('@/pages/HomePage'));
const KnowledgePage = lazy(() => import('@/pages/KnowledgePage'));
const KnowledgeDetailPage = lazy(() => import('@/pages/KnowledgeDetailPage'));
const PracticePage = lazy(() => import('@/pages/PracticePage'));

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="knowledge" element={<KnowledgePage />} />
            <Route path="knowledge/:chapterId" element={<KnowledgeDetailPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ProgressProvider>
    </ThemeProvider>
  );
}
