import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    assetsInclude: ['**/*.svg'],
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@assets': resolve(__dirname, 'src/assets')
    }
  }
});