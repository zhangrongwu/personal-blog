<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between">
      <!-- 个人介绍 -->
      <div class="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
          你好，我是 <span class="text-blue-600">张荣武</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          一个热爱技术、专注于全栈开发的程序员。我在这里分享我的技术见解、项目经验和个人成长。
        </p>
        
        <div class="flex space-x-4 justify-center md:justify-start">
          <router-link 
            to="/blog" 
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            阅读博客
          </router-link>
          
          <router-link 
            to="/about" 
            class="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            关于我
          </router-link>
        </div>
      </div>

      <!-- 个人头像 -->
      <div class="md:w-1/2 flex justify-center">
        <div class="relative">
          <div class="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
            <img 
              src="/src/assets/avatar.jpg" 
              alt="个人头像" 
              class="w-full h-full object-cover"
            />
          </div>
          <div class="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 002 2v1a1 1 0 102 0v-1a2 2 0 002-2V9a2 2 0 00-2-2V6zm7-3a1 1 0 00-1 1v.01a1 1 0 102 0V4a1 1 0 00-1-1h-.01zm2 3a1 1 0 10-2 0v1a2 2 0 00-2 2v1a2 2 0 002 2v1a1 1 0 102 0v-1a2 2 0 002-2V9a2 2 0 00-2-2V6z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术栈 -->
    <div class="bg-white dark:bg-gray-900 py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-12">
          我的技术栈
        </h2>
        <div class="flex flex-wrap justify-center gap-8">
          <div v-for="tech in technologies" :key="tech.name" class="group">
            <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
              <img :src="tech.icon" :alt="tech.name" class="w-12 h-12 group-hover:opacity-75 transition-opacity" />
            </div>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {{ tech.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const technologies = ref([
  { name: 'Vue', icon: 'https://vuejs.org/images/logo.png' },
  { name: 'TypeScript', icon: 'https://www.typescriptlang.org/favicon-32x32.png' },
  { name: 'Tailwind', icon: 'https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b.svg' },
  { name: 'Node.js', icon: 'https://nodejs.org/static/images/logo.svg' },
  { name: 'Cloudflare', icon: 'https://www.cloudflare.com/favicon.ico' },
  { name: 'Swift', icon: 'https://developer.apple.com/swift/images/swift-logo.svg' },
  { name: 'Objective-C', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Apple_Logo_Transparent.png/640px-Apple_Logo_Transparent.png' },
  { name: 'Java', icon: 'https://www.java.com/favicon.ico' }
])
</script>

<style scoped>
.animate-gradient {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
