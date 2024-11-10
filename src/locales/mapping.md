# Dashboard and internet.nl translations mapping

## Context

The metrics in the dashboard use a mapping of the js file that is generated with the dashboard backend.
When working with the .babel file it's nice to know what fields maps to what translation.

This used to be available in code, but that resulted in a pretty complex way of working. Since centralized
translations in a single file is much more workable, the code-mapping has been obsoleted and is available here
for reference for that moment translation files have been updated.

It _can_ be put in code and it _can_ be possible to auto-update the translation files for this. This might be
a nice exercise in the future if we don't want to copy all labels to the translation file one by one.

This will probably happen in the backend, not in this frontend.


## Mapping

internet_nl_web_tls: 'test_sitetls',
internet_nl_web_dnssec: 'test_sitednssec',
internet_nl_web_ipv6: 'test_siteipv6',
internet_nl_web_rpki: 'test_siterpki',

internet_nl_mail_dashboard_tls: 'test_mailtls',
internet_nl_mail_dashboard_auth: 'test_mailauth',
internet_nl_mail_dashboard_dnssec: 'test_maildnssec',
internet_nl_mail_dashboard_ipv6: 'test_mailipv6',
internet_nl_mail_dashboard_web_rpki: 'test_mailrpki',
internet_nl_mail_dashboard_rpki: 'test_mailrpki',

internet_nl_web_appsecpriv: 'test_siteappsecpriv',
internet_nl_web_appsecpriv_csp: 'detail_web_appsecpriv_http_csp',
internet_nl_web_appsecpriv_referrer_policy: 'detail_web_appsecpriv_http_referrer_policy',
internet_nl_web_appsecpriv_x_content_type_options: 'detail_web_appsecpriv_http_x_content_type',
internet_nl_web_appsecpriv_x_frame_options: 'detail_web_appsecpriv_http_x_frame',
internet_nl_web_https_cert_domain: 'detail_web_tls_cert_hostmatch',
internet_nl_web_https_http_redirect: 'detail_web_tls_https_forced',
internet_nl_web_https_cert_chain: 'detail_web_tls_cert_trust',
internet_nl_web_https_tls_version: 'detail_web_tls_version',
internet_nl_web_https_tls_clientreneg: 'detail_web_tls_renegotiation_client',
internet_nl_web_https_tls_ciphers: 'detail_web_tls_ciphers',
internet_nl_web_https_http_available: 'detail_web_tls_https_exists',
internet_nl_web_https_dane_exist: 'detail_web_tls_dane_exists',
internet_nl_web_https_http_compress: 'detail_web_tls_http_compression',
internet_nl_web_https_http_hsts: 'detail_web_tls_https_hsts',
internet_nl_web_https_tls_secreneg: 'detail_web_tls_renegotiation_secure',
internet_nl_web_https_dane_valid: 'detail_web_tls_dane_valid',
internet_nl_web_https_cert_pubkey: 'detail_web_tls_cert_pubkey',
internet_nl_web_https_cert_sig: 'detail_web_tls_cert_signature',
internet_nl_web_https_tls_compress: 'detail_web_tls_compression',
internet_nl_web_https_tls_keyexchange: 'detail_web_tls_fs_params',
internet_nl_web_dnssec_valid: 'detail_web_dnssec_valid',
internet_nl_web_dnssec_exist: 'detail_web_dnssec_exists',
internet_nl_web_ipv6_ws_similar: 'detail_web_ipv6_web_ipv46',
internet_nl_web_ipv6_ws_address: 'detail_web_ipv6_web_aaaa',
internet_nl_web_ipv6_ns_reach: 'detail_web_mail_ipv6_ns_reach',
internet_nl_web_ipv6_ws_reach: 'detail_web_ipv6_web_reach',
internet_nl_web_ipv6_ns_address: 'detail_web_mail_ipv6_ns_aaaa',

// added with api 2.0.0
internet_nl_web_https_tls_cipherorder: 'detail_web_tls_cipher_order',
internet_nl_web_https_tls_0rtt: 'detail_web_tls_zero_rtt',
internet_nl_web_https_tls_ocsp: 'detail_web_tls_ocsp_stapling',
internet_nl_web_https_tls_keyexchangehash: 'detail_web_tls_kex_hash_func',

internet_nl_mail_starttls_cert_domain: 'detail_mail_tls_cert_hostmatch',
internet_nl_mail_starttls_tls_version: 'detail_mail_tls_version',
internet_nl_mail_starttls_cert_chain: 'detail_mail_tls_cert_trust',
internet_nl_mail_starttls_tls_available: 'detail_mail_tls_starttls_exists',
internet_nl_mail_starttls_tls_clientreneg: 'detail_mail_tls_renegotiation_client',
internet_nl_mail_starttls_tls_ciphers: 'detail_mail_tls_ciphers',
internet_nl_mail_starttls_dane_valid: 'detail_mail_tls_dane_valid',
internet_nl_mail_starttls_dane_exist: 'detail_mail_tls_dane_exists',
internet_nl_mail_starttls_tls_secreneg: 'detail_mail_tls_renegotiation_secure',
internet_nl_mail_starttls_dane_rollover: 'detail_mail_tls_dane_rollover',
internet_nl_mail_starttls_cert_pubkey: 'detail_mail_tls_cert_pubkey',
internet_nl_mail_starttls_cert_sig: 'detail_mail_tls_cert_signature',
internet_nl_mail_starttls_tls_compress: 'detail_mail_tls_compression',
internet_nl_mail_starttls_tls_keyexchange: 'detail_mail_tls_fs_params',
internet_nl_mail_auth_dmarc_policy: 'detail_mail_auth_dmarc_policy',
internet_nl_mail_auth_dmarc_exist: 'detail_mail_auth_dmarc',
internet_nl_mail_auth_spf_policy: 'detail_mail_auth_spf_policy',
internet_nl_mail_auth_dkim_exist: 'detail_mail_auth_dkim',
internet_nl_mail_auth_spf_exist: 'detail_mail_auth_spf',
internet_nl_mail_dnssec_mailto_exist: 'detail_mail_dnssec_exists',
internet_nl_mail_dnssec_mailto_valid: 'detail_mail_dnssec_valid',
internet_nl_mail_dnssec_mx_valid: 'detail_mail_dnssec_mx_valid',
internet_nl_mail_dnssec_mx_exist: 'detail_mail_dnssec_mx_exists',
internet_nl_mail_ipv6_mx_address: 'detail_mail_ipv6_mx_aaaa',
internet_nl_mail_ipv6_mx_reach: 'detail_mail_ipv6_mx_reach',
internet_nl_mail_ipv6_ns_reach: 'detail_web_mail_ipv6_ns_reach',
internet_nl_mail_ipv6_ns_address: 'detail_web_mail_ipv6_ns_aaaa',

