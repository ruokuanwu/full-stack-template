<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const authStore = useAuthStore()
const appStore = useAppStore()

onMounted(() => appStore.setPageTitle('Dashboard'))

function openDocs() {
    window.open('http://localhost:3000/docs', '_blank')
}
</script>

<template>
    <div class="home-view">
        <!-- 欢迎横幅 -->
        <el-card class="welcome-card">
            <div class="welcome-content">
                <div>
                    <h2>欢迎回来，{{ authStore.displayName }} 👋</h2>
                    <p>这是一个基于 Vue 3 + Vite + ElementPlus + Bun + Elysia 的全栈模板。</p>
                </div>
                <el-tag :type="authStore.isAdmin ? 'danger' : 'primary'" size="large">
                    {{ authStore.isAdmin ? '管理员' : '普通用户' }}
                </el-tag>
            </div>
        </el-card>

        <!-- 信息卡片 -->
        <el-row :gutter="16" class="stat-row">
            <el-col :xs="24" :sm="12" :lg="6">
                <el-card class="stat-card">
                    <el-statistic title="技术栈" />
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
                <el-card class="stat-card">
                    <el-statistic title="运行时" />
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
                <el-card class="stat-card">
                    <el-statistic title="框架" />
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
                <el-card class="stat-card">
                    <el-statistic title="数据库" />
                </el-card>
            </el-col>
        </el-row>

        <!-- 快速入口 -->
        <el-card class="quick-card">
            <template #header>快速入口</template>
            <el-space wrap>
                <el-button type="primary" plain :icon="'User'" @click="$router.push({ name: 'profile' })">
                    个人资料
                </el-button>
                <el-button v-if="authStore.isAdmin" type="warning" plain :icon="'Avatar'"
                    @click="$router.push({ name: 'users' })">
                    用户管理
                </el-button>
                <el-button type="info" plain :icon="'Document'" @click="openDocs">
                    API 文档
                </el-button>
            </el-space>
        </el-card>
    </div>
</template>

<style scoped>
.home-view {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.welcome-card {
    background: linear-gradient(135deg, #667eea20, #764ba220);
}

.welcome-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.welcome-content h2 {
    font-size: 22px;
    font-weight: 700;
    color: #303133;
    margin-bottom: 8px;
}

.welcome-content p {
    color: #606266;
    font-size: 14px;
}

.stat-row {
    margin-top: 0;
}

.stat-card {
    text-align: center;
}

.quick-card :deep(.el-card__header) {
    font-weight: 600;
}
</style>
