import {createRouter, createWebHistory} from 'vue-router'

const Account = () => import('@/components/account/Account.vue');
const Demo = () => import('@/components/tour/Demo.vue');
const Home = () => import('@/components/home/Home.vue');
const Report = () => import('@/components/reports/Report.vue');
const ScanMonitor = () => import('@/components/scans/ScanMonitor.vue');
const DomainListManager = () => import('@/components/domains/DomainListManager.vue');
const SpreadsheetUpload = () => import('@/components/domains/SpreadsheetUpload.vue');
const SwitchAccount = () => import('@/components/admin/SwitchAccount.vue');
const InstantAddAccount = () => import('@/components/admin/InstantAddAccount.vue');
const Usage = () => import('@/components/admin/usage.vue');
const SignupPage = () => import('@/components/signup/SignupPage.vue');
const Unsubscribe = () => import('@/components/mail/Unsubscribe.vue');

const SharedReportViaNumbersInUrl = () => import('@/components/reports/SharedReportViaNumbersInUrl.vue');
const SharedReportLatest = () => import('@/components/reports/SharedReportLatest.vue');
const PublicReportsPerAccount = () => import('@/components/home/PublicReportsPerAccount.vue');
const Login = () => import('@/components/Login.vue')
const Beta = () => import('@/components/beta.vue');


const publicRoutes = [
  {
    path: '/home',
    component: Home,
    name: "home",
    meta: {title: 'home', access: 'public'},
    alias: '/'
  },
  {
    path: '/login',
    component: Login,
    name: "login",
    meta: {title: 'login', access: 'public'}
  },
  {
    path: '/shared/report/:report',
    component: SharedReportViaNumbersInUrl,
    meta: {title: 'reports', access: 'public'},
    'name': 'shared_report',
    alias: ['/shared/report/:report/:compare_with']
  },
  {
    path: '/published/:account/',
    component: PublicReportsPerAccount,
    meta: {title: 'reports', access: 'public'},
    'name': 'published_report',
    alias: ['/published/:account/:list_id/']
  },
  {
    path: '/latest/:list_id/',
    component: SharedReportLatest,
    meta: {title: 'reports', access: 'public'},
    'name': 'published_report_latest_in_list',
    alias: ['/latest/:list_id/web/', '/latest/:list_id/mail/']
  },
  {
    path: '/tour',
    component: Demo,
    meta: {title: 'tour', access: 'public'},
    name: 'tour',
    alias: '/demo'
  },
  {
    path: '/unsubscribe',
    component: Unsubscribe,
    meta: {title: 'unsubscribe', access: 'public'}
  },
  {
    path: '/signup',
    component: SignupPage,
    meta: {title: 'signup', access: 'public'},
    'name': 'signup'
  },
]

const privateRoutes = [
  {
    path: '/domains/list/:list',
    component: DomainListManager,
    name: 'numbered_lists',
    meta: {title: 'domains', access: 'private'},
    alias: ['/domains']
  },
  {
    path: '/domains/upload',
    component: SpreadsheetUpload,
    name: "spreadsheet-upload",
    meta: {title: 'domains_upload', access: 'private'}
  },
  {
    path: '/scans',
    component: ScanMonitor,
    meta: {title: 'scan_monitor', access: 'private'}
  },
  {
    path: '/report/:report/:compare_with',
    component: Report,
    name: 'compared_numbered_report',
    meta: {title: 'reports', access: 'private'}
  },
  {
    path: '/report/:report',
    component: Report,
    name: 'numbered_report',
    meta: {title: 'reports', access: 'private'}
  },
  {
    path: '/report',
    component: Report,
    meta: {title: 'reports', access: 'private'}
  },
  {
    path: '/switch-account',
    component: SwitchAccount,
    meta: {title: 'switch_user', access: 'private'}
  },
  {
    path: '/add-user',
    component: InstantAddAccount,
    meta: {title: 'add_user', access: 'private'}
  },

  {
    path: '/account',
    component: Account,
    meta: {title: 'account', access: 'private'},
    alias: ["/profile", '/account/:active_tab']
  },
  {
    path: '/usage',
    component: Usage,
    meta: {title: 'usage_overview', access: 'private'}
  },
  {
    path: '/beta',
    component: Beta,
    meta: {title: 'beta', access: 'private'},
    alias: "/dev"
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes, ...privateRoutes]
})

export default router
