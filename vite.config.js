import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    viteDevTools(),
  ],
  server: {
    port: 3000,
    fs: {
      allow: ['..'] // Allow access to parent directories for submodules
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'n8n': fileURLToPath(new URL('./lib/n8n', import.meta.url))
    },
  },
  optimizeDeps: {
    include: [
      'axios',
      'form-data',
      'jsonwebtoken',
      'googleapis',
      'slack-web-api-client'
    ],
    exclude: ['lib/n8n/**'] // Exclude n8n submodule
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Don't bundle n8n files, treat them as external
        return id.includes('lib/n8n/') || id.includes('/n8n/')
      }
    }
  }
})