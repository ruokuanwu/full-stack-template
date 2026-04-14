import { t } from 'elysia'

export const UpdateUserDto = t.Object({
    username: t.Optional(t.String({ minLength: 3, maxLength: 32, pattern: '^[a-zA-Z0-9_]+$' })),
    email: t.Optional(t.String({ format: 'email' })),
    role: t.Optional(t.Union([t.Literal('admin'), t.Literal('user')])),
    isActive: t.Optional(t.Boolean()),
})

export const ChangePasswordDto = t.Object({
    currentPassword: t.String({ minLength: 1 }),
    newPassword: t.String({ minLength: 8, maxLength: 72 }),
})

export const UserIdParam = t.Object({
    id: t.Numeric(),
})

export const PaginationQuery = t.Object({
    page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
    pageSize: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
    keyword: t.Optional(t.String()),
})
