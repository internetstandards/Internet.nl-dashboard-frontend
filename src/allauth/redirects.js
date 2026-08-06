import { pathForReauthentication } from '@/allauth/flows'

const reauthenticationPath = '/account/reauthenticate'

export function reauthenticationRouteFor(auth, currentRoute) {
  const path = pathForReauthentication(auth)
  if (!path || currentRoute.path.startsWith(reauthenticationPath)) {
    return null
  }

  return {
    path,
    query: { next: currentRoute.fullPath },
  }
}

export function installAuthChangeRedirector(router) {
  const authChangeHandler = async (event) => {
    const route = reauthenticationRouteFor(event.detail, router.currentRoute.value)
    if (!route) {
      return
    }

    try {
      await router.replace(route)
    } catch (error) {
      console.error('Unable to redirect to reauthentication.', error)
    }
  }

  document.addEventListener('allauth.auth.change', authChangeHandler)
  return () => document.removeEventListener('allauth.auth.change', authChangeHandler)
}
