import { eden, normalizeEden } from '@/lib/eden'

export const register = async (data: Parameters<typeof eden.auth.register.post>[0]) =>
    normalizeEden(await eden.auth.register.post(data))

export const login = async (data: Parameters<typeof eden.auth.login.post>[0]) =>
    normalizeEden(await eden.auth.login.post(data))

export const getMe = async () =>
    normalizeEden(await eden.auth.me.get())
