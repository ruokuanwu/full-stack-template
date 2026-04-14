import { db } from '@/db'
import { hashPassword, verifyPassword } from '@/utils/password'
import type { UserRow, User } from '@/types'

function rowToUser(row: UserRow): User {
    return {
        id: row.id,
        username: row.username,
        email: row.email,
        role: row.role,
        isActive: row.is_active === 1,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

// ─── 列表（分页 + 关键字） ────────────────────────────────────────────────────

export interface ListUsersOptions {
    page?: number
    pageSize?: number
    keyword?: string
}

export function listUsers(opts: ListUsersOptions = {}): { items: User[]; total: number } {
    const page = Math.max(1, opts.page ?? 1)
    const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20))
    const offset = (page - 1) * pageSize
    const like = opts.keyword ? `%${opts.keyword}%` : '%'

    const items = db
        .query<UserRow, [string, string, number, number]>(
            `SELECT * FROM users
       WHERE (username LIKE ?1 OR email LIKE ?2)
       ORDER BY id DESC
       LIMIT ?3 OFFSET ?4`,
        )
        .all(like, like, pageSize, offset)

    const { total } = db
        .query<{ total: number }, [string, string]>(
            `SELECT COUNT(*) AS total FROM users WHERE (username LIKE ?1 OR email LIKE ?2)`,
        )
        .get(like, like)!

    return { items: items.map(rowToUser), total }
}

// ─── 单个用户 ──────────────────────────────────────────────────────────────────

export function getUserById(id: number): User | null {
    const row = db.query<UserRow, [number]>('SELECT * FROM users WHERE id = ?1').get(id)
    return row ? rowToUser(row) : null
}

// ─── 更新 ─────────────────────────────────────────────────────────────────────

export interface UpdateUserInput {
    username?: string
    email?: string
    role?: 'admin' | 'user'
    isActive?: boolean
}

export function updateUser(id: number, input: UpdateUserInput): User | null {
    const fields: string[] = []
    const values: Array<string | number> = []
    let idx = 1

    if (input.username !== undefined) { fields.push(`username = ?${idx++}`); values.push(input.username) }
    if (input.email !== undefined) { fields.push(`email = ?${idx++}`); values.push(input.email) }
    if (input.role !== undefined) { fields.push(`role = ?${idx++}`); values.push(input.role) }
    if (input.isActive !== undefined) { fields.push(`is_active = ?${idx++}`); values.push(input.isActive ? 1 : 0) }

    if (fields.length === 0) return getUserById(id)

    fields.push(`updated_at = datetime('now')`)
    values.push(id)

    const row = db
        .query<UserRow, Array<string | number>>(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?${idx} RETURNING *`,
        )
        .get(...values)

    return row ? rowToUser(row) : null
}

// ─── 修改密码 ─────────────────────────────────────────────────────────────────

export async function changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
): Promise<{ ok: boolean; reason?: string }> {
    const row = db.query<UserRow, [number]>('SELECT * FROM users WHERE id = ?1').get(id)
    if (!row) return { ok: false, reason: 'user_not_found' }

    const valid = await verifyPassword(currentPassword, row.password_hash)
    if (!valid) return { ok: false, reason: 'wrong_password' }

    const newHash = await hashPassword(newPassword)
    db.run("UPDATE users SET password_hash = ?1, updated_at = datetime('now') WHERE id = ?2", [
        newHash,
        id,
    ])
    return { ok: true }
}

// ─── 删除 ─────────────────────────────────────────────────────────────────────

export function deleteUser(id: number): boolean {
    const result = db.run('DELETE FROM users WHERE id = ?1', [id])
    return result.changes > 0
}
