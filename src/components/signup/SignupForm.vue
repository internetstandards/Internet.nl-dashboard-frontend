<template>
  <div>

    <loading :loading="loading"></loading>
    <server-response :response="server_response" :message="$t(server_response.message)"></server-response>


    <b-form @submit="onSubmit" v-if="!loading && !submitted_succesfully">

      <div class="mb-2" style="font-weight: bold">{{ $t('access_to')}}:</div>

      <!--
      <b-form-group id="input-group-4" v-slot="{ ariaDescribedby }">
        <b-form-checkbox-group
          v-model="form.access"
          :label="$t('access_to')"
          id="checkboxes-4"
          :aria-describedby="ariaDescribedby"
        >
          <b-form-checkbox value="api" >{{$t('api_access')}}</b-form-checkbox>
          <b-form-checkbox value="dashboard">{{$t('dashboard_access')}}</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>
      -->

      <b-form-group
        id="input-group-name"
        :label="$t('name')"
        label-for="input-name"
        :state="form.name.length < 3"
        description=""
      >
        <b-form-input
          id="input-name"
          v-model="form.name"
          type="text"
          :placeholder="$t('name_placeholder')"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-email"
        :label="$t('email')"
        label-for="input-email"
        description=""
      >
        <b-form-input
          id="input-email"
          v-model="form.email"
          type="email"
          :placeholder="$t('email_placeholder')"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-mobile"
        :label="$t('mobile_phone_number')"
        label-for="input-mobile"
        :description="$t('mobile_phone_number_description')"
      >
        <b-form-input
          id="input-mobile"
          v-model="form.mobile_phone_number"
          type="tel"
          :placeholder="$t('mobile_phone_number_placeholder')"
          required
        ></b-form-input>
      </b-form-group>

       <b-form-group
        id="input-group-organization"
        :label="$t('organization_name')"
        label-for="input-organization"
        description=""
      >
        <b-form-input
          id="input-organization"
          v-model="form.organization_name"
          type="text"
          placeholder=""
          required
        ></b-form-input>
      </b-form-group>

      <div class="mb-2" style="font-weight: bold">{{ $t('nature_of_organization')}}:</div>
      <b-form-group id="input-group-nature-of-organization" >
        <template #description>
          <span v-html="$t('nature_of_organization_description')" />
        </template>

        <b-form-radio-group
          v-model="form.nature_of_organization"
          id="radios-nature-of-organization"
          :aria-describedby="ariaDescribedby"
          plain stacked
        >
          <b-form-radio value="government">{{$t('nature_government')}}</b-form-radio>
          <b-form-radio value="non-profit">{{$t('nature_non_profit')}}</b-form-radio>
          <b-form-radio value="dutch-cloud-community">{{$t('nature_dutch_cloud_community')}} (<a href="https://dutchcloudcommunity.nl/" target="_blank" rel="nofollow">link</a>)</b-form-radio>
          <b-form-radio value="vereniging-van-registrars">{{$t('nature_registrar_community')}} (<a href="https://www.verenigingvanregistrars.nl/" target="_blank" rel="nofollow">link</a>)</b-form-radio>
          <b-form-radio value="vital_infrastructure">{{$t('nature_vital_infrastructure')}}</b-form-radio>
          <b-form-radio value="hoster_in_hall_of_fame">{{$t('nature_hoster_in_hall_of_fame')}}</b-form-radio>
          <!-- <b-form-radio value="other">{{$t('nature_other')}}</b-form-radio> -->
        </b-form-radio-group>
      </b-form-group>

      <b-alert v-if="form.nature_of_organization === 'vital_infrastructure'" variant="warning" show>
        {{$t('please_explain_vital_infrastructure')}}
      </b-alert>

      <b-form-group
        id="input-group-coc-number"
        :label="$t('chamber_of_commerce_number')"
        label-for="input-chamber-of-commerce-number"
        description=""
      >
        <b-form-input
          id="input-chamber-of-commerce-number"
          v-model="form.chamber_of_commerce_number"
          type="text"
          placeholder=""
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-reason-for-application"
        :label="$t('reason_for_application')"
        label-for="input-reason-for-application"
        :description="$t('reason_for_application_description')"
      >
        <b-form-textarea
          id="input-reason-for-application"
          v-model="form.reason_for_application"
          type="text"
          placeholder=""
          required
        ></b-form-textarea>
      </b-form-group>

      <b-form-group
        id="input-group-usage-frequency"
        :label="$t('intended_usage_frequency')"
        label-for="input-usage-frequency"
        :description="$t('intended_usage_frequency_description')"
      >
        <b-form-input
          id="input-usage-frequency"
          v-model="form.intended_usage_frequency"
          type="text"
          placeholder=""
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-captcha"
        :label="$t('captcha_title')"
        label-for="input-captcha"
        :description="$t('captcha_description')"
      >
        <b-form-input
          id="input-captcha"
          v-model="form.captcha"
          type="text"
          :state="this.correct_captcha_answers.includes(form.captcha)"
          placeholder=""
          required
        ></b-form-input>
      </b-form-group>


      <b-form-group id="input-group-terms-of-use" v-slot="{ ariaDescribedby }" :label="$t('terms_of_use')">
        <b-form-checkbox-group
          v-model="form.terms_of_use"
          :state="form.terms_of_use.includes('accepted')"
          :aria-describedby="ariaDescribedby"
        >
          <span v-html="$t('terms_of_use_description')" /><br />
          <b-form-checkbox value="accepted" :state="form.terms_of_use !== ['accepted']">{{$t("terms_of_use_accept")}}</b-form-checkbox>
        </b-form-checkbox-group>
        <b-form-invalid-feedback id="checkboxes-terms-of-use">
          &nbsp;
        </b-form-invalid-feedback>
      </b-form-group>
      <button type="submit" variant="info" :disabled="!submit_possible"><b>{{ $t('submit') }}</b></button>
    </b-form>

  </div>
