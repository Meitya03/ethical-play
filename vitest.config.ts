import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

// 抽离 Vitest 专属配置，提升可读性
const vitestConfig = defineConfig({
  test: {
    environment: 'jsdom', // 适配 React 组件的 DOM 环境
    exclude: [...configDefaults.exclude, 'e2e/**'], // 排除 e2e 测试目录
    root: fileURLToPath(new URL('./', import.meta.url)) // 测试根目录指向项目根目录
  },
  resolve: viteConfig.resolve
})

// 合并 Vite 主配置和 Vitest 配置
export default mergeConfig(viteConfig, vitestConfig)
