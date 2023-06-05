import { createRouter, createWebHistory } from 'vue-router'
import Movies from '../components/Movie.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Movies
    }
  ]
})

export default router
