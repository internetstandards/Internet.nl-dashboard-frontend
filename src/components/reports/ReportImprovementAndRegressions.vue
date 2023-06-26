<template>
  <content-block>
    <h2>{{ $t('title') }}</h2>
    <div v-if="!comparison.previous_report_available">
      <loading :loading="loading"/>
      {{ $t('no_changes') }}
    </div>
    <div v-else>
      <loading :loading="loading"/>
      <p>{{ $t('days_ago', [comparison.days_between_current_and_previous_report]) }}</p>

      <ul>
        <li><img src="/static_frontend/images/report_comparison_improved.png"> {{ comparison.improvement }}
          {{ $t('improvement') }}
        </li>
        <li><img src="/static_frontend/images/report_comparison_regressed.png"> {{ comparison.regression }}
          {{ $t('regression') }}
        </li>
        <li>• {{ comparison.neutral }} {{ $t('neutral') }}</li>
      </ul>

      <div v-if="comparison.domains_exclusive_in_current_report.length">
        <b>{{ $t('domains_exclusive_current') }}</b>: {{ comparison.domains_exclusive_in_current_report.join(", ") }}
      </div>
      <div v-if="comparison.domains_exclusive_in_other_report.length">
        <b>{{ $t('domain_exclusive_other') }}</b>: {{ comparison.domains_exclusive_in_other_report.join(", ") }}
      </div>

      <!-- <ReportImprovementAndRegressionsTable :items="sample_data" /> -->
      <!-- todo: is this the same data? -->
      <b-tabs
        v-if="comparison.comparison_table_improvement.length > 0 || comparison.comparison_table_regression.length > 0">
        <b-tab title="Domeinen met verbeteringen" v-if="comparison.comparison_table_improvement.length > 0">
          <template #title>
            <img src="/static_frontend/images/report_comparison_improved.png"> {{$t('domains_with_improvements')}}
          </template>
          <ReportImprovementAndRegressionsTable :items="comparison.comparison_table_improvement" />
        </b-tab>
        <b-tab title="Domeinen met verslechteringen" v-if="comparison.comparison_table_regression.length > 0">
          <template #title>
            <img src="/static_frontend/images/report_comparison_regressed.png"> {{$t('domains_with_regressions')}}
          </template>
          <ReportImprovementAndRegressionsTable :items="comparison.comparison_table_regression" />
        </b-tab>
        <!-- Some simple test data: -->
        <!-- <b-tab title="Domeinen met verslechteringen">
          <template #title>
            <img src="/static_frontend/images/report_comparison_regressed.png"> {{$t('domains_with_regressions')}}
          </template>
          <ReportImprovementAndRegressionsTable :items="sample_data" />
        </b-tab>-->
      </b-tabs>
    </div>

  </content-block>
</template>

<script>
import http from "@/httpclient";
import ReportImprovementAndRegressionsTable from "@/components/reports/ReportImprovementAndRegressionsTable";

