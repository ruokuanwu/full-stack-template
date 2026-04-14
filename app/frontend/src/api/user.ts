import { eden, normalizeEden } from '@/lib/eden'
import type { ApiResponse, PaginatedResponse, PaginationParams, User } from '@/types'

/**
 * 获取用户列表（管理员）
 * Eden 推导分页查询参数类型来自后端 PaginationQuery schema
 */
export async function getUsers(
    params?: PaginationParams,
): Promise<{ data: PaginatedResponse<User> }> {
    const res = await eden.users.get({ query: params as never })
    return normalizeEden<PaginatedResponse<User>>(res as never)
}

/**
 * 获取单个用户
 */
export async function getUserById(id: number): Promise<{ data: ApiResponse<User> }> {
    const res = await eden.users({ id }).get()
    return normalizeEden<ApiResponse<User>>(res as never)
}

/**
 * 更新用户信息
 */
export async function updateUser(
    id: number,
    data: Partial<Pick<User, 'username' | 'email' | 'role' | 'isActive'>>,
): Promise<{ data: ApiResponse<User> }> {
    const res = await eden.users({ id }).put(data as never)
    return normalizeEden<ApiResponse<User>>(res as never)
}

/**
 * 修改密码
 */
export async function changePassword(
    id: number,
    data: { currentPassword: string; newPassword: string },
): Promise<{ data: ApiResponse<null> }> {
    const res = await eden.users({ id }).password.patch(data as never)
    return normalizeEden<ApiResponse<null>>(res as never)
}

/**
 * 删除用户（管理员）
 */
export async function deleteUser(id: number): Promise<{ data: ApiResponse<null> }> {
    const res = await eden.users({ id }).delete()
    return normalizeEden<ApiResponse<null>>(res as never)
}
