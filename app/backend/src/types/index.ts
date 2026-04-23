import { t } from 'elysia'

export const PaginationRequestDto = t.Object({
    page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
    pageSize: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
})

export const SuccessResponseDto = t.Object({
    success: t.Boolean(),
    message: t.String(),
    data: t.Optional(t.Any()),
})

export const FailureResponseDto = t.Object({
    success: t.Boolean(),
    message: t.String(),
})

export type PaginationRequest = typeof PaginationRequestDto.static

export const JwtTokenRequestDto = t.Object({
    sub: t.Number(),
    email: t.String(),
    username: t.String(),
    role: t.Union([t.Literal('admin'), t.Literal('user')]),
    iat: t.Optional(t.Number()),
    exp: t.Optional(t.Number()),
})

export interface JWTPayload {
    sub: number
    email: string
    username: string
    role: 'admin' | 'user'
    iat?: number
    exp?: number
}

export interface ApiResponse<T = unknown> {
    success: boolean
    message: string
    data?: T
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
    total: number
    page: number
    pageSize: number
}
