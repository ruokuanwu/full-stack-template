import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { config } from '@/config'
import { runMigrations } from '@/db'
import { loggerMiddleware } from '@/middleware/logger'
import { authModule } from '@/modules/auth'
import { usersModule } from '@/modules/users'
import { logger } from '@/utils/logger'
import { fail } from '@/utils/response'

// ── 初始化数据库 ────────────────────────────────────────────────────────────────
runMigrations()

// ── 创建应用 ────────────────────────────────────────────────────────────────────
const app = new Elysia()

    // ─ CORS ─────────────────────────────────────────────────────────────────────
    .use(
        cors({
            origin: config.isDev ? true : ['https://your-domain.com'],
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            credentials: true,
        }),
    )

    // ─ Swagger 文档（仅开发环境） ─────────────────────────────────────────────────
    .use(
        swagger({
            documentation: {
                info: {
                    title: 'Full Stack Template API',
                    version: '1.0.0',
                    description: 'Vue + Vite + Bun + Elysia 全栈模板接口文档',
                },
                tags: [
                    { name: 'auth', description: '认证相关' },
                    { name: 'users', description: '用户管理' },
                ],
            },
            path: '/docs',
        }),
    )

    // ─ 请求日志 ───────────────────────────────────────────────────────────────────
    .use(loggerMiddleware)

    // ─ 全局错误处理 ───────────────────────────────────────────────────────────────
    .onError(({ error, set }) => {
        const msg = error.message

        // 认证/授权错误
        if (msg.includes('Unauthorized') || msg.includes('Missing authorization')) {
            set.status = 401
            return fail(msg)
        }
        if (msg.includes('Forbidden') || msg.includes('admin only')) {
            set.status = 403
            return fail(msg)
        }
        // 验证错误（TypeBox）
        if (msg.includes('Expected') || msg.includes('Validation')) {
            set.status = 422
            return fail(`Validation error: ${msg}`)
        }

        // 其余服务器错误
        logger.error('Unhandled error', { message: msg })
        set.status = 500
        return fail(config.isDev ? msg : 'Internal server error')
    })

    // ─ 健康检查 ───────────────────────────────────────────────────────────────────
    .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))

    // ─ 业务模块 ───────────────────────────────────────────────────────────────────
    .use(authModule)
    .use(usersModule)

    // ─ 启动 ───────────────────────────────────────────────────────────────────────
    .listen(config.port)

logger.info(`🚀 Server running at http://localhost:${config.port}`)
logger.info(`📚 Swagger docs at  http://localhost:${config.port}/docs`)

export type App = typeof app
