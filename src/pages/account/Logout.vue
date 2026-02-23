<template>
  <section>
    <h2>Logout</h2>
    <p>Are you sure you want to log out?</p>
    <b-button variant="danger" :disabled="loading" @click="submit">Logout</b-button>
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
