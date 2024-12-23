<template>
  <footer class="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
    <div class="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
      <!-- 网站信息 -->
      <div>
        <div class="flex items-center mb-4">
          <img 
            src="../assets/logo.png" 
            alt="博客 Logo" 
            class="h-10 w-10 mr-3"
          />
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            我的个人博客
          </h2>
        </div>
        <p class="text-gray-600 dark:text-gray-400">
          分享技术、生活和思考的空间。致力于记录成长的点点滴滴。
        </p>
      </div>

      <!-- 社交媒体链接 -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          社交媒体
        </h3>
        <div class="flex space-x-4">
          <a 
            v-for="social in socialLinks" 
            :key="social.name"
            :href="social.link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path :d="social.icon" />
            </svg>
            <span class="sr-only">{{ social.name }}</span>
          </a>
        </div>
      </div>

      <!-- 友情链接 -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          友情链接
        </h3>
        <ul class="space-y-2">
          <li 
            v-for="link in friendlyLinks" 
            :key="link.name"
          >
            <a 
              :href="link.link"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {{ link.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="bg-gray-100 dark:bg-gray-900 py-4 text-center">
      <p class="text-gray-600 dark:text-gray-400">
        {{ currentYear }} 我的个人博客 | 保留所有权利
      </p>
      <nav class="mt-2 space-x-4">
        <a 
          href="/about" 
          class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          关于
        </a>
        <a 
          href="/privacy" 
          class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          隐私政策
        </a>
        <a 
          href="/terms" 
          class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          使用条款
        </a>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 社交媒体链接
const socialLinks = [
  { 
    name: 'GitHub', 
    icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z', 
    link: 'https://github.com/zhangrongwu' 
  },
  { 
    name: 'Twitter', 
    icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z', 
    link: 'https://twitter.com/zhangrongwu' 
  },
  { 
    name: 'LinkedIn', 
    icon: 'M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z', 
    link: 'https://linkedin.com/in/zhangrongwu' 
  }
];

// 友情链接
const friendlyLinks = [
  { name: 'Vue.js', link: 'https://vuejs.org/' },
  { name: 'Tailwind CSS', link: 'https://tailwindcss.com/' },
  { name: 'Cloudflare', link: 'https://www.cloudflare.com/' }
];

// 获取当前年份
const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>
