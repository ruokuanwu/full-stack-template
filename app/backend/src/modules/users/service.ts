import { hashPassword, verifyPassword } from '@/utils/password'
import type { ChangePasswordRequest, ListUsersRequest, UpdateUserRequest } from './dto'
import type { User } from './model'
import {
    deleteUserByIdFromDb,
    findUserByIdFromDb,
    getPasswordHashByUserIdFromDb,
    listUsersFromDb,
    updatePasswordByUserIdFromDb,
    updateUserByIdFromDb,
} from './repository'

// ─── 列表（分页 + 关键字） ────────────────────────────────────────────────────

export function listUsers(request: ListUsersRequest = {}): { items: User[]; total: number } {
    return listUsersFromDb(request)
}

// ─── 单个用户 ──────────────────────────────────────────────────────────────────

export function getUserById(id: number): User | null {
    return findUserByIdFromDb(id)
}

// ─── 更新 ─────────────────────────────────────────────────────────────────────

export function updateUser(id: number, request: UpdateUserRequest): User | null {
    return updateUserByIdFromDb(id, request)
}

// ─── 修改密码 ─────────────────────────────────────────────────────────────────

export async function changePassword(
    id: number,
    request: ChangePasswordRequest,
): Promise<{ ok: boolean; reason?: string }> {
    const passwordHash = getPasswordHashByUserIdFromDb(id)
    if (!passwordHash) return { ok: false, reason: 'user_not_found' }

    const valid = await verifyPassword(request.currentPassword, passwordHash)
    if (!valid) return { ok: false, reason: 'wrong_password' }

    const newHash = await hashPassword(request.newPassword)
    updatePasswordByUserIdFromDb(id, newHash)
    return { ok: true }
}

// ─── 删除 ─────────────────────────────────────────────────────────────────────

export function deleteUser(id: number): boolean {
    return deleteUserByIdFromDb(id)
}
