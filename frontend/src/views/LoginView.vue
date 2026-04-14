<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import type { FormInstance, FormRules } from 'element-plus'
import type { LoginForm } from '@/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const form = reactive<LoginForm>({
    email: '',
    password: '',
})

const rules: FormRules<LoginForm> = {
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 8, message: '密码至少 8 位', trigger: 'blur' },
    ],
}

async function handleLogin() {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return

    const result = await authStore.login(form)
    if (result.ok) {
        ElMessage.success('登录成功')
        const redirect = route.query.redirect as string | undefined
        router.push(redirect ?? { name: 'home' })
    } else {
        ElMessage.error(result.message)
    }
}
</script>

<template>
    <div class="login-page">
        <div class="login-card">
            <!-- 标题 -->
            <div class="login-header">
                <el-icon size="40" color="#409eff">
                    <Grid />
                </el-icon>
                <h1>Full Stack Template</h1>
                <p>欢迎回来，请登录</p>
            </div>

            <!-- 表单 -->
            <el-form ref="formRef" :model="form" :rules="rules" size="large" @keyup.enter="handleLogin">
                <el-form-item prop="email">
                    <el-input v-model="form.email" placeholder="邮箱" :prefix-icon="'Message'" clearable />
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="form.password" type="password" placeholder="密码" :prefix-icon="'Lock'"
                        show-password clearable />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" :loading="authStore.loading" class="login-btn" @click="handleLogin">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>

            <div class="login-footer">
                还没有账号？
                <el-link type="primary" :underline="false" @click="$router.push({ name: 'register' })">
                    立即注册
                </el-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
    width: 420px;
    background: #fff;
    border-radius: 12px;
    padding: 48px 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-header {
    text-align: center;
    margin-bottom: 36px;
}

.login-header h1 {
    font-size: 22px;
    font-weight: 700;
    color: #303133;
    margin: 12px 0 8px;
}

.login-header p {
    color: #909399;
    font-size: 14px;
}

.login-btn {
    width: 100%;
}

.login-footer {
    text-align: center;
    font-size: 14px;
    color: #606266;
    margin-top: 16px;
}
</style>
