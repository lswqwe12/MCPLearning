import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages 自定义域名下站点位于根路径，使用 '/'。
  // 若改为部署到项目子路径（https://<user>.github.io/<repo>/），
  // 请将 base 改为 '/<repo>/'（如 '/MCPLearning/'）。
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
