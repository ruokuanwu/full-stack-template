import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { bearer } from '@elysiajs/bearer'
import { config } from '@/config'
import type { JWTPayload } from '@/types'

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

        return {
            currentUser: payload as JWTPayload,
        }
    })

/**
 * 管理员守卫（在 authGuard 基础上追加角色校验）
 */
export const adminGuard = new Elysia({ name: 'admin-guard' })
    .use(authGuard)
    .derive({ as: 'scoped' }, ({ currentUser, set }) => {
        if (currentUser.role !== 'admin') {
            set.status = 403
            throw new Error('Forbidden: admin only')
        }
        return {}
    })
