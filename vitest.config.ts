import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['archives/**', 'AI-Resume-Parser/**', 'frontend/**', 'public/**'],
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});