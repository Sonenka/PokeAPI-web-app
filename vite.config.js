import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/PokeAPI-web-app/', // <-- путь для GitHub Pages
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        details: resolve(__dirname, 'details.html'),
      },
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },
});