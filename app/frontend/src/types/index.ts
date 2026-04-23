import type { eden } from '@/lib/eden'

// ─── 从 Eden 推断后端模型类型 ────────────────────────────────────────────────────
// User 类型从 /users 列表端点的成功响应中提取，与后端 UserResponseDto 保持同步

type _UsersListSuccess = Extract<
    NonNullable<Awaited<ReturnType<typeof eden.users.get>>['data']>,
    { success: true }
>
export type User = _UsersListSuccess['data'][number]

// ─── UI 专属表单类型 ────────────────────────────────────────────────────────────
// confirmPassword 仅用于前端校验，不发送给后端

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
