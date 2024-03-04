<template>
  <div>
    <content-block>
    <h2>{{ $t('application_title') }}</h2>
    <p>{{ $t('application_description') }} {{ $t('access_restrictions') }}</p>

    <ol>
      <li><b>{{ $t('dashboard_title') }}</b>: {{ $t('dashboard_description') }} <router-link :to="'demo'">{{ $t('dashboard_link') }}</router-link></li>
      <li><b>{{ $t('api_title') }}</b>: {{ $t('api_description') }} <a href="https://github.com/internetstandards/Internet.nl-API-docs" target="_blank">{{ $t('api_link') }}</a></li>
    </ol>
    <p><i>{{ $t('note') }} <a href="https://github.com/internetstandards/Internet.nl/" target="_blank" ref="nofollow">{{ $t('note_link') }}</a>.</i></p>

    <h3>{{ $t('procedure_title') }}</h3>
    <p v-html="$t('procedure_description')">

    </p>

    <h3>{{ $t('support_title') }}</h3>
      <p v-html="$t('support_description')"></p>

    </content-block>

    <content-block>
    <h3>{{ $t('application.form_title') }}</h3>


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
<i18n>
{
  "en": {
    "application_title": "Application for batch tests on internet.nl",
    "application_description": "With below form you can request access to two types of batch testing on Internet.nl: API access and Dashboard access",
    "dashboard_title": "Dashboard",
    "dashboard_description": "Graphical user interface for large amounts of scans, with reports.",
    "dashboard_link": "See the features here.",
    "api_title": "API",
    "api_description": "For developers.",
    "api_link": "The API is documented here.",
    "note": "Note: for unlimited amounts of tests, you can use the internet.nl docker container. ",
    "note_link": "Visit the github repository to get started",
    "procedure_title": "Procedure for issuing login details",
    "procedure_description": "After formal approval of your request by our Steering Committee, your username and instructions for using the Batch testing HTTP API and/or API Dashboard are send to the specified e-mail address. The corresponding password will be send to the specified mobile phone number. See our <a href=\"https://internet.nl/privacy/\">privacy statement</a> on what data internet.nl processes and stores.",
    "support_title": "Support",
    "support_description": "For questions regarding (the use of) the Batch testing HTTP API and the API Dashboard, an e-mail can be send to <a href=\"mailto:question@internet.nl\">question@internet.nl</a>",
    "application.form_title": "Application form",
    "access_restrictions": "The api and dashboard are only accessible to the types of organizations mentioned in the form. Other organizations will not be granted access."
  },
  "nl": {
    "application_title": "Toegang aanvragen voor batch tests op internet.nl",
    "application_description": "Met onderstaand formulier is toegang aan te vragen tot twee soorten batch testen: API toegang en Dashboard toegang.",
    "dashboard_title": "Dashboard",
    "dashboard_description": "Grafische interface voor grote hoeveelheden scans, met rapporten en dergelijke. Geschikt voor gewone gebruikers.",
    "dashboard_link": "Bekijk wat het allemaal kan op deze pagina.",
    "api_title": "API",
    "api_description": "Programmatische toegang tot internet.nl voor ontwikkelaars.",
    "api_link": "De API is hier gedocumenteerd.",
    "note": "Voetnoot: voor onbeperkte hoeveelheden tests is het ook mogelijk om de internet.nl docker container te gebruiken.",
    "note_link": "Bekijk het internet.nl project op github om te beginnen.",
    "procedure_title": "Procedure voor het uitgeven van inloggegevens",
    "procedure_description": "Na formele goedkeuring door de stuurgroep worden je gebruikersnaam en gebruiksinstructies verstuurd naar het opgegeven e-mail adres. Het wachtwoord wordt verstuurd naar het opgegeven mobiele nummer. Bekijk ons <a href=\"https://internet.nl/privacy/\">privacy statement</a> om te lezen hoe we omgaan met deze gegevens.",
    "support_title": "Ondersteuning",
    "support_description": "Voor vragen over (het gebruik van) de API of hte dashboard, stuur een e-mail naar <a href=\"mailto:vraag@internet.nl\">vraag@internet.nl</a>",
    "application.form_title": "Aanvraagformulier",
    "access_restrictions": "De API en dashboard zijn alleen toeganklijk voor de typen organisaties genoemd in het formulier. Andere typen organisaties wordt geen toegang gegeven."
  }
}
</i18n>
