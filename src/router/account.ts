const AllauthLayout = () => import('@/components/allauth/AllauthLayout.vue');
const Home = () => import('@/pages/account/Home.vue');
const Login = () => import('@/pages/account/Login.vue');
const LoginCodeRequest = () => import('@/pages/account/LoginCodeRequest.vue');
const LoginCodeConfirm = () => import('@/pages/account/LoginCodeConfirm.vue');
const Signup = () => import('@/pages/account/Signup.vue');
const SignupPasskey = () => import('@/pages/account/SignupPasskey.vue');
const SignupPasskeyCreate = () => import('@/pages/account/SignupPasskeyCreate.vue');
const ProviderSignup = () => import('@/pages/account/ProviderSignup.vue');
const ProviderCallback = () => import('@/pages/account/ProviderCallback.vue');
const Providers = () => import('@/pages/account/Providers.vue');
const Email = () => import('@/pages/account/Email.vue');
const VerifyEmailGate = () => import('@/pages/account/VerifyEmailGate.vue');
const VerifyEmail = () => import('@/pages/account/VerifyEmail.vue');
const PasswordResetRequest = () => import('@/pages/account/PasswordResetRequest.vue');
const PasswordResetConfirm = () => import('@/pages/account/PasswordResetConfirm.vue');
const PasswordResetComplete = () => import('@/pages/account/PasswordResetComplete.vue');
const PasswordResetByKey = () => import('@/pages/account/PasswordResetByKey.vue');
const PasswordChange = () => import('@/pages/account/PasswordChange.vue');
const Logout = () => import('@/pages/account/Logout.vue');
const Reauthenticate = () => import('@/pages/account/Reauthenticate.vue');
const ReauthenticateTotp = () => import('@/pages/account/ReauthenticateTotp.vue');
const ReauthenticateRecoveryCodes = () => import('@/pages/account/ReauthenticateRecoveryCodes.vue');
const ReauthenticateWebauthn = () => import('@/pages/account/ReauthenticateWebauthn.vue');
const AuthenticateTotp = () => import('@/pages/account/AuthenticateTotp.vue');
const AuthenticateRecoveryCodes = () => import('@/pages/account/AuthenticateRecoveryCodes.vue');
const AuthenticateWebauthn = () => import('@/pages/account/AuthenticateWebauthn.vue');
const MfaOverview = () => import('@/pages/account/MfaOverview.vue');
const MfaActivateTotp = () => import('@/pages/account/MfaActivateTotp.vue');
const MfaDeactivateTotp = () => import('@/pages/account/MfaDeactivateTotp.vue');
const MfaRecoveryCodes = () => import('@/pages/account/MfaRecoveryCodes.vue');
const MfaRecoveryCodesGenerate = () => import('@/pages/account/MfaRecoveryCodesGenerate.vue');
const MfaWebauthnList = () => import('@/pages/account/MfaWebauthnList.vue');
const MfaWebauthnAdd = () => import('@/pages/account/MfaWebauthnAdd.vue');
const MfaTrust = () => import('@/pages/account/MfaTrust.vue');
const Sessions = () => import('@/pages/account/Sessions.vue');

export const accountRoutes = [
  {
    path: '/account',
    component: AllauthLayout,
    meta: { allauth: true, title: 'authentication' },
    children: [
      { path: '', component: Home },
      { path: 'login', component: Login, meta: { requiresAnon: true } },
      { path: 'login/code', component: LoginCodeRequest, meta: { requiresAnon: true } },
      { path: 'login/code/confirm', component: LoginCodeConfirm, meta: { requiresAnon: true } },
      { path: 'signup', component: Signup, meta: { requiresAnon: true } },
      { path: 'signup/passkey', component: SignupPasskey, meta: { requiresAnon: true } },
      { path: 'signup/passkey/create', component: SignupPasskeyCreate, meta: { requiresAnon: true } },
      { path: 'provider/signup', component: ProviderSignup, meta: { requiresAnon: true } },
      { path: 'provider/callback', component: ProviderCallback },
      { path: 'providers', component: Providers, meta: { requiresAuth: true } },
      { path: 'email', component: Email, meta: { requiresAuth: true } },
      { path: 'verify-email', component: VerifyEmailGate },
      { path: 'verify-email/:key', component: VerifyEmail },
      { path: 'password/reset', component: PasswordResetRequest, meta: { requiresAnon: true } },
      { path: 'password/reset/confirm', component: PasswordResetConfirm, meta: { requiresAnon: true } },
      { path: 'password/reset/complete', component: PasswordResetComplete, meta: { requiresAnon: true } },
      { path: 'password/reset/key/:key', component: PasswordResetByKey, meta: { requiresAnon: true } },
      { path: 'password/change', component: PasswordChange, meta: { requiresAuth: true } },
      { path: 'logout', component: Logout },
      { path: 'reauthenticate', component: Reauthenticate, meta: { requiresAuth: true } },
      { path: 'reauthenticate/totp', component: ReauthenticateTotp, meta: { requiresAuth: true } },
      { path: 'reauthenticate/recovery-codes', component: ReauthenticateRecoveryCodes, meta: { requiresAuth: true } },
      { path: 'reauthenticate/webauthn', component: ReauthenticateWebauthn, meta: { requiresAuth: true } },
      { path: 'authenticate/totp', component: AuthenticateTotp, meta: { requiresAnon: true } },
      { path: 'authenticate/recovery-codes', component: AuthenticateRecoveryCodes, meta: { requiresAnon: true } },
      { path: 'authenticate/webauthn', component: AuthenticateWebauthn, meta: { requiresAnon: true } },
      { path: '2fa', component: MfaOverview, meta: { requiresAuth: true } },
      { path: '2fa/totp/activate', component: MfaActivateTotp, meta: { requiresAuth: true } },
      { path: '2fa/totp/deactivate', component: MfaDeactivateTotp, meta: { requiresAuth: true } },
      { path: '2fa/recovery-codes', component: MfaRecoveryCodes, meta: { requiresAuth: true } },
      { path: '2fa/recovery-codes/generate', component: MfaRecoveryCodesGenerate, meta: { requiresAuth: true } },
      { path: '2fa/webauthn', component: MfaWebauthnList, meta: { requiresAuth: true } },
      { path: '2fa/webauthn/add', component: MfaWebauthnAdd, meta: { requiresAuth: true } },
      { path: '2fa/trust', component: MfaTrust, meta: { requiresAnon: true } },
      { path: 'sessions', component: Sessions, meta: { requiresAuth: true } },
    ],
  },
];
