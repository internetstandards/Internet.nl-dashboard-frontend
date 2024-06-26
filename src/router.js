// SPDX-License-Identifier: Apache-2.0
import VueRouter from "vue-router";

const Login = () => import(/* webpackChunkName: "login" */ './components/Login')
const DomainListManager = () => import('./components/domains/DomainListManager');
const SpreadsheetUpload = () => import('./components/domains/SpreadsheetUpload');
const ScanMonitor = () => import('./components/scans/ScanMonitor');
const Report = () => import('./components/reports/Report');
const SharedReportViaNumbersInUrl = () => import('./components/reports/SharedReportViaNumbersInUrl');
const SharedReportLatest = () => import('./components/reports/SharedReportLatest');
const SwitchAccount = () => import('./components/admin/SwitchAccount');
const InstantAddAccount = () => import('./components/admin/InstantAddAccount');
const Usage = () => import('./components/admin/usage');
const Account = () => import('./components/account/Account');
const Demo = () => import('./components/tour/Demo');
const Unsubscribe = () => import('./components/mail/Unsubscribe');
const Home = () => import('./components/home/Home');
const PublicReportsPerAccount = () => import('./components/home/PublicReportsPerAccount');
const SignupPage = () => import('./components/signup/SignupPage');
const Beta = () => import('./components/beta');

const routes = [
    // todo: Make page title translations...
    {path: '/home', component: Home, name: "home", meta: {title: 'Internet.nl Dashboard / Home'}, alias: '/', },
    {path: '/login', component: Login, name: "login", meta: {title: 'Internet.nl Dashboard / Login'}},
    {
        path: '/domains/list/:list',
        component: DomainListManager,
        name: 'numbered_lists',
        meta: {title: 'Internet.nl Dashboard / Domains'}
    },
    {
        path: '/domains',
        component: DomainListManager,
        name: 'domains',
        meta: {title: 'Internet.nl Dashboard / Domains'},
    },
    {
        path: '/domains/upload', component: SpreadsheetUpload,
        name: "spreadsheet-upload",
        props: {
            max_lists: 200,
            max_urls: 5000,
        },
        meta: {title: 'Internet.nl Dashboard / Domains / Upload'}
    },
    {path: '/scans', component: ScanMonitor, meta: {title: 'Internet.nl Dashboard / Scan Monitor'}},

    {
        path: '/report/:report/:compare_with',
        component: Report,
        name: 'compared_numbered_report',
        meta: {title: 'Internet.nl Dashboard / Reports'}
    },
    {
        path: '/report/:report',
        component: Report,
        name: 'numbered_report',
        meta: {title: 'Internet.nl Dashboard / Reports'}
    },
    {path: '/report', component: Report, meta: {title: 'Internet.nl Dashboard / Reports'}},

    {path: '/shared/report/:report', component: SharedReportViaNumbersInUrl, meta: {title: 'Internet.nl Dashboard / Reports'}, 'name': 'shared_report'},
    {path: '/shared/report/:report/:compare_with', component: SharedReportViaNumbersInUrl, meta: {title: 'Internet.nl Dashboard / Reports'}, 'name': 'compared_shared_report'},

    {path: '/published/:account/', component: PublicReportsPerAccount, meta: {title: 'Internet.nl Dashboard / Reports'}, 'name': 'published_report'},
    {path: '/published/:account/:list_id/', component: PublicReportsPerAccount, meta: {title: 'Internet.nl Dashboard / Reports'}, 'name': 'published_report_and_list'},
    {path: '/latest/:list_id/', component: SharedReportLatest, meta: {title: 'Internet.nl Dashboard / Reports'}, 'name': 'published_report_latest_in_list'},
    {path: '/latest/:list_id/web/', component: SharedReportLatest, meta: {title: 'Internet.nl Dashboard / Reports'}, 'name': 'published_report_latest_in_list_web'},
    {path: '/latest/:list_id/mail/', component: SharedReportLatest, meta: {title: 'Internet.nl Dashboard / Reports'}, 'name': 'published_report_latest_in_list_mail'},

    {path: '/switch-account', component: SwitchAccount, meta: {title: 'Internet.nl Dashboard / Switch Account'}},
    {path: '/add-user', component: InstantAddAccount, meta: {title: 'Internet.nl Dashboard / Add User'}},
    {path: '/tour', component: Demo, meta: {title: 'Internet.nl Dashboard / Tour'}, name: 'tour'},
    {path: '/demo', component: Demo, meta: {title: 'Internet.nl Dashboard / Tour'}, name: 'demo'},
    {path: '/unsubscribe', component: Unsubscribe, meta: {title: 'Internet.nl Dashboard / Unsubscribe'}},
    {path: '/profile', component: Account, meta: {title: 'Internet.nl Dashboard / Account'}},
    {path: '/account', component: Account, meta: {title: 'Internet.nl Dashboard / Account'}},
    {path: '/account/:active_tab', component: Account, meta: {title: 'Internet.nl Dashboard / Account'}},
    {path: '/usage', component: Usage, meta: {title: 'Internet.nl Dashboard / Usage'}},
    {path: '/beta', component: Beta, meta: {title: 'Internet.nl Dashboard / Beta'}},

    {path: '/signup', component: SignupPage, meta: {title: 'Internet.nl Dashboard / Signup'}, 'name': 'signup'},
];

const router = new VueRouter({
    routes, // short for `routes: routes`
    props: true,
    // https://reactgo.com/scroll-to-anchor-tags-vue-router/
    // does not work, as nested anchors is not a thing (and not reliable). So do this in component.
    scrollBehavior: function (to) {
        if (to.hash) {
            return {selector: to.hash}
        }
    },
});

export default router
