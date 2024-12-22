#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # 无颜色

# 检查 Wrangler 是否已登录
check_wrangler_login() {
    echo -e "${YELLOW}检查 Cloudflare 登录状态...${NC}"
    wrangler whoami || {
        echo -e "${RED}未登录 Cloudflare，请先运行 wrangler login${NC}"
        exit 1
    }
}

# 部署 D1 数据库
deploy_d1() {
    echo -e "${YELLOW}创建 D1 数据库...${NC}"
    local db_name="personal-blog-db"
    
    # 创建 D1 数据库
    wrangler d1 create "$db_name"
    
    # 获取数据库 ID 并更新 wrangler.toml
    # 注意：这里需要手动复制粘贴实际的数据库 ID
    echo -e "${GREEN}请手动更新 wrangler.toml 中的 database_id${NC}"
}

# 部署 Workers
deploy_workers() {
    echo -e "${YELLOW}部署 Cloudflare Workers...${NC}"
    cd cloudflare-workers
    wrangler deploy
    cd ..
}

# 部署前端到 Cloudflare Pages
deploy_pages() {
    echo -e "${YELLOW}部署前端到 Cloudflare Pages...${NC}"
    cd frontend
    npm run build
    npx wrangler pages deploy dist
    cd ..
}

# 主部署流程
main() {
    check_wrangler_login
    deploy_d1
    deploy_workers
    deploy_pages
    
    echo -e "${GREEN}部署完成！${NC}"
}

# 执行主流程
main
