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
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Power of Representation Issuance</h1>
            <p class="mt-2 text-lg text-gray-600">Get a Power of Representation credential for your organization</p>
          </div>
          
          <!-- Company Certificates Section -->
          <div v-if="isLoadingCertificates" class="flex justify-center py-4">
            <div class="loader"></div>
          </div>
          
          <div v-else-if="certificateError" class="rounded-md bg-red-50 p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{{ certificateError }}</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>Please request a new PID which has SpongeBob SquarePants as its name.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="companyCertificates.length > 0" class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Your Organizations</h2>
              <p class="text-sm text-gray-600">Select an organization to issue a Power of Representation</p>
            </div>
            <ul role="list" class="divide-y divide-gray-100">
              <li v-for="cert in companyCertificates" :key="cert.certificate.legal_person.legal_person_id" class="flex items-center justify-between gap-x-6 py-5 px-6">
                <div class="flex min-w-0 gap-x-4">
                  <div class="size-12 flex-none rounded-full bg-gray-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-500">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                  </div>
                  <div class="min-w-0 flex-auto">
                    <p class="text-sm/6 font-semibold text-gray-900">{{ cert.certificate.legal_person.legal_person_name }}</p>
                    <p class="mt-1 truncate text-xs/5 text-gray-500">{{ cert.certificate.legal_person.legal_form_type }}</p>
                  </div>
                </div>
                <button 
                  @click="openDialog(cert.certificate.legal_person)"
                  class="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Issue
                </button>
              </li>
            </ul>
          </div>
          
          <!-- Flow navigation buttons -->
          <div class="flex justify-between items-center mt-6">
            <!-- Back button when in flow -->
            <router-link 
              v-if="isInFlow" 
              to="/login?flow=por"
              class="text-cyan-800 hover:text-cyan-900 font-medium flex items-center"
            >
              <span aria-hidden="true" class="mr-1">←</span>
              Back to Authentication
            </router-link>
            <div class="flex-grow"></div>
            <!-- Continue button when in flow -->
            <router-link 
              v-if="isInFlow" 
              to="/relying-party?flow=por"
              class="rounded-md bg-cyan-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-800"
            >
              Continue to Verification
              <span aria-hidden="true" class="ml-1">→</span>
            </router-link>
          </div>
        </main>
      </div>
    </div>
    
    <!-- Credential Dialog -->
    <Teleport to="body">
      <dialog 
        ref="credentialDialogRef"
        class="rounded-lg p-6 shadow-xl max-w-md w-full"
      >
        <div class="space-y-4">
          <h2 class="text-lg font-semibold">{{ selectedCompany ? selectedCompany.legal_person_name : 'Organization' }}</h2>
          
          <!-- Credential Type Selector -->
          <div v-if="!isInitialLoading" class="flex justify-center space-x-4 border-b pb-4 mb-4">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="credentialType" value="power-of-representation" v-model="activeCredentialType" class="radio radio-primary radio-sm">
              <span class="text-sm font-medium" :class="{'text-cyan-800': activeCredentialType === 'power-of-representation'}">Power of Representation</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="credentialType" value="company-registration" v-model="activeCredentialType" class="radio radio-primary radio-sm">
              <span class="text-sm font-medium" :class="{'text-cyan-800': activeCredentialType === 'company-registration'}">Company Registration</span>
            </label>
          </div>
          
          <!-- Format Selector -->
          <div v-if="!isInitialLoading" class="flex justify-center space-x-4 border-b pb-4 mb-4">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="format" value="sd_jwt_vc" v-model="formatValue" class="radio radio-primary radio-sm">
              <span class="text-sm font-medium" :class="{'text-cyan-800': formatValue === 'sd_jwt_vc'}">SD-JWT</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="format" value="mdoc" v-model="formatValue" class="radio radio-primary radio-sm">
              <span class="text-sm font-medium" :class="{'text-cyan-800': formatValue === 'mdoc'}">mDoc</span>
            </label>
          </div>
          
          <!-- Initial Loading Indicator -->
          <div v-if="isInitialLoading" class="flex justify-center items-center h-48"> 
            <div class="loader"></div>
            <p class="ml-3 text-sm text-gray-600">Loading credentials...</p>
          </div>

          <!-- Data Display Area -->
          <div v-else class="space-y-4">
            <div class="text-center" v-if="activeCredentialType === 'power-of-representation'">
              <h3 class="text-md font-medium text-gray-900 mb-2">Power of Representation</h3>
              <div v-if="isLoadingPor" class="flex justify-center py-4">
                <div class="loader"></div>
              </div>
              <template v-else-if="porData">
                <img :src="porData.qr_code" alt="Power of Representation QR Code" class="mx-auto max-w-xs" />
                <p class="mt-2 text-xs text-gray-600">Transaction Code: {{ porData.transaction_code }}</p>
                <a :href="porData.eudiw_link" class="mt-2 text-sm text-cyan-800 hover:text-cyan-900 block">Open in Wallet App</a>
              </template>
            </div>
            
            <div class="text-center" v-if="activeCredentialType === 'company-registration'">
              <h3 class="text-md font-medium text-gray-900 mb-2">Company Registration</h3>
              <div v-if="isLoadingCompanyReg" class="flex justify-center py-4">
                <div class="loader"></div>
              </div>
              <template v-else-if="companyRegData">
                <img :src="companyRegData.qr_code" alt="Company Registration QR Code" class="mx-auto max-w-xs" />
                <p class="mt-2 text-xs text-gray-600">Transaction Code: {{ companyRegData.transaction_code }}</p>
                <a :href="companyRegData.eudiw_link" class="mt-2 text-sm text-cyan-800 hover:text-cyan-900 block">Open in Wallet App</a>
              </template>
            </div>
          </div>
          
          <!-- Error Display -->
          <div v-if="error" class="rounded-md bg-red-50 p-4 mt-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
              </div>
            </div>
          </div>
          
          <!-- Buttons -->
          <div class="flex justify-end mt-4">
            <button 
              @click="closeDialog"
              class="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </Teleport>
  </FlowLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import FlowLayout from '@/components/FlowLayout.vue'
