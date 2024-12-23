<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
      {{ year }}年 {{ month }}月 文章
    </h1>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-300">加载中...</p>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-300">暂无文章</p>
    </div>

    <div v-else class="space-y-6">
      <div 
        v-for="post in posts" 
        :key="post.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <router-link 
              :to="`/blog/${post.id}`"
              class="text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {{ post.title }}
            </router-link>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(post.created_at) }}
            </span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {{ post.content }}
          </p>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span 
                v-for="tag in post.tags" 
                :key="tag"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
              >
                {{ tag }}
              </span>
            </div>
            <router-link 
              :to="`/blog/${post.id}`" 
              class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              阅读全文
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="posts.length > 0" class="mt-8 flex justify-center">
      <nav aria-label="分页导航">
        <ul class="inline-flex items-center -space-x-px">
          <li>
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              上一页
            </button>
          </li>
          <li>
            <span class="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
              {{ currentPage }} / {{ totalPages }}
            </span>
          </li>
          <li>
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              下一页
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { apiClient } from '@/services/api';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
}

const route = useRoute();

const year = computed(() => route.params.year as string);
const month = computed(() => route.params.month as string);

const posts = ref<BlogPost[]>([]);
const loading = ref(true);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);

async function fetchPosts() {
  try {
    loading.value = true;
    const response = await apiClient.get(`/archives/${year.value}/${month.value}`, {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value
      }
    });

    if (response.data.success) {
      posts.value = response.data.posts;
      totalPages.value = Math.ceil(response.data.pagination.total / pageSize.value);
    }
  } catch (error) {
    console.error('获取文章失败', error);
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric'
  });
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchPosts();
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchPosts();
  }
}

onMounted(fetchPosts);
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
