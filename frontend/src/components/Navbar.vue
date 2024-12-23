<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0">
            <img 
              class="h-8 w-8" 
              src="/logo.png" 
              alt="博客 Logo"
            />
          </router-link>
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link 
              to="/" 
              class="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              首页
            </router-link>
            <router-link 
              to="/blog" 
              class="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              博客
            </router-link>
            <router-link 
              to="/about" 
              class="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              关于
            </router-link>
          </div>
        </div>
        <div class="flex items-center">
          <div class="ml-4 flex items-center md:ml-6">
            <!-- 深色/浅色模式切换 -->
            <button 
              @click="toggleDarkMode"
              class="bg-gray-100 dark:bg-gray-700 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
            >
              <svg 
                v-if="!isDarkMode" 
                class="h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-3.657l-1.414-1.414m12.728 12.728l1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" 
                />
              </svg>
              <svg 
                v-else 
                class="h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                />
              </svg>
            </button>

            <!-- 用户认证按钮 -->
            <div v-if="!isAuthenticated" class="ml-3">
              <router-link 
                to="/login" 
                class="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                登录
              </router-link>
            </div>
            <div v-else class="ml-3 relative">
              <button 
                @click="toggleUserMenu"
                class="max-w-xs bg-gray-100 dark:bg-gray-700 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <img 
                  class="h-8 w-8 rounded-full" 
                  :src="userStore.avatar || '/default-avatar.png'" 
                  alt="用户头像" 
                />
              </button>
              
              <!-- 用户下拉菜单 -->
              <div 
                v-if="isUserMenuOpen" 
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5"
              >
                <router-link 
                  to="/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  个人资料
                </router-link>
                <button 
                  @click="logout"
                  class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { authService } from '@/services/api';

const router = useRouter();
const userStore = useUserStore();

// 深色模式状态
const isDarkMode = ref(false);
const isUserMenuOpen = ref(false);
const isAuthenticated = ref(false);

// 切换深色/浅色模式
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
}

// 切换用户菜单
function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value;
}

// 退出登录
function logout() {
  authService.logout();
  userStore.clearUser();
  router.push('/login');
}

// 检查认证状态
function checkAuthStatus() {
  isAuthenticated.value = !!authService.getCurrentUser();
}

// 初始化
onMounted(() => {
  // 恢复之前的主题设置
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }

  checkAuthStatus();
});

// 点击外部关闭用户菜单
document.addEventListener('click', (event) => {
  const userMenuButton = event.target as HTMLElement;
  if (!userMenuButton.closest('.relative')) {
    isUserMenuOpen.value = false;
  }
});
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>
