<template>
  <section>
    <h2>Sessions</h2>

    <table class="table table-sm table-bordered" v-if="sessions.length">
      <thead>
        <tr>
          <th>Started at</th>
          <th>IP address</th>
          <th>Browser</th>
          <th v-if="trackActivity">Last seen at</th>
          <th>Current</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="session in sessions" :key="session.id">
          <td>{{ humanize(session.created_at) }}</td>
          <td>{{ session.ip }}</td>
          <td>{{ session.user_agent }}</td>
          <td v-if="trackActivity">{{ humanize(session.last_seen_at) }}</td>
          <td>{{ session.is_current ? 'Yes' : '' }}</td>
          <td>
            <b-button size="sm" variant="outline-danger" :disabled="loading" @click="logoutSelected([session.id])">Logout</b-button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No active sessions found.</p>

    <b-button
      variant="outline-danger"
      :disabled="loading || otherSessionIds.length === 0"
      @click="logoutSelected(otherSessionIds)"
    >
      Logout elsewhere
    </b-button>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { getSessions, endSessions } from '@/allauth/lib/allauth'
import { allauthStore } from '@/allauthStore'

const allauth = allauthStore()

const sessions = ref([])
const loading = ref(false)

const trackActivity = computed(() => Boolean(allauth.config?.data?.usersessions?.track_activity))
const otherSessionIds = computed(() => sessions.value.filter((session) => !session.is_current).map((session) => session.id))

onMounted(async () => {
  await refreshSessions()
})

function humanize(timestamp) {
  if (!timestamp) {
    return ''
  }
  return new Date(timestamp * 1000).toLocaleString()
}

async function refreshSessions() {
  loading.value = true
  try {
    const response = await getSessions()
    if (response.status === 200) {
      sessions.value = response.data
    }
  } finally {
    loading.value = false
  }
}

async function logoutSelected(ids) {
  if (!ids.length) {
    return
  }

  loading.value = true
  try {
    const response = await endSessions(ids)
    if (response.status === 200) {
      sessions.value = response.data
    }
  } finally {
    loading.value = false
  }
}
</script>
