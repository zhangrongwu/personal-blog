<template>
  <nav 
    class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md dark:shadow-lg"
  >
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <!-- Logo 和站点名称 -->
      <div 
        class="flex items-center cursor-pointer" 
        @click="navigateTo('/')"
      >
        <img 
          :src="logoImage" 
          alt="博客 Logo" 
          class="h-10 w-10 mr-3"
        />
        <span class="text-xl font-bold text-gray-900 dark:text-white">
          我的个人博客
        </span>
      </div>

      <!-- 桌面端导航菜单 -->
      <div class="hidden md:flex items-center space-x-6">
        <!-- 主导航 -->
        <template v-for="item in menuItems" :key="item.path">
          <router-link 
            :to="item.path"
            class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            :class="{ 'text-blue-600 dark:text-blue-400': route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </template>

        <!-- 创建博客按钮 -->
        <router-link 
          v-if="isLoggedIn" 
          to="/blog/create"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          创建博客
        </router-link>

        <!-- 登录/登出按钮 -->
        <template v-if="!isLoggedIn">
          <router-link 
            to="/login"
            class="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
          >
            登录
          </router-link>
        </template>
        <button 
          v-else
          @click="logout"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          退出登录
        </button>

        <!-- 暗黑模式切换 -->
        <button 
          @click="emit('toggle-dark-mode')"
          class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          aria-label="切换暗黑模式"
        >
          <svg 
            v-if="!isDarkMode" 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
          </svg>
          <svg 
            v-else 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657L5.929 5.929m12.728 12.728L18.071 18.07M12 7a5 5 0 110 10 5 5 0 010-10z" 
            />
          </svg>
        </button>
      </div>

      <!-- 移动端菜单切换按钮 -->
      <div class="md:hidden flex items-center">
        <!-- 暗黑模式切换 -->
        <button 
          @click="emit('toggle-dark-mode')"
          class="mr-4 text-gray-600 dark:text-gray-300"
          aria-label="切换暗黑模式"
        >
          <svg 
            v-if="!isDarkMode" 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
          </svg>
          <svg 
            v-else 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657L5.929 5.929m12.728 12.728L18.071 18.07M12 7a5 5 0 110 10 5 5 0 010-10z" 
            />
          </svg>
        </button>

        <!-- 移动端菜单切换 -->
        <button 
          @click="toggleMobileMenu"
          class="text-gray-600 dark:text-gray-300 focus:outline-none"
          aria-label="切换菜单"
        >
          <svg 
            v-if="!isMobileMenuOpen" 
            class="h-6 w-6" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
          <svg 
            v-else 
            class="h-6 w-6" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <div 
      v-if="isMobileMenuOpen" 
      class="md:hidden bg-white dark:bg-gray-800 shadow-md"
    >
      <div class="px-4 pt-2 pb-4 space-y-2">
        <template v-for="item in menuItems" :key="item.path">
          <router-link 
            :to="item.path"
            class="block py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            :class="{ 'text-blue-600 dark:text-blue-400': route.path === item.path }"
            @click="isMobileMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
        </template>

        <!-- 创建博客按钮 -->
        <router-link 
          v-if="isLoggedIn" 
          to="/blog/create"
          class="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          @click="isMobileMenuOpen = false"
        >
          创建博客
        </router-link>

        <!-- 登录/登出按钮 -->
        <template v-if="!isLoggedIn">
          <router-link 
            to="/login"
            class="block w-full text-center px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
            @click="isMobileMenuOpen = false"
          >
            登录
          </router-link>
        </template>
        <button 
          v-else
          @click="logout"
          class="block w-full text-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          退出登录
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from '@/services/api';
import logoImage from '@/assets/logo.png';

// 定义 props
const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
});

// 定义 emits
const emit = defineEmits(['toggle-dark-mode']);

const route = useRoute();
const router = useRouter();

// 导航菜单项
const menuItems = [
  { path: '/', name: '首页' },
  { path: '/blog', name: '博客' },
  { path: '/archives', name: '归档' },
  { path: '/about', name: '关于' }
];

// 移动端菜单状态
const isMobileMenuOpen = ref(false);

// 切换移动端菜单
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// 导航到指定路由
const navigateTo = (path: string) => {
  router.push(path);
  isMobileMenuOpen.value = false;
};

// 登录状态
const isLoggedIn = ref(false);

// 检查登录状态
const checkLoginStatus = () => {
  isLoggedIn.value = !!authService.getCurrentUser();
};

// 登出
const logout = () => {
  authService.logout();
  checkLoginStatus();
  router.push('/login');
};

// 在组件挂载时检查登录状态
onMounted(checkLoginStatus);
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>
