<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          登录你的账户
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">邮箱</label>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="邮箱地址"
            />
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              required 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="密码"
            />
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            登录
          </button>
        </div>

        <div v-if="error" class="text-red-500 text-center">
          {{ error }}
        </div>
      </form>
      <div class="text-center">
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          还没有账户？ 
          <router-link 
            to="/register" 
            class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            立即注册
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/api';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

async function handleLogin() {
  try {
    const result = await authService.login(email.value, password.value);
    // 登录成功，跳转到首页或仪表盘
    router.push('/');
  } catch (err: any) {
    error.value = err.response?.data?.message || '登录失败，请重试';
  }
}
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>
