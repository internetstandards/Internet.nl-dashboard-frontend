<template>
  <section>
    <h2>{{ $t('authentication.logout.title') }}</h2>
    <p>{{ $t('authentication.logout.intro') }}</p>
    <b-button variant="danger" :disabled="loading" @click="submit">{{ $t('authentication.logout.submit') }}</b-button>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { allauthStore } from '@/allauthStore'

const loading = ref(false)
const router = useRouter()
const allauth = allauthStore()

async function submit() {
  loading.value = true
  try {
    await allauth.logout()
    await router.replace('/home')
  } finally {
    loading.value = false
  }
}
</script>
