import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const TOKEN_KEY = 'auth_token'

// ─── Axios 实例 ───────────────────────────────────────────────────────────────

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
})

// ─── 请求拦截器：自动注入 Token ───────────────────────────────────────────────

request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

// ─── 响应拦截器：统一错误处理 ─────────────────────────────────────────────────

request.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (!error.response) {
            ElMessage.error('网络错误，请检查连接')
            return Promise.reject(error)
        }

        const { status, data } = error.response
        const message: string = data?.message ?? '请求失败'

        switch (status) {
            case 401:
                // Token 失效，清除本地状态并跳转登录
                localStorage.removeItem(TOKEN_KEY)
                ElMessage.error('登录已过期，请重新登录')
                router.push({ name: 'login' })
                break
            case 403:
                ElMessage.error('权限不足')
                break
            case 404:
                ElMessage.error('资源不存在')
                break
            case 422:
                ElMessage.error(`参数错误：${message}`)
                break
            case 500:
                ElMessage.error('服务器内部错误')
                break
            default:
                ElMessage.error(message)
        }

        return Promise.reject(error)
    },
)

export { TOKEN_KEY }
export default request
