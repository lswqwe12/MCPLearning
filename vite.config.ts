import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  // 部署到 GitHub Pages 项目子路径：https://lswqwe12.github.io/MCPLearning/
  // 若以后改用自定义域名（根路径），改回 base: '/' 即可。
  base: '/MCPLearning/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
