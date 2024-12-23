<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/api';

// 定义博客文章接口
interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const posts = ref<BlogPost[]>([]);
const loading = ref(true);
const error = ref('');
const router = useRouter();

// 模拟获取博客文章的函数
const fetchBlogPosts = async () => {
  try {
    // 检查用户是否登录
    const token = authService.getCurrentUser();
    if (!token) {
      router.push('/login');
      return;
    }

    // 这里应该替换为实际的 API 调用
    const mockPosts: BlogPost[] = [
      {
        id: 1,
        title: '我的第一篇博客',
        content: '这是我的第一篇博客文章，记录下生活的点点滴滴。',
        author: '博主',
        createdAt: '2024-01-01'
      },
      {
        id: 2,
        title: '技术分享：Vue 3 最佳实践',
        content: '在这篇文章中，我将分享使用 Vue 3 的一些最佳实践和经验。',
        author: '博主',
        createdAt: '2024-02-15'
      }
    ];

    posts.value = mockPosts;
    loading.value = false;
  } catch (err: any) {
    error.value = err.message || '获取博客文章失败';
    loading.value = false;
  }
};

onMounted(fetchBlogPosts);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
      我的博客
    </h1>

    <div v-if="loading" class="text-center">
      <p class="text-gray-600 dark:text-gray-300">加载中...</p>
    </div>

    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-else-if="posts.length === 0" class="text-center">
      <p class="text-gray-600 dark:text-gray-300">暂无博客文章</p>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="post in posts" 
        :key="post.id" 
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {{ post.title }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          {{ post.content.slice(0, 100) }}{{ post.content.length > 100 ? '...' : '' }}
        </p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            作者：{{ post.author }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ post.createdAt }}
          </span>
        </div>
        <router-link 
          :to="`/blog/${post.id}`" 
          class="mt-4 inline-block text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          阅读全文
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可以添加一些额外的样式 */
</style>
