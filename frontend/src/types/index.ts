// ─── 用户相关 ─────────────────────────────────────────────────────────────────

export interface User {
    id: number
    username: string
    email: string
    role: 'admin' | 'user'
    isActive: boolean
    createdAt: string
    updatedAt: string
}

// ─── 认证相关 ─────────────────────────────────────────────────────────────────

export interface LoginForm {
    email: string
    password: string
}

export interface RegisterForm {
    username: string
    email: string
    password: string
    confirmPassword: string
}

export interface AuthToken {
    token: string
    expiresIn: string
    user: Pick<User, 'id' | 'username' | 'email' | 'role'>
}

// ─── API 响应 ─────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
    success: boolean
    message: string
    data?: T
}

export interface PaginatedResponse<T = unknown> {
    success: boolean
    message: string
    data: T[]
    total: number
    page: number
    pageSize: number
}

// ─── 查询参数 ─────────────────────────────────────────────────────────────────

export interface PaginationParams {
    page?: number
    pageSize?: number
    keyword?: string
}
