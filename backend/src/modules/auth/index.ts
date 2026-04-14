import { Elysia } from 'elysia'
import { jwtPlugin } from '@/middleware/auth'
import { authGuard } from '@/middleware/auth'
import { registerUser, loginUser, getUserById } from './service'
import { LoginDto, RegisterDto } from './dto'
import { success, fail } from '@/utils/response'
import { config } from '@/config'

export const authModule = new Elysia({ prefix: '/auth' })
    // ── 注册 ────────────────────────────────────────────────────────────────────
    .use(jwtPlugin)
    .post(
        '/register',
        async ({ body, set }) => {
            const result = await registerUser(body)
            if (!result.ok) {
                set.status = 409
                const messages: Record<string, string> = {
                    email_taken: 'Email already registered',
                    username_taken: 'Username already taken',
                }
                return fail(messages[result.reason] ?? 'Registration failed')
            }
            set.status = 201
            return success(
                {
                    id: result.user.id,
                    username: result.user.username,
                    email: result.user.email,
                    role: result.user.role,
                    createdAt: result.user.createdAt,
                },
                'Registration successful',
            )
        },
        { body: RegisterDto },
    )

    // ── 登录 ────────────────────────────────────────────────────────────────────
    .post(
        '/login',
        async ({ body, jwt, set }) => {
            const result = await loginUser(body)

            if (!result.ok) {
                set.status = 401
                return fail('Invalid email or password')
            }

            const { user } = result
            const token = await jwt.sign({
                sub: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            })

            return success(
                {
                    token,
                    expiresIn: config.jwtExpiresIn,
                    user: { id: user.id, username: user.username, email: user.email, role: user.role },
                },
                'Login successful',
            )
        },
        { body: LoginDto },
    )

    // ── 获取当前用户信息（需要认证） ─────────────────────────────────────────────
    .use(authGuard)
    .get('/me', ({ currentUser }) => {
        const user = getUserById(currentUser.sub)
        if (!user) return fail('User not found')
        return success(user)
    })
