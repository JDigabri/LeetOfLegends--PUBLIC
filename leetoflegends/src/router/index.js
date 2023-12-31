import { createRouter, createWebHistory } from 'vue-router'
import { store } from '../main.js';
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true  // This route requires authentication
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/SignUpView.vue')
  },
  {
    path: '/game/:problemId/:sessionId',
    name: 'game',
    component: () => import('../views/GameView.vue'),
    meta: {
      requiresAuth: true  // This route requires authentication
    }
  },
  {
    path:'/results/:problemId/:sessionId',
    name: 'results',
    component: () => import('../views/ResultsView.vue'),

  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isLoggedIn = store.state.loggedIn  // Replace with your Vuex store state
  
  if (requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn || to.path === '/register' && isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
