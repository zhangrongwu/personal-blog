<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-16">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden">
        <!-- 个人简介头部 -->
        <div class="relative h-64 md:h-96">
          <img 
            src="/src/assets/avatar.jpg" 
            alt="张荣武" 
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black opacity-50"></div>
          <div class="absolute inset-0 flex items-center justify-center text-center">
            <h1 class="text-4xl md:text-5xl font-extrabold text-white">
              关于我 - 张荣武
            </h1>
          </div>
        </div>

        <!-- 个人介绍内容 -->
        <div class="p-8 md:p-12">
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              个人简介
            </h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              我是一名热爱技术的全栈开发工程师，专注于 Web 开发和云原生技术。拥有丰富的前端和后端开发经验，擅长 Vue.js、TypeScript 和 Node.js 等技术栈。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              职业技能
            </h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                  前端开发
                </h3>
                <ul class="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Vue.js / React</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>状态管理 (Pinia, Redux)</li>
                </ul>
              </div>
              <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                  后端开发
                </h3>
                <ul class="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Node.js / Express</li>
                  <li>Cloudflare Workers</li>
                  <li>数据库 (MongoDB, PostgreSQL)</li>
                  <li>微服务架构</li>
                </ul>
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4 mt-4">
              <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                  移动开发
                </h3>
                <ul class="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Swift</li>
                  <li>Objective-C</li>
                  <li>iOS 应用开发</li>
                  <li>UIKit / SwiftUI</li>
                </ul>
              </div>
              <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                  其他编程语言
                </h3>
                <ul class="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Java</li>
                  <li>Python</li>
                  <li>Go</li>
                  <li>C++</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              我的博客
            </h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              这是我分享技术洞察、编程心得和个人成长的平台。我致力于记录学习过程，分享实践经验，并与技术社区交流。
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              联系方式
            </h2>
            <div class="flex space-x-4">
              <a 
                href="mailto:zhangrongwu@example.com" 
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
              >
                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                邮箱
              </a>
              <a 
                href="https://github.com/zhangrongwu" 
                target="_blank" 
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
              >
                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 可以添加一些交互逻辑或数据获取
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>
