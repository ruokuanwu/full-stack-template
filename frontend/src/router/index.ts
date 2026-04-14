import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // ── 认证页面（无需登录） ──────────────────────────────────────────────────
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            meta: { guest: true, title: '登录' },
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/RegisterView.vue'),
            meta: { guest: true, title: '注册' },
        },

        // ── 应用主体（需要登录） ────────────────────────────────────────────────────
        {
            path: '/',
            component: () => import('@/layouts/DefaultLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'home',
                    component: () => import('@/views/HomeView.vue'),
                    meta: { title: 'Dashboard' },
                },
                {
                    path: 'profile',
                    name: 'profile',
                    component: () => import('@/views/ProfileView.vue'),
                    meta: { title: '个人资料' },
                },
                {
                    path: 'users',
                    name: 'users',
                    component: () => import('@/views/UsersView.vue'),
                    meta: { title: '用户管理', requiresAdmin: true },
                },
            ],
        },

        // ── 404 ──────────────────────────────────────────────────────────────────
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/NotFoundView.vue'),
        },
    ],
})

// ─── 导航守卫 ──────────────────────────────────────────────────────────────────

router.beforeEach(async (to) => {
    const auth = useAuthStore()

    // 首次加载若有 token，先拉取用户信息
    if (auth.token && !auth.user) {
        await auth.fetchMe()
    }

    // 需要管理员
    if (to.meta.requiresAdmin && !auth.isAdmin) {
        return { name: 'home' }
    }

    // 需要登录
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        return { name: 'login', query: { redirect: to.fullPath } }
    }

    // 已登录时不允许访问 guest 页面
    if (to.meta.guest && auth.isLoggedIn) {
        return { name: 'home' }
    }
})

export default router