// added with api2.0
internet_nl_mail_starttls_tls_cipherorder: 'detail_mail_tls_cipher_order',
internet_nl_mail_starttls_tls_keyexchangehash: 'detail_mail_tls_kex_hash_func',
internet_nl_mail_starttls_tls_0rtt: 'detail_mail_tls_zero_rtt',

// rpki + security.txt
internet_nl_web_rpki_exists: 'detail_web_rpki_exists',
internet_nl_web_rpki_valid: 'detail_web_rpki_valid',
internet_nl_web_ns_rpki_exists: 'detail_web_mail_rpki_ns_exists',
internet_nl_web_ns_rpki_valid: 'detail_web_mail_rpki_ns_valid',
internet_nl_mail_rpki_exists: 'detail_mail_rpki_exists',
internet_nl_mail_rpki_valid: 'detail_mail_rpki_valid',
internet_nl_mail_ns_rpki_exists: 'detail_web_mail_rpki_ns_valid',
internet_nl_mail_ns_rpki_valid: 'detail_web_mail_rpki_ns_valid',
internet_nl_mail_mx_ns_rpki_exists: 'detail_mail_rpki_mx_ns_exists',
internet_nl_mail_mx_ns_rpki_valid: 'detail_mail_rpki_mx_ns_valid',
internet_nl_web_appsecpriv_securitytxt: 'detail_web_appsecpriv_http_securitytxt',


// categories and such
category_web: 'base_test_website',
category_web_ipv6_name_server: 'results_domain_mail_ipv6_name_servers',
category_web_ipv6_web_server: 'results_domain_ipv6_web_server',
category_web_dnssec_dnssec: 'test_sitednssec',
category_web_tls_http: 'results_domain_tls_https',
category_web_tls_tls: 'results_domain_tls_tls',
category_web_tls_certificate: 'results_domain_mail_tls_certificate',
category_web_tls_dane: 'results_domain_mail_tls_dane',
category_web_security_options_appsecpriv: 'results_domain_appsecpriv_http_headers',
category_mail: 'base_test_mail',
category_mail_ipv6_name_servers: 'results_domain_mail_ipv6_name_servers',
category_mail_ipv6_mail_servers: 'results_mail_ipv6_mail_servers',
category_mail_dnssec_email_address_domain: 'results_mail_dnssec_domain',
category_mail_dnssec_mail_server_domain: 'results_mail_dnssec_mail_servers',
category_mail_dashboard_auth_dmarc: 'results_mail_auth_dmarc',
category_mail_dashboard_aut_dkim: 'results_mail_auth_dkim',
category_mail_dashboard_aut_spf: 'results_mail_auth_spf',
category_mail_starttls_tls: 'results_mail_tls_starttls',
category_mail_starttls_certificate: 'results_domain_mail_tls_certificate',
category_mail_starttls_dane: 'results_domain_mail_tls_dane',
category_web_security_options_other: 'results_domain_appsecpriv_other_options',
category_web_rpki_name_server: 'results_domain_mail_rpki_name_servers',
category_web_rpki_web_server: 'results_domain_rpki_web_server',

category_mail_rpki_name_server: 'results_domain_mail_rpki_name_servers',
category_mail_rpki_name_mail_server: 'results_mail_rpki_mx_name_servers',
category_mail_rpki_mail_server: 'results_mail_rpki_mail_servers',



// https://github.com/NLnetLabs/Internet.nl/blob/cece8255ac7f39bded137f67c94a10748970c3c7/checks/templates/mail-results.html
internet_nl_mail_server_configured: 'Mail Server Configured (not in UI)',  // Added 24th of May 2019
internet_nl_mail_servers_testable: 'Mail Server Testable (not in UI)',  // Added 24th of May 2019
internet_nl_mail_starttls_dane_ta: 'Mail STARTTLS Dane TA (not in UI)',  // Added 24th of May 2019
internet_nl_mail_non_sending_domain: 'Mail Non Sending Domain (not in UI)',  // Added 24th of May 2019
internet_nl_mail_auth_dmarc_policy_only: 'Mail Auth DMARC Policy Only (not in UI)',   // Added 24th of May 2019
internet_nl_mail_auth_dmarc_ext_destination: 'Mail Auth DMARC Ext Destination (not in UI)',  // Added 24th of May 2019