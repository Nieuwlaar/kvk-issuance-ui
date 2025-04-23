<template>
  <div class="my-4">
    <nav aria-label="Progress">
      <ol role="list" class="flex items-center justify-center">
        <li v-for="(step, stepIdx) in steps" :key="step.name" :class="[stepIdx !== steps.length - 1 ? 'pr-6 sm:pr-10' : '', 'relative']">
          <div v-if="stepIdx !== steps.length - 1" class="absolute inset-0 flex items-center" aria-hidden="true">
            <div :class="[step.status === 'complete' ? 'bg-cyan-800' : 'bg-gray-200', 'h-0.5 w-full']" />
          </div>
          <template v-if="step.status === 'complete'">
            <router-link :to="step.href" class="relative flex size-7 items-center justify-center rounded-full bg-cyan-800 hover:bg-cyan-900 group">
              <component :is="step.icon" class="size-3.5 text-white" aria-hidden="true" />
              <span class="sr-only">{{ step.name }}</span>
              <span class="absolute -bottom-6 text-xs font-medium text-gray-600 mt-1">{{ step.name }}</span>
            </router-link>
          </template>
          <template v-else-if="step.status === 'current'">
            <router-link :to="step.href" class="relative flex size-7 items-center justify-center rounded-full border-2 border-cyan-800 bg-white" aria-current="step">
              <component :is="step.icon" class="size-3.5 text-cyan-800" aria-hidden="true" />
              <span class="sr-only">{{ step.name }}</span>
              <span class="absolute -bottom-6 text-xs font-medium text-cyan-800 mt-1">{{ step.name }}</span>
            </router-link>
          </template>
          <template v-else>
            <router-link :to="step.href" class="group relative flex size-7 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
              <component :is="step.icon" class="size-3.5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              <span class="sr-only">{{ step.name }}</span>
              <span class="absolute -bottom-6 text-xs font-medium text-gray-400 group-hover:text-gray-500 mt-1">{{ step.name }}</span>
            </router-link>
          </template>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  DevicePhoneMobileIcon, 
  FingerPrintIcon, 
  DocumentCheckIcon, 
  BuildingLibraryIcon 
} from '@heroicons/vue/24/outline'
import { CheckIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  currentStep: {
    type: String,
    required: true
  },
  flowActive: {
    type: Boolean,
    default: true
  }
})

const route = useRoute()

const steps = computed(() => [
  { 
    name: 'Initialize', 
    href: '/wallet', 
    status: getStatus('wallet'),
    icon: DevicePhoneMobileIcon
  },
  { 
    name: 'Authenticate', 
    href: '/login', 
    status: getStatus('login'),
    icon: FingerPrintIcon
  },
  { 
    name: 'Issuance', 
    href: '/authorization', 
    status: getStatus('authorization'),
    icon: DocumentCheckIcon
  },
  { 
    name: 'Verify', 
    href: '/relying-party', 
    status: getStatus('relying-party'),
    icon: BuildingLibraryIcon
  }
])

function getStatus(step) {
  if (props.currentStep === step) {
    return 'current'
  } else if (isStepComplete(step)) {
    return 'complete'
  } else {
    return 'upcoming'
  }
}

function isStepComplete(step) {
  const stepOrder = ['wallet', 'login', 'authorization', 'relying-party']
  const currentIndex = stepOrder.indexOf(props.currentStep)
  const stepIndex = stepOrder.indexOf(step)
  
  return stepIndex < currentIndex
}
</script> 