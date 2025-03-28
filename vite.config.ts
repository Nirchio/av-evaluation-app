// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages base path setup
const isGithubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  base: isGithubPages ? '/av-evaluation-app/' : '/',
  plugins: [react()],
  server: {
    port: 5173
  }
});
