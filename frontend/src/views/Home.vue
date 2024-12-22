<template>
  <div class="container animate-fade-in py-12 grid-bg">
    <header class="text-center mb-12 tech-container p-8">
      <h1 class="text-5xl font-extrabold mb-4 glitch-text" data-text="张荣武的技术博客">
        张荣武的技术博客
      </h1>
      <p class="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
        分享技术洞察、编程心得和创新思考
      </p>
      <div class="mt-6 flex justify-center space-x-4">
        <router-link 
          to="/create" 
          class="neon-btn"
        >
          写博客
        </router-link>
        <router-link 
          to="/about" 
          class="neon-btn"
        >
          关于我
        </router-link>
      </div>
    </header>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>

    <div v-else-if="error" class="text-center text-red-500 py-12">
      {{ error }}
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="post in posts" 
        :key="post.id" 
        class="tech-card p-6 hover:shadow-2xl transition-all duration-300"
      >
        <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          {{ post.title }}
        </h2>
        <p class="text-slate-600 dark:text-slate-300 mb-4">
          {{ post.summary }}
        </p>
        <div class="flex justify-between items-center">
          <router-link 
            :to="`/post/${post.id}`" 
            class="text-blue-600 dark:text-blue-400 hover:underline"
          >
            阅读全文
          </router-link>
          <span class="text-sm text-slate-500 dark:text-slate-400">
            {{ formatDate(post.createdAt) }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="posts.length === 0 && !loading" class="text-center py-12">
      <p class="text-xl text-slate-600 dark:text-slate-300">
        暂无博客文章
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface BlogPost {
  id: string
  title: string
  summary: string
  createdAt: string
}

const posts = ref<BlogPost[]>([])
const loading = ref(true)
const error = ref('')

const fetchPosts = async () => {
  try {
    const response = await fetch('https://personal-blog-workers.zhangrongwuios-c13.workers.dev/api/posts')
    if (!response.ok) {
      throw new Error('获取博客文章失败')
    }
    posts.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(fetchPosts)
</script>

<style scoped>
/* 可选的额外样式 */
</style>
