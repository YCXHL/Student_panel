import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // 允许访问的主机名
    allowedHosts: ['home.ycxhl.top','panel.ycxhl.top'],
    // 如果你想允许所有主机访问（仅限开发环境）
    // allowedHosts: 'all',
  }
})
