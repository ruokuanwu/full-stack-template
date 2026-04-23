import { db } from '@/db'
import type { ListUsersRequest, UpdateUserRequest } from './dto'
import { toUser, type User } from './model'

type UserRecord = Omit<User, 'isActive'> & { isActive: number }

function baseUserSelectSql(): string {
    return `
        id,
        username,
        email,
        role,
        is_active AS isActive,
        created_at AS createdAt,
        updated_at AS updatedAt
    `
}

export function listUsersFromDb(query: ListUsersRequest = {}): { items: User[]; total: number } {
    const page = Math.max(1, query.page ?? 1)
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20))
    const offset = (page - 1) * pageSize
    const like = query.keyword ? `%${query.keyword}%` : '%'

    const rows = db
        .query<UserRecord, [string, string, number, number]>(
            `SELECT ${baseUserSelectSql()} FROM users
             WHERE (username LIKE ?1 OR email LIKE ?2)
             ORDER BY id DESC
             LIMIT ?3 OFFSET ?4`,
        )
        .all(like, like, pageSize, offset)

    const totalRow = db
        .query<{ total: number }, [string, string]>(
            `SELECT COUNT(*) AS total FROM users WHERE (username LIKE ?1 OR email LIKE ?2)`,
        )
        .get(like, like)

    return {
        items: rows.map(toUser),
        total: totalRow?.total ?? 0,
    }
}

export function findUserByIdFromDb(id: number): User | null {
    const row = db
        .query<UserRecord, [number]>(
            `SELECT ${baseUserSelectSql()} FROM users WHERE id = ?1 LIMIT 1`,
        )
        .get(id)

    return row ? toUser(row) : null
}

export function updateUserByIdFromDb(id: number, input: UpdateUserRequest): User | null {
    const fields: string[] = []
    const values: Array<string | number> = []
    let idx = 1

    if (input.username !== undefined) { fields.push(`username = ?${idx++}`); values.push(input.username) }
    if (input.email !== undefined) { fields.push(`email = ?${idx++}`); values.push(input.email) }
    if (input.role !== undefined) { fields.push(`role = ?${idx++}`); values.push(input.role) }
    if (input.isActive !== undefined) { fields.push(`is_active = ?${idx++}`); values.push(input.isActive ? 1 : 0) }

    if (fields.length === 0) {
        return findUserByIdFromDb(id)
    }

    fields.push(`updated_at = datetime('now')`)
    values.push(id)

    const row = db
        .query<UserRecord, Array<string | number>>(
            `UPDATE users
             SET ${fields.join(', ')}
             WHERE id = ?${idx}
             RETURNING ${baseUserSelectSql()}`,
        )
        .get(...values)

    return row ? toUser(row) : null
}

export function getPasswordHashByUserIdFromDb(id: number): string | null {
    const row = db
        .query<{ passwordHash: string }, [number]>(
            'SELECT password_hash AS passwordHash FROM users WHERE id = ?1 LIMIT 1',
        )
        .get(id)

    return row?.passwordHash ?? null
}

export function updatePasswordByUserIdFromDb(id: number, passwordHash: string): void {
    db.run(
        "UPDATE users SET password_hash = ?1, updated_at = datetime('now') WHERE id = ?2",
        [passwordHash, id],
    )
}

export function deleteUserByIdFromDb(id: number): boolean {
    const result = db.run('DELETE FROM users WHERE id = ?1', [id])
    return result.changes > 0
}
