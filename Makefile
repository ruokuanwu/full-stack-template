# ─── 变量 ─────────────────────────────────────────────────────────────────────

BACKEND_DIR  := app/backend
FRONTEND_DIR := app/frontend
DEPLOY_DIR   := deploy

GREEN  := \033[0;32m
YELLOW := \033[0;33m
CYAN   := \033[0;36m
RESET  := \033[0m

# ─── 默认目标 ──────────────────────────────────────────────────────────────────

.DEFAULT_GOAL := help

.PHONY: help install types dev build start clean db-migrate \
        dev-backend dev-frontend dev-types \
        docker-build docker-up docker-down docker-logs docker-clean

# ─── 帮助 ──────────────────────────────────────────────────────────────────────

help:
	@echo ""
	@echo "$(CYAN)Full Stack Template$(RESET)  (Vue + Vite + ElementPlus + Bun + Elysia)"
	@echo ""
	@echo "$(GREEN)开发:$(RESET)"
	@echo "  make install      安装前后端所有依赖"
	@echo "  make types        生成后端 .d.ts 类型声明（Eden 类型推断需要此步骤）"
	@echo "  make dev          同时启动后端、前端和类型监听（开发模式）"
	@echo "  make dev-backend  仅启动后端"
	@echo "  make dev-frontend 仅启动前端"
	@echo "  make dev-types    仅启动类型监听"
	@echo "  make build        构建前端生产产物"
	@echo "  make start        生产模式启动后端"
	@echo "  make db-migrate   运行数据库迁移"
	@echo "  make clean        清理构建产物"
	@echo ""
	@echo "$(GREEN)Docker:$(RESET)"
	@echo "  make docker-build 构建 Docker 镜像"
	@echo "  make docker-up    启动 Docker 容器（后台）"
	@echo "  make docker-down  停止并移除 Docker 容器"
	@echo "  make docker-logs  查看 Docker 容器日志"
	@echo "  make docker-clean 停止容器并清理镜像和数据卷"
	@echo ""

# ─── 安装 ──────────────────────────────────────────────────────────────────────

install:
	@echo "$(GREEN)▶ Installing backend dependencies...$(RESET)"
	cd $(BACKEND_DIR) && bun install
	@echo "$(GREEN)▶ Installing frontend dependencies...$(RESET)"
	cd $(FRONTEND_DIR) && bun install
	@echo "$(GREEN)✓ All dependencies installed.$(RESET)"

# ─── 类型生成（Eden 类型推断需要此步骤） ──────────────────────────────────────

types:
	@echo "$(YELLOW)▶ Generating backend type declarations...$(RESET)"
	cd $(BACKEND_DIR) && bunx tsc -p tsconfig.types.json
	@echo "$(GREEN)✓ Type declarations generated at $(BACKEND_DIR)/dist/types/$(RESET)"

# ─── 开发模式 ──────────────────────────────────────────────────────────────────
# 并行启动：后端服务 + 后端类型监听 + 前端 Vite 开发服务器

dev:
	@echo "$(CYAN)▶ Starting development servers...$(RESET)"
	@echo "  Backend  : http://localhost:3000"
	@echo "  Swagger  : http://localhost:3000/docs"
	@echo "  Frontend : http://localhost:5173"
	@echo ""
	@trap 'kill 0' SIGINT; \
	  (cd $(BACKEND_DIR) && bun dev 2>&1 | sed 's/^/$(YELLOW)[backend]$(RESET) /') & \
	  (cd $(BACKEND_DIR) && bunx tsc -p tsconfig.types.json --watch \
	     --preserveWatchOutput 2>&1 | sed 's/^/$(CYAN)[types]$(RESET)   /') & \
	  (sleep 1 && cd $(FRONTEND_DIR) && bun run dev 2>&1 | \
	     sed 's/^/$(GREEN)[frontend]$(RESET) /') & \
	  wait

# 单独启动各进程（用于调试或分屏）
dev-backend:
	cd $(BACKEND_DIR) && bun dev

dev-frontend:
	cd $(FRONTEND_DIR) && bun run dev

dev-types:
	cd $(BACKEND_DIR) && bunx tsc -p tsconfig.types.json --watch --preserveWatchOutput

# ─── 构建 ──────────────────────────────────────────────────────────────────────

build: types
	@echo "$(GREEN)▶ Building frontend for production...$(RESET)"
	cd $(FRONTEND_DIR) && bun run build
	@echo "$(GREEN)✓ Frontend built to $(FRONTEND_DIR)/dist/$(RESET)"

# ─── 生产启动 ──────────────────────────────────────────────────────────────────

start:
	@echo "$(GREEN)▶ Starting production backend...$(RESET)"
	cd $(BACKEND_DIR) && bun start

# ─── 数据库 ────────────────────────────────────────────────────────────────────

db-migrate:
	@echo "$(YELLOW)▶ Running database migrations...$(RESET)"
	cd $(BACKEND_DIR) && bun db:migrate
	@echo "$(GREEN)✓ Migrations complete.$(RESET)"

# ─── 清理 ──────────────────────────────────────────────────────────────────────

clean:
	@echo "$(YELLOW)▶ Cleaning build artifacts...$(RESET)"
	rm -rf $(FRONTEND_DIR)/dist
	rm -rf $(BACKEND_DIR)/dist
	find . -name "*.tsbuildinfo" -not -path "*/node_modules/*" -delete
	@echo "$(GREEN)✓ Cleaned.$(RESET)"
