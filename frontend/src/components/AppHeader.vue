<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

async function handleLogout() {
    await ElMessageBox.confirm('确认退出登录？', '提示', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning',
    })
    authStore.logout()
    ElMessage.success('已退出登录')
    router.push({ name: 'login' })
}
</script>

<template>
    <div class="header-inner">
        <!-- 折叠按钮 -->
        <el-button :icon="appStore.sidebarCollapsed ? 'Expand' : 'Fold'" text size="large" class="collapse-btn"
            @click="appStore.toggleSidebar()" />

        <!-- 面包屑 -->
        <el-breadcrumb class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="appStore.pageTitle !== 'Dashboard'">
                {{ appStore.pageTitle }}
            </el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 右侧操作区 -->
        <div class="header-right">
            <el-dropdown @command="handleCommand">
                <div class="user-info">
                    <el-avatar :size="32" class="avatar">
                        {{ authStore.displayName.slice(0, 1).toUpperCase() }}
                    </el-avatar>
                    <span class="username">{{ authStore.displayName }}</span>
                    <el-icon><arrow-down /></el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="profile" :icon="'User'">个人资料</el-dropdown-item>
                        <el-dropdown-item divided command="logout" :icon="'SwitchButton'">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    methods: {
        handleCommand(command: string) {
            if (command === 'profile') this.$router.push({ name: 'profile' })
            else if (command === 'logout') this.handleLogout()
        },
    },
}
</script>

<style scoped>
.header-inner {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 16px;
    gap: 12px;
}

.collapse-btn {
    font-size: 20px;
    color: #303133;
}

.breadcrumb {
    flex: 1;
}

.header-right {
    margin-left: auto;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background 0.2s;
}

.user-info:hover {
    background: #f5f7fa;
}

.avatar {
    background: #409eff;
    color: #fff;
    font-weight: bold;
}

.username {
    font-size: 14px;
    color: #303133;
}
</style>
