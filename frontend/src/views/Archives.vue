<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
      文章归档
    </h1>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-300">加载中...</p>
    </div>

    <div v-else-if="archives.length === 0" class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-300">暂无文章</p>
    </div>

    <div v-else>
      <div 
        v-for="(yearArchive, yearIndex) in archives" 
        :key="yearArchive.year"
        class="mb-8"
      >
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2">
          {{ yearArchive.year }}年
        </h2>

        <div 
          v-for="(monthArchive, monthIndex) in yearArchive.months" 
          :key="monthArchive.month"
          class="mb-6"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-medium text-gray-800 dark:text-gray-200">
              {{ monthArchive.month }}月 ({{ monthArchive.postCount }}篇)
            </h3>
            <router-link 
              :to="`/archives/${yearArchive.year}/${monthArchive.month}`"
              class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              查看全部
            </router-link>
          </div>

          <ul class="space-y-3">
            <li 
              v-for="post in monthArchive.posts" 
              :key="post.id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <router-link 
                :to="`/blog/${post.id}`"
                class="block"
              >
                <div class="flex items-center justify-between">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ post.title }}
                  </h4>
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ formatDate(post.created_at) }}
                  </span>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { apiClient } from '@/services/api';

interface Post {
  id: number;
  title: string;
  created_at: string;
}

interface MonthArchive {
  month: string;
  postCount: number;
  posts: Post[];
}

interface YearArchive {
  year: string;
  months: MonthArchive[];
}

const loading = ref(true);
const rawArchives = ref<any[]>([]);
const archives = computed<YearArchive[]>(() => {
  const groupedArchives: { [key: string]: YearArchive } = {};

  rawArchives.value.forEach(archive => {
    if (!groupedArchives[archive.year]) {
      groupedArchives[archive.year] = {
        year: archive.year,
        months: []
      };
    }

    const existingMonth = groupedArchives[archive.year].months.find(
      m => m.month === archive.month
    );

    if (existingMonth) {
      existingMonth.postCount += archive.postCount;
      existingMonth.posts.push(...archive.posts);
    } else {
      groupedArchives[archive.year].months.push({
        month: archive.month,
        postCount: archive.postCount,
        posts: archive.posts
      });
    }
  });

  return Object.values(groupedArchives).map(yearArchive => ({
    ...yearArchive,
    months: yearArchive.months.sort((a, b) => parseInt(b.month) - parseInt(a.month))
  })).sort((a, b) => parseInt(b.year) - parseInt(a.year));
});

async function fetchArchives() {
  try {
    const response = await apiClient.get('/posts/archives');
    
    console.log('获取归档响应:', response);  // 添加日志
    
    if (response.data.success) {
      rawArchives.value = response.data.archives;
    } else {
      console.error('获取归档失败:', response.data);
      throw new Error(response.data.message || '获取归档失败');
    }
  } catch (error) {
    console.error('获取文章归档失败', error);
    // 可以在这里添加用户友好的错误提示
    alert('无法获取文章归档，请稍后重试');
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

onMounted(fetchArchives);
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>
