<template>
  <div class="container animate-fade-in py-12">
    <div class="tech-container max-w-3xl mx-auto p-8">
      <h1 class="text-4xl font-bold mb-8 text-center glitch-text" data-text="写博客">
        写博客
      </h1>
      
      <form @submit.prevent="submitPost" class="space-y-6">
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label for="title" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              文章标题
            </label>
            <input 
              type="text" 
              id="title" 
              v-model="title" 
              required 
              class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入文章标题"
            >
          </div>
          
          <div>
            <label for="summary" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              文章摘要
            </label>
            <textarea 
              id="summary" 
              v-model="summary" 
              rows="3"
              required
              class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="简要描述文章内容"
            ></textarea>
          </div>
          
          <div>
            <label for="content" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              文章内容
            </label>
            <textarea 
              id="content" 
              v-model="content" 
              rows="10"
              required
              class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="使用 Markdown 编写文章内容"
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-center mt-8">
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="neon-btn w-full max-w-xs"
          >
            {{ isSubmitting ? '发布中...' : '发布文章' }}
          </button>
        </div>
      </form>
      
      <div v-if="error" class="mt-4 text-center text-red-500">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref('')
const summary = ref('')
const content = ref('')
const isSubmitting = ref(false)
const error = ref('')

const submitPost = async () => {
  isSubmitting.value = true
  error.value = ''

  try {
    const response = await fetch('https://personal-blog-workers.zhangrongwuios-c13.workers.dev/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title.value,
        summary: summary.value,
        content: content.value
      })
    })

    if (!response.ok) {
      throw new Error('发布文章失败')
    }

    // 跳转到首页
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* 可选的额外样式 */
</style>