import { useFlowStore } from '@/stores/flowStore'

// Get route and flow state
const route = useRoute()
const flowStore = useFlowStore()
const isInFlow = ref(false)

// Form state for Power of Representation
const porForm = ref({
  legal_person_identifier: '',
  legal_name: '',
  format: 'sd_jwt_vc'
})

// Form state for Company Registration with optional fields
const companyRegistrationForm = ref({
  legal_person_identifier: '',
  legal_name: '',
  format: 'sd_jwt_vc',
  activity_description: "The preparation and sale of Krabby Patties.",
  admin_unit_L1: "Bikini Bottom",
  company_activity: "5610",
  company_contact_data: "+310201234567",
  company_status: "Active"
})

// Active credential type and format
const activeCredentialType = ref('power-of-representation')
const formatValue = ref('sd_jwt_vc')

// Watch for format changes and update both forms then refresh credentials
watch(formatValue, (newValue) => {
  porForm.value.format = newValue
  companyRegistrationForm.value.format = newValue
  
  // Refresh the active credential with the new format
  if (selectedCompany.value) {
    if (activeCredentialType.value === 'power-of-representation') {
      requestPowerOfRepresentation()
    } else {
      requestCompanyRegistration() 
    }
  }
})

// Watch for credential type changes to show the correct data
watch(activeCredentialType, (newValue) => {
  // If we switch between credential types and don't have data for the new one, fetch it
  if (newValue === 'power-of-representation' && !porData.value && selectedCompany.value) {
    requestPowerOfRepresentation()
  } else if (newValue === 'company-registration' && !companyRegData.value && selectedCompany.value) {
    requestCompanyRegistration()
  }
})

const isLoading = ref(false)
const isInitialLoading = ref(false)
const isLoadingPor = ref(false)
const isLoadingCompanyReg = ref(false)
const error = ref(null)
const porData = ref(null)
const companyRegData = ref(null)
const credentialDialogRef = ref(null)

// Company certificates state
const isLoadingCertificates = ref(false)
const certificateError = ref(null)
const companyCertificates = ref([])
const selectedCompany = ref(null)

