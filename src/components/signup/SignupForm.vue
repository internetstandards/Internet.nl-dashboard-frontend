<template>
  <div>

    <loading :loading="loading"></loading>
    <server-response :response="server_response" :message="$t(server_response.message)"></server-response>


    <b-form @submit="onSubmit" v-if="!loading && !submitted_succesfully">

      <div class="mb-2" style="font-weight: bold">{{ $t("signup.form.access_to")}}:</div>

      <!--
      <b-form-group id="input-group-4" v-slot="{ ariaDescribedby }">
        <b-form-checkbox-group
          v-model="form.access"
          :label='$t("access_to")'
          id="checkboxes-4"
          :aria-describedby="ariaDescribedby"
        >
          <b-form-checkbox value="api" >{{$t("api_access")}}</b-form-checkbox>
          <b-form-checkbox value="dashboard">{{$t("dashboard_access")}}</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>
      -->

      <b-form-group
        id="input-group-name"
        :label='$t("signup.form.name")'
        label-for="input-name"
        :state="form.name.length < 3"
        description=""
      >
        <b-form-input
          id="input-name"
          v-model="form.name"
          type="text"
          :placeholder='$t("signup.form.name_placeholder")'
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-email"
        :label='$t("signup.form.email")'
        label-for="input-email"
        description=""
      >
        <b-form-input
          id="input-email"
          v-model="form.email"
          type="email"
          :placeholder='$t("signup.form.email_placeholder")'
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-mobile"
        :label='$t("signup.form.mobile_phone_number")'
        label-for="input-mobile"
        :description='$t("signup.form.mobile_phone_number_description")'
      >
        <b-form-input
          id="input-mobile"
          v-model="form.mobile_phone_number"
          type="tel"
          :placeholder='$t("signup.form.mobile_phone_number_placeholder")'
          required
        ></b-form-input>
      </b-form-group>

       <b-form-group
        id="input-group-organization"
        :label='$t("signup.form.organization_name")'
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

      <div class="mb-2" style="font-weight: bold">{{ $t("signup.form.nature_of_organization")}}:</div>
      <b-form-group id="input-group-nature-of-organization" >
        <template #description>
          <span v-html='$t("signup.form.nature_of_organization_description")' />
        </template>

        <b-form-radio-group
          v-model="form.nature_of_organization"
          id="radios-nature-of-organization"
          plain stacked
        >
          <b-form-radio value="government">{{$t("signup.form.nature_government")}}</b-form-radio>
          <b-form-radio value="non-profit">{{$t("signup.form.nature_non_profit")}}</b-form-radio>
          <b-form-radio value="dutch-cloud-community">{{$t("signup.form.nature_dutch_cloud_community")}} (<a href="https://dutchcloudcommunity.nl/" target="_blank" rel="nofollow">link</a>)</b-form-radio>
          <b-form-radio value="vereniging-van-registrars">{{$t("signup.form.nature_registrar_community")}} (<a href="https://www.verenigingvanregistrars.nl/" target="_blank" rel="nofollow">link</a>)</b-form-radio>
          <b-form-radio value="vital_infrastructure">{{$t("signup.form.nature_vital_infrastructure")}}</b-form-radio>
          <b-form-radio value="hoster_in_hall_of_fame">{{$t("signup.form.nature_hoster_in_hall_of_fame")}}</b-form-radio>
          <!-- <b-form-radio value="other">{{$t("nature_other")}}</b-form-radio> -->
        </b-form-radio-group>
      </b-form-group>

      <b-alert v-if="form.nature_of_organization === 'vital_infrastructure'" variant="warning" show>
        {{$t("signup.form.please_explain_vital_infrastructure")}}
      </b-alert>

      <b-form-group
        id="input-group-coc-number"
        :label='$t("signup.form.chamber_of_commerce_number")'
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
        :label='$t("signup.form.reason_for_application")'
        label-for="input-reason-for-application"
        :description='$t("signup.form.reason_for_application_description")'
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
        :label='$t("signup.form.intended_usage_frequency")'
        label-for="input-usage-frequency"
        :description='$t("signup.form.intended_usage_frequency_description")'
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
        :label='$t("signup.form.captcha_title")'
        label-for="input-captcha"
        :description='$t("signup.form.captcha_description")'
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

      <b-form-group id="input-group-terms-of-use"  :label='$t("signup.form.terms_of_use")' label-for="checkboxes-terms-of-use">
        <b-form-checkbox-group
          v-model="form.terms_of_use"
          :state="form.terms_of_use.includes('accepted')"
        >
          <span v-html='$t("signup.form.terms_of_use_description")' /><br />
          <b-form-checkbox value="accepted" :state="form.terms_of_use !== ['accepted']">{{$t("signup.form.terms_of_use_accept")}}</b-form-checkbox>
        </b-form-checkbox-group>
        <b-form-invalid-feedback id="checkboxes-terms-of-use">
          &nbsp;
        </b-form-invalid-feedback>
      </b-form-group>
      <button type="submit" variant="info" :disabled="!submit_possible"><b>{{ $t("signup.form.submit") }}</b></button>
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
