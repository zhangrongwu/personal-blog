import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const id = ref<number | null>(null);
  const username = ref('');
  const email = ref('');
  const avatar = ref('');

  function updateUser(userData: {
    id?: number;
    username?: string;
    email?: string;
    avatar?: string;
  }) {
    if (userData.id !== undefined) id.value = userData.id;
    if (userData.username !== undefined) username.value = userData.username;
    if (userData.email !== undefined) email.value = userData.email;
    if (userData.avatar !== undefined) avatar.value = userData.avatar;
  }

  function clearUser() {
    id.value = null;
    username.value = '';
    email.value = '';
    avatar.value = '';
  }

  return {
    id,
    username,
    email,
    avatar,
    updateUser,
    clearUser
  };
});
