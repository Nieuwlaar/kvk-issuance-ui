<template>
    <div>
      <div class="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-1 sm:px-3.5 sm:before:flex-1">
        <div class="absolute inset-0 bg-gradient-to-r from-[#AA418B] to-[#FE9201] opacity-100" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);"></div>
      </div>
  
      <div class="flex items-center justify-between bg-gray-200 px-6 py-2 sm:px-3.5">
        <div class="flex items-center space-x-3">
          <router-link to="/" class="text-cyan-800 hover:text-cyan-900">
            <HomeIcon class="h-5 w-5" aria-hidden="true" />
            <span class="sr-only">Home</span>
          </router-link>
          <p class="text-sm leading-6 text-black">
            Issuance based on <a href="https://github.com/eu-digital-identity-wallet/eudi-srv-web-issuing-eudiw-py/tags" class="underline hover:text-gray-600">eudi-srv-web-issuing-eudiw-py</a> 0.7.1. Verification based on OpenID4VP draft 21.
          </p>
        </div>
        
        <!-- Auth Status Button -->
        <div class="flex items-center">
          <div v-if="isAuthenticated" class="relative">
            <button 
              @click="toggleProfileMenu" 
              class="profile-toggle-button flex items-center space-x-2 bg-white px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 transition"
            >
              <UserIcon class="h-5 w-5 text-gray-600" />
              <span class="text-sm font-medium text-gray-700">{{ userData.given_name }}</span>
            </button>
            
            <!-- Profile Dropdown Menu -->
            <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200 profile-menu">
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-800 mb-1">User Profile</h3>
                <div class="space-y-2">
                  <div>
                    <p class="text-xs text-gray-500">Name</p>
                    <p class="text-sm font-medium">{{ userData.given_name }} {{ userData.family_name }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Birth Date</p>
                    <p class="text-sm font-medium">{{ userData.birth_date }}</p>
                  </div>
                </div>
              </div>
              <div class="p-2">
                <button 
                  @click="logout" 
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          <router-link 
            v-else 
            to="/login" 
            class="flex items-center space-x-2 bg-white px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 transition"
          >
            <UserIcon class="h-5 w-5 text-gray-600" />
            <span class="text-sm font-medium text-gray-700">Login</span>
          </router-link>
        </div>
      </div>
  
      <header class="bg-white">
        <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
          <div class="fixed inset-0 z-10" />
          <DialogPanel class="fixed inset-y-0 right-0 z-8 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div class="flex items-center justify-between">
              <button @click="goHome" class="-m-1.5 p-1.5">
                <span class="sr-only">KVK</span>
                <img class="h-8 w-auto" src="https://logovtor.com/wp-content/uploads/2020/01/kamer-van-koophandel-kvk-logo-vector.png" alt="" />
              </button>
              <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
                <span class="sr-only">Close menu</span>
                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div class="mt-6 flow-root">
              <div class="-my-6 divide-y divide-gray-500/10">
                <div class="space-y-2 py-6">
                  <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                    <DisclosureButton class="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      Product
                      <ChevronDownIcon :class="[open ? 'rotate-180' : '', 'h-5 w-5 flex-none']" aria-hidden="true" />
                    </DisclosureButton>
                    <DisclosurePanel class="mt-2 space-y-2">
                      <DisclosureButton v-for="item in [...products, ...callsToAction]" :key="item.name" as="a" :href="item.href" class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">{{ item.name }}</DisclosureButton>
                    </DisclosurePanel>
                  </Disclosure>
                </div>
                <div class="py-6">
                  <router-link 
                    v-if="!isAuthenticated" 
                    to="/login" 
                    class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Login
                  </router-link>
                  <div v-else class="py-2.5 px-3">
                    <p class="text-base font-medium">{{ userData.given_name }} {{ userData.family_name }}</p>
                    <button 
                      @click="logout" 
                      class="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
      
      <!-- Added bottom logo container -->
      <div class="fixed bottom-0 left-0 p-4 pl-8 z-10">
        <button @click="goHome" class="-m-1.5 p-1.5">
          <img class="h-12 w-auto" src="https://logovtor.com/wp-content/uploads/2020/01/kamer-van-koophandel-kvk-logo-vector.png" alt="" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
  } from '@headlessui/vue'
  import {
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    GlobeAltIcon,
    UserIcon,
    HomeIcon
  } from '@heroicons/vue/24/outline'
  
  const mobileMenuOpen = ref(false)
  const showProfileMenu = ref(false)
  const isAuthenticated = ref(false)
  const userData = ref({
    given_name: '',
    family_name: '',
    birth_date: ''
  })
  
  const { t, locale } = useI18n()
  const router = useRouter()
  
  // Check authentication status on component mount
  onMounted(() => {
    checkAuthenticationStatus()
    
    // Add click outside listener to close profile menu
    document.addEventListener('click', handleClickOutside)
  })
  
  // Cleanup event listener on component unmount
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  
  // Handle clicks outside the profile menu to close it
  const handleClickOutside = (event) => {
    // Get profile button element (the toggle button)
    const profileButton = document.querySelector('.profile-toggle-button')
    const profileMenu = document.querySelector('.profile-menu')
    
    // Check if click is outside both the menu and the toggle button
    if (profileMenu && 
        !profileMenu.contains(event.target) && 
        (!profileButton || !profileButton.contains(event.target)) && 
        showProfileMenu.value) {
      showProfileMenu.value = false
    }
  }
  
  // Toggle profile menu visibility
  const toggleProfileMenu = (event) => {
    // Prevent event from bubbling to document click handler
    event.stopPropagation()
    showProfileMenu.value = !showProfileMenu.value
  }
  
  // Check if user is authenticated
  const checkAuthenticationStatus = async () => {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      isAuthenticated.value = false
      userData.value = { given_name: '', family_name: '', birth_date: '' }
      return
    }
    
    try {
      const response = await fetch('https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        isAuthenticated.value = true
        userData.value = {
          given_name: data.given_name || '',
          family_name: data.family_name || '',
          birth_date: data.birth_date || ''
        }
      } else {
        // Token invalid or expired
        isAuthenticated.value = false
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    } catch (err) {
      console.error('Error validating token:', err)
      isAuthenticated.value = false
    }
  }
  
  // Logout function
  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      
      if (accessToken) {
        await fetch('https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
      }
    } catch (err) {
      console.error('Error during logout:', err)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      isAuthenticated.value = false
      userData.value = { given_name: '', family_name: '', birth_date: '' }
      showProfileMenu.value = false
      
      // Redirect to login if on a protected page
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push('/login')
      }
    }
  }
  
  // Watch for route changes to update auth status
  watch(() => router.currentRoute.value, () => {
    checkAuthenticationStatus()
  })
  
  const changeLanguage = () => {
    locale.value = locale.value === 'en' ? 'nl' : 'en'
    console.log('Locale changed to:', locale.value)
  }
  
  const goHome = () => {
    router.push({ path: '/' })
  }
  </script>

  <style scoped>
  /* Add some transitions for smooth UI */
  .profile-menu-enter-active,
  .profile-menu-leave-active {
    transition: opacity 0.2s, transform 0.2s;
  }
  
  .profile-menu-enter-from,
  .profile-menu-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  </style>