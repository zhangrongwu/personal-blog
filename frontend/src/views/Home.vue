<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  created_at: string;
}

const posts = ref<BlogPost[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch('https://personal-blog.your-workers-subdomain.workers.dev/api/posts')
    posts.value = await response.json()
    loading.value = false
  } catch (error) {
    console.error('获取博客文章失败:', error)
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">最新文章</h1>
    <div v-if="loading" class="text-center">加载中...</div>
    <div v-else class="grid gap-6">
      <div v-for="post in posts" :key="post.id" class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-2">
          <router-link :to="`/post/${post.id}`" class="hover:text-blue-600">
            {{ post.title }}
          </router-link>
        </h2>
        <p class="text-gray-600 mb-4">{{ post.summary }}</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">
            {{ new Date(post.created_at).toLocaleDateString() }}
          </span>
          <router-link 
            :to="`/post/${post.id}`" 
            class="text-blue-500 hover:text-blue-700"
          >
            阅读全文 →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
