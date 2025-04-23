<template>
  <FlowLayout>
    <template #before-flow-bar>
      <div class="min-h-full relative">
        <NavigationBar />
      </div>
    </template>
    
    <div class="min-h-full relative">
      <div class="py-10">
        <main>
          <!-- User Profile Display (when authenticated) -->
          <div v-if="isAuthenticated" class="flex justify-center space-x-4 mx-auto max-w-4xl">
            <div class="max-w-sm w-full overflow-hidden bg-white rounded-lg border border-gray-500">
              <div class="max-w-sm mx-auto overflow-hidden bg-white">
                <div class="px-6 py-4">
                  <h2 class="text-2xl font-semibold text-gray-800">Welcome!</h2>
                  <p class="mt-1 text-green-600 font-medium">Successfully logged in</p>
                </div>
                
                <div class="px-6 pt-2 pb-2">
                  <div class="flex flex-col space-y-2">
                    <p><span class="font-medium">Name:</span> {{ userProfile.given_name }} {{ userProfile.family_name }}</p>
                    <p><span class="font-medium">Birth Date:</span> {{ userProfile.birth_date }}</p>
                  </div>
                </div>
                
                <div class="px-6 pt-4 pb-4">
                  <button 
                    @click="logout" 
                    class="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full"
                  >
                    <span class="flex-1 text-center font-medium text-gray-700">Logout</span>
                  </button>
                </div>
                
                <!-- Continue Button for Flow -->
                <div v-if="isInFlow" class="px-6 pt-2 pb-6">
                  <router-link 
                    to="/authorization?flow=por" 
                    class="flex items-center justify-center px-4 py-2 bg-cyan-800 rounded-lg hover:bg-cyan-700 w-full"
                  >
                    <span class="flex-1 text-center font-medium text-white">Continue to Get PoR</span>
                    <span aria-hidden="true" class="text-white ml-1">→</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Login Options (when not authenticated) -->
          <div v-else class="flex justify-center space-x-4 mx-auto max-w-4xl">
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
                
                <!-- Status Message (when polling) -->
                <div v-if="pollingStatus" class="mt-2 text-sm">
                  <p v-if="pollingStatus === 'pending'" class="text-blue-600">Waiting for authentication...</p>
                  <p v-else-if="pollingStatus === 'success'" class="text-green-600">Authentication successful! Logging you in...</p>
                  <p v-else-if="pollingStatus === 'error'" class="text-red-600">Authentication failed. Please try again.</p>
                </div>
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
  </FlowLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue' // Import ref and onMounted
import { useRoute } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue'
import FlowLayout from '@/components/FlowLayout.vue'
import euWalletImage from '@/assets/EUWallet.png'
import QRCode from 'qrcode' // Import QRCode library
import { useFlowStore } from '@/stores/flowStore'

// Get route and flow state
const route = useRoute()
const flowStore = useFlowStore()
const isInFlow = ref(false)

// Refs for dialog state and data
const pidDialogRef = ref(null)
const isLoading = ref(false)
const error = ref(null)
const qrCodeDataUrl = ref(null)
const walletLink = ref(null)
const requestId = ref(null)
const extractionEndpoint = ref(null)
const pollingStatus = ref(null)
const pollingInterval = ref(null)
const isAuthenticated = ref(false)
const userProfile = ref({
  given_name: '',
  family_name: '',
  birth_date: ''
})

// Check for existing tokens on component mount
onMounted(() => {
  checkAuthenticationStatus()
  
  // Check if we're in the PoR flow
  if (route.query.flow === 'por') {
    isInFlow.value = true
    flowStore.startFlow()
    flowStore.setCurrentStep('login')
  } else {
    isInFlow.value = false
  }
})

