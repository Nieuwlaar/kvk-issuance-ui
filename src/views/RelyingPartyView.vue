<template>
  <FlowLayout>
    <template #before-flow-bar>
      <div class="min-h-full relative">
        <NavigationBar />
      </div>
    </template>
    
    <div class="min-h-full relative">
      <div class="py-10">
        <main class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Verify Power of Representation</h1>
            <p class="mt-2 text-lg text-gray-600">Present your Power of Representation to relying parties</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Relying Party Verification</h2>
            
            <div class="space-y-4">
              <p class="text-gray-600">
                You can now present your Power of Representation to relying parties that need to verify your authorization to represent an organization.
              </p>
              
              <div class="mt-8">
                <h3 class="font-medium text-gray-800 mb-3">Available Relying Parties:</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- KVK Relying Party -->
                  <a href="https://mijn-kvk-portal.nieuwlaar.com/" target="_blank" class="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
                    <div class="flex items-center mb-2">
                      <div class="w-6 h-4 overflow-hidden flex-shrink-0 mr-2 border border-gray-300" style="background: linear-gradient(to bottom, #AE1C28 33%, white 33%, white 66%, #21468B 66%);">
                      </div>
                      <h4 class="font-medium text-gray-800">Test KVK Relying Party (not yet functional)</h4>
                    </div>
                    <p class="text-gray-600 text-sm">Dutch Chamber of Commerce verification service</p>
                  </a>

                  <!-- Dummy Relying Party -->
                  <div class="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div class="flex items-center mb-2">
                      <div class="w-6 h-4 overflow-hidden flex-shrink-0 mr-2 border border-gray-300" style="background: linear-gradient(to bottom, white 50%, red 50%);">
                      </div>
                      <h4 class="font-medium text-gray-400">More Relying Parties Coming Soon</h4>
                    </div>
                    <p class="text-gray-400 text-sm">Additional verification services will be added</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Flow Navigation -->
            <div v-if="isInFlow" class="mt-8 flex justify-between">
              <router-link 
                to="/authorization?flow=por"
                class="text-cyan-800 hover:text-cyan-900 font-medium flex items-center"
              >
                <span aria-hidden="true" class="mr-1">←</span>
                Back to PoR Issuance
              </router-link>
              
              <router-link 
                to="/"
                class="rounded-md bg-cyan-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-800"
              >
                Complete Flow
              </router-link>
            </div>
          </div>
        </main>
      </div>
    </div>
  </FlowLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import FlowLayout from '@/components/FlowLayout.vue'
import { useFlowStore } from '@/stores/flowStore'

// Get route and flow state
const route = useRoute()
const flowStore = useFlowStore()
const isInFlow = ref(false)

onMounted(() => {
  // Check if we're in the PoR flow
  if (route.query.flow === 'por') {
    isInFlow.value = true
    flowStore.startFlow()
    flowStore.setCurrentStep('relying-party')
  } else {
    isInFlow.value = false
  }
})
</script> 