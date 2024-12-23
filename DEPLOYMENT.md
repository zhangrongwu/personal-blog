# 博客项目部署指南

## 前提条件
- Node.js (v18+)
- Vercel CLI
- Cloudflare Workers 账号

## 前端部署步骤（Vercel）

1. 安装 Vercel CLI
```bash
npm install -g vercel
```

2. 登录 Vercel
```bash
vercel login
```

3. 进入前端目录
```bash
cd frontend
```

4. 构建项目
```bash
npm run build
```

5. 部署到测试环境
```bash
npm run deploy
```

6. 部署到生产环境
```bash
npm run deploy:prod
```

## 后端部署（Cloudflare Workers）

1. 安装 Wrangler CLI
```bash
npm install -g wrangler
```

2. 登录 Cloudflare
```bash
wrangler login
```

3. 部署 Workers
```bash
wrangler deploy
```

## 环境变量配置

在 Vercel 和 Cloudflare 控制台中配置以下环境变量：
- `VITE_API_URL`: API 服务器地址
- `DATABASE_URL`: 数据库连接字符串
- `JWT_SECRET`: JWT 密钥

## 注意事项
- 确保所有敏感信息都通过环境变量配置
- 定期更新依赖
- 使用 HTTPS 和安全最佳实践
