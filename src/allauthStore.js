import { defineStore } from 'pinia'
import * as allauth from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'
import http from '@/httpclient'
import { dashboardStore } from '@/dashboardStore'

let authListenerInstalled = false
let authChangeHandler = null

export const allauthStore = defineStore('allauth', {
  state: () => ({
    auth: null,
    config: null,
    loading: false,
    bootstrapped: false,
    lastError: null
  }),

  getters: {
    isAuthenticated(state) {
      if (!state.auth) {
        return false
      }
      return state.auth.status === 200 || (state.auth.status === 401 && state.auth.meta?.is_authenticated)
    },

    requiresReauthentication(state) {
      if (!state.auth) {
        return false
      }
      return state.auth.status === 401 && state.auth.meta?.is_authenticated
    },

    pendingFlow(state) {
      return state.auth?.data?.flows?.find((flow) => flow.is_pending) ?? null
    },

    pendingFlowPath() {
      return pathForPendingFlow(this.auth)
    }
  },

  actions: {
    installAuthChangeListener() {
      if (authListenerInstalled) {
        return
      }

      authChangeHandler = async (event) => {
        this.auth = event.detail
        try {
          await this.syncDashboardSession()
        } catch (error) {
          console.error('Unable to sync dashboard session status after auth change.', error)
        }
      }

      document.addEventListener('allauth.auth.change', authChangeHandler)
      authListenerInstalled = true
    },

    async loadConfig() {
      this.config = await allauth.getConfig()
      return this.config
    },

    async loadAuth() {
      this.auth = await allauth.getAuth()
      return this.auth
    },

    async syncDashboardSession() {
      const dashboard = dashboardStore()
      const response = await http.get('/api/v1/session/status')
      dashboard.set_user(response.data)
      return response.data
    },

    async bootstrap() {
      if (this.bootstrapped) {
        return
      }

      this.loading = true
      this.lastError = null

      try {
        this.installAuthChangeListener()
        await Promise.all([this.loadConfig(), this.loadAuth()])
        this.bootstrapped = true
      } catch (error) {
        this.lastError = error
        throw error
      } finally {
        this.loading = false
      }
    },

    async refreshAuth() {
      return await this.loadAuth()
    },

    async logout() {
      const response = await allauth.logout()
      await Promise.all([this.refreshAuth(), this.syncDashboardSession()])
      return response
    }
  }
})
