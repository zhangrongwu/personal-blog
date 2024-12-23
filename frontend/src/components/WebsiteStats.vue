<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
    <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2">
      网站统计
    </h3>

    <div class="grid grid-cols-2 gap-4">
      <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
        <h4 class="text-sm text-gray-600 dark:text-gray-300 mb-2">
          总访问量
        </h4>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ stats.totalViews }}
        </p>
      </div>
      <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
        <h4 class="text-sm text-gray-600 dark:text-gray-300 mb-2">
          今日访问
        </h4>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ stats.todayViews }}
        </p>
      </div>
    </div>

    <div>
      <h4 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2">
        热门文章
      </h4>
      <ul class="space-y-2">
        <li 
          v-for="post in stats.topPosts" 
          :key="post.path"
          class="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-colors"
        >
          <router-link 
            :to="post.path" 
            class="text-gray-800 dark:text-gray-200 truncate"
          >
            {{ getPostTitle(post.path) }}
          </router-link>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ post.viewCount }} 浏览
          </span>
        </li>
      </ul>
    </div>

    <div>
      <h4 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2">
        流量来源
      </h4>
      <ul class="space-y-2">
        <li 
          v-for="referrer in stats.referrerStats" 
          :key="referrer.referrer"
          class="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-colors"
        >
          <a 
            :href="referrer.referrer" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-gray-800 dark:text-gray-200 truncate"
          >
            {{ formatReferrer(referrer.referrer) }}
          </a>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ referrer.count }} 访问
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiClient } from '@/services/api';

interface WebsiteStats {
  totalViews: number;
  todayViews: number;
  topPosts: Array<{
    path: string;
    viewCount: number;
  }>;
  referrerStats: Array<{
    referrer: string;
    count: number;
  }>;
}

const stats = ref<WebsiteStats>({
  totalViews: 0,
  todayViews: 0,
  topPosts: [],
  referrerStats: []
});

async function fetchWebsiteStats() {
  try {
    const response = await apiClient.get('/stats');

    if (response.data.success) {
      stats.value = response.data.stats;
    }
  } catch (error) {
    console.error('获取网站统计失败', error);
  }
}

function getPostTitle(path: string) {
  const match = path.match(/\/blog\/(\d+)/);
  return match ? `文章 #${match[1]}` : path;
}

function formatReferrer(referrer: string) {
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return referrer;
  }
}

onMounted(fetchWebsiteStats);
</script>
