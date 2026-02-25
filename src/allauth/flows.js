import { Flows, AuthenticatorType } from '@/allauth/lib/allauth'

const flowToPath = {}
flowToPath[Flows.LOGIN] = '/account/login'
flowToPath[Flows.LOGIN_BY_CODE] = '/account/login/code/confirm'
flowToPath[Flows.MFA_WEBAUTHN_LOGIN] = '/account/login'
flowToPath[Flows.SIGNUP] = '/account/signup'
flowToPath[Flows.VERIFY_EMAIL] = '/account/verify-email'
flowToPath[Flows.VERIFY_PHONE] = '/account'
flowToPath[Flows.PASSWORD_RESET_BY_CODE] = '/account/password/reset/confirm'
flowToPath[Flows.PROVIDER_SIGNUP] = '/account/provider/signup'
flowToPath[Flows.REAUTHENTICATE] = '/account/reauthenticate'
flowToPath[Flows.MFA_TRUST] = '/account/2fa/trust'
flowToPath[`${Flows.MFA_AUTHENTICATE}:${AuthenticatorType.TOTP}`] = '/account/authenticate/totp'
flowToPath[`${Flows.MFA_AUTHENTICATE}:${AuthenticatorType.RECOVERY_CODES}`] = '/account/authenticate/recovery-codes'
flowToPath[`${Flows.MFA_AUTHENTICATE}:${AuthenticatorType.WEBAUTHN}`] = '/account/authenticate/webauthn'
flowToPath[`${Flows.MFA_REAUTHENTICATE}:${AuthenticatorType.TOTP}`] = '/account/reauthenticate/totp'
flowToPath[`${Flows.MFA_REAUTHENTICATE}:${AuthenticatorType.RECOVERY_CODES}`] = '/account/reauthenticate/recovery-codes'
flowToPath[`${Flows.MFA_REAUTHENTICATE}:${AuthenticatorType.WEBAUTHN}`] = '/account/reauthenticate/webauthn'
flowToPath[Flows.MFA_WEBAUTHN_SIGNUP] = '/account/signup/passkey/create'

export function pathForFlow(flow, typ) {
  let key = flow.id
  if (typeof flow.types !== 'undefined') {
    typ = typ ?? flow.types[0]
    key = `${key}:${typ}`
  }

  const path = flowToPath[key] ?? flowToPath[flow.id]
  return path || null
}

export function pathForPendingFlow(auth) {
  const flow = auth?.data?.flows?.find((candidate) => candidate.is_pending)
  if (flow) {
    return pathForFlow(flow)
  }
  return null
}
