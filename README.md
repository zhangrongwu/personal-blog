# 个人博客系统

## 技术栈
- 前端：Vue 3, TypeScript, Tailwind CSS
- 后端：Cloudflare Workers, Hono框架
- 数据库：Cloudflare D1
- 存储：Cloudflare R2

## 项目结构
- `frontend/`: Vue 3 前端项目
- `cloudflare-workers/`: Cloudflare Workers 后端服务

## 本地开发
1. 克隆仓库
2. 安装依赖
   ```bash
   cd frontend && npm install
   cd ../cloudflare-workers && npm install
   ```

## 部署
使用项目根目录的 `deploy.sh` 脚本：
```bash
./deploy.sh
```

## 环境配置
- 需要安装 Cloudflare Wrangler CLI
- 需要 Cloudflare 账号

## 注意事项
- 部署前请确认 `wrangler.toml` 中的配置
- 需要在 Cloudflare 控制台手动创建 D1 数据库和 R2 存储桶
