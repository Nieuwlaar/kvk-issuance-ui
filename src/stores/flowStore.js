import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFlowStore = defineStore('flow', () => {
  // State
  const isInFlow = ref(false)
  const currentStep = ref('')
  
  // Actions
  function startFlow() {
    isInFlow.value = true
  }
  
  function exitFlow() {
    isInFlow.value = false
    currentStep.value = ''
  }
  
  function setCurrentStep(step) {
    currentStep.value = step
  }
  
  // Return state and actions
  return {
    isInFlow,
    currentStep,
    startFlow,
    exitFlow,
    setCurrentStep
  }
}) 