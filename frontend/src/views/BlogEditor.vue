<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
      {{ isEditing ? '编辑文章' : '创建新文章' }}
    </h1>

    <form @submit.prevent="submitPost" class="space-y-6">
      <div>
        <label 
          for="title" 
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          文章标题
        </label>
        <input 
          id="title"
          v-model="title" 
          type="text" 
          required 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label 
          for="tags" 
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          标签（用逗号分隔）
        </label>
        <input 
          id="tags"
          v-model="tagsInput" 
          type="text" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="例如: Vue, TypeScript, 前端"
        />
      </div>

      <div>
        <label 
          for="content" 
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          文章内容
        </label>
        <div class="mt-1 grid grid-cols-2 gap-4">
          <div>
            <textarea 
              id="content"
              v-model="content" 
              rows="20" 
              required 
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="使用 Markdown 编写你的文章"
            ></textarea>
          </div>
          <div>
            <div 
              class="prose dark:prose-invert prose-lg p-4 bg-gray-50 dark:bg-gray-800 rounded-md overflow-auto h-full"
              v-html="renderedContent"
            ></div>
          </div>
        </div>
      </div>

      <div>
        <label 
          for="status" 
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          文章状态
        </label>
        <select 
          id="status"
          v-model="status" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="draft">草稿</option>
          <option value="published">发布</option>
        </select>
      </div>

      <div class="flex justify-end space-x-4">
        <button 
          type="button" 
          @click="cancel"
          class="btn-secondary"
        >
          取消
        </button>
        <button 
          type="submit" 
          class="btn"
        >
          {{ isEditing ? '更新文章' : '发布文章' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiClient } from '@/services/api';
import marked from 'marked';
import DOMPurify from 'dompurify';

const route = useRoute();
const router = useRouter();

const isEditing = computed(() => route.name === 'BlogEdit');
const postId = ref<number | null>(null);

const title = ref('');
const tagsInput = ref('');
const content = ref('');
const status = ref<'draft' | 'published'>('draft');

const renderedContent = computed(() => {
  const htmlContent = marked(content.value);
  return DOMPurify.sanitize(htmlContent);
});

async function fetchPost() {
  if (isEditing.value) {
    try {
      const id = Number(route.params.id);
      postId.value = id;
      const response = await apiClient.get(`/posts/${id}`);

      if (response.data.success) {
        const post = response.data.post;
        title.value = post.title;
        content.value = post.content;
        status.value = post.status;
        tagsInput.value = post.tags.join(', ');
      }
    } catch (error) {
      console.error('获取文章失败', error);
      router.push('/blog');
    }
  }
}

async function submitPost() {
  try {
    const postData = {
      title: title.value,
      content: content.value,
      tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(Boolean),
      status: status.value
    };

    if (isEditing.value && postId.value) {
      // 更新文章
      await apiClient.put(`/posts/${postId.value}`, postData);
    } else {
      // 创建文章
      await apiClient.post('/posts', postData);
    }

    // 跳转到博客列表或文章详情
    router.push('/blog');
  } catch (error) {
    console.error('文章提交失败', error);
    // 可以添加错误提示
  }
}

function cancel() {
  router.push('/blog');
}

onMounted(fetchPost);
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>
