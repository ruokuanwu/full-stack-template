<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const appStore = useAppStore()
</script>

<template>
    <el-container class="layout-container">
        <!-- 侧边栏 -->
        <el-aside :width="appStore.sidebarCollapsed ? '64px' : '220px'" class="layout-aside">
            <AppSidebar />
        </el-aside>

        <!-- 主体区域 -->
        <el-container class="layout-main-container">
            <el-header class="layout-header">
                <AppHeader />
            </el-header>

            <el-main class="layout-main">
                <RouterView />
            </el-main>

            <el-footer class="layout-footer" height="40px">
                <span>© {{ new Date().getFullYear() }} Full Stack Template</span>
            </el-footer>
        </el-container>
    </el-container>
</template>

<style scoped>
.layout-container {
    height: 100vh;
    overflow: hidden;
}

.layout-aside {
    background: #001529;
    transition: width 0.3s;
    overflow: hidden;
}

.layout-main-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.layout-header {
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    padding: 0;
    height: 56px;
}

.layout-main {
    background: #f5f7fa;
    overflow-y: auto;
    padding: 20px;
}

.layout-footer {
    background: #fff;
    border-top: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #909399;
}
</style>
