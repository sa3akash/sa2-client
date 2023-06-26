import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sassDts from 'vite-plugin-sass-dts';
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias:{
      '@assets': path.resolve(__dirname, './src/assets'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@root': path.resolve(__dirname, './src/'),
    }
  },
  plugins: [
    react(),
    sassDts(),
  ],
  define: {
    _global: ({}),
    'process.env': {}
  },
});
