# Full Stack Template

基于 **Vue 3 + Vite + Element Plus + Bun + Elysia** 的全栈项目模板。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3, Vite, Element Plus, Pinia, Vue Router |
| 后端 | Bun, Elysia, SQLite |
| 类型桥接 | Eden Treaty (端到端类型安全) |
| 部署 | Docker, Nginx |

## 项目结构

```
├── app/
│   ├── backend/          # Elysia 后端
│   │   └── src/
│   │       ├── config/       # 环境配置
│   │       ├── db/           # SQLite 数据库 & 迁移
│   │       ├── middleware/   # JWT 认证 & 日志中间件
│   │       ├── modules/      # 业务模块 (auth, users)
│   │       ├── types/        # 类型定义
│   │       └── utils/        # 工具函数
│   ├── frontend/         # Vue 3 前端
│   │   └── src/
│   │       ├── api/          # Eden API 客户端
│   │       ├── components/   # 公共组件
│   │       ├── layouts/      # 布局组件
│   │       ├── lib/          # Eden 配置
│   │       ├── router/       # 路由
│   │       ├── stores/       # Pinia 状态管理
│   │       ├── types/        # 前端类型
│   │       └── views/        # 页面视图
│   └── shared/           # 前后端共享类型桥接
├── deploy/               # Docker 部署配置
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
└── Makefile
```

## 快速开始

### 前置条件

- [Bun](https://bun.sh/) >= 1.0
- [Node.js](https://nodejs.org/) >= 18 (仅 vue-tsc 需要)

### 安装 & 运行

```bash
# 安装依赖
make install

# 生成后端类型声明（Eden 端到端类型推导需要）
make types

# 启动开发服务（后端 + 前端 + 类型监听）
make dev
```

启动后访问：
- 前端: http://localhost:5173
- 后端 API: http://localhost:3000
- Swagger 文档: http://localhost:3000/docs

### 环境变量

后端 (`app/backend/.env`)：

| 变量 | 默认值 | 说明 |
|---|---|---|
| `PORT` | `3000` | 服务端口 |
| `JWT_SECRET` | (开发默认值) | JWT 签名密钥 |
| `JWT_EXPIRES_IN` | `7d` | Token 过期时间 |
| `DB_PATH` | `./data.db` | SQLite 数据库路径 |
| `NODE_ENV` | `development` | 运行环境 |
| `LOG_LEVEL` | `info` | 日志级别 |
| `LOG_DIR` | `./logs` | 日志目录 |

前端 (`app/frontend/.env`)：

| 变量 | 默认值 | 说明 |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3000` | 后端 API 地址 |

## VS Code 调试

项目已配置 `.vscode/launch.json` 和 `.vscode/tasks.json`：

- **Backend (Bun)**：使用 Bun 调试器启动后端，支持断点调试
- **Frontend (Chrome)**：启动 Chrome 调试前端
- **Full Stack Debug**：同时调试前后端
- **Ctrl+Shift+B**：运行 `dev:all` 任务（同时启动后端 + 前端 + 类型监听）

> 调试后端前需安装 VS Code 扩展 [Bun for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=oven.bun-vscode)。

## Make 命令

### 开发

```bash
make install       # 安装前后端所有依赖
make types         # 生成后端 .d.ts 类型声明
make dev           # 同时启动后端、前端和类型监听
make dev-backend   # 仅启动后端
make dev-frontend  # 仅启动前端
make dev-types     # 仅启动类型监听
make build         # 构建前端生产产物
make start         # 生产模式启动后端
make db-migrate    # 运行数据库迁移
make clean         # 清理构建产物
```

### Docker 部署

```bash
make docker-build  # 构建 Docker 镜像
make docker-up     # 启动容器（后台运行）
make docker-down   # 停止容器
make docker-logs   # 查看容器日志
make docker-clean  # 停止容器并清理镜像和数据卷
```

## Docker 部署

### 快速部署

```bash
# 构建并启动
make docker-build
make docker-up
```

启动后访问：
- 前端: http://localhost (nginx 反向代理)
- 后端 API: http://localhost:3000

### 自定义配置

复制 `deploy/.env.example` 为 `deploy/.env` 并修改：

```bash
cp deploy/.env.example deploy/.env
```

主要配置项：

```env
FRONTEND_PORT=80        # 前端端口
BACKEND_PORT=3000       # 后端端口
JWT_SECRET=your-secret  # JWT 密钥（必须修改）
```

### 架构说明

```
┌─────────┐       ┌─────────────────────────┐       ┌─────────┐
│ Browser  │──80──▶│  Nginx (frontend)       │       │         │
│          │       │  /api/* ──proxy──▶ :3000 ├──────▶│ Backend │
│          │       │  /*     ──SPA──▶ dist/   │       │ (Bun)   │
└─────────┘       └─────────────────────────┘       └────┬────┘
                                                         │
                                                    ┌────▼────┐
                                                    │ SQLite  │
                                                    │ (volume)│
                                                    └─────────┘
```

## 功能特性

- **认证系统**：JWT 注册/登录，Bearer Token 鉴权
- **用户管理**：CRUD，角色权限（admin/user）
- **端到端类型安全**：Eden Treaty 自动推导 API 类型
- **请求日志**：文件日志 + 控制台彩色输出
- **Swagger 文档**：自动生成 API 文档（`/docs`）
- **Docker 一键部署**：前后端独立容器，nginx 反代

## License

MIT
