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
    hmr: {
      protocol: 'ws'
    },
    proxy: {
      'https://34.198.50.70:5000/api': {
        target: 'http://34.198.50.70:5000', 
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.options.agent = false;
          proxy.options.headers = {
            'Connection': 'keep-alive'
          };
        }
      }
    }
  }
})