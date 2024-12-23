<template>
  <div class="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
    <div class="lg:col-span-3">
      <article v-if="post" class="prose dark:prose-invert max-w-none">
        <header class="mb-8">
          <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {{ post.title }}
          </h1>
          <div class="flex items-center justify-between text-gray-600 dark:text-gray-300">
            <div class="flex items-center space-x-4">
              <span>作者: {{ post.author_name }}</span>
              <span>发布时间: {{ formatDate(post.created_at) }}</span>
            </div>
            <div class="flex items-center space-x-2">
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

        <div class="flex justify-between items-center border-t pt-6 dark:border-gray-700">
          <div class="flex space-x-4">
            <template v-if="isAuthenticated && post.author_id === currentUserId">
              <router-link 
                :to="`/blog/edit/${post.id}`"
                class="btn-secondary"
              >
                编辑文章
              </router-link>
            </template>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              @click="toggleLike" 
              class="flex items-center space-x-1 text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-6 w-6" 
                :fill="isLiked ? 'currentColor' : 'none'" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              <span>{{ likeCount }}</span>
            </button>
          </div>
        </div>

        <section class="mt-8">
          <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            评论 ({{ comments.length }})
          </h2>

          <div v-if="isAuthenticated" class="mb-6">
            <textarea 
              v-model="newComment" 
              placeholder="写下你的评论..." 
              rows="4"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
            <button 
              @click="submitComment" 
              class="mt-2 btn"
            >
              发布评论
            </button>
          </div>

          <div v-if="comments.length === 0" class="text-center py-6 text-gray-600 dark:text-gray-300">
            暂无评论
          </div>

          <div v-else class="space-y-6">
            <div 
              v-for="comment in comments" 
              :key="comment.id"
              class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm"
            >
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center space-x-3">
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {{ comment.author_name }}
                  </span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ formatDate(comment.created_at) }}
                  </span>
                </div>
                <div v-if="comment.author_id === currentUserId" class="flex space-x-2">
                  <button 
                    @click="editComment(comment)" 
                    class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                  >
                    编辑
                  </button>
                  <button 
                    @click="deleteComment(comment.id)" 
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    删除
                  </button>
                </div>
              </div>
              <p class="text-gray-800 dark:text-gray-200">
                {{ comment.content }}
              </p>
            </div>
          </div>
        </section>
      </article>

      <div v-else class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-300">文章加载中...</p>
      </div>
    </div>

    <div class="hidden lg:block">
      <Sidebar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { apiClient } from '@/services/api';
import { useUserStore } from '@/stores/user';
import Sidebar from '@/components/Sidebar.vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// 配置 marked 以支持代码高亮
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-',
});

interface BlogPost {
  id: number;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  author_id: number;
  author_name: string;
}

interface Comment {
  id: number;
  content: string;
  author_id: number;
  author_name: string;
  created_at: string;
}

const route = useRoute();
const userStore = useUserStore();

const post = ref<BlogPost | null>(null);
const comments = ref<Comment[]>([]);
const newComment = ref('');
const editingComment = ref<Comment | null>(null);

const isAuthenticated = ref(!!userStore.id);
const currentUserId = ref(userStore.id);

const isLiked = ref(false);
const likeCount = ref(0);

const renderedContent = ref('');

async function fetchPostDetails() {
  try {
    const postId = Number(route.params.id);
    const response = await apiClient.get(`/posts/${postId}`);

    if (response.data.success) {
      post.value = response.data.post;
      renderedContent.value = marked.parse(response.data.post.content);
    }
  } catch (error) {
    console.error('获取文章详情失败', error);
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
    console.error('发布评论失败', error);
  }
}

async function editComment(comment: Comment) {
  editingComment.value = comment;
  newComment.value = comment.content;
}

async function updateComment() {
  if (!editingComment.value || !newComment.value.trim()) return;

  try {
    const response = await apiClient.put(`/comments/${editingComment.value.id}`, {
      content: newComment.value
    });

    if (response.data.success) {
      const index = comments.value.findIndex(c => c.id === editingComment.value!.id);
      if (index !== -1) {
        comments.value[index].content = newComment.value;
      }
      newComment.value = '';
      editingComment.value = null;
    }
  } catch (error) {
    console.error('更新评论失败', error);
  }
}

async function deleteComment(commentId: number) {
  try {
    const response = await apiClient.delete(`/comments/${commentId}`);

    if (response.data.success) {
      comments.value = comments.value.filter(c => c.id !== commentId);
    }
  } catch (error) {
    console.error('删除评论失败', error);
  }
}

function toggleLike() {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
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

onMounted(() => {
  fetchPostDetails();
  fetchComments();
});
</script>

<style scoped>
.markdown-content {
  line-height: 1.6;
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
.markdown-content pre {
  background-color: #f4f4f4;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  overflow-x: auto;
}
.markdown-content code {
  font-family: 'Courier New', Courier, monospace;
}
</style>
