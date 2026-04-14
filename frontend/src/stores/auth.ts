import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, getMe } from '@/api/auth'
import { TOKEN_KEY } from '@/utils/request'
import type { User, LoginForm, RegisterForm } from '@/types'

export const useAuthStore = defineStore('auth', () => {
    // ─── 状态 ────────────────────────────────────────────────────────────────────
    const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
    const user = ref<User | null>(null)
    const loading = ref(false)

    // ─── 计算属性 ─────────────────────────────────────────────────────────────────
    const isLoggedIn = computed(() => !!token.value)
    const isAdmin = computed(() => user.value?.role === 'admin')
    const displayName = computed(() => user.value?.username ?? user.value?.email ?? '未知用户')

    // ─── 登录 ─────────────────────────────────────────────────────────────────────
    async function login(form: LoginForm): Promise<{ ok: boolean; message: string }> {
        loading.value = true
        try {
            const { data } = await apiLogin(form)
            if (!data.success || !data.data) return { ok: false, message: data.message }

            token.value = data.data.token
            localStorage.setItem(TOKEN_KEY, data.data.token)

            // 拉取完整用户信息
            await fetchMe()
            return { ok: true, message: data.message }
        } catch {
            return { ok: false, message: '登录失败，请重试' }
        } finally {
            loading.value = false
        }
    }

    // ─── 注册 ─────────────────────────────────────────────────────────────────────
    async function register(
        form: RegisterForm,
    ): Promise<{ ok: boolean; message: string }> {
        loading.value = true
        try {
            const { data } = await apiRegister({
                username: form.username,
                email: form.email,
                password: form.password,
            })
            return { ok: data.success, message: data.message }
        } catch {
            return { ok: false, message: '注册失败，请重试' }
        } finally {
            loading.value = false
        }
    }

    // ─── 拉取当前用户 ─────────────────────────────────────────────────────────────
    async function fetchMe(): Promise<void> {
        if (!token.value) return
        try {
            const { data } = await getMe()
            if (data.success && data.data) user.value = data.data
        } catch {
            logout()
        }
    }

    // ─── 登出 ─────────────────────────────────────────────────────────────────────
    function logout(): void {
        token.value = null
        user.value = null
        localStorage.removeItem(TOKEN_KEY)
    }

    return {
        token, user, loading,
        isLoggedIn, isAdmin, displayName,
        login, register, fetchMe, logout,
    }
})
