import { t } from 'elysia'

// ─── 请求体 ───────────────────────────────────────────────────────────────────

export const RegisterDto = t.Object({
    username: t.String({ minLength: 3, maxLength: 32, pattern: '^[a-zA-Z0-9_]+$' }),
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8, maxLength: 72 }),
})

export const LoginDto = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 1 }),
})

// ─── 响应体 ───────────────────────────────────────────────────────────────────

export const AuthTokenResponse = t.Object({
    success: t.Boolean(),
    message: t.String(),
    data: t.Optional(
        t.Object({
            token: t.String(),
            expiresIn: t.String(),
            user: t.Object({
                id: t.Number(),
                username: t.String(),
                email: t.String(),
                role: t.String(),
            }),
        }),
    ),
})
