import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { bearer } from '@elysiajs/bearer'
import { config } from '@/config'
import type { JWTPayload } from '@/types'

function isValidPayload(payload: unknown): payload is {
    sub: string
    email: string
    username: string
    role: 'admin' | 'user'
} {
    if (!payload || typeof payload !== 'object') return false
    const p = payload as Record<string, unknown>
    return (
        typeof p.sub === 'string'
        && typeof p.email === 'string'
        && typeof p.username === 'string'
        && (p.role === 'admin' || p.role === 'user')
    )
}

/**
 * 仅提供 jwt helper（sign/verify），供认证路由使用
 */
export const jwtPlugin = new Elysia({ name: 'jwt-plugin' }).use(
    jwt({
        name: 'jwt',
        secret: config.jwtSecret,
        exp: config.jwtExpiresIn,
    }),
)

/**
 * 认证守卫插件
 * 用于需要登录才能访问的路由组，会将 currentUser 注入上下文。
 * 示例：
 *   new Elysia().use(authGuard).get('/me', ({ currentUser }) => currentUser)
 */
export const authGuard = new Elysia({ name: 'auth-guard' })
    .use(jwtPlugin)
    .use(bearer())
    .derive({ as: 'scoped' }, async ({ jwt, bearer, set }) => {
        if (!bearer) {
            set.status = 401
            throw new Error('Missing authorization token')
        }

        const payload = await jwt.verify(bearer)
        if (!payload) {
            set.status = 401
            throw new Error('Invalid or expired token')
        }

        if (!isValidPayload(payload)) {
            set.status = 401
            throw new Error('Invalid token payload')
        }

        return {
            currentUser: {
                sub: Number(payload.sub),
                email: payload.email,
                username: payload.username,
                role: payload.role,
            } as JWTPayload,
        }
    })

/**
 * 管理员守卫（在 authGuard 基础上追加角色校验）
 */
export const adminGuard = new Elysia({ name: 'admin-guard' })
    .use(authGuard)
    .derive({ as: 'scoped' }, ({ currentUser, set }) => {
        if (!currentUser) {
            set.status = 401
            throw new Error('Missing user context')
        }

        if (currentUser.role !== 'admin') {
            set.status = 403
            throw new Error('Forbidden: admin only')
        }
        return {}
    })
