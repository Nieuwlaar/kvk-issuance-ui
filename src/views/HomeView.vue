<template>
  <div class="min-h-full relative">
    <NavigationBar />
    <div class="bg-gray-100 h-1"></div>
    <div class="py-10">
      <main class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome to the KVK Pilot Issuance UI</h1>
          <p class="mt-2 text-lg text-gray-600">Choose an option below to proceed:</p>
        </div>
        <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden p-6">
          <nav class="flex flex-col space-y-4">
            <!-- Use router-link for navigation -->
            <router-link 
              to="/pre-authorization" 
              class="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-center"
            >
              Start Pre-Authorization Flow
            </router-link>
            <router-link 
              to="/authorization" 
              class="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-center"
            >
              Start Authorization Flow (Placeholder)
            </router-link>
          </nav>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue'
</script>

<style scoped>
button {
  transition: background-color 0.3s ease;
}
button:hover {
  background-color: #e2e8f0; /* Light gray color */
}
</style>
