<!-- SPDX-License-Identifier: Apache-2.0 -->
<style>
figure img {
  border: thin silver solid;
}

figcaption {
  text-align: left !important;
  font-style: italic !important;
  font-size: smaller !important;
  color: dimgray;
}

figure {

  text-indent: 0;
  border: thin #05BFD6 solid;
  margin: 0.5em;
  padding: 0.5em;
}

img.scaled {
  width: 100%;
}
</style>

<template>
  <div id="demo-template">
    <content-block>
      <h1>
        <b-icon icon="info-circle"/>
        {{ $t("title") }}
      </h1>
      <p v-html="$t('introduction')"></p>
      <p v-html='$t("contact_information")'></p>
    </content-block>


    <content-block>

      <feature-row :feature="feature" :key='feature' :translation="$i18n" v-for="feature in features"/>


    </content-block>

  </div>
</template>

<script>
import FeatureRow from "@/components/FeatureRow";

export default {
  components: {FeatureRow},
  data() {
    return {
      features: ['manage_domains', 'import_domains', 'scan', 'focus_on_metrics', 'report_table', 'report_bar_chart',
      'report_timeline', 'export_spreadsheet', 'report_sharing', 'account_notifications', 'account_two_fa']
    }
  }
}
</script>
<i18n>
{
  "en": {
    "title": "Internet.nl dashboard features",
    "introduction": "The internet.nl allows bulk scans and reporting up to thousands of domains. Scan for IPv6, TLS, DMARC, SPF, DANE, DKIM, DNSSEC, HTTP Headers and more. Below is an overview of features included in the dashboard:",
    "contact_information": "To use the dashboard on internet.nl, contact: <a href='mailto:vraag@internet.nl?subject=dashboard%20access%20request'>vraag@internet.nl</a>",
    "manage_domains": {
      "title": "Bulk domain scans for web and mail",
      "introduction": "<p>Many domains can be stored in lists. These lists are configured to perform either the web or mail scan.</p><p>Using tags it's possible to filter the resulting report, and create new reports based on these filters.</p>",
      "caption": "The list has options for configuration, adding domains, direct scanning, scheduled scanning, exporting to csv and of course deletion."
    },
    "import_domains": {
      "title": "Import domains",
      "introduction": "Importing your domains is easy with either text import or spreadsheet uploads.",
      "caption": "It's also possible to upload Excel, ODS and CSV files domains. Examples are available on the upload page."
    },
    "scan": {
      "title": "Monitor scans",
      "introduction": "Scans can be performed simultaneously. The scan monitor shows the progress of each scan and allows for cancelling scans.",
      "caption": "The image shows several scans, of which one is still running. Our demo scan is finished and a report is ready."
    },
    "focus_on_metrics": {
      "title": "Configurable reports",
      "introduction": "The report is printer friendly and contains several graphs and a result table. It's even possible to download the report as a spreadsheet.",
      "caption": "All IPv6 metrics are now visible in the report. Enable or disable the entire group with one click and even include an average."
    },
    "report_timeline": {
      "title": "Track progress over time",
      "introduction": "Every time a list is scanned, the data in the timeline grows. The timeline allow comparing multiple lists over time, showing multiple lines.",
      "caption": "The timeline shows the average internet.nl score every time the same list is scanned. This helps keeping track of overall progress."
    },
    "report_bar_chart": {
      "title": "Bar charts",
      "introduction": "These bar are more versatile than meets the eye. It's possible to compare reports (up to five) and they are available for every category and subcategory (such as IPv6, DNSSEC, TLS).",
      "caption": "In this demo of course everybody has a 100% score, which is obvious. This image shows 6 bars with 100% score."
    },
    "report_table": {
      "title": "Table view, with comparison",
      "introduction": "Of course all results are visible in a table. The table is split into several categories and only shows the information that is needed. The table has a power feature: it's possible to compare data with a second report and see improvements/declines for all domains that are in both reports.",
      "caption": "The IPv6 results show that everything is correct. It's possible to filter domains and view the complete report on internet.nl. Of course sorting of results is included."
    },
    "export_spreadsheet": {
      "title": "Spreadsheet exports",
      "introduction": "The table can be exported to Excel, Libreoffice and CSV data. The Excel spreadsheet includes some statistics over the presented metrics.",
      "caption": "The Excel spreadsheet is opened in Numbers. It contains the same data as presented in the table."
    },
    "report_sharing": {
      "title": "Share reports",
      "introduction": "Reports can be shared with the world or with a select audience. Using the sharing option anyone with the link, or anyone with the password, can view the report and take action.",
      "caption": "Sharing reports look exaclty as reports while being logged in."
    },
    "account_notifications": {
      "title": "Notifications",
      "introduction": "Be notified when a scan is finished. The notification includes an overview of the scan results, including the major changes compared to the previous scan",
      "caption": "Account settings allow setting up notifications."
    },
    "account_two_fa": {
      "title": "Two factor authentication",
      "introduction": "Set up two factor authentication for your account using One Time Passwords.",
      "caption": "A QR code used to setup two factor authentication."
    },
    "contact": {
      "title": "Contact for access"
    }
  },
  "nl": {
    "title": "Internet.nl dashboard rondleiding"
  }
}

</i18n>