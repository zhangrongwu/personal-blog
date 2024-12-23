<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-10">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          登录到你的账户
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          访问你的个人博客管理后台
        </p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="sr-only">电子邮件</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            required 
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
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
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
            placeholder="密码"
          />
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              type="checkbox" 
              v-model="rememberMe"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              记住我
            </label>
          </div>
          
          <div class="text-sm">
            <a 
              href="#" 
              class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              忘记密码?
            </a>
          </div>
        </div>
        
        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </div>
      </form>
      
      <div class="text-center">
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          还没有账户？
          <router-link 
            to="/register" 
            class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            注册
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
import { useUserStore } from '@/stores/user';

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);

const router = useRouter();
const userStore = useUserStore();

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const response = await authService.login(email.value, password.value);
    
    // 存储用户信息到 Pinia store
    userStore.updateUser({
      id: response.user.id,
      username: response.user.username,
      email: response.user.email
    });

    // 记住登录状态
    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true');
    }
    
    // 跳转到首页
    router.push('/');
  } catch (error: any) {
    console.error('登录错误:', error);
    alert('登录时发生错误');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>
