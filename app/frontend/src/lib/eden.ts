import { treaty, type Treaty } from '@elysiajs/eden'
import { ElMessage } from 'element-plus'
import type { App } from '../../../shared/backend-app'

export const TOKEN_KEY = 'auth_token'

// ─── Eden Treaty 客户端 ───────────────────────────────────────────────────────
// 使用后端编译产出的 .d.ts 声明，提供完整路由与参数类型推导。

// 优先使用显式配置的后端地址（直连模式）；否则走同源 /api 前缀，
// 由 Vite dev proxy（开发）或 nginx（生产）转发，兼容远程开发环境。
const rawBase = import.meta.env.VITE_API_BASE_URL
const apiBase = rawBase
    ? rawBase.replace(/^https?:\/\//, '') // 去掉协议头，treaty 会自动补 http://
    : typeof window !== 'undefined'
        ? `${window.location.host}/api`     // 走代理：localhost:5173/api → localhost:3000
        : 'localhost:3000'                  // SSR / Node 环境兜底

export const eden: Treaty.Create<App> = treaty<App>(apiBase, {
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
