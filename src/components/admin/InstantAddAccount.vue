<template>
    <div id="switch-account" class="block fullwidth">

        <h1>{{ $t("title") }}</h1>
        <p>{{ $t("intro") }}</p>

        <p>
            <server-response :response="server_response"></server-response>

            {{ $t("username") }}:<br>
            <b-form-input id="username" type="text" maxlength="120" v-model="username"
                          :placeholder="$t('username')"></b-form-input>

            {{ $t("password") }}:<br>
            <b-form-input id="password" type="password" maxlength="120" v-model="password"
                          :placeholder="$t('password')"></b-form-input>
            <br/><br/>
            <button type="button" @click="save_instant_account()">{{ $t("save") }}</button>
        </p>

    </div>
</template>
<script>
export default {
    data: function () {
        return {
            username: "",
            password: "",
            server_response: {},
        }
    },
    methods: {
        save_instant_account: function () {
            let data = {'username': this.username, 'password': this.password};

            this.asynchronous_json_post(
                `${this.$store.state.dashboard_endpoint}/data/powertools/save_instant_account/`, data, (server_response) => {
                    if (server_response) {
                        this.server_response = server_response;
                    }
                }
            );
        },
    }
}
</script>
<i18n>
{
    "en": {
        "title": "Instant User Creation",
        "intro": "This creates a standard user, an Account to internet.nl and the bridge between it (DashboardUser).\n There are minimal password checks on this form. This form is intended to quickly migrate API user accounts and\n give them access to the dashboard with the same username and password.",
        "username": "Username",
        "password": "Password",
        "save": "Add user"
    },
    "nl": {
        "title": "Direct gebruikers toevoegen",
        "intro": "Met dit formulier kan een gebruiker worden gemaakt, het voegt meteen een account voor de gebruiker toe waarbij het gebruikersnaam en wachtwoord ook voor de API wordt gebruikt. Er zijn geen controles op kwaliteit van het wachtwoord in dit formulier, het is bedoeld om de huidige API gebruikers makkelijk toegang te geven.",
        "username": "Gebruikersnaam",
        "password": "Wachtwoord",
        "save": "Toevoegen"
    }
}
</i18n>