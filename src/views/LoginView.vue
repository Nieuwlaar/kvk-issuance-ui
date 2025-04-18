<template>
  <div class="min-h-full relative">
    <NavigationBar />
    <div class="py-10">
      <main>
        <div class="flex justify-center space-x-4 mx-auto max-w-4xl">
          <div class="max-w-sm w-full overflow-hidden bg-white rounded-lg border border-gray-500">
            <div class="max-w-sm mx-auto overflow-hidden bg-white">
              <div class="px-6 py-4">
                <h2 class="text-2xl font-semibold text-gray-800">Authentication</h2>
                <p class="mt-1 text-gray-600">Please select the authentication method you want to use.</p>
              </div>
              <div class="px-6 pt-4 pb-2">
                <button 
                  @click="openPidAuthenticationDialog" 
                  class="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full"
                >
                  <img :src="euWalletImage" alt="Login" class="h-6 mr-4">
                  <span class="flex-1 text-left font-medium text-gray-700">Login with EU Wallet</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" class="h-6 w-6 text-gray-900">
                    <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <div class="flex mb-4 items-center px-6 pt-4 pb-2">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" class="h-5 w-5 flex-none text-gray-900">
                  <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg> -->
                <!-- <a href="#" class="text-blue-600 hover:underline">More Information</a> -->
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- PID Authentication Dialog -->
    <Teleport to="body">
      <dialog ref="pidDialogRef" class="rounded-lg p-6 shadow-xl max-w-md w-full">
        <div class="space-y-4">
          <h2 class="text-lg font-semibold">Scan with EU Wallet</h2>
          
          <!-- Loading Indicator -->
          <div v-if="isLoading" class="flex justify-center items-center h-48"> 
            <div class="loader"></div> <!-- Using similar loader style as PreAuthorizationFlowView -->
          </div>

          <!-- Data Display Area -->
          <div v-else-if="qrCodeDataUrl" class="space-y-4 text-center">
            <div>
              <h3 class="font-medium">Scan QR Code:</h3>
              <img :src="qrCodeDataUrl" alt="PID Authentication QR Code" class="mt-2 mx-auto" style="max-width: 200px;">
            </div>
            <div>
              <h3 class="font-medium">Or use Deep Link:</h3>
              <a :href="walletLink" target="_blank" class="text-sm text-blue-600 hover:underline break-all">Open Wallet</a>
            </div>
          </div>
          
          <!-- Error Display -->
          <div v-else-if="error" class="text-red-600 text-center">
            <p>Error initiating authentication:</p>
            <p class="text-sm mt-1">{{ error }}</p>
          </div>
          
          <!-- Fallback if no data and no error (shouldn't normally happen after loading) -->
          <div v-else class="text-center text-gray-500 py-4">
             Could not load authentication details.
           </div>

          <!-- Close Button -->
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
  </div>
</template>

<script setup>
import { ref } from 'vue' // Import ref
import NavigationBar from '@/components/NavigationBar.vue'
import euWalletImage from '@/assets/EUWallet.png'
import QRCode from 'qrcode' // Import QRCode library

// Refs for dialog state and data
const pidDialogRef = ref(null)
const isLoading = ref(false)
const error = ref(null)
const qrCodeDataUrl = ref(null)
const walletLink = ref(null)

// Function to open the dialog and fetch PID authentication data
const openPidAuthenticationDialog = async () => {
  // Reset state
  isLoading.value = true
  error.value = null
  qrCodeDataUrl.value = null
  walletLink.value = null

  // Show the dialog
  pidDialogRef.value?.showModal()

  try {
    const apiUrl = 'https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/pid-authentication';
    console.log(`Fetching PID authentication from: ${apiUrl}`);
    const response = await fetch(apiUrl, {
      method: 'GET', // Assuming GET based on @router.get
      headers: {
        'Accept': 'application/json', 
      },
    });

    if (!response.ok) {
      let errorBody = 'Unknown error';
      try {
          errorBody = await response.text();
      } catch (e) {
          console.warn("Could not read error response body");
      }
      console.error(`Failed to initiate PID authentication: ${response.status}`, errorBody);
      throw new Error(`API Error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    console.log('Received PID authentication data:', data);

    if (data.status === 'success' && data.data?.wallet_link) {
      walletLink.value = data.data.wallet_link;
      // Generate QR Code
      qrCodeDataUrl.value = await QRCode.toDataURL(walletLink.value);
    } else {
      console.error('Invalid API response structure:', data);
      throw new Error(data.message || 'Received invalid data structure from API.');
    }

  } catch (err) {
    console.error('Error in openPidAuthenticationDialog:', err);
    error.value = err.message || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
};

// Function to close the dialog
const closeDialog = () => {
  pidDialogRef.value?.close()
  // Optional: Reset state when closing if needed
  // isLoading.value = false;
  // error.value = null;
  // qrCodeDataUrl.value = null;
  // walletLink.value = null;
}

</script>

<style scoped>
/* Add loader styles if not globally defined, borrowing from PreAuthorizationFlowView */
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 80px; /* Smaller loader for dialog */
  height: 80px;
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
