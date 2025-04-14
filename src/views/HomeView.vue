<template>
  <div class="min-h-full relative">
    <NavigationBar />
    <div class="bg-gray-100 h-1"></div>
    <div class="py-10">
      <main class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome to the KVK Pilot Issuance UI</h1>
          <p class="mt-2 text-lg text-gray-600">Select an organization below to issue an attestation</p>
        </div>
        <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <ul role="list" class="divide-y divide-gray-100">
            <li v-for="org in organizations" :key="org.attestation_type" class="flex items-center justify-between gap-x-6 py-5 px-6">
              <div class="flex min-w-0 gap-x-4">
                <img class="size-12 flex-none rounded-full bg-gray-50" :src="org.imageUrl" alt="" />
                <div class="min-w-0 flex-auto">
                  <p class="text-sm/6 font-semibold text-gray-900">{{ org.legal_person_name }}</p>
                  <p class="mt-1 truncate text-xs/5 text-gray-500">{{ org.attestation_type }}</p>
                </div>
              </div>
              <button 
                @click="openDialog(org)" 
                class="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Issue
              </button>
            </li>
          </ul>
        </div>
      </main>
    </div>

    <!-- Add Teleport for dialogs -->
    <Teleport to="body">
      <dialog 
        v-for="org in organizations" 
        :key="org.attestation_type"
        :id="`dialog-${org.legal_person_name.replace(/\s+/g, '-')}`"
        class="rounded-lg p-6 shadow-xl max-w-md w-full"
      >
        <div class="space-y-4">
          <h2 class="text-lg font-semibold">{{ org.legal_person_name }}</h2>
          
          <div v-if="isLoading[org.legal_person_name]" class="flex justify-center">
            <div class="loader"></div>
          </div>

          <div v-else-if="currentData[org.legal_person_name]" class="space-y-4">
            <div>
              <h3 class="font-medium">QR Code:</h3>
              <img :src="currentData[org.legal_person_name].qrCode" alt="QR Code" class="mt-2">
            </div>
            <div>
              <h3 class="font-medium">Transaction Code:</h3>
              <p>{{ currentData[org.legal_person_name].transactionCode }}</p>
            </div>
            <!-- <div>
              <h3 class="font-medium">Credential Offer URI:</h3>
              <p class="break-all">{{ currentData[org.legal_person_name].credentialOfferUri }}</p>
            </div> -->
          </div>

          <div v-else-if="error" class="text-red-600">
            {{ error }}
          </div>

          <div class="flex justify-end mt-4">
            <button 
              @click="closeDialog(org)"
              class="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import NavigationBar from '@/components/NavigationBar.vue'
import TheKrustyKrab from '@/img/TheKrustyKrab.png'
import DuckburgDaily from '@/img/DuckburgDaily.png'
import HetGroteBos from '@/img/HetGroteBos.png'

const { t } = useI18n()

const isLoading = ref({})
const error = ref(null)
const currentData = ref({})

const organizations = [
  {
    legal_person_name: 'The Krusty Krab',
    attestation_type: 'Power of Representation',
    imageUrl: TheKrustyKrab,
    kvkNumber: '90000021',
  },
  // {
  //   legal_person_name: 'Duckburg Daily',
  //   attestation_type: 'Power of Representation',
  //   imageUrl: DuckburgDaily,
  //   kvkNumber: '22222222',
  // },
  // {
  //   legal_person_name: 'The Great Forest',
  //   attestation_type: 'Power of Representation',
  //   imageUrl: HetGroteBos,
  //   kvkNumber: '33333333',
  // },
]

const fetchPowerOfRepresentation = async (org) => {
  if (isLoading.value[org.legal_person_name] || currentData.value[org.legal_person_name]) {
    return
  }

  try {
    isLoading.value[org.legal_person_name] = true
    error.value = null
    
    const powerOfRepUrl = 'https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/power-of-representation'
    const powerOfRepBody = {
      "legal_person_identifier": `NLNHR.${org.kvkNumber}`,
      "legal_name": org.legal_person_name
    }
    
    console.log('Making power of representation request with:', powerOfRepBody)
    const powerOfRepResponse = await fetch(powerOfRepUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(powerOfRepBody)
    })
    
    if (!powerOfRepResponse.ok) {
      throw new Error('Failed to submit power of representation')
    }
    
    const data = await powerOfRepResponse.json()
    console.log('Received power of representation data:', data)

    // Store the response data for this organization
    currentData.value[org.legal_person_name] = {
      qrCode: data.data.qr_code,
      transactionCode: data.data.transaction_code,
      credentialOfferUri: data.data.eudiw_link
    }

  } catch (error) {
    console.error('Error fetching credentials:', error)
    error.value = 'Failed to fetch credentials. Please try again.'
  } finally {
    isLoading.value[org.legal_person_name] = false
  }
}

const prefetchAllData = () => {
  // Launch all fetches in parallel
  organizations.forEach(org => {
    if (!currentData.value[org.legal_person_name]) {
      fetchPowerOfRepresentation(org)
    }
  })
}

onMounted(() => {
  prefetchAllData()
})

const openDialog = (org) => {
  const dialog = document.querySelector(`#dialog-${org.legal_person_name.replace(/\s+/g, '-')}`)
  if (dialog) {
    dialog.showModal()
    // Only fetch if we don't have the data yet
    if (!currentData.value[org.legal_person_name]) {
      fetchPowerOfRepresentation(org)
    }
  }
}

const closeDialog = (org) => {
  const dialog = document.querySelector(`#dialog-${org.legal_person_name.replace(/\s+/g, '-')}`)
  dialog?.close()
}
</script>

<style scoped>
button {
  transition: background-color 0.3s ease;
}
button:hover {
  background-color: #e2e8f0; /* Light gray color to avoid purple flash */
}
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
