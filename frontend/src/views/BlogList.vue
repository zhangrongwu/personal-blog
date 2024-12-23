<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        博客文章
      </h1>
      <div v-if="isAuthenticated" class="flex space-x-4">
        <router-link 
          to="/blog/create" 
          class="btn"
        >
          创建新文章
        </router-link>
      </div>
    </div>

    <div class="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <div class="flex-grow">
        <input 
          v-model="searchQuery" 
          @input="debouncedSearch"
          type="text" 
          placeholder="搜索文章标题、内容或作者" 
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      <div class="flex space-x-2">
        <select 
          v-model="selectedTags" 
          @change="fetchPosts"
          multiple
          class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option 
            v-for="tag in availableTags" 
            :key="tag" 
            :value="tag"
          >
            {{ tag }}
          </option>
        </select>
        <button 
          @click="clearFilters" 
          class="btn-secondary"
        >
          清除筛选
        </button>
      </div>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="post in posts" 
        :key="post.id" 
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {{ post.title }}
          </h2>
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
            <div class="flex items-center space-x-2">
              <router-link 
                :to="`/blog/${post.id}`" 
                class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                阅读更多
              </router-link>
              <template v-if="isAuthenticated && post.author_id === currentUserId">
                <router-link 
                  :to="`/blog/edit/${post.id}`"
                  class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                >
                  编辑
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="posts.length === 0" class="text-center py-12 text-gray-600 dark:text-gray-300">
      没有找到匹配的文章
    </div>

    <div class="mt-8 flex justify-center">
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
import { ref, onMounted, watch } from 'vue';
import { apiClient } from '@/services/api';
import { useUserStore } from '@/stores/user';
import { debounce } from 'lodash-es';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  author_id: number;
}

const userStore = useUserStore();

const posts = ref<BlogPost[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(9);

const isAuthenticated = ref(!!userStore.id);
const currentUserId = ref(userStore.id);

const searchQuery = ref('');
const selectedTags = ref<string[]>([]);
const availableTags = ref<string[]>([]);

async function fetchTags() {
  try {
    const response = await apiClient.get('/tags');
    if (response.data.success) {
      availableTags.value = response.data.tags;
    }
  } catch (error) {
    console.error('获取标签失败', error);
  }
}

async function fetchPosts() {
  try {
    const response = await apiClient.get('/posts', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        status: 'published',
        tags: selectedTags.value.length > 0 ? selectedTags.value.join(',') : undefined,
        searchQuery: searchQuery.value || undefined
      }
    });

    if (response.data.success) {
      posts.value = response.data.posts;
      totalPages.value = Math.ceil(response.data.pagination.total / pageSize.value);
    }
  } catch (error) {
    console.error('获取博客文章失败', error);
  }
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  fetchPosts();
}, 500);

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

function clearFilters() {
  searchQuery.value = '';
  selectedTags.value = [];
  currentPage.value = 1;
  fetchPosts();
}

onMounted(() => {
  fetchTags();
  fetchPosts();
});

watch([currentPage, selectedTags], fetchPosts);
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
