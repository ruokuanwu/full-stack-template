<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { getUsers, deleteUser } from '@/api/user'
import type { User } from '@/types'

const appStore = useAppStore()
onMounted(() => appStore.setPageTitle('用户管理'))

// ─── 列表状态 ─────────────────────────────────────────────────────────────────
const loading = ref(false)
const userList = ref<User[]>([])
const total = ref(0)
const query = reactive({
    page: 1,
    pageSize: 20,
    keyword: '',
})

async function loadUsers() {
    loading.value = true
    try {
        const { data } = await getUsers(query)
        if (data.success) {
            userList.value = data.data
            total.value = data.total
        }
    } finally {
        loading.value = false
    }
}

onMounted(loadUsers)

function handleSearch() {
    query.page = 1
    loadUsers()
}

function handlePageChange(page: number) {
    query.page = page
    loadUsers()
}

// ─── 删除 ─────────────────────────────────────────────────────────────────────
async function handleDelete(user: User) {
    await ElMessageBox.confirm(`确认删除用户 "${user.username}"？此操作不可恢复。`, '警告', {
        type: 'error',
        confirmButtonText: '删除',
        confirmButtonClass: 'el-button--danger',
    })

    const { data } = await deleteUser(user.id)
    if (data.success) {
        ElMessage.success('已删除')
        loadUsers()
    } else {
        ElMessage.error(data.message)
    }
}
</script>

<template>
    <div class="users-view">
        <el-card>
            <template #header>
                <div class="table-header">
                    <span class="title">用户列表</span>
                    <div class="actions">
                        <el-input v-model="query.keyword" placeholder="搜索用户名/邮箱" :prefix-icon="'Search'" clearable
                            style="width: 240px" @keyup.enter="handleSearch" @clear="handleSearch" />
                        <el-button type="primary" @click="handleSearch">搜索</el-button>
                    </div>
                </div>
            </template>

            <el-table v-loading="loading" :data="userList" stripe border>
                <el-table-column type="index" label="#" width="60" />
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="username" label="用户名" min-width="120" />
                <el-table-column prop="email" label="邮箱" min-width="200" />
                <el-table-column prop="role" label="角色" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'" size="small">
                            {{ row.role === 'admin' ? '管理员' : '用户' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="isActive" label="状态" width="90">
                    <template #default="{ row }">
                        <el-badge :is-dot="true" :type="row.isActive ? 'success' : 'danger'">
                            {{ row.isActive ? '正常' : '禁用' }}
                        </el-badge>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="注册时间" width="140">
                    <template #default="{ row }">{{ row.createdAt?.slice(0, 10) }}</template>
                </el-table-column>
                <el-table-column label="操作" width="160" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" @click="$router.push({ name: 'profile' })">
                            编辑
                        </el-button>
                        <el-button size="small" type="danger" @click="handleDelete(row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-wrap">
                <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total"
                    layout="total, sizes, prev, pager, next" :page-sizes="[10, 20, 50]"
                    @current-change="handlePageChange" @size-change="handleSearch" />
            </div>
        </el-card>
    </div>
</template>

<style scoped>
.users-view {
    height: 100%;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title {
    font-weight: 600;
    font-size: 16px;
}

.actions {
    display: flex;
    gap: 8px;
}

.pagination-wrap {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
}
</style>
