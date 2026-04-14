import { Elysia } from 'elysia'
import { logger } from '@/utils/logger'

/**
 * 请求日志中间件
 * 记录每个请求的方法、路径、状态码和耗时
 */
export const loggerMiddleware = new Elysia({ name: 'logger-middleware' })
    .onRequest(({ request, store }) => {
        // 在 store 中记录请求开始时间
        ; (store as Record<string, unknown>)._reqStart = Date.now()

        logger.info(`→ ${request.method} ${new URL(request.url).pathname}`)
    })
    .onAfterHandle({ as: 'global' }, ({ request, set, store }) => {
        const start = (store as Record<string, unknown>)._reqStart as number | undefined
        const duration = start ? `${Date.now() - start}ms` : '-'
        const status = set.status ?? 200
        const path = new URL(request.url).pathname

        const level = typeof status === 'number' && status >= 500
            ? 'error'
            : typeof status === 'number' && status >= 400
                ? 'warn'
                : 'info'

        logger[level](`← ${request.method} ${path} ${status} (${duration})`)
    })
    .onError({ as: 'global' }, ({ request, error, set }) => {
        const status = set.status ?? 500
        const path = new URL(request.url).pathname
        logger.error(`✗ ${request.method} ${path} ${status}`, {
            message: error.message,
        })
    })
