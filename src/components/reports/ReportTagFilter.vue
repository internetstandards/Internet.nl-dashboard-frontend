<template>
  <div v-if="available_tags.length > 0">

    <small>{{ $t("report.tag-filter.tag_explanation" )}}</small>

    <loading :loading="loading"/>

    <b-input-group class="mb-2">

      <v-select :options="available_tags" v-model="selected_tags" multiple taggable class="w-75"
                :placeholder='$t("report.tag-filter.filter_by_tag")'>
        <template v-slot:option="option">
          <tag :value="option.label"/>
        </template>

        <template #selected-option-container="{ option, deselect, multiple}">
          <div class="vs__selected">
            <tag :value="option.label"/>
            <b-button variant="warning" @mousedown.stop v-if="multiple" class="vs_deselect"  @click="deselect(option)" ref="deselectButtons"
                    :title="`Deselect ${option.label}`" :aria-label="`Deselect ${option.label}`">❌
            </b-button>
          </div>
        </template>

      </v-select>

        <b-button @click="load" variant="warning" class="lastbutton">🔁 <span class="visually-hidden">Reload</span></b-button>


    </b-input-group>

    <template v-if="store.user.is_superuser">
      <b-row>
        <b-col>
          <label for="datepicker">
            <b-badge variant="secondary">expert feature</b-badge>
            Date of report</label>
          <b-input-group class="mb-2">
            <b-form-input id="datepicker" type="date" v-model="custom_date"></b-form-input>

              <b-button @click="custom_date = null" variant="warning" class="lastbutton">❌ <span
                  class="visually-hidden">Clear</span>
              </b-button>

          </b-input-group>

        </b-col>
        <b-col>
          <label for="timepicker">
            <b-badge variant="secondary">expert feature</b-badge>
            Time of report</label>
          <b-input-group class="mb-2">
            <b-form-input id="timepicker" type="time" hourCycle="23h" :hour12="false"
                               v-model="custom_time"></b-form-input>

              <b-button @click="custom_time = null" variant="warning" class="lastbutton">❌ <span
                  class="visually-hidden">Clear</span>
              </b-button>

          </b-input-group>
        </b-col>
      </b-row>

    </template>


    <b-button variant="secondary" @click="clear" class="normalbutton mr-2">{{ $t("report.tag-filter.reset" )}}</b-button>&nbsp;
    <b-button variant="warning" @click="apply" class="normalbutton">{{ $t("report.tag-filter.apply" )}}</b-button>


    <b-button variant="warning" @click="save_ad_hoc_report" class="normalbutton float-end">🌟 {{ $t("report.tag-filter.save-as-new-report" )}}
    </b-button>

    <server-response :response="server_response" class="mt-2"></server-response>

  </div>
</template>

<script>
import http from "@/httpclient";
import Tag from "@/components/domains/domain/tag.vue";
import {mapState} from 'pinia';
import vSelect from 'vue-select';

import { dashboardStore } from '@/dashboardStore'

export default {
  name: "ReportTagFilter",
  components: {Tag, vSelect},
  mounted() {
    this.load();
    // empty list of selected tags on reloads etc to make the UI more intuitive:
    this.store.set_tags([]);
    this.selected_tags = this.store.tags;
    this.custom_date = this.store.ad_hoc_report_custom_date;
    this.custom_time = this.store.ad_hoc_report_custom_time;
  },
  data() {
    return {
      store: dashboardStore(),
      available_tags: [],
      selected_tags: [],
      custom_date: null,
      custom_time: null,
      loading: false,
      server_response: {},
    }
  },
  beforeDestroy() {
    // empty list of selected tags on reloads etc to make the UI more intuitive:
    this.store.set_tags([]);
  },
  props: {
    urllist_id: {type: Number, required: true}
  },
  methods: {
    clear() {
      this.store.set_tags([]);
      this.store.set_ad_hoc_report_custom_date(null);
      this.store.set_ad_hoc_report_custom_time(null);
      this.selected_tags = [];
      this.$emit('tags_applied')
    },
    load() {
      this.loading = true;
      http.get(`data/urllist/tag/list/${this.urllist_id}`).then(response => {
        // convert to: {'code': label, 'label': label} -> otherwise deselection doesn't work.
        this.available_tags = response.data.map(item => ({code: item, label: item}))
        this.loading = false;
      });
    },
    apply() {
      this.store.set_tags(this.selected_tags.map(item => item.label));
      this.store.set_ad_hoc_report_custom_date(this.custom_date);
      this.store.set_ad_hoc_report_custom_time(this.custom_time);
      this.$emit('tags_applied')
    },
    save_ad_hoc_report() {
      http.post(`/data/report/ad_hoc_save/${this.store.report_ids[0]}/`,
          {tags: this.selected_tags.map(item => item.label), custom_date: this.custom_date, custom_time: this.custom_time}).then(response => {
        // The report might be empty, because the wrong code has been sent:
        // if the report has been saved, then reload the list report list and give a success message
        this.server_response = response.data;
        this.$emit('ad-report-saved')
      });
    }
  },
  ...mapState(dashboardStore, ['report_ids', 'tags']),
}
</script>
