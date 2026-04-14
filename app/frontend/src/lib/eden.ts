import { treaty } from '@elysiajs/eden'
import { ElMessage } from 'element-plus'
import type { App } from '@backend/index'

export const TOKEN_KEY = 'auth_token'

// ─── Eden Treaty 客户端 ───────────────────────────────────────────────────────
// treaty<App> 从后端 App 类型自动推导所有路由的请求/响应类型，无需手写类型定义。
// 使用 project references（tsconfig.types.json）在编译时同步后端类型。

const apiBase = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000')
    .replace(/^https?:\/\//, '') // treaty 只接受 host:port 格式

export const eden = treaty<App>(apiBase, {
    // 每次请求动态读取 Token，确保登出后立即生效
    headers() {
        const token = localStorage.getItem(TOKEN_KEY)
        return token ? { authorization: `Bearer ${token}` } : {}
    },
})

// ─── Eden 错误处理辅助 ────────────────────────────────────────────────────────

export interface EdenError {
    status: number
    value: unknown
}

/**
 * 将 Eden 返回的 { data, error } 规范化为 { data: T }，
 * 与原有约定一致，方便 stores 中复用逻辑不变。
 *
 * 后端 onError 总返回 ApiResponse 格式，故 error.value 也可安全地当 T 使用。
 */
export function normalizeEden<T>(result: {
    data: T | null
    error: EdenError | null
}): { data: T } {
    if (result.error) {
        const errValue = result.error.value as T

        // 401：Token 失效，提示用户并抛出，由 store catch 后执行 logout
        if (result.error.status === 401) {
            ElMessage.error('登录已过期，请重新登录')
            throw Object.assign(new Error('Unauthorized'), { status: 401 })
        }

        // 其他 HTTP 错误：弹出提示后将 error body 作为数据返回（含 success:false）
        const msg = (errValue as Record<string, unknown>)?.message
        if (typeof msg === 'string') ElMessage.error(msg)

        return { data: errValue }
    }

    return { data: result.data as T }
}
