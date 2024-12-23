<script setup lang="ts">
import { ref, computed } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// 创建自定义渲染器
const renderer = new marked.Renderer();

renderer.code = (code: string, language?: string) => {
  const validLang = language && hljs.getLanguage(language) ? language : 'plaintext';
  
  try {
    const highlightedCode = hljs.highlight(validLang, code).value;
    return `<pre><code class="language-${validLang}">${highlightedCode}</code></pre>`;
  } catch (err) {
    console.error('Highlighting error:', err);
    return `<pre><code class="language-${validLang}">${code}</code></pre>`;
  }
};

// 配置 marked
marked.use({
  renderer,
  gfm: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartypants: false,
  xhtml: false
});

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
