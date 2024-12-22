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
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center text-xl text-gray-600">
      加载中...
    </div>
    
    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>
    
    <article v-else-if="post" class="prose lg:prose-xl max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
      <div class="text-gray-600 mb-6 text-sm">
        发布日期: {{ new Date(post.created_at).toLocaleString() }}
      </div>
      
      <div 
        class="blog-content" 
        v-html="post.content"
      ></div>
      
      <div class="mt-8 border-t pt-4 text-center">
        <router-link 
          to="/" 
          class="text-blue-500 hover:text-blue-700"
        >
          返回首页
        </router-link>
      </div>
    </article>
    
    <div v-else class="text-center text-gray-600">
      文章不存在
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.blog-content {
  line-height: 1.8;
}

.blog-content p {
  margin-bottom: 1rem;
}

.blog-content h2 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}
</style>
