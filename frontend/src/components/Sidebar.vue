<template>
  <aside class="w-full lg:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
    <!-- 热门文章 -->
    <div>
      <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2">
        热门文章
      </h3>
      <ul class="space-y-3">
        <li 
          v-for="post in popularPosts" 
          :key="post.id"
          class="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <router-link 
            :to="`/blog/${post.id}`"
            class="block p-2 text-gray-800 dark:text-gray-200 truncate"
          >
            {{ post.title }}
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 热门标签 -->
    <div>
      <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2">
        热门标签
      </h3>
      <div class="flex flex-wrap gap-2">
        <router-link 
          v-for="tag in popularTags" 
          :key="tag.name"
          :to="`/blog?tags=${tag.name}`"
          class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-800 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
        >
          {{ tag.name }} ({{ tag.count }})
        </router-link>
      </div>
    </div>

    <!-- 文章归档 -->
    <div>
      <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2">
        文章归档
      </h3>
      <ul class="space-y-2">
        <li 
          v-for="archive in archives" 
          :key="`${archive.year}-${archive.month}`"
          class="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <router-link 
            :to="`/archives/${archive.year}/${archive.month}`"
            class="block p-2 text-gray-800 dark:text-gray-200"
          >
            {{ archive.year }}年 {{ archive.month }}月 ({{ archive.postCount }}篇)
          </router-link>
        </li>
      </ul>
      <router-link 
        to="/archives"
        class="block mt-4 text-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        查看所有归档
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiClient } from '@/services/api';

interface PopularPost {
  id: number;
  title: string;
}

interface PopularTag {
  name: string;
  count: number;
}

interface Archive {
  year: string;
  month: string;
  postCount: number;
}

const popularPosts = ref<PopularPost[]>([]);
const popularTags = ref<PopularTag[]>([]);
const archives = ref<Archive[]>([]);

async function fetchPopularPosts() {
  try {
    const response = await apiClient.get('/popular-posts', {
      params: { limit: 5 }
    });

    if (response.data.success) {
      popularPosts.value = response.data.popularPosts;
    }
  } catch (error) {
    console.error('获取热门文章失败', error);
  }
}

async function fetchPopularTags() {
  try {
    const response = await apiClient.get('/popular-tags', {
      params: { limit: 10 }
    });

    if (response.data.success) {
      popularTags.value = response.data.popularTags;
    }
  } catch (error) {
    console.error('获取热门标签失败', error);
  }
}

async function fetchArchives() {
  try {
    const response = await apiClient.get('/archives');

    if (response.data.success) {
      // 取前5个归档
      archives.value = response.data.archives.slice(0, 5);
    }
  } catch (error) {
    console.error('获取文章归档失败', error);
  }
}

onMounted(() => {
  fetchPopularPosts();
  fetchPopularTags();
  fetchArchives();
});
</script>
