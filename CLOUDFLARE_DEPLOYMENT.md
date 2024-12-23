# Cloudflare 部署指南

## 项目架构
- 前端：Vue.js + Vite + Tailwind CSS
- 后端：Cloudflare Workers
- 数据库：Cloudflare D1
- 部署平台：Cloudflare Pages

## 前提条件
- Node.js (v18+)
- Cloudflare 账号
- Wrangler CLI
- Git

## 前端部署步骤

### 1. 安装依赖
```bash
cd frontend
npm install
```

### 2. 构建项目
```bash
npm run build
```

### 3. 部署到 Cloudflare Pages
```bash
npx wrangler pages deploy dist
```

## 后端部署步骤

### 1. 安装依赖
```bash
cd cloudflare-workers
npm install
```

### 2. 构建服务
```bash
npm run build
```

### 3. 部署到 Cloudflare Workers
```bash
npx wrangler deploy
```

## 部署地址
- 前端：`https://b6b7a2fe.personal-blog-593.pages.dev`
- 后端：`https://personal-blog-worker.zhangrongwuios-c13.workers.dev`

## 环境变量配置

### 前端环境变量
- `VITE_API_URL`: 后端 API 地址

### 后端环境变量
- `BLOG_TITLE`: 博客标题
- `JWT_SECRET`: JWT 密钥

## 数据库
- 数据库名称：`personal-blog-db`
- 数据库 ID：`cb89ea0b-22d5-400c-991b-261b73de07cd`

## 注意事项
- 确保所有敏感信息通过环境变量管理
- 定期更新依赖
- 使用 HTTPS 和安全最佳实践
- 配置自定义域名

## 持续集成与部署
可使用 GitHub Actions 自动部署：
- 前端：`.github/workflows/cloudflare-pages-deploy.yml`
- 后端：`.github/workflows/cloudflare-workers-deploy.yml`

## 故障排查
1. 检查 Cloudflare 控制台日志
2. 验证环境变量配置
3. 确保网络和权限设置正确
