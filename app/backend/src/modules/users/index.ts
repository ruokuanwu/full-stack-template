import { Elysia } from 'elysia'
import { authGuard } from '@/middleware/auth'
import { success, fail, paginated } from '@/utils/response'
import {
    listUsers,
    getUserById,
    updateUser,
    changePassword,
    deleteUser,
} from './service'
import {
    ChangePasswordRequestDto,
    ListUsersRequestDto,
    UpdateUserRequestDto,
    UserIdRequestDto,
} from './dto'

export const usersModule = new Elysia({ prefix: '/users' })
    .use(authGuard)

    // ── 列表（仅管理员） ──────────────────────────────────────────────────────────
    .get(
        '/',
        ({ currentUser, query, set }) => {
            if (currentUser.role !== 'admin') {
                set.status = 403
                return fail('Forbidden')
            }
            const { items, total } = listUsers(query)
            return paginated(items, total, query.page ?? 1, query.pageSize ?? 20)
        },
        { query: ListUsersRequestDto },
    )

    // ── 获取单个用户（自己或管理员） ──────────────────────────────────────────────
    .get(
        '/:id',
        ({ currentUser, params, set }) => {
            if (currentUser.role !== 'admin' && currentUser.sub !== params.id) {
                set.status = 403
                return fail('Forbidden')
            }
            const user = getUserById(params.id)
            if (!user) { set.status = 404; return fail('User not found') }
            return success(user)
        },
        { params: UserIdRequestDto },
    )

    // ── 更新用户（自己或管理员） ──────────────────────────────────────────────────
    .put(
        '/:id',
        ({ currentUser, params, body, set }) => {
            const isSelf = currentUser.sub === params.id
            const isAdmin = currentUser.role === 'admin'

            if (!isSelf && !isAdmin) { set.status = 403; return fail('Forbidden') }

            // 非管理员不能修改 role
            if (!isAdmin && body.role !== undefined) {
                set.status = 403
                return fail('Only admin can change role')
            }

            const user = updateUser(params.id, body)
            if (!user) { set.status = 404; return fail('User not found') }
            return success(user, 'User updated')
        },
        { params: UserIdRequestDto, body: UpdateUserRequestDto },
    )

    // ── 修改密码（仅本人） ────────────────────────────────────────────────────────
    .patch(
        '/:id/password',
        async ({ currentUser, params, body, set }) => {
            if (currentUser.sub !== params.id) { set.status = 403; return fail('Forbidden') }

            const result = await changePassword(params.id, body)
            if (!result.ok) {
                set.status = 400
                return fail(result.reason === 'wrong_password' ? 'Current password is incorrect' : 'User not found')
            }
            return success(null, 'Password changed')
        },
        { params: UserIdRequestDto, body: ChangePasswordRequestDto },
    )

    // ── 删除用户（仅管理员） ──────────────────────────────────────────────────────
    .delete(
        '/:id',
        ({ currentUser, params, set }) => {
            if (currentUser.role !== 'admin') { set.status = 403; return fail('Forbidden') }
            if (currentUser.sub === params.id) { set.status = 400; return fail('Cannot delete yourself') }

            const ok = deleteUser(params.id)
            if (!ok) { set.status = 404; return fail('User not found') }
            return success(null, 'User deleted')
        },
        { params: UserIdRequestDto },
    )
