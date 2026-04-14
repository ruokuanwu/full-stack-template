// HTTP 客户端已迁移至 Elysia Eden（@/lib/eden）以获得端到端类型安全。
// 此文件仅保留向后兼容的 TOKEN_KEY 重导出，方便未来扩展。

// TOKEN_KEY 的实际定义位于 @/lib/eden，这里是重导出：
export { TOKEN_KEY } from '@/lib/eden'

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
