import { defineStore } from 'pinia'
import * as allauth from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'
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
      return state.auth.status === 200 || (state.auth.status === 401 && state.auth.meta?.is_authenticated === true)
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

      authChangeHandler = (event) => {
        this.auth = event.detail
        this.syncDashboardSession()
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
      this.syncDashboardSession()
      return this.auth
    },

    syncDashboardSession() {
      const dashboard = dashboardStore()
      // Allauth can also return a user during incomplete login/password-reset
      // flows. Only use dashboard account data for an authenticated session.
      const user = this.isAuthenticated ? this.auth?.data?.user : null
      const dashboardUser = {
        is_authenticated: this.isAuthenticated,
        is_superuser: user?.is_superuser === true,
        account_name: user?.account_name ?? '',
        account_id: user?.account_id ?? null
      }
      dashboard.set_user(dashboardUser)
      return dashboardUser
    },

    async bootstrap() {
      if (this.bootstrapped) {
        return
      }

      this.loading = true
      this.lastError = null

      try {
        this.installAuthChangeListener()
        // Routing still needs the session result when loading config fails.
        const results = await Promise.allSettled([this.loadConfig(), this.loadAuth()])
        const failure = results.find(result => result.status === 'rejected')
        if (failure) {
          throw failure.reason
        }
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
      // Allauth reports a successful logout as an unauthenticated 401.
      if (![401, 410].includes(response.status) || response.meta?.is_authenticated === true) {
        throw new Error('Unable to log out.')
      }
      this.auth = response
      this.syncDashboardSession()
      return response
    }
  }
})
