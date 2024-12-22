#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # 无颜色

# 检查是否安装了必要的工具
check_dependencies() {
    echo -e "${YELLOW}检查部署依赖...${NC}"
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}错误：npm 未安装${NC}"
        exit 1
    fi

    # 检查 wrangler
    if ! command -v wrangler &> /dev/null; then
        echo -e "${RED}错误：Cloudflare Wrangler 未安装${NC}"
        echo -e "${YELLOW}请运行：npm install -g wrangler${NC}"
        exit 1
    fi
}

# 构建前端
build_frontend() {
    echo -e "${YELLOW}构建前端项目...${NC}"
    cd frontend
    npm install
    npm run build
    cd ..
}

# 部署 Cloudflare Workers
deploy_workers() {
    echo -e "${YELLOW}部署 Cloudflare Workers...${NC}"
    cd cloudflare-workers
    npm install
    wrangler deploy
    cd ..
}

# 部署前端到 Cloudflare Pages
deploy_frontend() {
    echo -e "${YELLOW}部署前端到 Cloudflare Pages...${NC}"
    cd frontend
    npx wrangler pages deploy dist --project-name=personal-blog
    cd ..
}

# 主部署流程
main() {
    check_dependencies
    build_frontend
    deploy_workers
    deploy_frontend
    
    echo -e "${GREEN}部署完成！${NC}"
}

# 执行主流程
main
