<template>
  <div class="min-h-full relative">
    <NavigationBar />
    <div class="bg-gray-100 h-1"></div>
    <div class="py-10">
      <main class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome to the KVK Potential Pilot</h1>
          <p class="mt-2 text-lg text-gray-600">Choose an option below to proceed:</p>
        </div>

        <!-- KVK PoR Pilot Flow -->
        <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden p-6 mb-8">
          <div class="mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Pilot with KVK issued attestations</h2>
            <p class="mt-2 text-sm text-gray-600">Complete end-to-end flow demonstrating attestation issuance and verification:</p>
            <ul class="mt-3 list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Authenticate to KVK using your PID (mdoc)</li>
              <li>Receive KVK attestations</li>
              <li>Verify your attestations with relying parties</li>
            </ul>
          </div>
          <router-link 
            to="/login?flow=por"
            class="w-full inline-flex justify-center rounded-md bg-cyan-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-800"
          >
            Start Complete Flow
          </router-link>
        </div>
        
        <!-- Individual Components -->
        <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Individual Components</h2>
          <nav class="flex flex-col space-y-4">
            <!-- Use router-link for navigation -->
            <router-link 
              to="/pre-authorization" 
              class="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-center"
            >
              Pre-Authorization Issuance
            </router-link>
            <router-link 
              to="/authorization" 
              class="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-center"
            >
              Authorization
            </router-link>
            <router-link
              to="/wallet"
              class="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-center"
            >
              Download Wallet & Issue Test PID
            </router-link>
            <a
              href="https://kvk-issuance-ui.nieuwlaar.com/relying-party"
              target="_blank"
              class="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-center"
            >
              List of Relying Parties
            </a>
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
