<template>
  <section>
    <h2>{{ $t('authentication.providers.title') }}</h2>

    <table class="table table-sm table-bordered" v-if="accounts.length">
      <thead>
        <tr>
          <th>{{ $t('authentication.providers.table.uid') }}</th>
          <th>{{ $t('authentication.providers.table.account') }}</th>
          <th>{{ $t('authentication.providers.table.provider') }}</th>
          <th>{{ $t('authentication.providers.table.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="account in accounts" :key="account.uid">
          <td>{{ account.uid }}</td>
          <td>{{ account.display }}</td>
          <td>{{ account.provider.name }}</td>
          <td>
            <b-button size="sm" variant="outline-danger" :disabled="loading" @click="disconnect(account)">{{ $t('authentication.providers.disconnect') }}</b-button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>{{ $t('authentication.providers.none') }}</p>

    <FormErrors :errors="response?.errors" />

    <ProviderButtons callback-url="/account/providers" process="connect" />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import ProviderButtons from '@/components/allauth/ProviderButtons.vue'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { getProviderAccounts, disconnectProviderAccount } from '@/allauth/lib/allauth'

const accounts = ref([])
const response = ref(null)
const loading = ref(false)

onMounted(async () => {
  await refreshAccounts()
})

async function refreshAccounts() {
  loading.value = true
  try {
    const resp = await getProviderAccounts()
    if (resp.status === 200) {
      accounts.value = resp.data
    }
  } finally {
    loading.value = false
  }
}

async function disconnect(account) {
  loading.value = true
  try {
    response.value = await disconnectProviderAccount(account.provider.id, account.uid)
    if (response.value?.status === 200) {
      accounts.value = response.value.data
    }
  } finally {
    loading.value = false
  }
}
</script>
