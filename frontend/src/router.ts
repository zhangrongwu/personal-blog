import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import BlogPost from './views/BlogPost.vue'
import BlogDetail from './views/BlogDetail.vue'
import About from './views/About.vue'
import CreatePost from './views/CreatePost.vue'
import LoginView from './views/LoginView.vue'
import Archives from './views/Archives.vue'

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { 
    path: '/blog', 
    component: BlogPost, 
    name: 'Blog',
    children: [
      { path: ':id', component: BlogDetail, name: 'BlogDetail' }
    ]
  },
  { path: '/archives', component: Archives, name: 'Archives' },
  { path: '/about', component: About, name: 'About' },
  { path: '/create', component: CreatePost, name: 'CreatePost' },
  { path: '/login', component: LoginView, name: 'Login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
