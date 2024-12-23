<template>
  <div v-if="post" class="container mx-auto px-4 py-8 max-w-3xl">
    <article class="prose dark:prose-invert prose-lg">
      <header class="mb-8">
        <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ post.title }}
        </h1>
        <div class="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
          <span>{{ formatDate(post.created_at) }}</span>
          <div class="flex space-x-2">
            <span 
              v-for="tag in post.tags" 
              :key="tag"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </header>

      <div 
        class="markdown-content" 
        v-html="renderedContent"
      ></div>
    </article>

    <section class="mt-12">
      <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        评论
      </h2>
      
      <div v-if="!isAuthenticated" class="text-center">
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          请先登录后发表评论
        </p>
        <router-link 
          to="/login" 
          class="btn"
        >
          登录
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <form @submit.prevent="submitComment" class="mb-6">
          <textarea 
            v-model="newComment" 
            placeholder="写下你的评论..." 
            rows="4"
            class="w-full rounded-lg border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
          <button 
            type="submit" 
            class="mt-2 btn"
          >
            发表评论
          </button>
        </form>

        <div v-if="comments.length === 0" class="text-center text-gray-600 dark:text-gray-300">
          暂无评论
        </div>

        <div 
          v-for="comment in comments" 
          :key="comment.id" 
          class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
        >
          <div class="flex items-center mb-2">
            <img 
              :src="comment.user.avatar || '/default-avatar.png'" 
              alt="用户头像" 
              class="w-8 h-8 rounded-full mr-3"
            />
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white">
                {{ comment.user.username }}
              </h4>
              <p class="text-xs text-gray-600 dark:text-gray-300">
                {{ formatDate(comment.created_at) }}
              </p>
            </div>
          </div>
          <p class="text-gray-800 dark:text-gray-200">
            {{ comment.content }}
          </p>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="text-center py-12">
    <p class="text-gray-600 dark:text-gray-300">文章加载中...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { apiClient } from '@/services/api';
import { useUserStore } from '@/stores/user';
import marked from 'marked';
import DOMPurify from 'dompurify';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
}

interface Comment {
  id: number;
  content: string;
  user: {
    username: string;
    avatar?: string;
  };
  created_at: string;
}

const route = useRoute();
const userStore = useUserStore();

const post = ref<BlogPost | null>(null);
const comments = ref<Comment[]>([]);
const newComment = ref('');

const isAuthenticated = computed(() => !!userStore.id);

const renderedContent = computed(() => {
  if (!post.value) return '';
  const htmlContent = marked(post.value.content);
  return DOMPurify.sanitize(htmlContent);
});

async function fetchPost() {
  try {
    const postId = Number(route.params.id);
    const response = await apiClient.get(`/posts/${postId}`);

    if (response.data.success) {
      post.value = response.data.post;
      await fetchComments();
    }
  } catch (error) {
    console.error('获取博客文章失败', error);
  }
}

async function fetchComments() {
  try {
    const postId = Number(route.params.id);
    const response = await apiClient.get(`/posts/${postId}/comments`);

    if (response.data.success) {
      comments.value = response.data.comments;
    }
  } catch (error) {
    console.error('获取评论失败', error);
  }
}

async function submitComment() {
  if (!newComment.value.trim()) return;

  try {
    const postId = Number(route.params.id);
    const response = await apiClient.post(`/posts/${postId}/comments`, {
      content: newComment.value
    });

    if (response.data.success) {
      comments.value.unshift(response.data.comment);
      newComment.value = '';
    }
  } catch (error) {
    console.error('发表评论失败', error);
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

onMounted(fetchPost);
</script>

<style>
.markdown-content img {
  max-width: 100%;
  height: auto;
}

.markdown-content h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.markdown-content h2 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-content p {
  margin-bottom: 1rem;
}

.markdown-content blockquote {
  border-left: 4px solid #6366f1;
  padding-left: 1rem;
  color: #6b7280;
  font-style: italic;
}

.markdown-content code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.markdown-content pre {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
</style>
