<template>
  <div class="min-h-full relative">
    <NavigationBar />
    <div class="py-10">
      <main>
        <div class="flex justify-center space-x-4 mx-auto max-w-4xl">
          <div class="max-w-sm w-full overflow-hidden bg-white rounded-lg border border-gray-500">
            <div class="max-w-sm mx-auto overflow-hidden bg-white">
              <div class="px-6 py-4">
                <h2 class="text-2xl font-semibold text-gray-800">Authentication</h2>
                <p class="mt-1 text-gray-600">Please select the authentication method you want to use.</p>
              </div>
              <div class="px-6 pt-4 pb-2">
                <button class="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full">
                  <img :src="euWalletImage" alt="Login" class="h-6 mr-4">
                  <span class="flex-1 text-left font-medium text-gray-700">Login with EU Wallet</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" class="h-6 w-6 text-gray-900">
                    <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <div class="flex mb-4 items-center px-6 pt-4 pb-2">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" class="h-5 w-5 flex-none text-gray-900">
                  <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg> -->
                <!-- <a href="#" class="text-blue-600 hover:underline">More Information</a> -->
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue'
import euWalletImage from '@/assets/EUWallet.png'
</script>