</template>

<script>
import http from "@/httpclient";

export default {
  name: "SignupForm",

  data(){
    return {
      server_response: {},
      loading: false,
      submitted_succesfully: false,
      form: {
        access: ['api', 'dashboard'],
        name: "",
        email: "",
        mobile_phone_number: "",
        organization_name: "",
        nature_of_organization: "",
        chamber_of_commerce_number: "",
        reason_for_application: "",
        intended_usage_frequency: "",
        terms_of_use: [],
        captcha: ""
      },
      correct_captcha_answers: ["42"],
    }
  },
  computed: {
    submit_possible( ){
      // possible logic here...
      return true
    }
  },

  methods: {
    onSubmit(event) {
      // don't send it but handle it yourself
      event.preventDefault()

      if(!this.form.terms_of_use.includes('accepted')) {
        return
      }

      this.loading = true;
      http.post('/data/signup/', {
        'form_data': this.form
      }).then(data => {
        if (data.data) {
          this.server_response = data.data;


          // you have to re-init the app to resubmit.
          if (data.data.success) {
            this.submitted_succesfully = true;
          }

          this.loading = false;
        }
      });
    },
  }
}
</script>

<style scoped>

</style>
<i18n>
{
  "en": {
    "access_to": "I would like access to",
    "api_access": "API",
    "dashboard_access": "Dashboard",
    "name": "Name",
    "name_placeholder": "First name and last name",
    "email": "Email",
    "email_placeholder": "email@",
    "mobile_phone_number": "Mobile phone number",
    "mobile_phone_number_placeholder": "+31...",
    "mobile_phone_number_description": "Used to send the password to you",
    "organization_name": "Organization name",
    "organization_name_placeholder": "",
    "nature_of_organization": "Nature of organization",
    "nature_government": "Government",
    "nature_non_profit": "Non profit",
    "nature_for_profit": "For profit",
    "nature_hoster_in_hall_of_fame": "Hoster in the Hall of Fame for Hosters",
    "nature_dutch_cloud_community": "member of Dutch Cloud Community",
    "nature_registrar_community": "member of Vereniging van Registrars",
    "nature_vital_infrastructure": "Category A vital infrastructure (NIS2)",
    "nature_other": "Other",
    "chamber_of_commerce_number": "Chamber of commerce number",
    "chamber_of_commerce_number_placeholder": "",
    "reason_for_application": "Reason for applying",
    "reason_for_application_description": "How will the test results be used?",
    "intended_usage_frequency": "Intended usage frequency",
    "intended_usage_frequency_description": "For example: 1000 domains per week/month/year",
    "captcha_title": "To prevent automated signups: what is the answer to 23 * 2 - 4?",
    "captcha_description": "Please answer the above question",
    "terms_of_use": "Terms of use",
    "terms_of_use_description": "By submitting this application form the applicant declares that they will honor the terms of use which are published <a href='https://github.com/internetstandards/Internet.nl-API-docs/blob/main/terms-of-use.md' target='_blank' rel='_nofollow'>here</a>.",
    "terms_of_use_accept": "I will honor the terms of use",
    "submit": "Send in application",

    "incorrect_captcha": "Question to prevent automated signups not correctly answered",
    "incomplete_form_submitted": "Form was not filled out completely, please fill out all fields",
    "access_requested": "Your request has been received and will be reviewed in the coming weeks. You will receive an e-mail with further instructions in the coming weeks.",
    "other_type_not_possible": "The dashboard is not meant for other types of organizations. Your request will not be accepted.",
    "please_explain_vital_infrastructure": "Please add some information about your vital infrastructure organization in the reason for applying.",
    "nature_of_organization_description": "The API and Dashboard are only available for organizations that meet <a target=\"_blank\" rel=\"nofollow\" href=\"https://github.com/internetstandards/Internet.nl-API-docs/blob/main/application_form/README.md\">specific requirements</a>."
  },
  "nl": {
    "access_to": "Ik wil graag toegang tot",
    "api_access": "API",
    "dashboard_access": "Dashboard",
    "name": "Naam",
    "name_placeholder": "Voornaam en achternaam",
    "email": "Email",
    "email_placeholder": "email@",
    "mobile_phone_number": "Mobiel nummer",
    "mobile_phone_number_placeholder": "+31...",
    "mobile_phone_number_description": "Hier versturen we het wachtwoord naar toe",
    "organization_name": "Naam van organisatie",
    "organization_name_placeholder": "",
    "nature_of_organization": "Soort organisatie",
    "nature_government": "Overheid",
    "nature_non_profit": "Non profit",
    "nature_for_profit": "For profit",
    "nature_hoster_in_hall_of_fame": "Hoster in de Hall of Fame van Hosters",
    "nature_dutch_cloud_community": "Lid van Dutch Cloud Community",
    "nature_registrar_community": "Lid van Vereniging van Registrars",
    "nature_vital_infrastructure": "Categorie A vitale infrastructuur (NIS2)",
    "nature_other": "Overig",
    "chamber_of_commerce_number": "Kamer van koophandel nummer",
    "chamber_of_commerce_number_placeholder": "",
    "reason_for_application": "Reden om toegang aan te vragen",
    "reason_for_application_description": "Hoe worden de testresultaten gebruikt?",
    "intended_usage_frequency": "Verwacht verbruik en frequentie",
    "intended_usage_frequency_description": "Bijvoorbeeld: 1000 domeinen per week/maand/jaar",
    "captcha_title": "Om geautomatiseerde inschrijvingen te voorkomen: wat is de uitkomst van 23 * 2 - 4?",
    "captcha_description": "Graag het antwoord op deze vraag invullen",
    "terms_of_use": "Voorwaarden",
    "terms_of_use_description": "Door dit formulier in te sturen ga ik akkoord met de gebruiksvoorwaarden. Deze heb ik gelezen op de volgende pagina; <a href='https://github.com/internetstandards/Internet.nl-API-docs/blob/main/terms-of-use.md' target='_blank' rel='_nofollow'>gebruiksvoorwaarden</a>.",
    "terms_of_use_accept": "Ik hou me aan deze voorwaarden",
    "submit": "Toegang aanvragen",

    "incorrect_captcha": "Antwoord op de controlevraag om geautomatiseerde inschrijvingen tegen te gaan is niet juist beantwoord. Beantwoord de vraag en probeer opnieuw.",
    "incomplete_form_submitted": "Het formulier is niet volledig ingevoerd, vul de ontbrekende velden in en probeer opnieuw.",
    "access_requested": "De aanvraag is ontvangen en word in de komende weken behandeld. Wij sturen in de komende weken een e-mail met een reactie.",
    "other_type_not_possible": "Het dashboard is niet bedoeld voor andere typen organisaties. De aanvraag zal worden afgewezen.",
    "please_explain_vital_infrastructure": "Graag een motivatie en informatie over uw vitale infrastructurele organisatie toevoegen in het veld 'Reden om toegang aan te vragen'.",
    "nature_of_organization_description": "De API en het dashboard zijn alleen beschikbaar voor organisaties die voldoen aan <a target=\"_blank\" rel=\"nofollow\" href=\"https://github.com/internetstandards/Internet.nl-API-docs/blob/main/application_form/README.md\">deze specifieke voorwaarden</a>."
  }
}
</i18n>