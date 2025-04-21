// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthorizationFlowView from '../views/AuthorizationFlowView.vue'
import PreAuthorizationFlowView from '../views/PreAuthorizationFlowView.vue'
import LoginView from '../views/LoginView.vue'
import WalletView from '../views/WalletView.vue'
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
      component: AuthorizationFlowView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: WalletView
    },
    // {
    //   path: '/portal',
    //   name: 'portal',
    //   component: PortalView
    // },
  ]
})

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is authenticated
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      // User is not authenticated, redirect to login page
      next({ name: 'login' })
    } else {
      // Validate token with the backend
      try {
        const response = await fetch('https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/auth/validate', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        
        if (response.ok) {
          // Token is valid, proceed
          next()
        } else {
          // Token is invalid or expired, clear and redirect to login
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          next({ name: 'login' })
        }
      } catch (error) {
        console.error('Error validating token:', error)
        // On network error, we'll allow the navigation but log the error
        // This prevents users from being locked out due to temporary API issues
        next()
      }
    }
  } else {
    // Route doesn't require authentication, proceed
    next()
  }
})

export default router
