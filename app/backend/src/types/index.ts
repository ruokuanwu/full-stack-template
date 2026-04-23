import { t, type TSchema } from 'elysia'

// ── 分页请求 ────────────────────────────────────────────────────────────────────
export const PaginationRequestDto = t.Object({
    page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
    pageSize: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
})

// ── 失败响应 schema（用于路由 response 声明） ─────────────────────────────────────
export const FailureResponseDto = t.Object({
    success: t.Literal(false),
    message: t.String(),
})

// ── 成功响应 schema 工厂（用于路由 response 声明，Eden 类型推断依赖此）────────────
export const createSuccessResponseDto = <TDataSchema extends TSchema>(data: TDataSchema) =>
    t.Object({ success: t.Literal(true), message: t.String(), data })

// ── 分页成功响应 schema 工厂 ──────────────────────────────────────────────────────
export const createPaginatedResponseDto = <TItemSchema extends TSchema>(item: TItemSchema) =>
    t.Object({
        success: t.Literal(true),
        message: t.String(),
        data: t.Array(item),
        total: t.Number(),
        page: t.Number(),
        pageSize: t.Number(),
    })

// ── JWT Payload ──────────────────────────────────────────────────────────────────
export interface JWTPayload {
    sub: number
    email: string
    username: string
    role: 'admin' | 'user'
    iat?: number
    exp?: number
}
