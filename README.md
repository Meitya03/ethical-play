# Ethical Play - 工程伦理教育平台

## 项目简介

Ethical Play 是一个沉浸式工程伦理教育平台，旨在通过互动体验帮助用户理解工程实践中的伦理决策重要性。该平台模拟真实工程场景中的伦理困境，让用户在安全的环境中做出决策并观察后果，从而培养工程伦理意识和决策能力。

## 核心功能

- **沉浸式案例场景**：模拟工程决策中的伦理困境，如技术创新与公共安全的冲突
- **价值权衡训练**：探讨效率与公平、创新与传统、商业利益与公共福祉等多元价值冲突
- **风险预见能力**：通过虚拟场景中的选择，培养用户预见风险的能力
- **未来责任感**：传递"工程是为了更美好未来"的使命，激励用户成为技术向善的推动者

## 技术栈

- **前端框架**：React 18.2.0 + TypeScript
- **构建工具**：Vite 5.0.8
- **路由管理**：React Router DOM
- **动画效果**：GSAP 3.12.0
- **平滑滚动**：Lenis
- **测试框架**：Vitest
- **代码质量**：ESLint + Prettier

## 项目结构

```
ethical-play/
├── public/              # 静态资源
│   └── icons/          # 图标文件
├── src/                # 源代码
│   ├── assets/         # 图片和样式
│   ├── components/     # 通用组件
│   ├── pages/          # 页面组件
│   │   ├── Home/       # 首页
│   │   ├── CaseScene/  # 案例场景
│   │   ├── SelectRole/ # 角色选择
│   │   └── NotFound/   # 404页面
│   ├── router/         # 路由配置
│   ├── App.tsx         # 应用主组件
│   └── main.tsx        # 应用入口
├── package.json        # 项目配置
├── vite.config.ts      # Vite配置
└── tsconfig.json       # TypeScript配置
```

## 快速开始

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

然后在浏览器中访问：http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 页面导航

- **首页**：http://localhost:5173/ - 项目介绍和核心价值展示
- **案例场景**：http://localhost:5173/case-scene - 互动式案例体验
- **404页面**：处理未定义的路由

## 核心组件

- **DissolveEffect**：首页的溶解过渡效果组件
- **Home**：首页组件，包含卡片式内容展示和滚动动画
- **CaseScene**：案例场景组件，提供互动式伦理决策体验
- **SelectRole**：角色选择组件
- **NotFound**：404错误页面

## 技术特性

- **响应式设计**：适配不同屏幕尺寸
- **平滑滚动**：使用Lenis实现流畅的滚动效果
- **GSAP动画**：高质量的页面动画和过渡效果
- **TypeScript**：类型安全的代码
- **模块化结构**：清晰的代码组织和复用

## 项目目标

1. 提高工程伦理意识
2. 培养伦理决策能力
3. 展示技术向善的重要性
4. 为工程教育提供创新工具

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 许可证

MIT License

## 联系信息

- 项目地址：https://github.com/yourusername/ethical-play
- 维护者：Your Name <your.email@example.com>
