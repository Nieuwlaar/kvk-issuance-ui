<template>
  <div>
    <!-- Content -->
    <slot name="before-flow-bar"></slot>
    
    <!-- Progress bar shown only when in flow -->
    <div v-if="flowStore.isInFlow" class="bg-gray-50 py-4 shadow-sm border-b border-gray-200">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="flex-grow">
            <FlowProgressBar :current-step="flowStore.currentStep" />
          </div>
          <button 
            @click="exitFlow" 
            class="ml-4 flex items-center text-sm text-cyan-800 hover:text-cyan-900"
          >
            <XMarkIcon class="size-5 mr-1" />
            Exit Flow
          </button>
        </div>
      </div>
    </div>
    
    <!-- Main content -->
    <slot></slot>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useFlowStore } from '@/stores/flowStore'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import FlowProgressBar from '@/components/FlowProgressBar.vue'

const flowStore = useFlowStore()
const router = useRouter()

// Function to exit the flow
function exitFlow() {
  flowStore.exitFlow()
  router.push('/')
}
</script> 