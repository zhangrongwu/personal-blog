<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-16">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="flex justify-between items-center mb-12">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white">
          技术博客
        </h1>
        <div class="flex items-center space-x-4">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索博客..." 
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select 
            v-model="selectedTag" 
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有标签</option>
            <option v-for="tag in tags" :key="tag" :value="tag">
              {{ tag }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>

      <div v-else-if="error" class="text-center text-red-500 py-12">
        {{ error }}
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="post in filteredPosts" 
          :key="post.id" 
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
        >
          <div class="relative">
            <img 
              :src="post.coverImage || 'https://via.placeholder.com/400x250'" 
              :alt="post.title" 
              class="w-full h-48 object-cover"
            />
            <div class="absolute top-0 right-0 m-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              {{ formatDate(post.createdAt) }}
            </div>
          </div>
          
          <div class="p-6">
            <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              {{ post.title }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {{ post.summary }}
            </p>
            
            <div class="flex justify-between items-center">
              <div class="flex space-x-2">
                <span 
                  v-for="tag in post.tags" 
                  :key="tag"
                  class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                >
                  {{ tag }}
                </span>
              </div>
              
              <router-link 
                :to="{ 
                  name: 'BlogDetail', 
                  params: { id: post.id },
                  query: { title: encodeURIComponent(post.title) }
                }"
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
              >
                阅读更多
                <svg class="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredPosts.length === 0" class="text-center py-12">
        <p class="text-xl text-gray-600 dark:text-gray-300">
          没有找到匹配的博客文章
        </p>
      </div>

      <div class="flex justify-center mt-12">
        <nav class="flex space-x-2">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
          >
            上一页
          </button>
          <span class="px-4 py-2 bg-blue-500 text-white rounded-lg">
            {{ currentPage }}
          </span>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
          >
            下一页
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface BlogPost {
  id: string
  title: string
  summary: string
  createdAt: string
  coverImage?: string
  tags: string[]
}

const posts = ref<BlogPost[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const selectedTag = ref('')
const currentPage = ref(1)
const postsPerPage = 9

const fetchPosts = async () => {
  try {
    const response = await fetch('https://personal-blog-workers.zhangrongwuios-c13.workers.dev/api/posts')
    if (!response.ok) {
      throw new Error('获取博客文章失败')
    }
    const data = await response.json()
    console.log('获取的博客文章:', data)  
    posts.value = data
  } catch (err) {
    console.error('获取博客文章错误:', err)
    error.value = err instanceof Error ? err.message : '未知错误'
    posts.value = [] 
  } finally {
    loading.value = false
  }
}

const tags = computed(() => {
  const allTags = posts.value.flatMap(post => post.tags || [])
  return [...new Set(allTags)]
})

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesTag = !selectedTag.value || (post.tags || []).includes(selectedTag.value)
    return matchesSearch && matchesTag
  }).slice((currentPage.value - 1) * postsPerPage, currentPage.value * postsPerPage)
})

const totalPages = computed(() => Math.ceil(
  posts.value.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesTag = !selectedTag.value || (post.tags || []).includes(selectedTag.value)
    return matchesSearch && matchesTag
  }).length / postsPerPage
))

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

onMounted(fetchPosts)
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
