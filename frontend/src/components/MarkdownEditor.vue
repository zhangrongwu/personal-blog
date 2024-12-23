<script setup lang="ts">
import { ref, computed } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// 配置 marked 以支持代码高亮
const markedOptions = {
  highlight: (code: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, code).value
      } catch (err) {
        console.error('Highlighting error:', err)
      }
    }
    return code
  }
};

marked.setOptions(markedOptions);

// Props 定义
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '300px'
  }
});

// Emits 定义
const emit = defineEmits(['update:modelValue']);

// 编辑器状态
const isPreviewMode = ref(false);

// 渲染 Markdown
const renderedContent = computed(() => {
  return marked.parse(props.modelValue || '');
});

// 切换预览模式
const togglePreviewMode = () => {
  isPreviewMode.value = !isPreviewMode.value;
};

// 更新内容
const updateContent = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="markdown-editor">
    <div class="editor-toolbar">
      <button 
        @click="togglePreviewMode"
        class="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {{ isPreviewMode ? '编辑' : '预览' }}
      </button>
    </div>

    <div class="editor-container" :style="{ height }">
      <textarea 
        v-if="!isPreviewMode"
        :value="modelValue"
        @input="updateContent"
        class="w-full h-full p-4 border rounded dark:bg-gray-800 dark:text-white"
        placeholder="使用 Markdown 编写你的内容"
      ></textarea>

      <div 
        v-else 
        v-html="renderedContent"
        class="w-full h-full p-4 overflow-auto prose dark:prose-invert"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.markdown-editor {
  @apply border rounded dark:border-gray-700;
}

.editor-toolbar {
  @apply p-2 border-b dark:border-gray-700;
}

.editor-container {
  @apply relative;
}
</style>
