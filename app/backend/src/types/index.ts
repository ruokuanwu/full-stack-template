// ─── 数据库实体类型 ───────────────────────────────────────────────────────────

export interface UserRow {
    id: number
    username: string
    email: string
    password_hash: string
    role: 'admin' | 'user'
    is_active: number // SQLite 存 0/1
    created_at: string
    updated_at: string
}

// ─── 业务层类型（不含敏感字段） ───────────────────────────────────────────────

export interface User {
    id: number
    username: string
    email: string
    role: 'admin' | 'user'
    isActive: boolean
    createdAt: string
    updatedAt: string
}

// ─── JWT ─────────────────────────────────────────────────────────────────────

export interface JWTPayload {
    sub: number   // user id
    email: string
    username: string
    role: 'admin' | 'user'
    iat?: number
    exp?: number
}

// ─── API 通用响应 ─────────────────────────────────────────────────────────────

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

// ─── 分页查询参数 ─────────────────────────────────────────────────────────────

export interface PaginationQuery {
    page?: number
    pageSize?: number
}
