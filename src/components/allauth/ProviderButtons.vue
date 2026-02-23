<template>
  <div v-if="providers.length">
    <h2 class="h5 mt-3">Use a third-party provider</h2>
    <div class="d-flex flex-wrap gap-2">
      <b-button
        v-for="provider in providers"
        :key="provider.id"
        variant="outline-secondary"
        @click="startProvider(provider.id)"
      >
        {{ provider.name }}
      </b-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { allauthStore } from '@/allauthStore'
import { redirectToProvider, AuthProcess } from '@/allauth/lib/allauth'

const props = defineProps({
  callbackUrl: {
    type: String,
    default: '/account/provider/callback'
  },
  process: {
    type: String,
    default: AuthProcess.LOGIN
  }
})

const allauth = allauthStore()

const providers = computed(() => allauth.config?.data?.socialaccount?.providers || [])

function startProvider(providerId) {
  redirectToProvider(providerId, props.callbackUrl, props.process)
}
</script>
