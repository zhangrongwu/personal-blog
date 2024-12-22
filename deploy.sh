#!/bin/bash

# 部署脚本 v2.0 - 个人技术博客自动化部署工具

# ANSI 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 日志函数
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    
    case "$level" in
        "info")
            echo -e "${BLUE}[INFO ${timestamp}]${NC} $message"
            ;;
        "success")
            echo -e "${GREEN}[SUCCESS ${timestamp}]${NC} $message"
            ;;
        "warning")
            echo -e "${YELLOW}[WARNING ${timestamp}]${NC} $message"
            ;;
        "error")
            echo -e "${RED}[ERROR ${timestamp}]${NC} $message"
            ;;
    esac
}

# 错误处理函数
handle_error() {
    local error_message="$1"
    log "error" "$error_message"
    exit 1
}

# 检查依赖
check_dependencies() {
    log "info" "检查部署依赖..."
    
    local dependencies=("npm" "wrangler" "git")
    for cmd in "${dependencies[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            handle_error "$cmd 未安装。请安装：brew install $cmd 或 npm install -g $cmd"
        fi
    done
}

# Git 状态检查
check_git_status() {
    log "info" "检查 Git 状态..."
    
    if [[ -n $(git status -s) ]]; then
        log "warning" "检测到未提交的更改"
        git status
        read -p "是否继续部署？(y/n) " continue_deploy
        
        if [[ "$continue_deploy" != "y" ]]; then
            handle_error "部署已取消"
        fi
    fi
}

# 构建前端
build_frontend() {
    log "info" "构建前端项目..."
    
    cd frontend || handle_error "无法进入前端目录"
    
    npm install || handle_error "前端依赖安装失败"
    npm run lint || log "warning" "代码风格检查未通过"
    npm run build || handle_error "前端构建失败"
    
    cd ..
}

# 运行前端测试
test_frontend() {
    log "info" "运行前端测试..."
    
    cd frontend || handle_error "无法进入前端目录"
    
    if npm run test &> /dev/null; then
        log "success" "前端测试通过"
    else
        log "warning" "前端测试未通过，继续部署"
    fi
    
    cd ..
}

# 部署 Cloudflare Workers
deploy_workers() {
    log "info" "部署 Cloudflare Workers..."
    
    cd cloudflare-workers || handle_error "无法进入 Workers 目录"
    
    npm install || handle_error "Workers 依赖安装失败"
    wrangler deploy || handle_error "Workers 部署失败"
    
    cd ..
}

# 部署前端到 Cloudflare Pages
deploy_frontend() {
    log "info" "部署前端到 Cloudflare Pages..."
    
    cd frontend || handle_error "无法进入前端目录"
    
    npx wrangler pages deploy dist \
        --project-name=personal-blog \
        --branch=main \
        --commit-dirty=true || handle_error "前端部署到 Cloudflare Pages 失败"
    
    cd ..
}

# 发布 Git 标签
create_release_tag() {
    log "info" "创建发布标签..."
    
    local version=$(date "+%Y%m%d.%H%M%S")
    git tag -a "v$version" -m "自动部署 $version" || handle_error "创建 Git 标签失败"
    git push origin "v$version" || log "warning" "推送 Git 标签失败"
}

# 主部署流程
main() {
    clear
    
    log "info" "🚀 个人技术博客自动化部署工具 v2.0"
    
    check_dependencies
    check_git_status
    
    build_frontend
    test_frontend
    
    deploy_workers
    deploy_frontend
    
    create_release_tag
    
    log "success" "🎉 部署完成！访问地址：https://personal-blog-593.pages.dev"
}

# 执行主流程
main
