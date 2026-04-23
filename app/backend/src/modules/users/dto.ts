import { t } from 'elysia'
import { PaginationRequestDto } from '@/types'

export const UserResponseDto = t.Object({
    id: t.Number(),
    username: t.String(),
    email: t.String(),
    role: t.Union([t.Literal('admin'), t.Literal('user')]),
    isActive: t.Boolean(),
    createdAt: t.String(),
    updatedAt: t.String(),
})

export const UpdateUserRequestDto = t.Object({
    username: t.Optional(t.String({ minLength: 3, maxLength: 32, pattern: '^[a-zA-Z0-9_]+$' })),
    email: t.Optional(t.String({ format: 'email' })),
    role: t.Optional(t.Union([t.Literal('admin'), t.Literal('user')])),
    isActive: t.Optional(t.Boolean()),
})

export const ChangePasswordRequestDto = t.Object({
    currentPassword: t.String({ minLength: 1 }),
    newPassword: t.String({ minLength: 8, maxLength: 72 }),
})

export const UserIdRequestDto = t.Object({
    id: t.Numeric(),
})

export const ListUsersRequestDto = t.Intersect([
    PaginationRequestDto,
    t.Object({
        keyword: t.Optional(t.String()),
    }),
])

export type UserResponse = typeof UserResponseDto.static
export type UpdateUserRequest = typeof UpdateUserRequestDto.static
export type ChangePasswordRequest = typeof ChangePasswordRequestDto.static
export type UserIdRequest = typeof UserIdRequestDto.static
export type ListUsersRequest = typeof ListUsersRequestDto.static

export const ListUsersResponseDto = t.Object({
    items: t.Array(UserResponseDto),
    total: t.Number(),
    page: t.Number(),
    pageSize: t.Number(),
})

export type ListUsersResponse = typeof ListUsersResponseDto.static
