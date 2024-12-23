<script setup lang="ts">
import { ref, computed, watch } from 'vue';
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

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '400px'
  }
});

const emit = defineEmits(['update:modelValue']);

const content = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const previewHtml = computed(() => {
  return marked.parse(content.value || '');
});

const activeTab = ref<'edit' | 'preview'>('edit');
</script>

<template>
  <div class="markdown-editor">
    <div class="tabs mb-2">
      <button 
        @click="activeTab = 'edit'"
        :class="['tab', activeTab === 'edit' ? 'active' : '']"
      >
        编辑
      </button>
      <button 
        @click="activeTab = 'preview'"
        :class="['tab', activeTab === 'preview' ? 'active' : '']"
      >
        预览
      </button>
    </div>
    <div class="editor-container">
      <textarea 
        v-if="activeTab === 'edit'"
        v-model="content"
        :style="{ height }"
        class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
        placeholder="使用 Markdown 编写您的博客内容"
      ></textarea>
      <div 
        v-else 
        :style="{ height }"
        class="preview w-full p-2 border rounded overflow-auto dark:bg-gray-800 dark:text-white dark:border-gray-600"
        v-html="previewHtml"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 10px;
}
.tab {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: #f8f9fa;
  border-radius: 4px;
}
.tab.active {
  background-color: #007bff;
  color: white;
}
.preview {
  white-space: pre-wrap;
  word-wrap: break-word;
}
/* 代码块样式 */
.preview pre {
  background-color: #f4f4f4;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  overflow-x: auto;
}
.preview code {
  font-family: 'Courier New', Courier, monospace;
}
</style>
