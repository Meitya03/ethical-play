import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url' // 新增路径处理

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5999',
        changeOrigin: true,
        // 如果后端服务不稳定，可以尝试 127.0.0.1
        // target: 'http://127.0.0.1:5999',
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy Error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
})
