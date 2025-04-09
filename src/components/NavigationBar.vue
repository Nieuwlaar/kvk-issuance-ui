<template>
  <div>
    <div class="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-1 sm:px-3.5 sm:before:flex-1">
      <div class="absolute inset-0 bg-gradient-to-r from-[#AA418B] to-[#FE9201] opacity-100" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);"></div>
    </div>

    <div class="flex items-center gap-x-6 bg-gray-200 px-6 sm:px-3.5 sm:before:flex-1">
      <p class="text-sm leading-6 text-black">
        Pre-Authorization Flow (
        <router-link to="/authorization-flow" class="underline hover:text-gray-600">
          Authorization Flow here
        </router-link>
        ). Issuance based on <a href="https://github.com/eu-digital-identity-wallet/eudi-srv-web-issuing-eudiw-py/tags" class="underline hover:text-gray-600">eudi-srv-web-issuing-eudiw-py</a> 0.7.1 using OpenID4VCI draft 13 
      </p>
    </div>

    <header class="bg-white">
      <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
        <div class="fixed inset-0 z-10" />
        <DialogPanel class="fixed inset-y-0 right-0 z-8 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div class="flex items-center justify-between">
            <button @click="goHome" class="-m-1.5 p-1.5">
              <span class="sr-only">KVK</span>
              <img class="h-8 w-auto" src="https://logovtor.com/wp-content/uploads/2020/01/kamer-van-koophandel-kvk-logo-vector.png" alt="" />
            </button>
            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
              <span class="sr-only">Close menu</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10">
              <div class="space-y-2 py-6">
                <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                  <DisclosureButton class="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Product
                    <ChevronDownIcon :class="[open ? 'rotate-180' : '', 'h-5 w-5 flex-none']" aria-hidden="true" />
                  </DisclosureButton>
                  <DisclosurePanel class="mt-2 space-y-2">
                    <DisclosureButton v-for="item in [...products, ...callsToAction]" :key="item.name" as="a" :href="item.href" class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">{{ item.name }}</DisclosureButton>
                  </DisclosurePanel>
                </Disclosure>
              </div>
              <div class="py-6">
                <a href="#" class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">{{ t('login') }}</a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
    
    <!-- Added bottom logo container -->
    <div class="fixed bottom-0 left-0 p-4 pl-8 z-10">
      <button @click="goHome" class="-m-1.5 p-1.5">
        <img class="h-12 w-auto" src="https://logovtor.com/wp-content/uploads/2020/01/kamer-van-koophandel-kvk-logo-vector.png" alt="" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
} from '@headlessui/vue'
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

const mobileMenuOpen = ref(false)

const { t, locale } = useI18n()
const router = useRouter()

const changeLanguage = () => {
  locale.value = locale.value === 'en' ? 'nl' : 'en'
  console.log('Locale changed to:', locale.value)
}

const goHome = () => {
  router.push({ path: '/' })
}
</script>
