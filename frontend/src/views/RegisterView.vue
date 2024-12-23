<template>
  <div class="flex justify-center items-center px-4 py-12 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div class="p-10 space-y-8 w-full max-w-md bg-white rounded-xl shadow-2xl dark:bg-gray-800">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          创建新账户
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          开始您的博客之旅
        </p>
      </div>
      
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="username" class="sr-only">用户名</label>
          <input 
            id="username" 
            v-model="username" 
            type="text" 
            required 
            class="block relative px-3 py-2 w-full placeholder-gray-500 text-gray-900 rounded-md border border-gray-300 appearance-none dark:border-gray-600 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
            placeholder="用户名"
          />
        </div>

        <div>
          <label for="email" class="sr-only">电子邮件</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            required 
            class="block relative px-3 py-2 w-full placeholder-gray-500 text-gray-900 rounded-md border border-gray-300 appearance-none dark:border-gray-600 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
            placeholder="电子邮件"
          />
        </div>
        
        <div>
          <label for="password" class="sr-only">密码</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            required 
            class="block relative px-3 py-2 w-full placeholder-gray-500 text-gray-900 rounded-md border border-gray-300 appearance-none dark:border-gray-600 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
            placeholder="密码"
          />
        </div>

        <div>
          <label for="confirm-password" class="sr-only">确认密码</label>
          <input 
            id="confirm-password" 
            v-model="confirmPassword" 
            type="password" 
            required 
            class="block relative px-3 py-2 w-full placeholder-gray-500 text-gray-900 rounded-md border border-gray-300 appearance-none dark:border-gray-600 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
            placeholder="确认密码"
          />
        </div>
        
        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="flex relative justify-center px-4 py-2 w-full text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
          >
            <span v-if="isLoading" class="flex absolute inset-y-0 left-0 items-center pl-3">
              <svg class="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
        </div>
      </form>
      
      <div class="text-center">
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          已有账户？
          <router-link 
            to="/login" 
            class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            立即登录
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/api'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const router = useRouter()

const handleRegister = async () => {
  // 验证密码是否一致
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }

  isLoading.value = true
  try {
    const response = await authService.register(
      username.value, 
      email.value, 
      password.value
    )

    if (response.success) {
      // 注册成功，跳转到登录页
      alert('注册成功，请登录')
      router.push('/login')
    } else {
      // 注册失败
      alert(response.message || '注册失败')
    }
  } catch (error: any) {
    console.error('注册错误:', error)
    alert(error.response?.data?.message || '注册时发生错误')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>
