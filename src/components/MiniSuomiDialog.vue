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
        <h2 class="text-xl font-semibold text-gray-800">MiniSuomi Credentials</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <span class="sr-only">Close</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="grid grid-cols-2 gap-6">
        <!-- LPID Section -->
        <div class="space-y-4">
          <h3 class="font-medium text-gray-900">LPID</h3>
          <div class="bg-gray-100 p-4 flex items-center justify-center">
            <qrcode-vue :value="lpidCredentialOfferUri" :size="200" level="H" />
          </div>
          <div class="space-y-2">
            <p class="text-sm text-gray-600">Credential Offer URI:</p>
            <div class="flex items-center space-x-2">
              <input 
                type="text" 
                :value="lpidCredentialOfferUri" 
                readonly 
                class="flex-1 p-2 border rounded-md text-sm"
              />
              <button 
                @click="copyToClipboard(lpidCredentialOfferUri)"
                class="p-2 text-blue-600 hover:text-blue-800"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Company Certificate Section -->
        <div class="space-y-4">
          <h3 class="font-medium text-gray-900">Company Certificate</h3>
          <div class="bg-gray-100 p-4 flex items-center justify-center">
            <qrcode-vue :value="certificateCredentialOfferUri" :size="200" level="H" />
          </div>
          <div class="space-y-2">
            <p class="text-sm text-gray-600">Credential Offer URI:</p>
            <div class="flex items-center space-x-2">
              <input 
                type="text" 
                :value="certificateCredentialOfferUri" 
                readonly 
                class="flex-1 p-2 border rounded-md text-sm"
              />
              <button 
                @click="copyToClipboard(certificateCredentialOfferUri)"
                class="p-2 text-blue-600 hover:text-blue-800"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
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
  }
})

defineEmits(['close'])

const lpidCredentialOfferUri = ref('')
const certificateCredentialOfferUri = ref('')
const showCopiedNotification = ref(false)

onMounted(async () => {
  console.log('Dialog mounted with KVK number:', props.kvkNumber);
  try {
    // Get base URL based on environment
    const baseUrl = import.meta.env.VITE_ENV === 'production'
      ? import.meta.env.VITE_PROD_API_BASE_URL
      : import.meta.env.VITE_DEV_API_BASE_URL
    
    // LPID Request
    const lpidPath = `/mini-suomi/issuers/kvk/openid4vci/issue/LPIDSdJwt/${props.kvkNumber}`
    const lpidUrl = `${baseUrl}${lpidPath}`
    
    console.log('Making LPID request to:', lpidUrl);
    const lpidResponse = await fetch(lpidUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    
    if (!lpidResponse.ok) {
      console.error('LPID Response not OK:', lpidResponse.status, lpidResponse.statusText);
      throw new Error('Failed to fetch LPID credential offer')
    }
    
    const lpidData = await lpidResponse.json()
    console.log('Received LPID data:', lpidData);
    lpidCredentialOfferUri.value = lpidData.credential_offer_uri

    // Company Certificate Request
    const certificatePath = `/mini-suomi/issuers/kvk/openid4vci/issue/EUCCSdJwt/${props.kvkNumber}`
    const certificateUrl = `${baseUrl}${certificatePath}`
    
    console.log('Making Certificate request to:', certificateUrl);
    const certificateResponse = await fetch(certificateUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    
    if (!certificateResponse.ok) {
      console.error('Certificate Response not OK:', certificateResponse.status, certificateResponse.statusText);
      throw new Error('Failed to fetch Certificate credential offer')
    }
    
    const certificateData = await certificateResponse.json()
    console.log('Received Certificate data:', certificateData);
    certificateCredentialOfferUri.value = certificateData.credential_offer_uri

  } catch (error) {
    console.error('Error fetching credentials:', error)
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
</script>

<style scoped>
.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}
</style> 