<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="bg-gray-800 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold">
          我的个人博客
        </router-link>
        <nav>
          <ul class="flex space-x-4">
            <li><router-link to="/" class="hover:text-gray-300">首页</router-link></li>
            <li><router-link to="/about" class="hover:text-gray-300">关于</router-link></li>
          </ul>
        </nav>
      </div>
    </header>

    <RouterView />

    <footer class="bg-gray-800 text-white p-4 mt-8">
      <div class="container mx-auto text-center">
        <p>&copy; {{ new Date().getFullYear() }} 我的个人博客. 保留所有权利.</p>
      </div>
    </footer>
  </div>
</template>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>
