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

onMounted(async () => {
  try {
    const response = await fetch(`https://personal-blog.your-workers-subdomain.workers.dev/api/posts/${route.params.id}`)
    post.value = await response.json()
    loading.value = false
  } catch (error) {
    console.error('获取博客文章失败:', error)
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center">加载中...</div>
    <article v-else-if="post" class="prose lg:prose-xl">
      <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
      <div class="text-gray-600 mb-6">
        发布日期: {{ new Date(post.created_at).toLocaleDateString() }}
      </div>
      <div v-html="post.content"></div>
    </article>
    <div v-else class="text-center">文章不存在</div>
  </div>
</template>
