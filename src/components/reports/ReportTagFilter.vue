<style scoped>
.firstbutton {
  border-radius: 4px 0 0 4px !important;
}

.lastbutton {
  border-radius: 0 4px 4px 0 !important;
}

.normalbutton {
  border-radius: 4px 4px 4px 4px !important;
}
</style>
<template>
  <div v-if="available_tags.length > 0">

    <small>{{ $t('tag_explanation' )}}</small>

    <loading :loading="loading"/>

    <b-input-group class="mb-2">

      <v-select :options="available_tags" v-model="selected_tags" multiple taggable class="w-75"
                :placeholder="$t('filter_by_tag')">
        <template v-slot:option="option">
          <tag :value="option.label"/>
        </template>

        <template #selected-option-container="{ option, deselect, multiple}">
          <div class="vs__selected">
            <tag :value="option.label"/>
            <button @mousedown.stop v-if="multiple" class="vs_deselect" type="button" @click="deselect(option)" ref="deselectButtons"
                    :title="`Deselect ${option.label}`" :aria-label="`Deselect ${option.label}`">❌
            </button>
          </div>
        </template>

      </v-select>
      <b-input-group-append>
        <b-button @click="load" variant="info" class="lastbutton">🔁 <span class="sr-only">Reload</span></b-button>
      </b-input-group-append>

    </b-input-group>

    <template v-if="$store.state.user.is_superuser">
      <b-row>
        <b-col>
          <label for="datepicker">
            <b-badge pill variant="info">expert feature</b-badge>
            Date of report</label>
          <b-input-group class="mb-2">
            <b-form-datepicker id="datepicker" v-model="custom_date"></b-form-datepicker>
            <b-input-group-append>
              <b-button @click="custom_date = null" variant="info" class="lastbutton">❌ <span
                  class="sr-only">Clear</span>
              </b-button>
            </b-input-group-append>
          </b-input-group>

        </b-col>
        <b-col>
          <label for="timepicker">
            <b-badge pill variant="info">expert feature</b-badge>
            Time of report</label>
          <b-input-group class="mb-2">
            <b-form-timepicker id="timepicker" hourCycle="23h" :hour12="false"
                               v-model="custom_time"></b-form-timepicker>
            <b-input-group-append>
              <b-button @click="custom_time = null" variant="info" class="lastbutton">❌ <span
                  class="sr-only">Clear</span>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>

    </template>


    <b-button variant="danger" @click="clear" class="normalbutton mr-2">Reset</b-button>
    <b-button variant="success" @click="apply" class="normalbutton">Apply</b-button>


    <b-button variant="secondary" @click="save_ad_hoc_report" class="normalbutton float-right">🌟 Save as new report
    </b-button>

    <server-response :response="server_response" class="mt-2"></server-response>

  </div>
</template>

<script>
import http from "@/httpclient";
import Tag from "@/components/domains/domain/tag";
import {mapState} from 'vuex'

export default {
  name: "ReportTagFilter",
  components: {Tag},
  mounted() {
    this.load();
    // empty list of selected tags on reloads etc to make the UI more intuitive:
    this.$store.commit("set_tags", []);
    this.selected_tags = this.$store.state.tags;
    this.custom_date = this.$store.state.ad_hoc_report_custom_date;
    this.custom_time = this.$store.state.ad_hoc_report_custom_time;
  },
  data() {
    return {
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
    this.$store.commit("set_tags", []);
  },
  props: {
    urllist_id: {type: Number, required: true}
  },
  methods: {
    clear() {
      this.$store.commit("set_tags", []);
      this.$store.commit("set_ad_hoc_report_custom_date", null);
      this.$store.commit("set_ad_hoc_report_custom_time", null);
      this.selected_tags = [];
      this.$emit('tags_applied')
    },
    load() {
      this.loading = true;
      http.get(`data/urllist/tag/list/${this.urllist_id}/`).then(response => {
        // convert to: {'code': label, 'label': label} -> otherwise deselection doesn't work.
        this.available_tags = response.data.map(item => ({code: item, label: item}))
        this.loading = false;
      });
    },
    apply() {
      this.$store.commit("set_tags", this.selected_tags.map(item => item.label));
      this.$store.commit("set_ad_hoc_report_custom_date", this.custom_date);
      this.$store.commit("set_ad_hoc_report_custom_time", this.custom_time);
      this.$emit('tags_applied')
    },
    save_ad_hoc_report() {
      http.post(`/data/report/ad_hoc_save/${this.$store.state.report_ids[0]}/`,
          {tags: this.selected_tags.map(item => item.label), custom_date: this.custom_date, custom_time: this.custom_time}).then(response => {
        // The report might be empty, because the wrong code has been sent:
        // if the report has been saved, then reload the list report list and give a success message
        this.server_response = response.data;
        this.$emit('ad-report-saved')
      });
    }
  },
  ...mapState(['report_ids', 'tags']),
}
</script>
<i18n>
{
  "en": {
    "tag_explanation": "This report supports labels. Labels can be used to filter the data in the report and create new sub-reports based on the selected tags. Filtering happens directly on the database, so this may take a while before it's rendered. Selecting multiple tags means that they are all applied per domain.",
    "filter_by_tag": "-- filter by label"
  },
  "nl": {
    "tag_explanation": "Dit rapport ondersteund label, hierop kan worden gefilterd. Dit gebeurd direct op de database, daardoor kan het even duren voordat het filter is toegepast. Meerdere labels selecteren betekent dat deze per domein allemaal worden gebruikt.",
    "filter_by_tag": "-- filter op label"
  }
}
</i18n>