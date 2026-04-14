# Full Stack Template

基于 **Vue 3 + Vite + ElementPlus + TypeScript**（前端）和 **Bun + Elysia**（后端）的全栈项目模板。

## 技术栈

| 层次 | 技术 |
|------|------|
| 前端框架 | Vue 3 (Composition API) |
| 构建工具 | Vite 6 |
| UI 组件库 | ElementPlus 2 |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| HTTP 客户端 | Axios |
| 后端运行时 | Bun |
| 后端框架 | Elysia 1.x |
| 数据库 | SQLite（Bun 内置） |
| 认证 | JWT（@elysiajs/jwt） |
| 密码哈希 | Argon2id（Bun.password） |
| API 文档 | Swagger（@elysiajs/swagger） |

## 目录结构

```
full-stack-template/
├── backend/                       # Bun + Elysia 后端
│   ├── src/
│   │   ├── config/
│   │   │   └── index.ts           # 环境变量配置
│   │   ├── db/
│   │   │   ├── index.ts           # 数据库连接（单例）
│   │   │   ├── schema.ts          # 建表 DDL
│   │   │   └── migrate.ts         # 迁移脚本入口
│   │   ├── middleware/
│   │   │   ├── auth.ts            # JWT 认证守卫插件
│   │   │   └── logger.ts          # 请求日志中间件
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── dto.ts         # 请求/响应 Schema（TypeBox）
│   │   │   │   ├── service.ts     # 认证业务逻辑
│   │   │   │   └── index.ts       # 路由注册（Elysia 插件）
│   │   │   └── users/
│   │   │       ├── dto.ts         # 请求/响应 Schema
│   │   │       ├── service.ts     # 用户 CRUD 业务逻辑
│   │   │       └── index.ts       # 路由注册
│   │   ├── types/
│   │   │   └── index.ts           # 公共 TypeScript 类型
│   │   ├── utils/
│   │   │   ├── logger.ts          # 结构化日志（分级+写文件）
│   │   │   ├── password.ts        # 密码哈希工具（Argon2id）
│   │   │   └── response.ts        # 统一响应格式工具
│   │   └── index.ts               # 应用入口
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # Vue 3 + Vite 前端
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.ts            # 认证 API
│   │   │   └── user.ts            # 用户 API
│   │   ├── components/
│   │   │   ├── AppHeader.vue      # 顶部导航栏
│   │   │   └── AppSidebar.vue     # 侧边菜单
│   │   ├── layouts/
│   │   │   └── DefaultLayout.vue  # 主布局（含侧栏+Header）
│   │   ├── router/
│   │   │   └── index.ts           # 路由定义 + 导航守卫
│   │   ├── stores/
│   │   │   ├── auth.ts            # Pinia 认证状态
│   │   │   └── app.ts             # Pinia 应用全局状态
│   │   ├── types/
│   │   │   └── index.ts           # 前端 TypeScript 类型
│   │   ├── utils/
│   │   │   └── request.ts         # Axios 实例 + 拦截器
│   │   ├── views/
│   │   │   ├── LoginView.vue      # 登录页
│   │   │   ├── RegisterView.vue   # 注册页
│   │   │   ├── HomeView.vue       # Dashboard 首页
│   │   │   ├── ProfileView.vue    # 个人资料页
│   │   │   ├── UsersView.vue      # 用户管理页（管理员）
│   │   │   └── NotFoundView.vue   # 404 页
│   │   ├── App.vue
│   │   └── main.ts
│   ├── index.html
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
└── README.md
```

## 快速开始

### 1. 启动后端

```bash
cd backend

# 安装依赖
bun install

# 复制环境变量（按需修改 JWT_SECRET 等）
cp .env.example .env

# 运行数据库迁移（首次运行）
bun db:migrate

# 开发模式启动（热重载）
bun dev
```

后端默认监听 `http://localhost:3000`  
Swagger 文档地址：`http://localhost:3000/docs`

### 2. 启动前端

```bash
cd frontend

# 安装依赖
bun install   # 或 npm install / pnpm install

# 复制环境变量
cp .env.example .env

# 开发模式启动
bun run dev
```

前端默认运行在 `http://localhost:5173`，`/api` 请求自动代理到后端 `3000` 端口。

## API 端点

| 方法 | 路径 | 描述 | 鉴权 |
|------|------|------|------|
| `GET` | `/health` | 健康检查 | 无 |
| `POST` | `/auth/register` | 注册 | 无 |
| `POST` | `/auth/login` | 登录，返回 JWT | 无 |
| `GET` | `/auth/me` | 获取当前用户 | JWT |
| `GET` | `/users` | 用户列表（分页） | JWT + 管理员 |
| `GET` | `/users/:id` | 获取单个用户 | JWT（本人或管理员） |
| `PUT` | `/users/:id` | 更新用户信息 | JWT（本人或管理员） |
| `PATCH` | `/users/:id/password` | 修改密码 | JWT（本人） |
| `DELETE` | `/users/:id` | 删除用户 | JWT + 管理员 |

## 功能模块说明

### 认证模块
- 注册：用户名/邮箱唯一校验，密码使用 Argon2id 哈希
- 登录：校验通过后签发 JWT，有效期可配置
- 守卫：`authGuard` 插件负责验证 Bearer Token 并向路由上下文注入 `currentUser`
- 角色：内置 `admin` / `user` 两种角色，`adminGuard` 基于 `authGuard` 追加角色校验

### 日志模块
- 分级：`debug / info / warn / error`，可通过 `LOG_LEVEL` 环境变量控制输出级别
- 控制台带 ANSI 颜色区分级别
- 生产环境自动写入 `logs/<YYYY-MM-DD>.log` 和 `logs/error.log`

### 错误处理
- Elysia 全局 `onError` 钩子统一捕获并返回标准 JSON 响应
- 前端 Axios 响应拦截器统一处理 `401/403/404/422/500`，并通过 ElMessage 提示用户

### 数据库
- Bun 内置 SQLite（零外部依赖），WAL 模式 + 外键约束
- 建表逻辑全部封装在 `schema.ts`，可一键幂等迁移
- 表：`users`、`refresh_tokens`（预留）、`audit_logs`（预留）

## 环境变量

### 后端 (`backend/.env`)

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | 监听端口 |
| `JWT_SECRET` | *(必须修改)* | JWT 签名密钥（生产环境至少 32 字符） |
| `JWT_EXPIRES_IN` | `7d` | Token 有效期 |
| `DB_PATH` | `./data.db` | SQLite 文件路径 |
| `NODE_ENV` | `development` | 环境标识 |
| `LOG_LEVEL` | `debug` | 日志级别 |
| `LOG_DIR` | `./logs` | 日志文件目录 |

### 前端 (`frontend/.env`)

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `VITE_APP_TITLE` | `Full Stack Template` | 应用标题 |
| `VITE_API_BASE_URL` | `http://localhost:3000` | 后端 API 地址（生产环境下使用） |

> 开发模式下前端通过 Vite 代理将 `/api` 转发到后端，无需设置 `VITE_API_BASE_URL`。

## 生产部署

```bash
# 后端
cd backend
bun start

# 前端
cd frontend
bun run build
# 将 dist/ 部署至 Nginx / CDN
```
