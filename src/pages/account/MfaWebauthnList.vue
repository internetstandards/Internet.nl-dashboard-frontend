<template>
  <section>
    <h2>{{ $t('authentication.mfa_webauthn_list.title') }}</h2>
    <p class="alert alert-info">
      {{ $t('authentication.mfa_webauthn_list.alert') }}
    </p>

    <table class="table table-sm table-bordered" v-if="keys.length">
      <thead>
        <tr>
          <th>{{ $t('authentication.mfa_webauthn_list.table.name') }}</th>
          <th>{{ $t('authentication.mfa_webauthn_list.table.type') }}</th>
          <th>{{ $t('authentication.mfa_webauthn_list.table.created_at') }}</th>
          <th>{{ $t('authentication.mfa_webauthn_list.table.last_used_at') }}</th>
          <th>{{ $t('authentication.mfa_webauthn_list.table.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="key in keys" :key="key.id">
          <td>
            <template v-if="editingId === key.id">
              <input v-model="editingName" class="form-control form-control-sm">
              <div class="d-flex gap-1 mt-1">
                <b-button size="sm" variant="warning" @click="saveName(key)">{{ $t('authentication.mfa_webauthn_list.save') }}</b-button>
                <b-button size="sm" variant="outline-secondary" @click="cancelEdit">{{ $t('authentication.mfa_webauthn_list.cancel') }}</b-button>
              </div>
            </template>
            <template v-else>
              {{ key.name }}
              <b-button size="sm" class="ms-2" variant="outline-secondary" @click="startEdit(key)">{{ $t('authentication.mfa_webauthn_list.edit') }}</b-button>
            </template>
          </td>
          <td>{{ key.is_passwordless ? $t('authentication.mfa_webauthn_list.type_passkey') : $t('authentication.mfa_webauthn_list.type_security_key') }}</td>
          <td>{{ humanize(key.created_at) }}</td>
          <td>{{ key.last_used_at ? humanize(key.last_used_at) : $t('authentication.mfa_webauthn_list.unused') }}</td>
          <td>
            <b-button size="sm" variant="outline-danger" :disabled="loading" @click="deleteKey(key)">{{ $t('authentication.mfa_webauthn_list.delete') }}</b-button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>{{ $t('authentication.mfa_webauthn_list.none') }}</p>

    <div class="d-flex gap-2">
      <b-button variant="warning" :to="webauthnAddPath">{{ $t('authentication.mfa_webauthn_list.add') }}</b-button>
      <b-button variant="outline-secondary" :to="mfaOverviewPath">{{ $t('authentication.mfa_webauthn_list.back') }}</b-button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AuthenticatorType, getAuthenticators, deleteWebAuthnCredential, updateWebAuthnCredential } from '@/allauth/lib/allauth'

const router = useRouter()
const route = useRoute()

const keys = ref([])
const loading = ref(false)
const editingId = ref(null)
const editingName = ref('')
const mfaOverviewPath = computed(() =>
  route.path.startsWith('/profile/authentication') ? '/profile/authentication/2fa' : '/account/2fa'
)
const webauthnAddPath = computed(() => `${mfaOverviewPath.value}/webauthn/add`)

onMounted(async () => {
  await refreshKeys()
})

function humanize(timestamp) {
  return new Date(timestamp * 1000).toLocaleString()
}

async function refreshKeys() {
  loading.value = true
  try {
    const response = await getAuthenticators()
    if (response.status === 200) {
      keys.value = response.data.filter((authenticator) => authenticator.type === AuthenticatorType.WEBAUTHN)
      if (!keys.value.length) {
        await router.replace(mfaOverviewPath.value)
      }
    }
  } finally {
    loading.value = false
  }
}

function startEdit(key) {
  editingId.value = key.id
  editingName.value = key.name
}

function cancelEdit() {
  editingId.value = null
  editingName.value = ''
}

async function saveName(key) {
  loading.value = true
  try {
    const response = await updateWebAuthnCredential(key.id, { name: editingName.value })
    if (response.status === 200) {
      key.name = editingName.value
      cancelEdit()
    }
  } finally {
    loading.value = false
  }
}

async function deleteKey(key) {
  loading.value = true
  try {
    const response = await deleteWebAuthnCredential([key.id])
    if (response.status === 200) {
      keys.value = keys.value.filter((entry) => entry.id !== key.id)
      if (!keys.value.length) {
        await router.replace(mfaOverviewPath.value)
      }
    }
  } finally {
    loading.value = false
  }
}
</script>
