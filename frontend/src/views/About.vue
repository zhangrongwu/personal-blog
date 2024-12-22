<template>
  <div class="container animate-fade-in py-12">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
      <h1 class="text-4xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">
        关于我
      </h1>
      
      <div class="prose dark:prose-invert max-w-2xl mx-auto">
        <div class="flex justify-center mb-8">
          <img 
            src="/avatar.jpg" 
            alt="张荣武" 
            class="w-48 h-48 rounded-full object-cover shadow-md"
          />
        </div>
        
        <h2>个人简介</h2>
        <p>
          大家好，我是张荣武，一名热爱技术和创新的软件工程师。目前专注于全栈开发、云原生技术和人工智能领域。
        </p>
        
        <h2>技术栈</h2>
        <ul>
          <li>前端：Vue.js, React, TypeScript</li>
          <li>后端：Node.js, Python, Go</li>
          <li>云计算：Cloudflare Workers, AWS, GCP</li>
          <li>数据库：PostgreSQL, MongoDB, D1</li>
        </ul>
        
        <h2>联系方式</h2>
        <p>
          邮箱：<a href="mailto:zhangrongwuios@gmail.com">zhangrongwuios@gmail.com</a><br>
          GitHub：<a href="https://github.com/zhangrongwu" target="_blank">@zhangrongwu</a>
        </p>
      </div>
      
      <div class="mt-8 text-center">
        <router-link 
          to="/" 
          class="btn btn-primary"
        >
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面逻辑（如果需要）
</script>

<style scoped>
/* 可选的额外样式 */
</style>
