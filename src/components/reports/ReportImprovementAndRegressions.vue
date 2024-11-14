<template>
  <content-block>
    <h2>{{ $t("report.improvement-regressions.title") }}</h2>
    <div v-if="!comparison.previous_report_available">
      <loading :loading="loading"/>
      {{ $t("report.improvement-regressions.no_changes") }}
    </div>
    <div v-else>
      <loading :loading="loading"/>
      <p>{{ $t("report.improvement-regressions.days_ago", [comparison.days_between_current_and_previous_report]) }}</p>

      <ul>
        <li><img src="/static_frontend/images/report_comparison_improved.png"> {{ comparison.improvement }}
          {{ $t("report.improvement-regressions.improvement") }}
        </li>
        <li><img src="/static_frontend/images/report_comparison_regressed.png"> {{ comparison.regression }}
          {{ $t("report.improvement-regressions.regression") }}
        </li>
        <li>• {{ comparison.neutral }} {{ $t("report.improvement-regressions.neutral") }}</li>
      </ul>

      <div v-if="comparison.domains_exclusive_in_current_report.length">
        <b>{{ $t("report.improvement-regressions.domains_exclusive_current") }}</b>: {{ comparison.domains_exclusive_in_current_report.join(", ") }}
      </div>
      <div v-if="comparison.domains_exclusive_in_other_report.length">
        <b>{{ $t("report.improvement-regressions.domain_exclusive_other") }}</b>: {{ comparison.domains_exclusive_in_other_report.join(", ") }}
      </div>

      <!-- <ReportImprovementAndRegressionsTable :items="sample_data" /> -->
      <!-- todo: is this the same data? -->
      <b-tabs
        v-if="comparison.comparison_table_improvement.length > 0 || comparison.comparison_table_regression.length > 0">
        <b-tab title="Domeinen met verbeteringen" v-if="comparison.comparison_table_improvement.length > 0">
          <template #title>
            <img src="/static_frontend/images/report_comparison_improved.png"> {{$t("report.improvement-regressions.domains_with_improvements")}}
          </template>
          <ReportImprovementAndRegressionsTable :items="comparison.comparison_table_improvement" />
        </b-tab>
        <b-tab title="Domeinen met verslechteringen" v-if="comparison.comparison_table_regression.length > 0">
          <template #title>
            <img src="/static_frontend/images/report_comparison_regressed.png"> {{$t("report.improvement-regressions.domains_with_regressions")}}
          </template>
          <ReportImprovementAndRegressionsTable :items="comparison.comparison_table_regression" />
        </b-tab>
        <!-- Some simple test data: -->
        <!-- <b-tab title="Domeinen met verslechteringen">
          <template #title>
            <img src="/static_frontend/images/report_comparison_regressed.png"> {{$t("domains_with_regressions")}}
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
        "url": "example.com",
        "computed_suffix": "com",
        "computed_domain": "example",
        "computed_subdomain": "",
        "computed_domain_and_suffix": "example.com",
        "test_results_from_internet_nl_available": true,
        "changes": {
          "improvement": 1,
          "regression": 0,
          "neutral": 35,
          "improved_metrics": ["internet_nl_web_https_tls_ocsp"],
          "regressed_metrics": [],
          "neutral_metrics": ["internet_nl_web_ipv6_ws_address", "internet_nl_web_https_tls_cipherorder", "internet_nl_web_https_tls_ciphers", "internet_nl_web_appsecpriv_securitytxt", "internet_nl_web_appsecpriv_csp", "internet_nl_web_appsecpriv_referrer_policy", "internet_nl_web_appsecpriv_x_frame_options", "internet_nl_web_https_dane_exist", "internet_nl_web_dnssec_valid", "internet_nl_web_https_tls_0rtt", "internet_nl_web_https_cert_sig", "internet_nl_web_ipv6_ns_address", "internet_nl_web_dnssec_exist", "internet_nl_web_https_tls_secreneg", "internet_nl_web_https_tls_compress", "internet_nl_web_https_http_redirect", "internet_nl_web_https_http_hsts", "internet_nl_web_https_http_available", "internet_nl_web_https_tls_keyexchange", "internet_nl_web_ns_rpki_exists", "internet_nl_web_https_http_compress", "internet_nl_web_ipv6_ns_reach", "internet_nl_web_ns_rpki_valid", "internet_nl_web_https_cert_domain", "internet_nl_web_https_dane_valid", "internet_nl_web_rpki_exists", "internet_nl_web_https_cert_chain", "internet_nl_web_ipv6_ws_reach", "internet_nl_web_https_tls_clientreneg", "internet_nl_web_https_tls_version", "internet_nl_web_appsecpriv_x_content_type_options", "internet_nl_web_https_tls_keyexchangehash", "internet_nl_web_rpki_valid", "internet_nl_web_https_cert_pubkey", "internet_nl_web_ipv6_ws_similar"]
        },
        "old": {"report": "https://dev.batch.internet.nl/site/example.com/123456/", "score": 79},
        "new": {"report": "https://dev.batch.internet.nl/site/example.com/654321/", "score": 79}
      }, {
        "url": "test.com",
        "computed_suffix": "com",
        "computed_domain": "test",
        "computed_subdomain": "",
        "computed_domain_and_suffix": "test.com",
        "test_results_from_internet_nl_available": true,
        "changes": {
          "improvement": 3,
          "regression": 3,
          "neutral": 30,
          "improved_metrics": ["internet_nl_web_https_tls_0rtt", "internet_nl_web_https_tls_cipherorder", "internet_nl_web_https_tls_ciphers"],
          "regressed_metrics": ["internet_nl_web_appsecpriv_x_content_type_options", "internet_nl_web_https_http_compress", "internet_nl_web_https_tls_ocsp"],
          "neutral_metrics": ["internet_nl_web_dnssec_exist", "internet_nl_web_https_http_hsts", "internet_nl_web_appsecpriv_securitytxt", "internet_nl_web_appsecpriv_csp", "internet_nl_web_appsecpriv_referrer_policy", "internet_nl_web_appsecpriv_x_frame_options", "internet_nl_web_https_dane_exist", "internet_nl_web_ipv6_ws_address", "internet_nl_web_dnssec_valid", "internet_nl_web_https_cert_sig", "internet_nl_web_ipv6_ns_address", "internet_nl_web_https_tls_secreneg", "internet_nl_web_https_tls_compress", "internet_nl_web_https_http_redirect", "internet_nl_web_https_http_available", "internet_nl_web_https_tls_keyexchange", "internet_nl_web_ns_rpki_exists", "internet_nl_web_ipv6_ns_reach", "internet_nl_web_ns_rpki_valid", "internet_nl_web_https_cert_domain", "internet_nl_web_https_dane_valid", "internet_nl_web_rpki_exists", "internet_nl_web_https_cert_chain", "internet_nl_web_ipv6_ws_reach", "internet_nl_web_https_tls_clientreneg", "internet_nl_web_https_tls_version", "internet_nl_web_https_tls_keyexchangehash", "internet_nl_web_rpki_valid", "internet_nl_web_https_cert_pubkey", "internet_nl_web_ipv6_ws_similar"]
        },
        "old": {"report": "https://dev.batch.internet.nl/site/test.com/130494/", "score": 66},
        "new": {"report": "https://dev.batch.internet.nl/site/test.com/133519/", "score": 70}
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
        "url": "example.nl",
        "computed_suffix": "nl",
        "computed_domain": "example",
        "computed_subdomain": "",
        "computed_domain_and_suffix": "example.nl",
        "test_results_from_internet_nl_available": true,
        "changes": {
          "improvement": 2,
          "regression": 0,
          "neutral": 34,
          "improved_metrics": ["internet_nl_web_https_tls_cipherorder", "internet_nl_web_https_tls_ciphers"],
          "regressed_metrics": [],
          "neutral_metrics": ["internet_nl_web_dnssec_exist", "internet_nl_web_https_http_redirect", "internet_nl_web_https_http_hsts", "internet_nl_web_https_tls_keyexchange", "internet_nl_web_appsecpriv_x_content_type_options", "internet_nl_web_appsecpriv_securitytxt", "internet_nl_web_appsecpriv_csp", "internet_nl_web_appsecpriv_referrer_policy", "internet_nl_web_appsecpriv_x_frame_options", "internet_nl_web_https_tls_ocsp", "internet_nl_web_https_dane_exist", "internet_nl_web_ipv6_ws_address", "internet_nl_web_dnssec_valid", "internet_nl_web_https_tls_0rtt", "internet_nl_web_https_cert_sig", "internet_nl_web_ipv6_ns_address", "internet_nl_web_https_tls_secreneg", "internet_nl_web_https_tls_compress", "internet_nl_web_https_http_available", "internet_nl_web_ns_rpki_exists", "internet_nl_web_https_http_compress", "internet_nl_web_ipv6_ns_reach", "internet_nl_web_ns_rpki_valid", "internet_nl_web_https_cert_domain", "internet_nl_web_https_dane_valid", "internet_nl_web_rpki_exists", "internet_nl_web_https_cert_chain", "internet_nl_web_ipv6_ws_reach", "internet_nl_web_https_tls_clientreneg", "internet_nl_web_https_tls_version", "internet_nl_web_https_tls_keyexchangehash", "internet_nl_web_rpki_valid", "internet_nl_web_https_cert_pubkey", "internet_nl_web_ipv6_ws_similar"]
        },
        "old": {"report": "https://dev.batch.internet.nl/site/example.nl/130506/", "score": 65},
        "new": {"report": "https://dev.batch.internet.nl/site/example.nl/133555/", "score": 68}
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
