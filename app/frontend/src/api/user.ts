import { eden, normalizeEden } from '@/lib/eden'

export const getUsers = async (params?: NonNullable<Parameters<typeof eden.users.get>[0]>['query']) =>
    normalizeEden(await eden.users.get({ query: params }))

export const getUserById = async (id: number) =>
    normalizeEden(await eden.users({ id }).get())

export const updateUser = async (
    id: number,
    data: Parameters<ReturnType<typeof eden.users>['put']>[0],
) => normalizeEden(await eden.users({ id }).put(data))

export const changePassword = async (
    id: number,
    data: Parameters<ReturnType<typeof eden.users>['password']['patch']>[0],
) => normalizeEden(await eden.users({ id }).password.patch(data))

export const deleteUser = async (id: number) =>
    normalizeEden(await eden.users({ id }).delete())
