<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { updateUser, changePassword } from '@/api/user'
import type { FormInstance, FormRules } from 'element-plus'

const authStore = useAuthStore()
const appStore = useAppStore()

onMounted(() => appStore.setPageTitle('个人资料'))

// ─── 编辑信息 ─────────────────────────────────────────────────────────────────

const infoRef = ref<FormInstance>()
const infoForm = reactive({
    username: authStore.user?.username ?? '',
    email: authStore.user?.email ?? '',
})
const infoRules: FormRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 32, message: '3-32 位', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
    ],
}
const infoLoading = ref(false)

async function handleUpdateInfo() {
    const valid = await infoRef.value?.validate().catch(() => false)
    if (!valid) return

    infoLoading.value = true
    try {
        const { data } = await updateUser(authStore.user!.id, infoForm)
        if (data.success && data.data) {
            authStore.user = data.data
            ElMessage.success('资料已更新')
        } else {
            ElMessage.error(data.message)
        }
    } catch {
        // 错误已在拦截器中处理
    } finally {
        infoLoading.value = false
    }
}

// ─── 修改密码 ─────────────────────────────────────────────────────────────────

const pwdRef = ref<FormInstance>()
const pwdForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
})
const pwdRules: FormRules = {
    currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 8, message: '新密码至少 8 位', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
            validator: (_rule: unknown, value: string, callback: (err?: Error) => void) => {
                if (value !== pwdForm.newPassword) callback(new Error('两次密码不一致'))
                else callback()
            },
            trigger: 'blur',
        },
    ],
}
const pwdLoading = ref(false)

async function handleChangePassword() {
    const valid = await pwdRef.value?.validate().catch(() => false)
    if (!valid) return

    pwdLoading.value = true
    try {
        const { data } = await changePassword(authStore.user!.id, {
            currentPassword: pwdForm.currentPassword,
            newPassword: pwdForm.newPassword,
        })
        if (data.success) {
            ElMessage.success('密码已修改')
            pwdRef.value?.resetFields()
        } else {
            ElMessage.error(data.message)
        }
    } catch {
        // 错误已在拦截器中处理
    } finally {
        pwdLoading.value = false
    }
}
</script>

<template>
    <div class="profile-view">
        <el-row :gutter="20">
            <!-- 基本信息 -->
            <el-col :xs="24" :md="12">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <el-icon>
                                <User />
                            </el-icon>
                            基本信息
                        </div>
                    </template>

                    <div class="avatar-section">
                        <el-avatar :size="72" class="big-avatar">
                            {{ authStore.displayName.slice(0, 1).toUpperCase() }}
                        </el-avatar>
                        <div>
                            <div class="user-name">{{ authStore.user?.username }}</div>
                            <el-tag :type="authStore.isAdmin ? 'danger' : 'primary'" size="small">
                                {{ authStore.isAdmin ? '管理员' : '用户' }}
                            </el-tag>
                        </div>
                    </div>

                    <el-divider />

                    <el-form ref="infoRef" :model="infoForm" :rules="infoRules" label-width="80px">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="infoForm.username" />
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="infoForm.email" />
                        </el-form-item>
                        <el-form-item label="注册时间">
                            <span class="info-text">{{ authStore.user?.createdAt?.slice(0, 10) ?? '-' }}</span>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" :loading="infoLoading" @click="handleUpdateInfo">
                                保存修改
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>

            <!-- 修改密码 -->
            <el-col :xs="24" :md="12">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <el-icon>
                                <Lock />
                            </el-icon>
                            修改密码
                        </div>
                    </template>

                    <el-form ref="pwdRef" :model="pwdForm" :rules="pwdRules" label-width="100px">
                        <el-form-item label="当前密码" prop="currentPassword">
                            <el-input v-model="pwdForm.currentPassword" type="password" show-password />
                        </el-form-item>
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input v-model="pwdForm.newPassword" type="password" show-password />
                        </el-form-item>
                        <el-form-item label="确认新密码" prop="confirmPassword">
                            <el-input v-model="pwdForm.confirmPassword" type="password" show-password />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="warning" :loading="pwdLoading" @click="handleChangePassword">
                                修改密码
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.profile-view {
    max-width: 900px;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
}

.avatar-section {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
}

.big-avatar {
    background: #409eff;
    color: #fff;
    font-size: 28px;
    font-weight: bold;
}

.user-name {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 6px;
}

.info-text {
    color: #606266;
    font-size: 14px;
}
</style>
