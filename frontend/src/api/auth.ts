import request from '@/utils/request'
import type { ApiResponse, AuthToken, LoginForm, RegisterForm, User } from '@/types'

/**
 * 注册
 */
export function register(data: Omit<RegisterForm, 'confirmPassword'>) {
    return request.post<ApiResponse<User>>('/auth/register', data)
}

/**
 * 登录
 */
export function login(data: LoginForm) {
    return request.post<ApiResponse<AuthToken>>('/auth/login', data)
}

/**
 * 获取当前登录用户信息
 */
export function getMe() {
    return request.get<ApiResponse<User>>('/auth/me')
}
