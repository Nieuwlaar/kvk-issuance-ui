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
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Verify Attestations</h1>
            <p class="mt-2 text-lg text-gray-600">Present your attestations to relying parties</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Relying Party Verification</h2>
            
            <div class="space-y-4">
              <p class="text-gray-600">
                You can now present your attestations to relying parties.
              </p>
              
              <div class="mt-8">
                <h3 class="font-medium text-gray-800 mb-3">Functional Partner Relying Parties:</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Polish Relying Party -->
                  <a href="https://demo-relying-party.pit.lukasiewicz.gov.pl/" target="_blank" class="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
                    <div class="flex items-center mb-2">
                      <country-flag country="pl" size="small" class="mr-3" />
                      <h4 class="font-medium text-gray-800">Polish Relying Party</h4>
                    </div>
                    <p class="text-gray-600 text-sm">Polish verification service</p>
                  </a>

                  <!-- Slovenian Relying Party -->
                  <a href="https://sicas.setcce.si/idpw/login?policy=IDP-W&service=https%3A%2F%2Fsicas.gov.si%2Fbl%2FhandleIdpResponse%3FrelayState%3D29f7b1ba-caec-4536-8658-90231e2d1261&lang=si&spName=eUPRAVA&addAtt=emso%2Cdrzava%2Cnaslov%2Cdatum_roj" target="_blank" class="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
                    <div class="flex items-center mb-2">
                      <country-flag country="si" size="small" class="mr-3" />
                      <h4 class="font-medium text-gray-800">Slovenian Relying Party</h4>
                    </div>
                    <p class="text-gray-600 text-sm">Slovenian verification service</p>
                  </a>
                </div>

                <h3 class="font-medium text-gray-800 mb-3 mt-8">Other Functional Relying Parties:</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Austrian Test Relying Party -->
                  <a href="https://apps.egiz.gv.at/customverifier/por.html" target="_blank" class="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
                    <div class="flex items-center mb-2">
                      <country-flag country="at" size="small" class="mr-3" />
                      <h4 class="font-medium text-gray-800">Austrian Test Relying Party</h4>
                    </div>
                    <p class="text-gray-600 text-sm">Austrian test verification service</p>
                  </a>

                  <!-- French Relying Party (commented out) -->
                  <!-- <a href="https://api.playground.france-identite.gouv.fr/docaposte/console-icp/" target="_blank" class="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
                    <div class="flex items-center mb-2">
                      <country-flag country="fr" size="small" class="mr-3" />
                      <h4 class="font-medium text-gray-800">French Relying Party</h4>
                    </div>
                    <p class="text-gray-600 text-sm">French verification service</p>
                  </a> -->
                </div>

                <h3 class="font-medium text-gray-800 mb-3 mt-8">Work in Progress:</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- German Relying Party -->
                  <a href="https://servicekonto.test.governikus-eid.de/eudi-mercury-testclient/start" target="_blank" class="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
                    <div class="flex items-center mb-2">
                      <country-flag country="de" size="small" class="mr-3" />
                      <h4 class="font-medium text-gray-800">German Relying Party</h4>
                    </div>
                    <p class="text-gray-600 text-sm">German verification service</p>
                  </a>

                  <!-- Austrian Official Relying Party -->
                  <a href="https://pp-q.sdg-oop.gv.at/potential" target="_blank" class="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
                    <div class="flex items-center mb-2">
                      <country-flag country="at" size="small" class="mr-3" />
                      <h4 class="font-medium text-gray-800">Austrian Official Relying Party</h4>
                    </div>
                    <p class="text-gray-600 text-sm">Austrian official verification service</p>
                  </a>

                  <!-- Portuguese Relying Party -->
                  <a href="https://eudiwpotential-driving.demo.arubapec.it/uc1" target="_blank" class="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
                    <div class="flex items-center mb-2">
                      <country-flag country="pt" size="small" class="mr-3" />
                      <h4 class="font-medium text-gray-800">Portuguese Relying Party</h4>
                    </div>
                    <p class="text-gray-600 text-sm">Portuguese verification service</p>
                  </a>
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
import CountryFlag from 'vue-country-flag-next'

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

<style scoped>
:deep(.flag-icon) {
  border: 1px solid #e5e7eb;
  border-radius: 2px;
}
</style> 