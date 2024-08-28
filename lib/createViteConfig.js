import fs from 'fs';
import path from 'path';

function createViteConfig() {
  const viteConfigPath = path.join(
    process.cwd(),
    'components-page',
    'vite.config.js',
  );

  const viteConfigContent = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './src',
  base: './',
  build: {
    outDir: '../components-page',
  },
  server: {
    port: 3000,
    open: true, 
  },
  resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        pages: path.resolve(__dirname, 'src/pages'),
        components: path.resolve(__dirname, 'src/pages'),
      },
    },
});
  `;

  fs.writeFileSync(viteConfigPath, viteConfigContent.trim());
  console.log('------------------------------------------------------------');

  console.log(`vite.config.js 已经创建，请查看：${viteConfigPath}`);
}

export default createViteConfig;
