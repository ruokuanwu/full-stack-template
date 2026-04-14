<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()

const activeMenu = computed(() => route.path)

interface MenuItem {
    path: string
    title: string
    icon: string
    adminOnly?: boolean
}

const menuItems: MenuItem[] = [
    { path: '/', title: 'Dashboard', icon: 'Odometer' },
    { path: '/profile', title: '个人资料', icon: 'User' },
    { path: '/users', title: '用户管理', icon: 'Avatar', adminOnly: true },
]

const visibleMenuItems = computed(() =>
    menuItems.filter((item) => !item.adminOnly || authStore.isAdmin),
)
</script>

<template>
    <div class="sidebar">
        <!-- Logo -->
        <div class="logo">
            <el-icon size="24" color="#409eff">
                <Grid />
            </el-icon>
            <span v-if="!appStore.sidebarCollapsed" class="logo-text">FullStack</span>
        </div>

        <!-- 菜单 -->
        <el-menu :default-active="activeMenu" :collapse="appStore.sidebarCollapsed" :collapse-transition="false"
            background-color="#001529" text-color="#ffffffa6" active-text-color="#409eff" router>
            <el-menu-item v-for="item in visibleMenuItems" :key="item.path" :index="item.path">
                <el-icon>
                    <component :is="item.icon" />
                </el-icon>
                <template #title>{{ item.title }}</template>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<style scoped>
.sidebar {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.logo {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-bottom: 1px solid #ffffff1a;
    flex-shrink: 0;
}

.logo-text {
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 1px;
    white-space: nowrap;
}

.el-menu {
    border-right: none;
    flex: 1;
}

:deep(.el-menu-item:hover) {
    background-color: #ffffff14 !important;
}

:deep(.el-menu-item.is-active) {
    background-color: #1677ff26 !important;
}
</style>
