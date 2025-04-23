<template>
  <FlowLayout>
    <template #before-flow-bar>
      <div class="min-h-full relative">
        <NavigationBar />
        <div class="bg-gray-100 h-1"></div>
      </div>
    </template>
    
    <div class="min-h-full relative">
      <div class="py-10">
        <main class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">KVK Wallet & Test PID</h1>
          </div>
          <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden p-6 space-y-6">
            <div class="download-section text-center">
              <h2 class="text-xl font-semibold text-gray-800">Download KVK Test Wallet</h2>
              <p class="mt-2 mb-4 text-gray-600">
                Download the Wallet app for Android to manage your test Personal Identification Data (PID).
              </p>
              <a href="/app-demo-debug.apk" download="kvk-wallet-test.apk">
                <button class="rounded-md bg-cyan-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-800">
                  Download Wallet (Android .apk)
                </button>
              </a>
            </div>

            <div class="issuance-section">
              <h2 class="text-xl font-semibold text-gray-800 text-center">Issuing a test PID</h2>
              <p class="mt-2 text-gray-600">
                This wallet allows you to receive and present a test PID. To issue a new test PID within the wallet app:
              </p>
              <ol class="list-decimal list-inside mt-3 space-y-1 text-gray-600">
                  <li>Open the (NiScy) Wallet app.</li>
                  <li>Select the option to add a new PID.</li>
                  <li>Choose "Country Selection" and Submit.</li>
                  <li>Select "FormEU".</li>
                  <li>Fill in the required details in the form:
                    <ul class="list-disc list-inside ml-5 space-y-1">
                      <li>family_name: "Squarepants"</li>
                      <li>given_name: "Spongebob"</li>
                      <li>birth_date: "2000-01-01"</li>
                    </ul>
                  </li>
                  <li>Submit the form, review the details, and Authorize the issuance.</li>
              </ol>
            </div>
            
            <!-- Continue Button for Flow -->
            <div v-if="isInFlow" class="mt-8 flex justify-end">
              <router-link 
                to="/login?flow=por" 
                class="rounded-md bg-cyan-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-800"
              >
                Continue to Authentication
                <span aria-hidden="true" class="ml-1">→</span>
              </router-link>
            </div>
          </div>
        </main>
      </div>
    </div>
  </FlowLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import FlowLayout from '@/components/FlowLayout.vue'
import { useFlowStore } from '@/stores/flowStore'

const route = useRoute()
const flowStore = useFlowStore()
const isInFlow = ref(false)

onMounted(() => {
  // Check if we're in the PoR flow
  if (route.query.flow === 'por') {
    isInFlow.value = true
    flowStore.startFlow()
    flowStore.setCurrentStep('wallet')
  } else {
    isInFlow.value = false
  }
})
</script>

<style scoped>
/* Reusing some styles and potentially adding new ones if needed */
.download-section, .issuance-section {
  margin-top: 0; /* Adjusted spacing handled by parent */
  padding: 0; /* Padding handled by parent */
  border: none; /* Removed border as it's wrapped now */
}

h1, h2 {
  color: #333; /* Kept basic color styling */
}

/* Adjusted button styling for consistency if needed, or rely on global/HomeView styles */
/* button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
} */

/* Removing form-specific styles */
/* form { ... } */
/* label { ... } */
/* input[type="text"] { ... } */
</style> 