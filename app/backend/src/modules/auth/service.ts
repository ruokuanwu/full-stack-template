import { db } from '@/db'
import { hashPassword, verifyPassword } from '@/utils/password'
import type { UserRow, User } from '@/types'

// ─── 辅助：将数据库行转换为业务对象 ────────────────────────────────────────────

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

// ─── 注册 ─────────────────────────────────────────────────────────────────────

export interface RegisterInput {
    username: string
    email: string
    password: string
}

export type RegisterResult = {
    ok: true; user: User
} | {
    ok: false; reason: 'email_taken' | 'username_taken'
}

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
    const existing = db.query<{ id: number }, [string, string]>(
        'SELECT id FROM users WHERE email = ?1 OR username = ?2 LIMIT 1',
    ).get(input.email, input.username)

    if (existing) {
        const emailRow = db.query<{ id: number }, [string]>(
            'SELECT id FROM users WHERE email = ?1 LIMIT 1',
        ).get(input.email)
        return { ok: false, reason: emailRow ? 'email_taken' : 'username_taken' }
    }

    const passwordHash = await hashPassword(input.password)

    const stmt = db.prepare<UserRow, [string, string, string]>(`
    INSERT INTO users (username, email, password_hash)
    VALUES (?1, ?2, ?3)
    RETURNING *
  `)
    const user = stmt.get(input.username, input.email, passwordHash)!

    return { ok: true, user: rowToUser(user) }
}

// ─── 登录 ─────────────────────────────────────────────────────────────────────

export interface LoginInput {
    email: string
    password: string
}

export type LoginResult = {
    ok: true; user: User
} | {
    ok: false; reason: 'user_not_found' | 'wrong_password' | 'account_inactive'
}

export async function loginUser(input: LoginInput): Promise<LoginResult> {
    const row = db.query<UserRow, [string]>(
        'SELECT * FROM users WHERE email = ?1 LIMIT 1',
    ).get(input.email)

    if (!row) return { ok: false, reason: 'user_not_found' }
    if (!row.is_active) return { ok: false, reason: 'account_inactive' }

    const valid = await verifyPassword(input.password, row.password_hash)
    if (!valid) return { ok: false, reason: 'wrong_password' }

    return { ok: true, user: rowToUser(row) }
}

// ─── 通过 ID 获取用户 ─────────────────────────────────────────────────────────

export function getUserById(id: number): User | null {
    const row = db.query<UserRow, [number]>(
        'SELECT * FROM users WHERE id = ?1 LIMIT 1',
    ).get(id)

    return row ? rowToUser(row) : null
}
