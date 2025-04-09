<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <!-- Notification -->
    <div 
      v-if="showCopiedNotification"
      class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300"
    >
      Copied to clipboard!
    </div>

    <div class="bg-white rounded-lg overflow-hidden shadow-lg max-w-2xl w-full p-6">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">RDW NiScy Credentials</h2>
        </div>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <span class="sr-only">Close</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-4">
        <!-- Credential Section -->
        <div class="space-y-4">
          <h3 class="font-medium text-gray-900">Power of Representation Credential</h3>
          
          <!-- QR Code Section with Loading State -->
          <div class="bg-gray-100 p-4 flex flex-col items-center justify-center space-y-4">
            <!-- Loading Animation -->
            <div v-if="isLoading" class="flex flex-col items-center space-y-2">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p class="text-sm text-gray-600">Loading credentials...</p>
            </div>

            <!-- QR Code and Transaction Code (shown when loaded) -->
            <template v-else>
              <img :src="qrCode" alt="QR Code" class="w-[200px] h-[200px]" v-if="qrCode" />
              <p class="text-lg font-semibold text-gray-800" v-if="transactionCode">
                Transaction Code: {{ transactionCode }}
              </p>
              <p class="text-sm text-gray-600">Please use this code when scanning the QR</p>
            </template>
          </div>

          <!-- EUDI Link Section -->
          <div class="space-y-2">
            <!-- Divider with "or" text -->
            <div v-if="credentialOfferUri" class="relative my-4">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-gray-100 text-gray-500">or</span>
              </div>
            </div>

            <!-- Add wallet trigger button - Only show when credentialOfferUri is available -->
            <button 
              v-if="credentialOfferUri"
              @click="openWallet(credentialOfferUri)"
              class="w-full mb-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18v-6m0 0l-4 4m4-4l4 4m-4-12v2" />
              </svg>
              <span>Open in Wallet</span>
            </button>

            <!-- Only show URI section when credentialOfferUri is available -->
            <template v-if="credentialOfferUri">
              <p class="text-sm text-gray-600">Credential Offer URI:</p>
              <div class="flex items-center space-x-2">
                <input 
                  type="text" 
                  :value="credentialOfferUri" 
                  readonly 
                  class="flex-1 p-2 border rounded-md text-sm"
                />
                <button 
                  @click="copyToClipboard(credentialOfferUri)"
                  class="p-2 text-blue-600 hover:text-blue-800"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { defineProps, defineEmits } from 'vue'
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
  kvkNumber: {
    type: String,
    required: true
  },
  legalName: {
    type: String,
    required: true
  }
})

defineEmits(['close'])

const credentialOfferUri = ref('')
const qrCode = ref('')
const transactionCode = ref('')
const showCopiedNotification = ref(false)
const isLoading = ref(true)

onMounted(async () => {
  console.log('RDW Dialog mounted with KVK number:', props.kvkNumber);
  console.log('Legal Name:', props.legalName);
  
  try {
    isLoading.value = true
    
    // First make the power of representation call
    const powerOfRepUrl = 'https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/power-of-representation'
    const powerOfRepBody = {
      "legal_person_identifier": `NLNHR.${props.kvkNumber}`,
      "legal_name": props.legalName
    }
    
    console.log('Making power of representation request with:', powerOfRepBody);
    const powerOfRepResponse = await fetch(powerOfRepUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(powerOfRepBody)
    })
    
    if (!powerOfRepResponse.ok) {
      console.error('Power of representation response not OK:', powerOfRepResponse.status, powerOfRepResponse.statusText);
      throw new Error('Failed to submit power of representation')
    }
    
    const data = await powerOfRepResponse.json()
    console.log('Received power of representation data:', data);

    // Update the UI with the response data
    qrCode.value = data.data.qr_code
    transactionCode.value = data.data.transaction_code
    credentialOfferUri.value = data.data.eudiw_link

  } catch (error) {
    console.error('Error fetching credentials:', error)
  } finally {
    isLoading.value = false
  }
})

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showCopiedNotification.value = true
    setTimeout(() => {
      showCopiedNotification.value = false
    }, 2000) // Hide after 2 seconds
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

const openWallet = (uri) => {
  window.location.href = uri
}
</script>

<style scoped>
.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 