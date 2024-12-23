<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();

// 控制暗黑模式
const isDarkMode = ref(false);

// 切换暗黑模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
  
  // 存储用户偏好
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode.value));
};

// 初始化暗黑模式
onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    isDarkMode.value = JSON.parse(savedDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode.value);
  }
});
</script>

<template>
  <div 
    class="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
  >
    <Navbar 
      :is-dark-mode="isDarkMode" 
      @toggle-dark-mode="toggleDarkMode" 
    />

    <main class="flex-grow">
      <RouterView v-slot="{ Component }">
        <transition 
          name="fade" 
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <Footer />
  </div>
</template>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
