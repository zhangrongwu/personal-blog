<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const route = useRoute()
const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await fetch(`https://personal-blog-workers.zhangrongwuios-c13.workers.dev/api/posts/${route.params.id}`)
    
    if (!response.ok) {
      throw new Error('文章获取失败')
    }
    
    post.value = await response.json()
    loading.value = false
  } catch (err) {
    console.error('获取博客文章失败:', err)
    error.value = err instanceof Error ? err.message : '未知错误'
    loading.value = false
  }
})
</script>

<template>
  <div class="container animate-fade-in">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="text-center text-red-500 dark:text-red-400">
      {{ error }}
    </div>
    
    <article v-else-if="post" class="prose dark:prose-invert lg:prose-xl max-w-3xl mx-auto py-12">
      <header class="mb-10 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          {{ post.title }}
        </h1>
        <div class="text-gray-600 dark:text-gray-300 text-sm">
          发布日期: {{ new Date(post.created_at).toLocaleString() }}
        </div>
      </header>
      
      <div 
        class="blog-content" 
        v-html="post.content"
      ></div>
      
      <div class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <router-link 
          to="/" 
          class="btn btn-secondary"
        >
          返回首页
        </router-link>
      </div>
    </article>
    
    <div v-else class="text-center text-gray-600 dark:text-gray-400 py-12">
      文章不存在
    </div>
  </div>
</template>

<style scoped>
.blog-content {
  @apply leading-relaxed;
}

.blog-content p {
  @apply mb-4;
}

.blog-content h2 {
  @apply text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white;
}
</style>
