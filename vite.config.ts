import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url' // 新增路径处理

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 改用相对项目根目录的路径，跨平台兼容
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
