<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div id="report-template">
    <content-block class="do-not-print">
      <h1>
        <b-icon icon="file-bar-graph"/>
        {{ $t("title") }}
      </h1>
      <p>{{ $t("intro") }}</p>

      <report-selection @tags_applied="apply_tags"/>

    </content-block>

    <loading :loading="reports_to_load > 0"></loading>

    <div v-if="reports.length > 0 && reports_to_load === 0">

      <template v-if="!tags_applied">
        <report-download :report="report" v-for="report in shallow_reports" :key="`d${report.id}`"></report-download>
        <!-- create a shallow report that can be mutated and does not contain the full data, which saves a lot of memory. -->
        <sharing-configuration
            :report="report" v-for="report in shallow_reports"
            :key="`shared_report_${report.id}`"></sharing-configuration>
      </template>

      <content-block>
        <report-header :reports="shallow_reports"/>
      </content-block>

      <b-tabs variant="info" nav-class="">

        <b-tab  :title="$t('tab_metrics')" lazy>


          <!-- The table can show up to two reports (the first as the source, the second as a comparison). -->
          <content-block v-if="reports.length < 3" class="start-on-new-page">
            <ReportTableVirtualList :reports="reports" :load_comparison_with_current="!tags_applied"/>

            <!--
             <b-tabs>
               <b-tab title="Origineel">
                 <ReportTable :reports="reports" :load_comparison_with_current="!tags_applied"/>
               </b-tab>
               <b-tab title="BootstrapVue" lazy>
                 <p>Een tabeloverzicht met standaard componenten. Werkt redelijk vlot tot 10.000 domeinen, zitten er nu 5000 in.
                    Eerste laadtijd is het maken van deze 5000 records.
                 Printen, sorteren, zoeken, documentatie en toegankelijkheid zitten er standaard in. Let op de sticky headers
                   bij het scrollen, vooral goed zichtbaar bij HTTPS metingen. In deze demo zitten 5000 records en het
                   eet best wat memory.
                 </p>
                 <ReportTableBv :reports="reports" :load_comparison_with_current="!tags_applied" />
               </b-tab>
               <b-tab title="Virtual List" lazy>
                 <p>Het origineel maar dan als virtual list.
                   Bevat ook 5000 items. Eerste laadtijd is het maken van deze 5000 records. Bij https metingen is het lastig om de kolommen gelijk te laten lopen met de inhoud van de tabel.
                   Het moet uitgezocht worden hoe het scrollen van de tabel ook de headers mee laat scrollen. Sticky headers aan de linkerkant
                   is nog niet gelukt. Zoeken en sorteren werken vlot. Printen van de huidige set werkt niet voldoende nog.
                 </p>

               </b-tab>
             </b-tabs>-->
          </content-block>
        </b-tab>


        <b-tab :title="$t('tab_graphs')" lazy>
          <ReportCharts :reports="reports" :show_timeline="!tags_applied"/>
        </b-tab>
        <b-tab :title="$t('tab_changes')" lazy>
          <ReportImprovementAndRegressions :report_id="reports[0].id"/>
        </b-tab>


      </b-tabs>

    </div>

  </div>
</template>

<script>
import ReportCharts from '@/components/reports/ReportCharts'

import ReportTableVirtualList from '@/components/reports/ReportTableVirtualList'
import report_mixin from '@/components/reports/report_mixin'
import report_mixin_2 from '@/components/reports/report_mixin_2'
import ReportHeader from '@/components/reports/ReportHeader'
import ReportDownload from '@/components/reports/ReportDownload'
import ReportSelection from "@/components/reports/ReportSelection";
import {mapState} from 'vuex'
import SharingConfiguration from '@/components/reports/SharingConfiguration'
import ReportImprovementAndRegressions from "@/components/reports/ReportImprovementAndRegressions";

export default {
  components: {
    ReportImprovementAndRegressions,
    ReportSelection,
    ReportCharts,

    ReportHeader,
    ReportDownload,
    SharingConfiguration,
    ReportTableVirtualList
  },
  mixins: [report_mixin, report_mixin_2],
  name: 'report',
  data() {
    return {
      // list of report ids that should be shown as a report
      requested_report_ids: [],
      tags_applied: false,
    }
  },

  mounted() {
    this.load_visible_metrics();
    // only do this when there is no report selection component, otherwise let that component handle it...
    let router_params = this.$router.history.current.params;
    // the route to this component can determine what is shown
    this.requested_report_ids = [parseInt(router_params.report), parseInt(router_params.compare_with)].filter(Boolean);
  },
  methods: {
    apply_tags() {
      this.tags_applied = this.tags.length > 0;
      this.load_reports_by_ids(this.report_ids, {
        tags: this.tags,
        custom_date: this.ad_hoc_report_custom_date,
        custom_time: this.ad_hoc_report_custom_time
      });
    }
  },

  watch: {

    // Report selection control can select a number of reports
    report_ids(report_ids) {
      this.requested_report_ids = report_ids;
    },

    requested_report_ids(report_ids) {
      this.tags_applied = false;
      this.load_reports_by_ids(report_ids, {});
    },
  },
  computed: {
    report_category() {
      if (this.reports.length > 0)
        return this.reports[0].report_type;
      return ""
    },
    ...mapState(['report_ids', 'tags', 'ad_hoc_report_custom_date', 'ad_hoc_report_custom_time']),
  }
}
</script>
<i18n>
{
  "en": {
    "settings": "Select visible metrics",
    "title": "Reports",
    "intro": "It is possible to select one or multiple reports. Selecting a single report shows all data of that report, including graphs and a table with detailed results. Selecting two reports, a comparison is made between these reports in the graphs and detailed result. Selecting more than two reports, only graphs are shown.",
    "tab_metrics": "Metrics table",
    "tab_graphs": "Graphs",
    "tab_changes": "Changes"
  },
  "nl": {
    "settings": "Selecteer zichtbare meetwaarden",
    "title": "Rapporten",
    "intro": "Het is mogelijk om meerdere rapporten te selecteren. Bij het selecteren van een enkel rapport wordt alle relevante informatie hierover getoond. Bij het selecteren van twee rapporten wordt een vergelijking gemaakt: zowel in de grafieken als in de detail tabel. Bij het selecteren van meer dan twee rapporten zijn alleen de grafieken zichtbaar.",
    "tab_metrics": "Meetwaardentabel",
    "tab_graphs": "Grafieken",
    "tab_changes": "Veranderingen"
  }
}
</i18n>