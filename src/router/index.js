import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue') },
  { path: '/detail/:type/:id', name: 'Detail', component: () => import('@/views/DetailView.vue') },
  { path: '/message', name: 'Message', component: () => import('@/views/MessageView.vue') },
  { path: '/about', name: 'About', component: () => import('@/views/AboutView.vue') },
  { path: '/search', name: 'Search', component: () => import('@/views/SearchView.vue') },
  { path: '/admin', name: 'Admin', component: () => import('@/views/AdminView.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
