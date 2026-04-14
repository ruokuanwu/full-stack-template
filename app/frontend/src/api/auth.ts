import { eden, normalizeEden } from '@/lib/eden'
import type { ApiResponse, AuthToken, LoginForm, RegisterForm, User } from '@/types'

/**
 * 注册
 * Eden 自动推导请求体类型来自后端 RegisterDto，响应类型来自路由返回值
 */
export async function register(
    data: Omit<RegisterForm, 'confirmPassword'>,
): Promise<{ data: ApiResponse<User> }> {
    const res = await eden.auth.register.post(data)
    return normalizeEden<ApiResponse<User>>(res as never)
}

/**
 * 登录
 */
export async function login(data: LoginForm): Promise<{ data: ApiResponse<AuthToken> }> {
    const res = await eden.auth.login.post(data)
    return normalizeEden<ApiResponse<AuthToken>>(res as never)
}

/**
 * 获取当前登录用户信息
 */
export async function getMe(): Promise<{ data: ApiResponse<User> }> {
    const res = await eden.auth.me.get()
    return normalizeEden<ApiResponse<User>>(res as never)
}