export default {
  name: "ReportImprovementAndRegressions",
  components: {ReportImprovementAndRegressionsTable},
  props: {
    report_id: {
      type: Number,
      required: true
    }
  },
  mounted() {
    this.load();
  },
  data() {
    return {
      sample_data: [{
        "url": "paulaschoice-eu.com",
        "computed_suffix": "com",
        "computed_domain": "paulaschoice-eu",
        "computed_subdomain": "",
        "computed_domain_and_suffix": "paulaschoice-eu.com",
        "test_results_from_internet_nl_available": true,
        "changes": {
          "improvement": 1,
          "regression": 0,
          "neutral": 35,
          "improved_metrics": ["internet_nl_web_https_tls_ocsp"],
          "regressed_metrics": [],
          "neutral_metrics": ["internet_nl_web_ipv6_ws_address", "internet_nl_web_https_tls_cipherorder", "internet_nl_web_https_tls_ciphers", "internet_nl_web_appsecpriv_securitytxt", "internet_nl_web_appsecpriv_csp", "internet_nl_web_appsecpriv_referrer_policy", "internet_nl_web_appsecpriv_x_frame_options", "internet_nl_web_https_dane_exist", "internet_nl_web_dnssec_valid", "internet_nl_web_https_tls_0rtt", "internet_nl_web_https_cert_sig", "internet_nl_web_ipv6_ns_address", "internet_nl_web_dnssec_exist", "internet_nl_web_https_tls_secreneg", "internet_nl_web_https_tls_compress", "internet_nl_web_https_http_redirect", "internet_nl_web_https_http_hsts", "internet_nl_web_https_http_available", "internet_nl_web_https_tls_keyexchange", "internet_nl_web_ns_rpki_exists", "internet_nl_web_https_http_compress", "internet_nl_web_ipv6_ns_reach", "internet_nl_web_ns_rpki_valid", "internet_nl_web_https_cert_domain", "internet_nl_web_https_dane_valid", "internet_nl_web_rpki_exists", "internet_nl_web_https_cert_chain", "internet_nl_web_ipv6_ws_reach", "internet_nl_web_https_tls_clientreneg", "internet_nl_web_https_tls_version", "internet_nl_web_appsecpriv_x_content_type_options", "internet_nl_web_https_tls_keyexchangehash", "internet_nl_web_rpki_valid", "internet_nl_web_https_cert_pubkey", "internet_nl_web_ipv6_ws_similar"]
        },
        "old": {"report": "https://dev.batch.internet.nl/site/paulaschoice-eu.com/130534/", "score": 79},
        "new": {"report": "https://dev.batch.internet.nl/site/paulaschoice-eu.com/133548/", "score": 79}
      }, {
        "url": "scoupy.com",
        "computed_suffix": "com",
        "computed_domain": "scoupy",
        "computed_subdomain": "",
        "computed_domain_and_suffix": "scoupy.com",
        "test_results_from_internet_nl_available": true,
        "changes": {
          "improvement": 3,
          "regression": 3,
          "neutral": 30,
          "improved_metrics": ["internet_nl_web_https_tls_0rtt", "internet_nl_web_https_tls_cipherorder", "internet_nl_web_https_tls_ciphers"],
          "regressed_metrics": ["internet_nl_web_appsecpriv_x_content_type_options", "internet_nl_web_https_http_compress", "internet_nl_web_https_tls_ocsp"],
          "neutral_metrics": ["internet_nl_web_dnssec_exist", "internet_nl_web_https_http_hsts", "internet_nl_web_appsecpriv_securitytxt", "internet_nl_web_appsecpriv_csp", "internet_nl_web_appsecpriv_referrer_policy", "internet_nl_web_appsecpriv_x_frame_options", "internet_nl_web_https_dane_exist", "internet_nl_web_ipv6_ws_address", "internet_nl_web_dnssec_valid", "internet_nl_web_https_cert_sig", "internet_nl_web_ipv6_ns_address", "internet_nl_web_https_tls_secreneg", "internet_nl_web_https_tls_compress", "internet_nl_web_https_http_redirect", "internet_nl_web_https_http_available", "internet_nl_web_https_tls_keyexchange", "internet_nl_web_ns_rpki_exists", "internet_nl_web_ipv6_ns_reach", "internet_nl_web_ns_rpki_valid", "internet_nl_web_https_cert_domain", "internet_nl_web_https_dane_valid", "internet_nl_web_rpki_exists", "internet_nl_web_https_cert_chain", "internet_nl_web_ipv6_ws_reach", "internet_nl_web_https_tls_clientreneg", "internet_nl_web_https_tls_version", "internet_nl_web_https_tls_keyexchangehash", "internet_nl_web_rpki_valid", "internet_nl_web_https_cert_pubkey", "internet_nl_web_ipv6_ws_similar"]
        },
        "old": {"report": "https://dev.batch.internet.nl/site/scoupy.com/130494/", "score": 66},
        "new": {"report": "https://dev.batch.internet.nl/site/scoupy.com/133519/", "score": 70}
      }, {
        "url": "ster.nl",
        "computed_suffix": "nl",
        "computed_domain": "ster",
        "computed_subdomain": "",
        "computed_domain_and_suffix": "ster.nl",
        "test_results_from_internet_nl_available": true,
        "changes": {
          "improvement": 1,
          "regression": 0,
          "neutral": 35,
          "improved_metrics": ["internet_nl_web_https_tls_ocsp"],
          "regressed_metrics": [],
          "neutral_metrics": ["internet_nl_web_ipv6_ws_address", "internet_nl_web_https_tls_ciphers", "internet_nl_web_appsecpriv_securitytxt", "internet_nl_web_appsecpriv_csp", "internet_nl_web_https_http_compress", "internet_nl_web_https_dane_exist", "internet_nl_web_dnssec_valid", "internet_nl_web_https_tls_0rtt", "internet_nl_web_https_cert_sig", "internet_nl_web_ipv6_ns_address", "internet_nl_web_dnssec_exist", "internet_nl_web_https_tls_secreneg", "internet_nl_web_https_tls_compress", "internet_nl_web_https_http_redirect", "internet_nl_web_https_http_hsts", "internet_nl_web_https_http_available", "internet_nl_web_https_tls_keyexchange", "internet_nl_web_ns_rpki_exists", "internet_nl_web_ipv6_ns_reach", "internet_nl_web_ns_rpki_valid", "internet_nl_web_appsecpriv_x_frame_options", "internet_nl_web_https_cert_domain", "internet_nl_web_https_dane_valid", "internet_nl_web_https_tls_cipherorder", "internet_nl_web_rpki_exists", "internet_nl_web_https_cert_chain", "internet_nl_web_ipv6_ws_reach", "internet_nl_web_https_tls_clientreneg", "internet_nl_web_https_tls_version", "internet_nl_web_appsecpriv_x_content_type_options", "internet_nl_web_https_tls_keyexchangehash", "internet_nl_web_rpki_valid", "internet_nl_web_appsecpriv_referrer_policy", "internet_nl_web_https_cert_pubkey", "internet_nl_web_ipv6_ws_similar"]
        },
        "old": {"report": "https://dev.batch.internet.nl/site/ster.nl/130522/", "score": 81},
        "new": {"report": "https://dev.batch.internet.nl/site/ster.nl/133585/", "score": 81}
      }, {
        "url": "transavia.com",
        "computed_suffix": "com",
        "computed_domain": "transavia",
        "computed_subdomain": "",
        "computed_domain_and_suffix": "transavia.com",
        "test_results_from_internet_nl_available": true,
        "changes": {
          "improvement": 1,
          "regression": 0,
          "neutral": 35,
          "improved_metrics": ["internet_nl_web_ipv6_ns_address"],
          "regressed_metrics": [],
          "neutral_metrics": ["internet_nl_web_ipv6_ws_address", "internet_nl_web_dnssec_exist", "internet_nl_web_https_http_redirect", "internet_nl_web_https_http_hsts", "internet_nl_web_ns_rpki_exists", "internet_nl_web_ns_rpki_valid", "internet_nl_web_appsecpriv_x_content_type_options", "internet_nl_web_https_tls_ciphers", "internet_nl_web_appsecpriv_securitytxt", "internet_nl_web_appsecpriv_csp", "internet_nl_web_appsecpriv_referrer_policy", "internet_nl_web_appsecpriv_x_frame_options", "internet_nl_web_https_dane_exist", "internet_nl_web_dnssec_valid", "internet_nl_web_https_tls_0rtt", "internet_nl_web_https_cert_sig", "internet_nl_web_https_tls_secreneg", "internet_nl_web_https_tls_compress", "internet_nl_web_https_http_available", "internet_nl_web_https_tls_keyexchange", "internet_nl_web_https_http_compress", "internet_nl_web_ipv6_ns_reach", "internet_nl_web_https_tls_ocsp", "internet_nl_web_https_cert_domain", "internet_nl_web_https_dane_valid", "internet_nl_web_https_tls_cipherorder", "internet_nl_web_rpki_exists", "internet_nl_web_https_cert_chain", "internet_nl_web_ipv6_ws_reach", "internet_nl_web_https_tls_clientreneg", "internet_nl_web_https_tls_version", "internet_nl_web_https_tls_keyexchangehash", "internet_nl_web_rpki_valid", "internet_nl_web_https_cert_pubkey", "internet_nl_web_ipv6_ws_similar"]
        },
        "old": {"report": "https://dev.batch.internet.nl/site/transavia.com/130508/", "score": 42},
        "new": {"report": "https://dev.batch.internet.nl/site/transavia.com/133491/", "score": 49}
      }, {
        "url": "vangoghmuseum.nl",
        "computed_suffix": "nl",
        "computed_domain": "vangoghmuseum",
        "computed_subdomain": "",
        "computed_domain_and_suffix": "vangoghmuseum.nl",
        "test_results_from_internet_nl_available": true,
        "changes": {
          "improvement": 1,
          "regression": 0,
          "neutral": 35,
          "improved_metrics": ["internet_nl_web_https_tls_ocsp"],
          "regressed_metrics": [],
          "neutral_metrics": ["internet_nl_web_ipv6_ws_address", "internet_nl_web_dnssec_exist", "internet_nl_web_https_http_hsts", "internet_nl_web_https_tls_version", "internet_nl_web_appsecpriv_x_content_type_options", "internet_nl_web_https_tls_ciphers", "internet_nl_web_appsecpriv_securitytxt", "internet_nl_web_appsecpriv_csp", "internet_nl_web_appsecpriv_referrer_policy", "internet_nl_web_appsecpriv_x_frame_options", "internet_nl_web_https_dane_exist", "internet_nl_web_dnssec_valid", "internet_nl_web_https_tls_0rtt", "internet_nl_web_https_cert_sig", "internet_nl_web_ipv6_ns_address", "internet_nl_web_https_tls_secreneg", "internet_nl_web_https_tls_compress", "internet_nl_web_https_http_redirect", "internet_nl_web_https_http_available", "internet_nl_web_https_tls_keyexchange", "internet_nl_web_ns_rpki_exists", "internet_nl_web_https_http_compress", "internet_nl_web_ipv6_ns_reach", "internet_nl_web_ns_rpki_valid", "internet_nl_web_https_cert_domain", "internet_nl_web_https_dane_valid", "internet_nl_web_https_tls_cipherorder", "internet_nl_web_rpki_exists", "internet_nl_web_https_cert_chain", "internet_nl_web_ipv6_ws_reach", "internet_nl_web_https_tls_clientreneg", "internet_nl_web_https_tls_keyexchangehash", "internet_nl_web_rpki_valid", "internet_nl_web_https_cert_pubkey", "internet_nl_web_ipv6_ws_similar"]
        },
        "old": {"report": "https://dev.batch.internet.nl/site/vangoghmuseum.nl/130284/", "score": 52},
        "new": {"report": "https://dev.batch.internet.nl/site/vangoghmuseum.nl/133130/", "score": 52}
      }, {
        "url": "yarden.nl",
        "computed_suffix": "nl",
        "computed_domain": "yarden",
        "computed_subdomain": "",
        "computed_domain_and_suffix": "yarden.nl",
        "test_results_from_internet_nl_available": true,
        "changes": {
          "improvement": 2,
          "regression": 0,
          "neutral": 34,
          "improved_metrics": ["internet_nl_web_https_tls_cipherorder", "internet_nl_web_https_tls_ciphers"],
          "regressed_metrics": [],
          "neutral_metrics": ["internet_nl_web_dnssec_exist", "internet_nl_web_https_http_redirect", "internet_nl_web_https_http_hsts", "internet_nl_web_https_tls_keyexchange", "internet_nl_web_appsecpriv_x_content_type_options", "internet_nl_web_appsecpriv_securitytxt", "internet_nl_web_appsecpriv_csp", "internet_nl_web_appsecpriv_referrer_policy", "internet_nl_web_appsecpriv_x_frame_options", "internet_nl_web_https_tls_ocsp", "internet_nl_web_https_dane_exist", "internet_nl_web_ipv6_ws_address", "internet_nl_web_dnssec_valid", "internet_nl_web_https_tls_0rtt", "internet_nl_web_https_cert_sig", "internet_nl_web_ipv6_ns_address", "internet_nl_web_https_tls_secreneg", "internet_nl_web_https_tls_compress", "internet_nl_web_https_http_available", "internet_nl_web_ns_rpki_exists", "internet_nl_web_https_http_compress", "internet_nl_web_ipv6_ns_reach", "internet_nl_web_ns_rpki_valid", "internet_nl_web_https_cert_domain", "internet_nl_web_https_dane_valid", "internet_nl_web_rpki_exists", "internet_nl_web_https_cert_chain", "internet_nl_web_ipv6_ws_reach", "internet_nl_web_https_tls_clientreneg", "internet_nl_web_https_tls_version", "internet_nl_web_https_tls_keyexchangehash", "internet_nl_web_rpki_valid", "internet_nl_web_https_cert_pubkey", "internet_nl_web_ipv6_ws_similar"]
        },
        "old": {"report": "https://dev.batch.internet.nl/site/yarden.nl/130506/", "score": 65},
        "new": {"report": "https://dev.batch.internet.nl/site/yarden.nl/133555/", "score": 68}
      }],
      loading: false,
      comparison: {
        "previous_report_available": false,
        "previous_report_average_internet_nl_score": 0,
        "current_report_average_internet_nl_score": 0,
        "compared_report_id": 0,
        "comparison_is_empty": true,
        "improvement": 0,
        "regression": 0,
        "neutral": 0,
        "comparison_report_available": false,
        "comparison_report_contains_improvement": false,
        "comparison_report_contains_regression": false,
        "days_between_current_and_previous_report": 0,
        "comparison_table_improvement": [],
        "comparison_table_regression": [],
        "domains_exclusive_in_current_report": [],
        "domains_exclusive_in_other_report": [],
      }
    }
  },
  methods: {
    //
    load() {
      this.loading = true;
      http.get(`data/report/get_improvements_and_regressions/${this.report_id}/`).then(data => {
        this.comparison = data.data;
        this.loading = false;
      });
    }
  }
}
</script>

<i18n>
{
  "en": {
    "title": "Changes",
    "improvement": "Improvements",
    "regression": "Regressions",
    "neutral": "Unchanged",
    "domains_exclusive_current": "Domeinen exclusief in het huidige rapport",
    "domains_exclusive_other": "Domeinen exclusief in het vorige rapport",
    "no_changes": "Er zijn geen gegevens beschikbaar van het vorige rapport.",
    "days_ago": "Het vorige rapport werd {0} dagen geleden gemaakt.",
    "domains_with_improvements": "Domains with improvements",
    "domains_with_regressions": "Domains with regressions"
  },
  "nl": {
    "title": "Veranderingen",
    "improvement": "Verbeteringen",
    "regression": "Verslechteringen",
    "neutral": "Ongewijzigd",
    "url": "Domein",
    "metrics": "Metingen",
    "score_from": "Score van",
    "score_to": "naar",
    "domains_with_improvements": "Domeinen met verbeteringen",
    "domains_with_regressions": "Domeinen met verslechteringen"
  }
}
</i18n>