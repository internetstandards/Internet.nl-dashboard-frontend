<style scoped>
.router-link-active {
    font-weight: 600;
    border-bottom: 3px solid #ffab4c;
}

ul {
    margin-bottom: 0;
}
a, a:hover, a:active, a:visited, a:link {
    color: black;
    text-decoration: none;
}
</style>
<template>
    <ul>
        <template v-if="is_authenticated">
            <template v-if="is_superuser">
                <li>
                  <router-link to="/switch-account"><b-icon icon="person-circle"></b-icon> {{this.account_name}}</router-link>
                </li>
                <li>
                    <router-link to="/add-user"><b-icon icon="person-plus"></b-icon></router-link>
                </li>
                <li>
                    <router-link to="/usage"><b-icon icon="graph-up"></b-icon></router-link>
                </li>
            </template>

            <li>
                <router-link to="/domains" accesskey="d">{{ $t("domains") }}</router-link>
            </li>
            <li>
                <router-link to="/scans" accesskey="s">{{ $t("scans") }}</router-link>
            </li>
            <li>
                <router-link to="/report" accesskey="r">{{ $t("reports") }}</router-link>
            </li>
            <li>
                <router-link to="/account" accesskey="a">{{ $t("account") }}</router-link>
            </li>

            <li class=""><a @click="logout" accesskey="l">{{ $t("log_off") }}</a></li>
        </template>
        <template v-if="!is_authenticated">
            <router-link to="/login" accesskey="a">{{ $t("log_in") }}</router-link>
        </template>
    </ul>
</template>
<script>
import http from "@/httpclient";

export default {
    props: {
        is_authenticated: {
            type: Boolean,
            default: false,
        },
        is_superuser: {
            type: Boolean,
            default: false,
        },
        account_name: {
            type: String,
            default: "",
        }
    },
    name: 'site-menu',
    methods: {
        logout: function () {
            this.loading = true;
            http.get('/session/logout/').then(() => {
                this.loading = false;
                this.status();
            });
        },
        status: function () {
            this.server_response = {};
            this.loading = true;
            http.get('/session/status/').then(data => {
                this.$store.commit("set_user", data.data);
                this.loading = false;
                if (!this.$store.state.user.is_authenticated) {
                    this.$bvToast.toast(this.$i18n.t('logged_out_successfully'), {
                        title: `✅ ${this.$i18n.t('logged_out_successfully')}`,
                        autoHideDelay: 5000,
                        variant: 'success',
                        solid: true,
                        isStatus: false,
                        appendToast: false,
                    })
                    this.$router.push({'name': 'login'});
                }
            });
        },
    }
}
</script>
<i18n>
{
	"en": {
		"account": "Account",
		"admin": "Admin",
		"domains": "Domains",
		"log_in": "Log in",
		"log_off": "Log off",
		"reports": "Reports",
		"scans": "Scans",
        "logged_out_successfully": "You have logged out successfully"
	},
	"nl": {
		"account": "Account",
		"admin": "Beheer",
		"domains": "Domeinen",
		"log_in": "Inloggen",
		"log_off": "Uitloggen",
		"reports": "Rapporten",
		"scans": "  Scans",
        "logged_out_successfully": "Je bent uitgelogd"
	}
}
</i18n>