// Function to check if the user is already authenticated
const checkAuthenticationStatus = async () => {
  const accessToken = localStorage.getItem('accessToken')
  
  if (!accessToken) {
    isAuthenticated.value = false
    return
  }
  
  try {
    // Validate the token with the backend
    const response = await fetch('https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/auth/validate', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    if (response.ok) {
      const userData = await response.json()
      isAuthenticated.value = true
      userProfile.value = {
        given_name: userData.given_name,
        family_name: userData.family_name,
        birth_date: userData.birth_date
      }
    } else {
      // Token invalid or expired, clear storage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      isAuthenticated.value = false
    }
  } catch (err) {
    console.error('Error validating token:', err)
    isAuthenticated.value = false
  }
}

// Function to open the dialog and fetch PID authentication data
const openPidAuthenticationDialog = async () => {
  // Reset state
  isLoading.value = true
  error.value = null
  qrCodeDataUrl.value = null
  walletLink.value = null
  requestId.value = null
  extractionEndpoint.value = null
  pollingStatus.value = null
  
  // Clear any existing polling interval
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }

  // Show the dialog
  pidDialogRef.value?.showModal()

  try {
    const apiUrl = 'https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/pid-authentication';
    console.log(`Fetching PID authentication from: ${apiUrl}`);
    const response = await fetch(apiUrl, {
      method: 'GET',
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
      console.log("Received successfull data");
      walletLink.value = data.data.wallet_link;
      requestId.value = data.data.id;
      extractionEndpoint.value = data.data.extraction_endpoint;
      
      // Generate QR Code
      qrCodeDataUrl.value = await QRCode.toDataURL(walletLink.value);
      
      // Start polling the extraction endpoint
      startPolling();
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

// Function to start polling the extraction endpoint
const startPolling = () => {
  pollingStatus.value = 'pending';
  console.log("Starting polling with request ID:", requestId.value);

  pollingInterval.value = setInterval(async () => {
    try {
      console.log("Polling cycle starting...");
      
      if (!requestId.value) {
        console.error("No request ID available for polling");
        clearInterval(pollingInterval.value);
        return;
      }
      
      const baseUrl = 'https://kvk-issuance-service.nieuwlaar.com/rdw-niscy';
      // Using the authentication-requests endpoint instead of pid-extraction
      const fullUrl = `${baseUrl}/authentication-requests/${requestId.value}`;
      console.log("Full polling URL:", fullUrl);
      
      console.log("Sending polling request...");
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log("Polling response status:", response.status);
      
      if (!response.ok) {
        console.error(`Polling request failed with status: ${response.status}`);
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`Polling request failed with status: ${response.status}. Response: ${errorText}`);
      }
      
      console.log("Parsing polling response JSON...");
      const data = await response.json();
      console.log('Detailed polling response:', JSON.stringify(data, null, 2));
      
      // Check for completion in the authentication-requests response
      if (data.status === 'success' && data.presentation_data?.extracted_data) {
        console.log("Authentication successful! Extracted data:", data.presentation_data.extracted_data);
        // Authentication successful - stop polling
        clearInterval(pollingInterval.value);
        pollingStatus.value = 'success';
        
        // Request authentication token
        console.log("Requesting authentication token...");
        await requestAuthToken();
      } else if (data.status === 'error') {
        // Error occurred - stop polling
        console.error("Polling returned error status:", data.message || "Unknown error");
        clearInterval(pollingInterval.value);
        pollingStatus.value = 'error';
        error.value = data.message || 'Authentication failed';
      } else if (data.status === 'extraction_incomplete') {
        console.log("Extraction incomplete, some data is missing");
        clearInterval(pollingInterval.value);
        pollingStatus.value = 'error';
        error.value = 'Authentication data extraction incomplete';
      } else {
        console.log("Authentication status still pending, continuing polling...");
      }
      
    } catch (err) {
      console.error('Error during polling:', err);
      console.error('Error stack:', err.stack);
      error.value = err.message || 'Error checking authentication status';
      pollingStatus.value = 'error';
      clearInterval(pollingInterval.value);
    }
  }, 3000); // Poll every 3 seconds
  
  console.log("Polling interval set:", pollingInterval.value);
};

// Function to request authentication token
const requestAuthToken = async () => {
  console.log("Starting token request with auth_id:", requestId.value);
  
  try {
    const tokenUrl = 'https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/auth/token';
    console.log("Token request URL:", tokenUrl);
    
    const requestBody = {
      auth_id: requestId.value
    };
    console.log("Token request body:", JSON.stringify(requestBody));
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log("Token response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token request failed. Response:", errorText);
      throw new Error(`Failed to get authentication token: ${response.status}. Response: ${errorText}`);
    }
    
    const tokenData = await response.json();
    console.log("Token received successfully. Token type:", tokenData.token_type);
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', tokenData.access_token);
    localStorage.setItem('refreshToken', tokenData.refresh_token);
    
    // Update authentication state
    console.log("Updating authentication state...");
    await checkAuthenticationStatus();
    
    // Close the dialog
    console.log("Authentication complete, closing dialog");
    closeDialog();
    
  } catch (err) {
    console.error('Error requesting authentication token:', err);
    console.error('Error stack:', err.stack);
    error.value = err.message || 'Failed to complete authentication';
    pollingStatus.value = 'error';
  }
};

// Function to close the dialog
const closeDialog = () => {
  pidDialogRef.value?.close()
  
  // Clear polling interval if active
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

// Function to logout
const logout = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      // Call logout endpoint to invalidate the token
      await fetch('https://kvk-issuance-service.nieuwlaar.com/rdw-niscy/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
    }
  } catch (err) {
    console.error('Error during logout:', err);
  } finally {
    // Clear tokens regardless of API call success
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Reset authentication state
    isAuthenticated.value = false;
    userProfile.value = {
      given_name: '',
      family_name: '',
      birth_date: ''
    };
  }
};

</script>

<style scoped>
/* Add loader styles if not globally defined, borrowing from PreAuthorizationFlowView */
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #155e75; /* cyan-800 */
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