// Fetch company certificates on mount
const fetchCompanyCertificates = async () => {
  isLoadingCertificates.value = true
  certificateError.value = null
  
  try {
    // Get access token from local storage
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      throw new Error('You must be logged in to view company certificates.')
    }
    
    // Get user details from API rather than localStorage
    const userResponse = await fetch('https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/auth/validate', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    if (!userResponse.ok) {
      throw new Error('Failed to retrieve user information. Please log in again.')
    }
    
    const user = await userResponse.json()
    
    // Extract user details
    const { given_name: givenName, family_name: familyName, birth_date: birthdate } = user
    
    const response = await fetch('https://kvk-issuance-service.nieuwlaar.com/bevoegdheid/natural-person/company-certificate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        givenName,
        familyName,
        birthdate
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch company certificates: ${errorText}`)
    }
    
    const data = await response.json()
    
    if (data.data && Array.isArray(data.data)) {
      companyCertificates.value = data.data
    } else {
      throw new Error('Invalid response format')
    }
  } catch (err) {
    console.error('Error fetching company certificates:', err)
    certificateError.value = err.message || 'Failed to fetch company certificates'
  } finally {
    isLoadingCertificates.value = false
  }
}

// Open dialog when selecting a company
const openDialog = (company) => {
  selectedCompany.value = company
  
  // Set basic info for both form types
  porForm.value.legal_person_identifier = company.legal_person_id
  porForm.value.legal_name = company.legal_person_name
  
  companyRegistrationForm.value.legal_person_identifier = company.legal_person_id
  companyRegistrationForm.value.legal_name = company.legal_person_name
  
  // Reset other states
  activeCredentialType.value = 'power-of-representation'
  formatValue.value = 'sd_jwt_vc'
  error.value = null
  porData.value = null
  companyRegData.value = null
  
  // Set initial loading state
  isInitialLoading.value = true
  
  // Show dialog
  credentialDialogRef.value?.showModal()
  
  // Auto-request both credential types
  Promise.all([
    requestPowerOfRepresentation(),
    requestCompanyRegistration()
  ]).finally(() => {
    isInitialLoading.value = false
  })
}

// Close dialog
const closeDialog = () => {
  credentialDialogRef.value?.close()
}

// Request Power of Representation
const requestPowerOfRepresentation = async () => {
  if (!selectedCompany.value) return
  
  isLoadingPor.value = true
  error.value = null
  
  try {
    // Get authorization token
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      throw new Error('You must be logged in to request a Power of Representation')
    }
    
    const response = await fetch('https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/power-of-representation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(porForm.value)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to request Power of Representation: ${errorText}`)
    }
    
    const data = await response.json()
    
    if (data.status === 'success' && data.data) {
      porData.value = {
        qr_code: data.data.qr_code,
        transaction_code: data.data.transaction_code,
        eudiw_link: data.data.eudiw_link
      }
    } else {
      throw new Error('Invalid response from server')
    }
  } catch (err) {
    console.error('Error in requestPowerOfRepresentation:', err)
    error.value = err.message || 'An unexpected error occurred'
  } finally {
    isLoadingPor.value = false
  }
}

// Request Company Registration
const requestCompanyRegistration = async () => {
  if (!selectedCompany.value) return
  
  isLoadingCompanyReg.value = true
  error.value = null
  
  try {
    // Get authorization token
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      throw new Error('You must be logged in to request a Company Registration')
    }
    
    const response = await fetch('https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/company-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(companyRegistrationForm.value)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to request Company Registration: ${errorText}`)
    }
    
    const data = await response.json()
    
    if (data.status === 'success' && data.data) {
      companyRegData.value = {
        qr_code: data.data.qr_code,
        transaction_code: data.data.transaction_code,
        eudiw_link: data.data.eudiw_link
      }
    } else {
      throw new Error('Invalid response from server')
    }
  } catch (err) {
    console.error('Error in requestCompanyRegistration:', err)
    error.value = err.message || 'An unexpected error occurred'
  } finally {
    isLoadingCompanyReg.value = false
  }
}

onMounted(() => {
  // Check if we're in the PoR flow
  if (route.query.flow === 'por') {
    isInFlow.value = true
    flowStore.startFlow()
    flowStore.setCurrentStep('authorization')
  } else {
    isInFlow.value = false
  }
  
  // Fetch company certificates
  fetchCompanyCertificates()
})
</script>

<style scoped>
.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #155e75; /* cyan-800 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Ensure dialog backdrop is styled */
dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
