<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
      {{ route.params.id ? '编辑博客' : '创建新博客' }}
    </h1>

    <form @submit.prevent="submitPost" class="max-w-2xl mx-auto">
      <div class="mb-4">
        <label for="title" class="block text-gray-700 dark:text-gray-300 mb-2">
          博客标题
        </label>
        <input 
          id="title"
          v-model="post.title"
          type="text" 
          required
          class="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          placeholder="输入博客标题"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">
          博客内容 (支持 Markdown)
        </label>
        <MarkdownEditor 
          v-model="post.content"
          height="500px"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">
          标签
        </label>
        <div class="flex mb-2">
          <input 
            v-model="newTag"
            type="text" 
            class="flex-grow px-3 py-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
            placeholder="添加标签"
            @keyup.enter="addTag"
          />
          <button 
            type="button"
            @click="addTag"
            class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            添加
          </button>
        </div>
        <div class="flex flex-wrap gap-2 mt-2">
          <span 
            v-for="tag in post.tags" 
            :key="tag"
            class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
          >
            {{ tag }}
            <button 
              @click="removeTag(tag)"
              class="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </span>
        </div>
      </div>

      <div class="flex justify-end">
        <button 
          type="submit" 
          class="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {{ route.params.id ? '更新' : '发布' }}博客
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authService } from '@/services/api';
import MarkdownEditor from '@/components/MarkdownEditor.vue';

const router = useRouter();
const route = useRoute();

// 博客文章数据结构
interface BlogPost {
  id?: number;
  title: string;
  content: string;
  tags?: string[];
}

// 表单数据
const post = ref<BlogPost>({
  title: '',
  content: '',
  tags: []
});

// 标签管理
const newTag = ref('');
const addTag = () => {
  if (newTag.value.trim() && !post.value.tags?.includes(newTag.value.trim())) {
    post.value.tags = post.value.tags || [];
    post.value.tags.push(newTag.value.trim());
    newTag.value = '';
  }
};

const removeTag = (tagToRemove: string) => {
  post.value.tags = post.value.tags?.filter(tag => tag !== tagToRemove);
};

// 提交博客
const submitPost = async () => {
  try {
    // 检查用户是否登录
    const token = authService.getCurrentUser();
    if (!token) {
      router.push('/login');
      return;
    }

    // 验证输入
    if (!post.value.title.trim()) {
      alert('请输入博客标题');
      return;
    }

    if (!post.value.content.trim()) {
      alert('请输入博客内容');
      return;
    }

    // TODO: 实际的 API 调用
    console.log('提交的博客文章:', post.value);
    
    // 成功后跳转到博客列表
    router.push('/blog');
  } catch (error) {
    console.error('发布博客失败:', error);
    alert('发布博客失败，请重试');
  }
};

// 如果是编辑模式，获取现有博客文章
onMounted(async () => {
  const postId = route.params.id;
  if (postId) {
    try {
      // TODO: 获取特定 ID 的博客文章
      // const existingPost = await fetchBlogPost(postId);
      // post.value = existingPost;
    } catch (error) {
      console.error('获取博客文章失败:', error);
      router.push('/blog');
    }
  }
});
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>
