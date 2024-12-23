import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { authService } from '@/services/api';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/blog',
    name: 'BlogList',
    component: () => import('@/views/BlogList.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/blog/create',
    name: 'BlogCreate',
    component: () => import('@/views/BlogEditor.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/blog/edit/:id',
    name: 'BlogEdit',
    component: () => import('@/views/BlogEditor.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: () => import('@/views/BlogDetail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/archives',
    name: 'Archives',
    component: () => import('@/views/Archives.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/archives/:year/:month',
    name: 'ArchiveDetail',
    component: () => import('@/views/ArchiveDetail.vue'),
    meta: { requiresAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局导航守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!authService.getCurrentUser();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    // 如果路由需要认证但用户未登录，重定向到登录页
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    // 如果已登录，不允许访问登录和注册页
    next('/');
  } else {
    next();
  }
});

export default router;
