import { hashPassword, verifyPassword } from '@/utils/password'
import type { LoginRequest, RegisterRequest } from './dto'
import type { User } from '@/modules/users/model'
import {
    createUserFromRegisterRequestFromDb,
    findRegisterConflictFromDb,
    findUserByIdFromDb,
    findUserWithPasswordByEmailFromDb,
} from './repository'

// ─── 注册 ─────────────────────────────────────────────────────────────────────

export type RegisterResult = {
    ok: true; user: User
} | {
    ok: false; reason: 'email_taken' | 'username_taken'
}

export async function registerUser(request: RegisterRequest): Promise<RegisterResult> {
    const conflict = findRegisterConflictFromDb(request.email, request.username)
    if (conflict.emailTaken) return { ok: false, reason: 'email_taken' }
    if (conflict.usernameTaken) return { ok: false, reason: 'username_taken' }

    const passwordHash = await hashPassword(request.password)

    const user = createUserFromRegisterRequestFromDb(request, passwordHash)

    return { ok: true, user }
}

// ─── 登录 ─────────────────────────────────────────────────────────────────────

export type LoginResult = {
    ok: true; user: User
} | {
    ok: false; reason: 'user_not_found' | 'wrong_password' | 'account_inactive'
}

export async function loginUser(request: LoginRequest): Promise<LoginResult> {
    const authRecord = findUserWithPasswordByEmailFromDb(request)

    if (!authRecord) return { ok: false, reason: 'user_not_found' }
    if (!authRecord.user.isActive) return { ok: false, reason: 'account_inactive' }

    const valid = await verifyPassword(request.password, authRecord.passwordHash)
    if (!valid) return { ok: false, reason: 'wrong_password' }

    return { ok: true, user: authRecord.user }
}

// ─── 通过 ID 获取用户 ─────────────────────────────────────────────────────────

export function getUserById(id: number): User | null {
    return findUserByIdFromDb(id)
}
