<template>
  <div class="min-h-full relative">
    <NavigationBar />
    <div class="bg-gray-100 h-1"></div>
    <div class="py-10">
      <main class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Pre-Authorization Flow</h1>
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
          <p class="text-sm text-gray-600">KVK: {{ org.kvkNumber }}</p>
          
          <!-- Loading Indicator -->
          <div v-if="isLoading[org.legal_person_name]?.mdoc || isLoading[org.legal_person_name]?.sd_jwt_vc" class="flex justify-center items-center h-48"> 
            <div class="loader"></div>
          </div>

          <!-- Data Display Area -->
          <div v-else-if="currentData[org.legal_person_name]" class="space-y-4">
            <!-- Format Selector -->
            <div class="flex justify-center space-x-4 border-b pb-4 mb-4">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="format" value="sd_jwt_vc" v-model="selectedFormat" class="radio radio-primary radio-sm">
                <span class="text-sm font-medium" :class="{'text-blue-600': selectedFormat === 'sd_jwt_vc'}">SD-JWT</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="format" value="mdoc" v-model="selectedFormat" class="radio radio-primary radio-sm">
                <span class="text-sm font-medium" :class="{'text-blue-600': selectedFormat === 'mdoc'}">mDoc</span>
              </label>
            </div>

            <!-- Display based on selected format -->
            <div v-if="currentData[org.legal_person_name]?.[selectedFormat]" class="space-y-4">
              <div>
                <h3 class="font-medium">QR Code ({{ selectedFormat === 'sd_jwt_vc' ? 'SD-JWT' : 'mDoc' }}):</h3>
                <img :src="currentData[org.legal_person_name][selectedFormat].qrCode" alt="QR Code" class="mt-2 mx-auto" style="max-width: 200px;">
              </div>
              <div>
                <h3 class="font-medium">Transaction Code:</h3>
                <p class="text-sm text-gray-700 font-mono break-all">{{ currentData[org.legal_person_name][selectedFormat].transactionCode }}</p>
              </div>
               <div>
                <h3 class="font-medium">Deep Link:</h3>
                 <a :href="currentData[org.legal_person_name][selectedFormat].credentialOfferUri" target="_blank" class="text-sm text-blue-600 hover:underline break-all">Open Wallet</a>
               </div>
            </div>
            <div v-else class="text-center text-gray-500 py-4">
               Data for {{ selectedFormat === 'sd_jwt_vc' ? 'SD-JWT' : 'mDoc' }} format not available yet or failed to load.
             </div>
          </div>
          
          <!-- Error Display -->
          <div v-else-if="error" class="text-red-600">
            {{ error }}
          </div>
          
          <!-- Fallback if no data and no error -->
          <div v-else class="text-center text-gray-500 py-4">
             Waiting for data...
           </div>

          <!-- Close Button -->
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
import { ref, onMounted, onUnmounted } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'
import TheKrustyKrab from '@/img/TheKrustyKrab.png'
import DuckburgDaily from '@/img/DuckburgDaily.png'
import HetGroteBos from '@/img/HetGroteBos.png'

const isLoading = ref({})
const error = ref(null)
const currentData = ref({})
const selectedFormat = ref('sd_jwt_vc') // Default format
const refetchIntervalId = ref(null)

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

const fetchPowerOfRepresentation = async (org, format) => {
  const orgKey = org.legal_person_name;

  if (!isLoading.value[orgKey]) {
    isLoading.value[orgKey] = {}; // Initialize loading state for the org if it doesn't exist
  }

  if (isLoading.value[orgKey][format]) {
    console.log(`Already fetching ${format} for ${orgKey}`);
    return; // Don't fetch if already loading this format
  }

  try {
    isLoading.value[orgKey][format] = true; // Set loading state for this specific format
    error.value = null // Reset global error, maybe refine later if needed

    // Construct URL with format query parameter
    const powerOfRepUrl = `https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/power-of-representation?format=${format}`;
    const powerOfRepBody = {
      "legal_person_identifier": `NLNHR.${org.kvkNumber}`,
      "legal_name": org.legal_person_name
    }

    console.log(`Making power of representation request for ${format} with:`, powerOfRepBody);
    const powerOfRepResponse = await fetch(powerOfRepUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(powerOfRepBody)
    })

    if (!powerOfRepResponse.ok) {
      const errorBody = await powerOfRepResponse.text();
      console.error(`Failed to submit power of representation for ${format}: ${powerOfRepResponse.status}`, errorBody);
      throw new Error(`Failed to submit power of representation for ${format}`);
    }

    const data = await powerOfRepResponse.json()
    console.log(`Received power of representation data for ${format}:`, data)

    // Ensure the structure for the organization exists
    if (!currentData.value[orgKey]) {
      currentData.value[orgKey] = {};
    }

    // Store the response data under the specific format key
    currentData.value[orgKey][format] = {
      qrCode: data.data.qr_code,
      transactionCode: data.data.transaction_code,
      credentialOfferUri: data.data.eudiw_link
    };

  } catch (err) { 
    console.error(`Error fetching ${format} credentials for ${orgKey}:`, err);
    // Consider more granular error handling, e.g., storing error per org/format
    error.value = `Failed to fetch ${format} credentials for ${orgKey}. Please try again.`;
  } finally {
    if (isLoading.value[orgKey]) {
       isLoading.value[orgKey][format] = false; // Reset loading state for this format
    }
  }
}

const prefetchAllData = () => {
  organizations.forEach(org => {
    const orgKey = org.legal_person_name;
    // Always fetch both formats initially
    fetchPowerOfRepresentation(org, 'mdoc');
    fetchPowerOfRepresentation(org, 'sd_jwt_vc');
  });
};

const refetchAllData = () => {
  console.log("Performing scheduled re-fetch...");
  organizations.forEach(org => {
    fetchPowerOfRepresentation(org, 'mdoc');
    fetchPowerOfRepresentation(org, 'sd_jwt_vc');
  });
};

onMounted(() => {
  prefetchAllData()
  const thirtyMinutesInMs = 30 * 60 * 1000;
  refetchIntervalId.value = setInterval(refetchAllData, thirtyMinutesInMs);
})

onUnmounted(() => {
  if (refetchIntervalId.value) {
    clearInterval(refetchIntervalId.value);
  }
})

const openDialog = (org) => {
  selectedFormat.value = 'sd_jwt_vc'; // Reset to default when opening
  const dialog = document.querySelector(`#dialog-${org.legal_person_name.replace(/\s+/g, '-')}`)
  const orgKey = org.legal_person_name;
  if (dialog) {
    dialog.showModal();
    // Fetch if data for either format is missing or refetch on open? Decide based on UX.
    // For now, let's assume prefetch + interval covers most cases, but we could add checks here.
    // Example check (uncomment if needed):
    // if (!currentData.value[orgKey] || !currentData.value[orgKey].mdoc) {
    //    console.log(`Fetching mdoc for ${orgKey} on dialog open`);
    //    fetchPowerOfRepresentation(org, 'mdoc');
    // }
    //  if (!currentData.value[orgKey] || !currentData.value[orgKey].sd_jwt_vc) {
    //    console.log(`Fetching sd_jwt_vc for ${orgKey} on dialog open`);
    //    fetchPowerOfRepresentation(org, 'sd_jwt_vc');
    // }
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