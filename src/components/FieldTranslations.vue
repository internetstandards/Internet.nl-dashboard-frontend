<!-- SPDX-License-Identifier: Apache-2.0 -->
<script>
// This file is in the repository as part of documentation about what fields match the internet.nl translations.
// So it's clear what translations need to be updated in the babel file.
const internet_nl_field_mapping = {};

const additional_mapping = {
  test_title: 'faqs_report_test_title',
  test_good: 'faqs_report_test_good',
  test_bad: 'faqs_report_test_bad',
  test_warning: 'faqs_report_test_warning',
  test_info: 'faqs_report_test_info',
  subtest_title: 'faqs_report_subtest_title',
  subtest_good: 'faqs_report_subtest_good',
  subtest_bad: 'faqs_report_subtest_bad',
  subtest_warning: 'faqs_report_subtest_warning',
  subtest_info: 'faqs_report_subtest_info',
}


// categories are translated with _passed_summary or _failed_summary. The rest with their label. Should be in
// the retrieved translations anyway.
function import_field_translations(internet_nl_messages, language) {
  let mapping = {};
  for (let key of Object.keys(internet_nl_field_mapping)) {
    mapping[key] = internet_nl_messages[language].internet_nl[internet_nl_field_mapping[key] + '_label']
  }
  for (let key of Object.keys(additional_mapping)) {
    mapping[key] = internet_nl_messages[language].internet_nl[additional_mapping[key]]
  }
  return mapping;
}

function interpolate_translations(internet_nl_messages) {
  let translation = {
    'en': {
      fields: {
        forum_standardistation: {
          category_label: 'Extra Fields',
          measurements_on_agreed_security_standards: 'Extra Fields',
          ipv6_monitor: 'IPv6 monitor',
          status_fields: 'Status Fields',
        },
        additional_fields: {
          label: 'Additional fields',
        },
      },


      pct_ok: "passed",
      pct_low: "info",
      pct_medium: "warning",
      pct_high: "failed",
      pct_not_applicable: "not applicable",
      pct_not_testable: "not testable",
      pct_error_in_test: "test error"
    }, 'nl': {

      fields: {
        forum_standardistation: {
          category_label: 'Extra Velden',
          measurements_on_agreed_security_standards: 'Extra Velden',
          ipv6_monitor: 'IPv6 monitor',
          status_fields: 'Status Velden'
        },
        additional_fields: {
          label: 'Additionele velden',
        },
      },

      pct_ok: "geslaagd",
      pct_low: "info",
      pct_medium: "waarschuwing",
      pct_high: "gezakt",
      pct_not_applicable: "niet van toepassing",
      pct_not_testable: "niet testbaar",
      pct_error_in_test: "testfout"

    }
  };

  translation.nl = Object.assign(translation.nl, import_field_translations(internet_nl_messages, 'nl'));
  translation.en = Object.assign(translation.en, import_field_translations(internet_nl_messages, 'en'));

  return translation;
}

import internet_nl_messages from './translations/internet_nl.js'

const sharedMessages = interpolate_translations(internet_nl_messages);
export default sharedMessages;
</script>