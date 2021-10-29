<!-- SPDX-License-Identifier: Apache-2.0 -->
<script>
// Done: order of the fields, and possible sub sub categories
// Done: allow filtering on what results to show
// Done: store filter options for reports (as generic or per report? or as a re-applicable set?) Per user account.
// Done: how to add a item for legacy views?
// Done: how to translate graphs?
import field_translations from '../FieldTranslations'
import http from "@/httpclient"

export default {
  i18n: {
    sharedMessages: field_translations,
  },

  methods: {
    alphabet_sorting: function (a, b) {
      // i already mis sorted()
      if (a.url < b.url) {
        return -1;
      }
      if (a.url > b.url) {
        return 1;
      }
      return 0;
    },

    load_visible_metrics: function () {
      const default_metric_visibility = {
        // contains all fields in the application and some default values
        web: {visible: true, show_dynamic_average: true},
        internet_nl_web_legacy_category: {visible: false, show_dynamic_average: true},
        internet_nl_mail_legacy_category: {visible: false, show_dynamic_average: true},
        internet_nl_web_tls: {visible: true, show_dynamic_average: true},
        internet_nl_web_dnssec: {visible: true, show_dynamic_average: true},
        internet_nl_web_ipv6: {visible: true, show_dynamic_average: true},
        internet_nl_web_appsecpriv: {visible: true, show_dynamic_average: true},
        mail: {visible: true, show_dynamic_average: true},
        internet_nl_mail_dashboard_tls: {visible: true, show_dynamic_average: true},
        internet_nl_mail_dashboard_auth: {visible: true, show_dynamic_average: true},
        internet_nl_mail_dashboard_dnssec: {visible: true, show_dynamic_average: true},
        internet_nl_mail_dashboard_ipv6: {visible: true, show_dynamic_average: true},
        category_web_ipv6_name_server: {show_dynamic_average: true},
        category_web_ipv6_web_server: {show_dynamic_average: true},
        category_web_dnssec_dnssec: {show_dynamic_average: true},
        category_web_tls_http: {show_dynamic_average: true},
        category_web_tls_tls: {show_dynamic_average: true},
        category_web_tls_certificate: {show_dynamic_average: true},
        category_web_tls_dane: {show_dynamic_average: true},
        category_web_security_options_appsecpriv: {show_dynamic_average: true},
        category_web_forum_standardisation_magazine: {show_dynamic_average: true},
        category_web_forum_standardisation_ipv6_monitor: {show_dynamic_average: true},
        category_web_forum_standardisation_status_fields: {show_dynamic_average: true},
        category_mail_ipv6_name_servers: {show_dynamic_average: true},
        category_mail_ipv6_mail_servers: {show_dynamic_average: true},
        category_mail_dnssec_email_address_domain: {show_dynamic_average: true},
        category_mail_dnssec_mail_server_domain: {show_dynamic_average: true},
        category_mail_dashboard_auth_dmarc: {show_dynamic_average: true},
        category_mail_dashboard_aut_dkim: {show_dynamic_average: true},
        category_mail_dashboard_aut_spf: {show_dynamic_average: true},
        category_mail_starttls_tls: {show_dynamic_average: true},
        category_mail_starttls_certificate: {show_dynamic_average: true},
        category_mail_starttls_dane: {show_dynamic_average: true},
        category_mail_forum_standardisation_magazine: {show_dynamic_average: true},
        category_mail_forum_standardisation_ipv6_monitor: {show_dynamic_average: true},
        internet_nl_web_https_cert_domain: {visible: true},
        internet_nl_web_https_http_redirect: {visible: true},
        internet_nl_web_https_cert_chain: {visible: true},
        internet_nl_web_https_tls_version: {visible: true},
        internet_nl_web_https_tls_clientreneg: {visible: true},
        internet_nl_web_https_tls_ciphers: {visible: true},
        internet_nl_web_https_http_available: {visible: true},
        internet_nl_web_https_dane_exist: {visible: true},
        internet_nl_web_https_http_compress: {visible: true},
        internet_nl_web_https_http_hsts: {visible: true},
        internet_nl_web_https_tls_secreneg: {visible: true},
        internet_nl_web_https_dane_valid: {visible: true},
        internet_nl_web_https_cert_pubkey: {visible: true},
        internet_nl_web_https_cert_sig: {visible: true},
        internet_nl_web_https_tls_compress: {visible: true},
        internet_nl_web_https_tls_keyexchange: {visible: true},
        internet_nl_web_https_tls_keyexchangehash: {visible: true},
        internet_nl_web_https_tls_ocsp: {visible: true},
        internet_nl_web_https_tls_0rtt: {visible: true},
        internet_nl_web_https_tls_cipherorder: {visible: true},
        internet_nl_web_dnssec_valid: {visible: true},
        internet_nl_web_dnssec_exist: {visible: true},
        internet_nl_web_ipv6_ws_similar: {visible: true},
        internet_nl_web_ipv6_ws_address: {visible: true},
        internet_nl_web_ipv6_ns_reach: {visible: true},
        internet_nl_web_ipv6_ws_reach: {visible: true},
        internet_nl_web_ipv6_ns_address: {visible: true},
        internet_nl_mail_starttls_cert_domain: {visible: true},
        internet_nl_mail_starttls_tls_version: {visible: true},
        internet_nl_mail_starttls_cert_chain: {visible: true},
        internet_nl_mail_starttls_tls_available: {visible: true},
        internet_nl_mail_starttls_tls_clientreneg: {visible: true},
        internet_nl_mail_starttls_tls_ciphers: {visible: true},
        internet_nl_mail_starttls_dane_valid: {visible: true},
        internet_nl_mail_starttls_dane_exist: {visible: true},
        internet_nl_mail_starttls_tls_secreneg: {visible: true},
        internet_nl_mail_starttls_dane_rollover: {visible: true},
        internet_nl_mail_starttls_cert_pubkey: {visible: true},
        internet_nl_mail_starttls_cert_sig: {visible: true},
        internet_nl_mail_starttls_tls_compress: {visible: true},
        internet_nl_mail_starttls_tls_keyexchange: {visible: true},
        internet_nl_mail_auth_dmarc_policy: {visible: true},
        internet_nl_mail_auth_dmarc_exist: {visible: true},
        internet_nl_mail_auth_spf_policy: {visible: true},
        internet_nl_mail_auth_dkim_exist: {visible: true},
        internet_nl_mail_auth_spf_exist: {visible: true},
        internet_nl_mail_dnssec_mailto_exist: {visible: true},
        internet_nl_mail_dnssec_mailto_valid: {visible: true},
        internet_nl_mail_dnssec_mx_valid: {visible: true},
        internet_nl_mail_dnssec_mx_exist: {visible: true},
        internet_nl_mail_ipv6_mx_address: {visible: true},
        internet_nl_mail_ipv6_mx_reach: {visible: true},
        internet_nl_mail_ipv6_ns_reach: {visible: true},
        internet_nl_mail_ipv6_ns_address: {visible: true},
        internet_nl_mail_legacy_dmarc: {visible: false},
        internet_nl_mail_legacy_dkim: {visible: false},
        internet_nl_mail_legacy_spf: {visible: false},
        internet_nl_mail_legacy_dmarc_policy: {visible: false},
        internet_nl_mail_legacy_spf_policy: {visible: false},
        internet_nl_mail_legacy_start_tls: {visible: false},
        internet_nl_mail_legacy_start_tls_ncsc: {visible: false},
        internet_nl_mail_legacy_dnssec_email_domain: {visible: false},
        internet_nl_mail_legacy_dnssec_mx: {visible: false},
        internet_nl_mail_legacy_dane: {visible: false},
        internet_nl_mail_legacy_ipv6_nameserver: {visible: false},
        internet_nl_mail_legacy_ipv6_mailserver: {visible: false},
        internet_nl_web_legacy_dnssec: {visible: false},
        internet_nl_web_legacy_tls_available: {visible: false},
        internet_nl_web_legacy_tls_ncsc_web: {visible: false},
        internet_nl_web_legacy_https_enforced: {visible: false},
        internet_nl_web_legacy_hsts: {visible: false},
        internet_nl_web_legacy_ipv6_nameserver: {visible: false},
        internet_nl_web_legacy_ipv6_webserver: {visible: false},
        internet_nl_web_legacy_dane: {visible: false},
        internet_nl_mail_auth_dmarc_policy_only: {visible: false},
        internet_nl_mail_auth_dmarc_ext_destination: {visible: false},
        internet_nl_mail_non_sending_domain: {visible: false},
        internet_nl_mail_server_configured: {visible: false},
        internet_nl_mail_servers_testable: {visible: false},
        internet_nl_mail_starttls_dane_ta: {visible: false},
        internet_nl_web_appsecpriv_csp: {visible: true},
        internet_nl_web_appsecpriv_referrer_policy: {visible: true},
        internet_nl_web_appsecpriv_x_content_type_options: {visible: true},
        internet_nl_web_appsecpriv_x_frame_options: {visible: true},
        internet_nl_mail_starttls_tls_cipherorder: {visible: false},
        internet_nl_mail_starttls_tls_keyexchangehash: {visible: false},
        internet_nl_mail_starttls_tls_0rtt: {visible: false},
        internet_nl_web_legacy_tls_1_3: {visible: false},
        internet_nl_mail_legacy_mail_sending_domain: {visible: false},
        internet_nl_mail_legacy_mail_server_testable: {visible: false},
        internet_nl_mail_legacy_mail_server_reachable: {visible: false},
        internet_nl_mail_legacy_domain_has_mx: {visible: false},
        internet_nl_mail_legacy_tls_1_3: {visible: false},
        internet_nl_mail_legacy_category_ipv6: {visible: false},
        internet_nl_web_legacy_category_ipv6: {visible: false},
      };

      http.get(`/data/account/report_settings/get/`).then(settings => {
        let data = settings.data;
        if (!this.isEmptyObject(data.data)) {
          // Get all possible issue fields before overwriting them with whatever is stored.
          const all_possible_fields = Object.keys(default_metric_visibility);

          // now overwrite with the custom settings
          let issue_filters = data.data;

          // upgrade the saved issue filters with all fields we know. In case of missing fields, those will
          // be added with a default value (invisible).
          all_possible_fields.forEach((field_name) => {
            this.upgrade_issue_filter_with_new_field(issue_filters, field_name);
          })
          // console.log(issue_filters);
          this.$store.commit("set_visible_metrics", issue_filters);
        } else {
          // no issue filters at all, set it to the default:
          console.log('Using default visible metrics, to change this, set visible metrics in the report page.');
          this.$store.commit("set_visible_metrics", default_metric_visibility);
        }

      }).catch(() => {});
        // When a user is not logged in, defaults are used.
        console.log("Using fallback visible metrics.")
        this.$store.commit("set_visible_metrics", default_metric_visibility);
    },
    upgrade_issue_filter_with_new_field: function (issue_filters, field_name) {
      if (!Object.keys(issue_filters).includes(field_name)) {
        // console.log(`Field ${field_name} is not in the issue filters, setting the default value.`)

        // web and mail and default categories are always visible by default.: otherwise we'd never see any categories when this data is malformed.
        // in totally empty data, all fields are invisible, which is ok.
        if (["web",
          "mail",
          "internet_nl_web_ipv6",
          "internet_nl_web_dnssec",
          "internet_nl_web_tls",
          "internet_nl_web_appsecpriv",
          "internet_nl_mail_dashboard_ipv6",
          "internet_nl_mail_dashboard_dnssec",
          "internet_nl_mail_dashboard_auth",
          "internet_nl_mail_dashboard_tls",
          "internet_nl_web_https_cert_domain",
          "internet_nl_web_https_http_redirect",
          "internet_nl_web_https_cert_chain",
          "internet_nl_web_https_tls_version",
          "internet_nl_web_https_tls_clientreneg",
          "internet_nl_web_https_tls_ciphers",
          "internet_nl_web_https_http_available",
          "internet_nl_web_https_dane_exist",
          "internet_nl_web_https_http_compress",
          "internet_nl_web_https_http_hsts",
          "internet_nl_web_https_tls_secreneg",
          "internet_nl_web_https_dane_valid",
          "internet_nl_web_https_cert_pubkey",
          "internet_nl_web_https_cert_sig",
          "internet_nl_web_https_tls_compress",
          "internet_nl_web_https_tls_keyexchange",
          "internet_nl_web_https_tls_keyexchangehash",
          "internet_nl_web_https_tls_ocsp",
          "internet_nl_web_https_tls_0rtt",
          "internet_nl_web_https_tls_cipherorder",
          "internet_nl_web_dnssec_valid",
          "internet_nl_web_dnssec_exist",
          "internet_nl_web_ipv6_ws_similar",
          "internet_nl_web_ipv6_ws_address",
          "internet_nl_web_ipv6_ns_reach",
          "internet_nl_web_ipv6_ws_reach",
          "internet_nl_web_ipv6_ns_address",
          "internet_nl_mail_starttls_cert_domain",
          "internet_nl_mail_starttls_tls_version",
          "internet_nl_mail_starttls_cert_chain",
          "internet_nl_mail_starttls_tls_available",
          "internet_nl_mail_starttls_tls_clientreneg",
          "internet_nl_mail_starttls_tls_ciphers",
          "internet_nl_mail_starttls_dane_valid",
          "internet_nl_mail_starttls_dane_exist",
          "internet_nl_mail_starttls_tls_secreneg",
          "internet_nl_mail_starttls_dane_rollover",
          "internet_nl_mail_starttls_cert_pubkey",
          "internet_nl_mail_starttls_cert_sig",
          "internet_nl_mail_starttls_tls_compress",
          "internet_nl_mail_starttls_tls_keyexchange",
          "internet_nl_mail_auth_dmarc_policy",
          "internet_nl_mail_auth_dmarc_exist",
          "internet_nl_mail_auth_spf_policy",
          "internet_nl_mail_auth_dkim_exist",
          "internet_nl_mail_auth_spf_exist",
          "internet_nl_mail_dnssec_mailto_exist",
          "internet_nl_mail_dnssec_mailto_valid",
          "internet_nl_mail_dnssec_mx_valid",
          "internet_nl_mail_dnssec_mx_exist",
          "internet_nl_mail_ipv6_mx_address",
          "internet_nl_mail_ipv6_mx_reach",
          "internet_nl_mail_ipv6_ns_reach",
          "internet_nl_mail_ipv6_ns_address",
          "internet_nl_web_appsecpriv_csp",
          "internet_nl_web_appsecpriv_referrer_policy",
          "internet_nl_web_appsecpriv_x_content_type_options",
          "internet_nl_web_appsecpriv_x_frame_options",
        ].includes(field_name)) {
          issue_filters[field_name] = {
            visible: true,
            show_dynamic_average: true,
            only_show_dynamic_average: false
          }
        } else {
          // this is invisible because we don't want to tamper with existing settings when introducing new
          // fields. Users will have to enable it themselves.
          issue_filters[field_name] = {
            visible: false,
            show_dynamic_average: true,
            only_show_dynamic_average: false
          }
        }
      }
    },

  },
  computed: {
    scan_methods: function () {
      /*
      * This is a hierarchy that makes sense in representing the large amount of metrics.
      * This hierarchy is shared in all reports parts and visible metric configuration.
      * */
      return [
        {
          name: 'web',
          fields: [],

          label: this.$i18n.t('web'),
          categories: [
            {
              name: 'ipv6',
              label: this.$i18n.t('internet_nl_web_ipv6'),
              // key is being used by selected categories to not iterate through fields.
              key: 'internet_nl_web_ipv6',
              fields: [
                {name: 'internet_nl_web_ipv6'}
              ],


              categories: [
                {
                  name: 'Name servers',
                  key: 'category_web_ipv6_name_server',
                  // there is NO translations for web, only for mail.
                  label: this.$i18n.t('category_web_ipv6_name_server'),
                  fields: [
                    {name: 'internet_nl_web_ipv6_ns_address'},
                    {name: 'internet_nl_web_ipv6_ns_reach'},
                  ],

                },
                {
                  name: 'Web server',
                  key: 'category_web_ipv6_web_server',
                  label: this.$i18n.t('category_web_ipv6_web_server'),
                  fields: [
                    {name: 'internet_nl_web_ipv6_ws_address'},
                    {name: 'internet_nl_web_ipv6_ws_reach'},
                    {name: 'internet_nl_web_ipv6_ws_similar'},
                  ],

                }
              ]
            },
            {
              name: 'dnssec',
              label: this.$i18n.t('internet_nl_web_dnssec'),
              key: 'internet_nl_web_dnssec',
              fields: [
                {name: 'internet_nl_web_dnssec'}
              ],

              categories: [
                {
                  // the exception to the rule
                  name: 'DNSSEC',
                  key: 'category_web_dnssec_dnssec',
                  label: this.$i18n.t('category_web_dnssec_dnssec'),
                  fields: [
                    {name: 'internet_nl_web_dnssec_exist'},
                    {name: 'internet_nl_web_dnssec_valid'},
                  ],

                },
              ]
            },
            {
              name: 'tls',
              label: this.$i18n.t('internet_nl_web_tls'),
              key: 'internet_nl_web_tls',
              fields: [
                {name: 'internet_nl_web_tls'},
              ],

              categories: [
                {
                  name: 'HTTP',
                  key: 'category_web_tls_http',
                  label: this.$i18n.t('category_web_tls_http'),
                  fields: [
                    {name: 'internet_nl_web_https_http_available'},
                    {name: 'internet_nl_web_https_http_redirect'},
                    {name: 'internet_nl_web_https_http_compress'},
                    {name: 'internet_nl_web_https_http_hsts'},
                  ],

                },
                {
                  name: 'TLS',
                  key: 'category_web_tls_tls',
                  label: this.$i18n.t('category_web_tls_tls'),
                  fields: [
                    {name: 'internet_nl_web_https_tls_version'},
                    {name: 'internet_nl_web_https_tls_ciphers'},
                    {name: 'internet_nl_web_https_tls_cipherorder'},
                    {name: 'internet_nl_web_https_tls_keyexchange'},
                    {name: 'internet_nl_web_https_tls_keyexchangehash'},
                    {name: 'internet_nl_web_https_tls_compress'},
                    {name: 'internet_nl_web_https_tls_secreneg'},
                    {name: 'internet_nl_web_https_tls_clientreneg'},
                    {name: 'internet_nl_web_https_tls_0rtt'},
                    {name: 'internet_nl_web_https_tls_ocsp'},
                  ],
                },
                {
                  name: 'Certificate',
                  key: 'category_web_tls_certificate',
                  // mail is being reused as there is no alternative translation (!)
                  label: this.$i18n.t('category_web_tls_certificate'),
                  fields: [
                    {name: 'internet_nl_web_https_cert_chain'},
                    {name: 'internet_nl_web_https_cert_pubkey'},
                    {name: 'internet_nl_web_https_cert_sig'},
                    {name: 'internet_nl_web_https_cert_domain'},
                  ],

                },
                {
                  name: 'DANE',
                  key: 'category_web_tls_dane',
                  label: this.$i18n.t('category_web_tls_dane'),
                  fields: [
                    {name: 'internet_nl_web_https_dane_exist'},
                    {name: 'internet_nl_web_https_dane_valid'},
                  ],

                }
              ]
            },
            {
              name: 'security_options',
              label: this.$i18n.t('internet_nl_web_appsecpriv'),
              key: 'internet_nl_web_appsecpriv',
              fields: [
                {name: 'internet_nl_web_appsecpriv'},
              ],


              categories: [
                {
                  name: 'HTTP security headers',
                  key: 'category_web_security_options_appsecpriv',
                  label: this.$i18n.t('category_web_security_options_appsecpriv'),
                  fields: [
                    {name: 'internet_nl_web_appsecpriv_x_frame_options'},
                    {name: 'internet_nl_web_appsecpriv_x_content_type_options'},
                    {name: 'internet_nl_web_appsecpriv_csp'},
                    {name: 'internet_nl_web_appsecpriv_referrer_policy'},
                  ],

                }
              ]

            },
            {
              name: 'forum_standardisation',
              label: this.$i18n.t('internet_nl_web_legacy_category'),
              key: 'internet_nl_web_legacy_category',
              fields: [
                {name: 'internet_nl_web_legacy_category'},
              ],


              categories: [
                {
                  name: 'Baseline NL Government',
                  key: 'category_web_forum_standardisation_magazine',
                  label: 'Baseline NL Government',
                  fields: [
                    {
                      name: 'internet_nl_web_legacy_dnssec',
                      explanation: 'fields.forum_standardistation.internet_nl_web_legacy_dnssec_explanation'
                    },
                    {
                      name: 'internet_nl_web_legacy_tls_available',
                      explanation: 'fields.forum_standardistation.internet_nl_web_legacy_tls_available_explanation'
                    },
                    {
                      name: 'internet_nl_web_legacy_tls_ncsc_web',
                      explanation: 'fields.forum_standardistation.internet_nl_web_legacy_tls_ncsc_web_explanation'
                    },
                    {
                      name: 'internet_nl_web_legacy_https_enforced',
                      explanation: 'fields.forum_standardistation.internet_nl_web_legacy_https_enforced_explanation'
                    },
                    {
                      name: 'internet_nl_web_legacy_hsts',
                      explanation: 'fields.forum_standardistation.internet_nl_web_legacy_hsts_explanation'
                    },
                    {
                      name: 'internet_nl_web_legacy_category_ipv6',
                      explanation: 'fields.forum_standardistation.internet_nl_web_legacy_ipv6_nameserver_explanation'
                    },
                    {
                      name: 'internet_nl_web_legacy_ipv6_nameserver',
                      explanation: 'fields.forum_standardistation.internet_nl_web_legacy_ipv6_nameserver_explanation'
                    },
                    {
                      name: 'internet_nl_web_legacy_ipv6_webserver',
                      explanation: 'fields.forum_standardistation.internet_nl_web_legacy_ipv6_webserver_explanation'
                    },
                  ],

                },
                {
                  name: 'Status Fields',
                  key: 'category_web_forum_standardisation_status_fields',
                  label: this.$i18n.t('fields.forum_standardistation.status_fields'),
                  fields: [
                    {
                      name: 'internet_nl_web_legacy_tls_1_3',
                      explanation: 'fields.forum_standardistation.internet_nl_web_legacy_tls_1_3_explanation'
                    },
                  ],

                }
              ]
            }
          ]
        },
        {
          name: 'mail',
          fields: [],
          label: this.$i18n.t('mail'),
          categories: [
            {
              name: 'IPv6',
              label: this.$i18n.t('internet_nl_mail_dashboard_ipv6'),
              key: 'internet_nl_mail_dashboard_ipv6',
              fields: [
                {name: 'internet_nl_mail_dashboard_ipv6'}
              ],


              categories: [
                {
                  name: 'Name servers',
                  key: 'category_mail_ipv6_name_servers',
                  label: this.$i18n.t('category_mail_ipv6_name_servers'),
                  fields: [
                    {name: 'internet_nl_mail_ipv6_ns_address'},
                    {name: 'internet_nl_mail_ipv6_ns_reach'},
                  ],

                },
                {
                  name: 'Mail server(s)',
                  key: 'category_mail_ipv6_mail_servers',
                  label: this.$i18n.t('category_mail_ipv6_mail_servers'),
                  fields: [
                    {name: 'internet_nl_mail_ipv6_mx_address'},
                    {name: 'internet_nl_mail_ipv6_mx_reach'},
                  ],

                }
              ]
            },
            {
              name: 'DNSSEC',
              label: this.$i18n.t('internet_nl_mail_dashboard_dnssec'),
              key: 'internet_nl_mail_dashboard_dnssec',
              fields: [
                {name: 'internet_nl_mail_dashboard_dnssec',}
              ],

              categories: [
                {
                  name: 'Email address domain',
                  key: 'category_mail_dnssec_email_address_domain',
                  label: this.$i18n.t('category_mail_dnssec_email_address_domain'),
                  fields: [
                    {name: 'internet_nl_mail_dnssec_mailto_exist'},
                    {name: 'internet_nl_mail_dnssec_mailto_valid'},
                  ],

                },
                {
                  name: 'Mail server domain(s)',
                  key: 'category_mail_dnssec_mail_server_domain',
                  label: this.$i18n.t('category_mail_dnssec_mail_server_domain'),
                  fields: [
                    {name: 'internet_nl_mail_dnssec_mx_exist'},
                    {name: 'internet_nl_mail_dnssec_mx_valid'},
                  ],
                },
              ]
            },
            {
              name: 'DMARC, DKIM and SPF',
              label: this.$i18n.t('internet_nl_mail_dashboard_auth'),
              key: 'internet_nl_mail_dashboard_auth',
              fields: [
                {name: 'internet_nl_mail_dashboard_auth'}
              ],

              categories: [
                {
                  name: 'DMARC',
                  key: 'category_mail_dashboard_auth_dmarc',
                  label: this.$i18n.t('category_mail_dashboard_auth_dmarc'),
                  fields: [
                    {name: 'internet_nl_mail_auth_dmarc_exist'},
                    {name: 'internet_nl_mail_auth_dmarc_policy'},
                  ],

                },
                {
                  name: 'DKIM',
                  key: 'category_mail_dashboard_aut_dkim',
                  label: this.$i18n.t('category_mail_dashboard_aut_dkim'),
                  fields: [
                    {name: 'internet_nl_mail_auth_dkim_exist'},
                  ],

                },
                {
                  name: 'SPF',
                  key: 'category_mail_dashboard_aut_spf',
                  label: this.$i18n.t('category_mail_dashboard_aut_spf'),
                  fields: [
                    {name: 'internet_nl_mail_auth_spf_exist'},
                    {name: 'internet_nl_mail_auth_spf_policy'},
                  ],

                },
              ]
            },
            {
              name: 'STARTTLS and DANE',
              label: this.$i18n.t('internet_nl_mail_dashboard_tls'),
              key: 'internet_nl_mail_dashboard_tls',
              fields: [
                {name: 'internet_nl_mail_dashboard_tls'},
              ],

              categories: [
                {
                  name: 'TLS',
                  key: 'category_mail_starttls_tls',
                  label: this.$i18n.t('category_mail_starttls_tls'),
                  fields: [
                    {name: 'internet_nl_mail_starttls_tls_available'},
                    {name: 'internet_nl_mail_starttls_tls_version'},
                    {name: 'internet_nl_mail_starttls_tls_ciphers'},
                    {name: 'internet_nl_mail_starttls_tls_cipherorder'},
                    {name: 'internet_nl_mail_starttls_tls_keyexchange'},
                    {name: 'internet_nl_mail_starttls_tls_keyexchangehash'},
                    {name: 'internet_nl_mail_starttls_tls_compress'},
                    {name: 'internet_nl_mail_starttls_tls_secreneg'},
                    {name: 'internet_nl_mail_starttls_tls_clientreneg'},
                    {name: 'internet_nl_mail_starttls_tls_0rtt'},
                  ],

                },
                {
                  name: 'Certificate',
                  key: 'category_mail_starttls_certificate',
                  label: this.$i18n.t('category_mail_starttls_certificate'),
                  fields: [
                    {name: 'internet_nl_mail_starttls_cert_chain'},
                    {name: 'internet_nl_mail_starttls_cert_pubkey'},
                    {name: 'internet_nl_mail_starttls_cert_sig'},
                    {name: 'internet_nl_mail_starttls_cert_domain'},
                  ],

                },
                {
                  name: 'DANE',
                  key: 'category_mail_starttls_dane',
                  label: this.$i18n.t('category_mail_starttls_dane'),
                  fields: [
                    {name: 'internet_nl_mail_starttls_dane_exist'},
                    {name: 'internet_nl_mail_starttls_dane_valid'},
                    {name: 'internet_nl_mail_starttls_dane_rollover'},
                  ],


                },
              ]
            },
            {
              name: 'forum_standardisation',
              label: this.$i18n.t('internet_nl_mail_legacy_category'),
              key: 'internet_nl_mail_legacy_category',
              fields: [
                {
                  name: 'internet_nl_mail_legacy_category',
                },
              ],


              categories: [
                {
                  name: 'Baseline NL Government',
                  label: 'Baseline NL Government',
                  key: 'category_mail_forum_standardisation_magazine',
                  fields: [
                    {
                      name: 'internet_nl_mail_legacy_dmarc',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_dmarc_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_dkim',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_dkim_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_spf',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_spf_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_dmarc_policy',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_dmarc_policy_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_spf_policy',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_spf_policy_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_start_tls',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_start_tls_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_start_tls_ncsc',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_start_tls_ncsc_explanation'
                    },
                    // {name: 'internet_nl_mail_legacy_dnssec_email_domain'},
                    {
                      name: 'internet_nl_mail_legacy_dnssec_mx',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_dnssec_mx_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_dane',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_dane_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_category_ipv6',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_ipv6_category_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_ipv6_nameserver',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_ipv6_nameserver_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_ipv6_mailserver',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_ipv6_mailserver_explanation'
                    },

                  ],

                },

                {
                  name: 'Status Fields',
                  key: 'category_web_forum_standardisation_status_fields',
                  label: this.$i18n.t('fields.forum_standardistation.status_fields'),
                  fields: [
                    {
                      name: 'internet_nl_mail_legacy_tls_1_3',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_tls_1_3_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_domain_has_mx',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_domain_has_mx_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_mail_server_reachable',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_mail_server_reachable_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_mail_server_testable',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_mail_server_testable_explanation'
                    },
                    {
                      name: 'internet_nl_mail_legacy_mail_sending_domain',
                      explanation: 'fields.forum_standardistation.internet_nl_mail_legacy_mail_sending_domain_explanation'
                    },
                  ],

                }
              ]
            }
          ]
        }
      ];
    },

    field_name_to_category_names: function () {
      /** Based on the scan methods, the names of the categories is 1-1 associated with a category name.
       * This can be used to generate "category" headers in the result table. This helps to distinguish
       * several chapter headings for a set of scans. This is useful for mail dnssec scans, as the
       * name of the dnssec tests is identical and very confusing to see what is what. */

      let fields_mapping = {};

      // 0 = web, 1 = mail, ugly.
      this.scan_methods[0].categories.forEach((category) => {

        category.categories.forEach((subcategory) => {
          subcategory.fields.forEach((field) => {
            fields_mapping[field.name] = subcategory.name;
          });
        });
      });

      this.scan_methods[1].categories.forEach((category) => {

        category.categories.forEach((subcategory) => {
          subcategory.fields.forEach((field) => {
            fields_mapping[field.name] = subcategory.name;
          });
        });
      });

      return fields_mapping;
    },


  }
}
</script>
