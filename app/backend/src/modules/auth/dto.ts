import { t } from 'elysia'

export const RegisterRequestDto = t.Object({
    username: t.String({ minLength: 3, maxLength: 32, pattern: '^[a-zA-Z0-9_]+$' }),
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8, maxLength: 72 }),
})

export const LoginRequestDto = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 1 }),
})

export const AuthUserResponseDto = t.Object({
    id: t.Number(),
    username: t.String(),
    email: t.String(),
    role: t.Union([t.Literal('admin'), t.Literal('user')]),
})

export const LoginResponseDto = t.Object({
    token: t.String(),
    expiresIn: t.String(),
    user: AuthUserResponseDto,
})

export const RegisterResponseDto = t.Object({
    id: t.Number(),
    username: t.String(),
    email: t.String(),
    role: t.Union([t.Literal('admin'), t.Literal('user')]),
    createdAt: t.String(),
})

export type RegisterRequest = typeof RegisterRequestDto.static
export type LoginRequest = typeof LoginRequestDto.static
export type AuthUserResponse = typeof AuthUserResponseDto.static
export type LoginResponse = typeof LoginResponseDto.static
export type RegisterResponse = typeof RegisterResponseDto.static
