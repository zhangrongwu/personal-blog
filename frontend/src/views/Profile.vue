<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div class="px-6 py-8">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img 
                class="h-24 w-24 rounded-full object-cover" 
                :src="userStore.avatar || '/default-avatar.png'" 
                alt="用户头像"
              />
            </div>
            <div class="ml-6">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ userStore.username }}
              </h2>
              <p class="text-gray-600 dark:text-gray-300">
                {{ userStore.email }}
              </p>
            </div>
          </div>

          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              个人信息
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  用户名
                </label>
                <input 
                  v-model="username" 
                  type="text" 
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  邮箱
                </label>
                <input 
                  v-model="email" 
                  type="email" 
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              修改密码
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  当前密码
                </label>
                <input 
                  v-model="currentPassword" 
                  type="password" 
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  新密码
                </label>
                <input 
                  v-model="newPassword" 
                  type="password" 
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-end space-x-4">
            <button 
              @click="updateProfile"
              class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              保存修改
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { apiClient } from '@/services/api';

const userStore = useUserStore();

const username = ref('');
const email = ref('');
const currentPassword = ref('');
const newPassword = ref('');

async function updateProfile() {
  try {
    // 更新用户信息
    const updateData = {
      username: username.value,
      email: email.value,
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    };

    const response = await apiClient.put('/profile', updateData);
    
    // 更新本地用户信息
    userStore.updateUser(response.data.user);

    // 清空密码字段
    currentPassword.value = '';
    newPassword.value = '';

    // 显示成功提示
    alert('个人信息更新成功');
  } catch (error: any) {
    // 处理错误
    alert(error.response?.data?.message || '更新失败');
  }
}

// 初始化页面数据
onMounted(() => {
  username.value = userStore.username;
  email.value = userStore.email;
});
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>
