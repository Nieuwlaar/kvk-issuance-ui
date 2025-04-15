// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthorizationFlowView from '../views/AuthorizationFlowView.vue'
import PreAuthorizationFlowView from '../views/PreAuthorizationFlowView.vue'
import LoginView from '../views/LoginView.vue'
// import PortalView from '../views/PortalView.vue'  // Import the new component

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/pre-authorization',
      name: 'pre-authorization',
      component: PreAuthorizationFlowView
    },
    {
      path: '/authorization',
      name: 'authorization',
      component: AuthorizationFlowView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    // {
    //   path: '/portal',
    //   name: 'portal',
    //   component: PortalView
    // },
  ]
})

export default router
