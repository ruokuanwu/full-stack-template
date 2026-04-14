import request from '@/utils/request'
import type { ApiResponse, PaginatedResponse, PaginationParams, User } from '@/types'

/**
 * 获取用户列表（管理员）
 */
export function getUsers(params?: PaginationParams) {
    return request.get<PaginatedResponse<User>>('/users', { params })
}

/**
 * 获取单个用户
 */
export function getUserById(id: number) {
    return request.get<ApiResponse<User>>(`/users/${id}`)
}

/**
 * 更新用户信息
 */
export function updateUser(
    id: number,
    data: Partial<Pick<User, 'username' | 'email' | 'role' | 'isActive'>>,
) {
    return request.put<ApiResponse<User>>(`/users/${id}`, data)
}

/**
 * 修改密码
 */
export function changePassword(
    id: number,
    data: { currentPassword: string; newPassword: string },
) {
    return request.patch<ApiResponse<null>>(`/users/${id}/password`, data)
}

/**
 * 删除用户（管理员）
 */
export function deleteUser(id: number) {
    return request.delete<ApiResponse<null>>(`/users/${id}`)
}
