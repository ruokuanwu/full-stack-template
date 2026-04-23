import { db } from '@/db'
import type { LoginRequest, RegisterRequest } from './dto'
import { toUser, type User } from '@/modules/users/model'

type UserRecord = Omit<User, 'isActive'> & { isActive: number }
type UserAuthRecord = UserRecord & { passwordHash: string }

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

export function findRegisterConflictFromDb(email: string, username: string): {
    emailTaken: boolean
    usernameTaken: boolean
} {
    const rows = db
        .query<{ email: string; username: string }, [string, string]>(
            'SELECT email, username FROM users WHERE email = ?1 OR username = ?2',
        )
        .all(email, username)

    return {
        emailTaken: rows.some((row) => row.email === email),
        usernameTaken: rows.some((row) => row.username === username),
    }
}

export function createUserFromRegisterRequestFromDb(
    request: RegisterRequest,
    passwordHash: string,
): User {
    const row = db
        .query<UserRecord, [string, string, string]>(
            `INSERT INTO users (username, email, password_hash)
             VALUES (?1, ?2, ?3)
             RETURNING ${baseUserSelectSql()}`,
        )
        .get(request.username, request.email, passwordHash)

    return toUser(row!)
}

export function findUserWithPasswordByEmailFromDb(request: LoginRequest): {
    user: User
    passwordHash: string
} | null {
    const row = db
        .query<UserAuthRecord, [string]>(
            `SELECT ${baseUserSelectSql()}, password_hash AS passwordHash
             FROM users
             WHERE email = ?1
             LIMIT 1`,
        )
        .get(request.email)

    if (!row) return null

    return {
        user: toUser(row),
        passwordHash: row.passwordHash,
    }
}

export function findUserByIdFromDb(id: number): User | null {
    const row = db
        .query<UserRecord, [number]>(
            `SELECT ${baseUserSelectSql()}
             FROM users
             WHERE id = ?1
             LIMIT 1`,
        )
        .get(id)

    return row ? toUser(row) : null
}
