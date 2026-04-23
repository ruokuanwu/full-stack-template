export type UserRole = 'admin' | 'user'

export interface User {
    id: number
    username: string
    email: string
    role: UserRole
    isActive: boolean
    createdAt: string
    updatedAt: string
}

type UserRecord = Omit<User, 'isActive'> & { isActive: number | boolean }

export function toUser(record: UserRecord): User {
    return {
        ...record,
        isActive: Boolean(record.isActive),
    }
}
