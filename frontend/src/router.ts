import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import BlogPost from './views/BlogPost.vue'
import About from './views/About.vue'
import CreatePost from './views/CreatePost.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/post/:id', component: BlogPost },
  { path: '/about', component: About },
  { path: '/create', component: CreatePost }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
