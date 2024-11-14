<template>
  <div>
    <content-block>
    <h2>{{ $t("signup.page.application_title") }}</h2>
    <p>{{ $t("signup.page.application_description") }} {{ $t("signup.page.access_restrictions")}}</p>

    <ol>
      <li><b>{{ $t("signup.page.dashboard_title") }}</b>: {{ $t("signup.page.dashboard_description") }} <router-link :to="'demo'">{{ $t("signup.page.dashboard_link") }}</router-link></li>
      <li><b>{{ $t("signup.page.api_title") }}</b>: {{ $t("signup.page.api_description") }} <a href="https://github.com/internetstandards/Internet.nl-API-docs" target="_blank">{{ $t("signup.page.api_link") }}</a></li>
    </ol>
    <p><i>{{ $t("signup.page.note") }} <a href="https://github.com/internetstandards/Internet.nl/" target="_blank" ref="nofollow">{{ $t("signup.page.note_link") }}</a>.</i></p>

    <h3>{{ $t("signup.page.procedure_title") }}</h3>
    <p v-html='$t("signup.page.procedure_description")'>

    </p>

    <h3>{{ $t("signup.page.support_title") }}</h3>
      <p v-html='$t("signup.page.support_description")'></p>

    </content-block>

    <content-block>
    <h3>{{ $t("signup.page.application_form_title") }}</h3>

    <signup-form />
    </content-block>
  </div>
</template>

<script>
import SignupForm from "@/components/signup/SignupForm";
export default {
  name: "SignupPage",
  components: {SignupForm}
}
</script>
