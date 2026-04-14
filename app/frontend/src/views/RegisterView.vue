<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import type { FormInstance, FormRules } from 'element-plus'
import type { RegisterForm } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const form = reactive<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
})

const rules: FormRules<RegisterForm> = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 32, message: '用户名 3-32 位', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '仅允许字母、数字和下划线', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 8, max: 72, message: '密码 8-72 位', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
            validator: (_rule, value, callback) => {
                if (value !== form.password) callback(new Error('两次密码不一致'))
                else callback()
            },
            trigger: 'blur',
        },
    ],
}

async function handleRegister() {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return

    const result = await authStore.register(form)
    if (result.ok) {
        ElMessage.success('注册成功，请登录')
        router.push({ name: 'login' })
    } else {
        ElMessage.error(result.message)
    }
}
</script>

<template>
    <div class="register-page">
        <div class="register-card">
            <div class="register-header">
                <el-icon size="40" color="#409eff">
                    <Grid />
                </el-icon>
                <h1>创建账号</h1>
                <p>加入 Full Stack Template</p>
            </div>

            <el-form ref="formRef" :model="form" :rules="rules" size="large">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="用户名" :prefix-icon="'User'" clearable />
                </el-form-item>

                <el-form-item prop="email">
                    <el-input v-model="form.email" placeholder="邮箱" :prefix-icon="'Message'" clearable />
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="form.password" type="password" placeholder="密码（至少 8 位）" :prefix-icon="'Lock'"
                        show-password />
                </el-form-item>

                <el-form-item prop="confirmPassword">
                    <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" :prefix-icon="'Lock'"
                        show-password />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" :loading="authStore.loading" class="register-btn" @click="handleRegister">
                        注册
                    </el-button>
                </el-form-item>
            </el-form>

            <div class="register-footer">
                已有账号？
                <el-link type="primary" :underline="false" @click="$router.push({ name: 'login' })">
                    立即登录
                </el-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.register-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.register-card {
    width: 440px;
    background: #fff;
    border-radius: 12px;
    padding: 48px 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.register-header {
    text-align: center;
    margin-bottom: 32px;
}

.register-header h1 {
    font-size: 22px;
    font-weight: 700;
    color: #303133;
    margin: 12px 0 8px;
}

.register-header p {
    color: #909399;
    font-size: 14px;
}

.register-btn {
    width: 100%;
}

.register-footer {
    text-align: center;
    font-size: 14px;
    color: #606266;
    margin-top: 16px;
}
</style>
