# 个人技术博客系统

## 项目概述

这是一个现代化的个人技术博客系统，使用 Vue 3 + TypeScript 构建前端，Cloudflare Workers 作为后端，D1 作为数据库。项目追求极致的开发体验和卓越的用户交互。

## 技术栈

### 前端
- Vue 3
- TypeScript
- Tailwind CSS
- Vue Router
- Vite

### 后端
- Cloudflare Workers
- Hono 框架
- Cloudflare D1 数据库
- OpenAPI 规范

## 功能特性

- 响应式设计
- 深色/浅色模式切换
- 博客文章列表
- 博客文章详情页
- 在线写博客
- 科技感交互动画
- 移动端友好

## 项目结构

```
personal-blog/
├── frontend/             # Vue 3 前端项目
│   ├── src/
│   │   ├── views/        # 页面组件
│   │   ├── router.ts     # 路由配置
│   │   └── index.css     # 全局样式
├── cloudflare-workers/   # Cloudflare Workers 后端
│   ├── src/
│   │   ├── index.ts      # 主入口
│   │   └── routes.ts     # API 路由
└── wrangler.toml         # Cloudflare 部署配置
```

## 本地开发

### 前提条件

- Node.js 18+
- npm 或 pnpm
- Cloudflare 账号
- Wrangler CLI

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/zhangrongwu/personal-blog.git
cd personal-blog
```

2. 安装前端依赖
```bash
cd frontend
npm install
```

3. 安装后端依赖
```bash
cd ../cloudflare-workers
npm install
```

### 本地运行

1. 前端开发服务器
```bash
cd frontend
npm run dev
```

2. 后端开发服务器
```bash
cd cloudflare-workers
npm run dev
```

## 部署

### 前端部署 (Cloudflare Pages)

```bash
cd frontend
npm run build
npx wrangler pages deploy dist
```

### 后端部署 (Cloudflare Workers)

```bash
cd cloudflare-workers
npm run deploy
```

## 环境变量

在 `wrangler.toml` 中配置：

- `DATABASE_ID`: Cloudflare D1 数据库 ID
- `API_KEY`: 可选的 API 密钥

## 性能优化

- 使用 Vite 构建
- Tailwind CSS 按需加载
- Workers 边缘计算
- 响应式图像
- 代码分割

## 安全性

- CORS 配置
- 输入验证
- 可选的 API 鉴权

## 贡献指南

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交代码 (`git commit -m '添加了一些很棒的特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT 许可证

## 联系方式

- 邮箱：zhangrongwuios@gmail.com
- GitHub：[@zhangrongwu](https://github.com/zhangrongwu)

## 最新部署

- 前端：`https://93c9ba5e.personal-blog-593.pages.dev`
- 后端 API：`https://personal-blog-workers.zhangrongwuios-c13.workers.dev/api/posts`

---

**注意**：项目正在持续开发中，功能和设计可能会有变化。
