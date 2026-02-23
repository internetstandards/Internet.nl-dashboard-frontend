<template>
  <section>
    <h2>Security Keys</h2>

    <table class="table table-sm table-bordered" v-if="keys.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Created at</th>
          <th>Last used at</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="key in keys" :key="key.id">
          <td>
            <template v-if="editingId === key.id">
              <input v-model="editingName" class="form-control form-control-sm">
              <div class="d-flex gap-1 mt-1">
                <b-button size="sm" variant="primary" @click="saveName(key)">Save</b-button>
                <b-button size="sm" variant="outline-secondary" @click="cancelEdit">Cancel</b-button>
              </div>
            </template>
            <template v-else>
              {{ key.name }}
              <b-button size="sm" class="ms-2" variant="outline-secondary" @click="startEdit(key)">Edit</b-button>
            </template>
          </td>
          <td>{{ key.is_passwordless ? 'Passkey' : 'Security key' }}</td>
          <td>{{ humanize(key.created_at) }}</td>
          <td>{{ key.last_used_at ? humanize(key.last_used_at) : 'Unused' }}</td>
          <td>
            <b-button size="sm" variant="outline-danger" :disabled="loading" @click="deleteKey(key)">Delete</b-button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No security keys configured yet.</p>

    <b-button variant="outline-secondary" to="/account/2fa/webauthn/add">Add</b-button>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthenticatorType, getAuthenticators, deleteWebAuthnCredential, updateWebAuthnCredential } from '@/allauth/lib/allauth'

const router = useRouter()

const keys = ref([])
const loading = ref(false)
const editingId = ref(null)
const editingName = ref('')

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
        await router.replace('/account/2fa')
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
        await router.replace('/account/2fa')
      }
    }
  } finally {
    loading.value = false
  }
}
</script>
