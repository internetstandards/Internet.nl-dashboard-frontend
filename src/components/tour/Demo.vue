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
import FeatureRow from "@/components/tour/FeatureRow";

export default {
  components: {FeatureRow},
  data() {
    return {
      features: ['manage_domains', 'import_domains', 'scan', 'focus_on_metrics', 'report_table', 'report_bar_chart',
      'report_timeline', 'export_spreadsheet', 'report_sharing', 'account_notifications']
      // account_two_fa
    }
  }
}
</script>
<i18n>
{
  "en": {
    "title": "Internet.nl dashboard features",
    "introduction": "The dashboard allows bulk scans and reporting up to thousands of domains. Scan for IPv6, TLS, DMARC, SPF, DANE, DKIM, DNSSEC, HTTP Headers and more. Below is an overview of features included in the dashboard:",
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
    }
  },
  "nl": {
    "title": "Internet.nl dashboard rondleiding",
    "introduction": "Het dashboard maakt het mogelijk duizenden internet.nl scans tegelijk uit te voeren. Meet de actuele adoptie van IPv6, TLS, DMARC, SPF, DANE, DKIM, DNSSEC, HTTP Headers en meer. Deze pagina geeft een overzicht weer van verschillende handige eigenschappen van het dashboard:",
    "contact_information": "Om gebruik te maken van het dashboard is een account nodig. Vraag deze aan via: <a href='mailto:vraag@internet.nl?subject=dashboard%20access%20request'>vraag@internet.nl</a>",
    "manage_domains": {
      "title": "Bulk domein-scans voor web en mail",
      "introduction": "<p>Domeinen worden beheerd middels lijsten. Alle domeinen in de lijst kunnen worden gescand op web, mail of beide.</p><p>Door gebruik te maken van labels kan het eindresultaat gefilterd worden. Deze deelresultaten kunnen weer als nieuwe rapporten worden opgeslagen en gedeeld.</p><p>Een lijst met domeinen kan periodiek worden gescand.</p>",
      "caption": "Een lijst met domeinen, voorzien van labels. De lijst is te bedienen met meerdere knoppen zoals: instellingen, domeinen toevoegen, direct scannen, verwijderen en automatisch toevoegen van 'www' subdomeinen."
    },
    "import_domains": {
      "title": "Domeinen importeren",
      "introduction": "Importeer domeinen als kommagescheiden tekst of met een spreadsheet. Er is ondersteuning voor zowel Excel als Open Office.",
      "caption": "In een spreadsheet staat het domein en in welke lijst(en) deze moet komen."
    },
    "scan": {
      "title": "Scan monitor",
      "introduction": "Er kunnen meerdere scans tegelijk worden uitgevoerd. De monitor toont de voortgang van alle scans.",
      "caption": "Een afgeronde en lopende scan."
    },
    "focus_on_metrics": {
      "title": "Focus op meetwaarden",
      "introduction": "Bekijk alleen de meetwaarden waarop de organisatie zich nu wel richten. Bijvoorbeeld DNSSEC of IPv6.",
      "caption": "Schakel alle afzonderlijke IPv6 meetwaarden in of uit, per stuk of tegelijk."
    },
    "report_timeline": {
      "title": "Volg de voortgang",
      "introduction": "Bij iedere scan op dezelfde lijst wordt de gemiddelde score toegevoegd aan de tijdlijn.",
      "caption": "De eerste meetwaarde begint in het midden, en is nu 52%."
    },
    "report_bar_chart": {
      "title": "Staafgrafieken",
      "introduction": "Voor iedere groep meetwaarden is er een grafiek beschikbaar. Het is zelfs mogelijk meerdere rapporten tegelijk te openen en met elkaar te vergelijken.",
      "caption": "De grafiek voor alle TLS categorien wordt getoond, waaruit blijkt dat TLS in 84% van de gevallen wordt toegepast."
    },
    "report_table": {
      "title": "Meetwaardentabel",
      "introduction": "Alle meetwaarden zijn zichtbaar in een tabel. De tabel is opgesplitst in diverse categoriën. Het is ook mogelijk de meetwaarden te vergelijken met een ander rapport, om alle afzonderlijke verbeteringen te zien.",
      "caption": "Per regel in de tabel wordt het domein, de gemiddelde internet.nl score en natuurlijk een afbeelding (en tekst) met de uitslag."
    },
    "export_spreadsheet": {
      "title": "Exporteer naar spreadsheet",
      "introduction": "Een rapport kan worden geëxporteerd naar Excel, Libre Office en kommagescheiden tekst. De Excel spreadsheet bevat ook extra berekeningen per kolom.",
      "caption": "Het spreadsheet kan ook worden geopend in andere programma's, zoals in Numbers in deze afbeelding. Hierop is net als op de tabel te zien welk domein, de score, een link naar de internet.nl site met alle metingen en de uitslag per meting"
    },
    "report_sharing": {
      "title": "Rapporten delen",
      "introduction": "<p>Rapporten kunnen online worden gedeeld, met of zonder wachtwoord. Iedereen met de link, en eventueel het wachtwoord, kan zien wat de meetwaarden zijn.</p>",
      "caption": "Een gedeeld rapport ziet er hetzelfde uit als een rapport van iemand die is ingelogd."
    },
    "account_notifications": {
      "title": "E-mail updates",
      "introduction": "Wanneer een scan is afgrond kan een e-mail worden verzonden. Hierin staat een opsomming van de resultaten. Bij een tweede scan staat er ook een vergelijking met de vorige scan.",
      "caption": "Een overzicht van account-instellingen, met daarin de mogelijkheid om notificaties in te stellen."
    },
    "account_two_fa": {
      "title": "Two factor authentication",
      "introduction": "Set up two factor authentication for your account using One Time Passwords.",
      "caption": "A QR code used to setup two factor authentication."
    }
  }
}

</i18n>