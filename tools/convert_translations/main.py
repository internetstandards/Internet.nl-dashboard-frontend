import json

mapping = {
    'metrics': {
        "internet_nl_web_appsecpriv": 'test_siteappsecpriv',
        "internet_nl_web_appsecpriv_csp": 'detail_web_appsecpriv_http_csp',
        "internet_nl_web_appsecpriv_referrer_policy": 'detail_web_appsecpriv_http_referrer_policy',
        "internet_nl_web_appsecpriv_x_content_type_options": 'detail_web_appsecpriv_http_x_content_type',
        "internet_nl_web_appsecpriv_x_frame_options": 'detail_web_appsecpriv_http_x_frame',
        "internet_nl_web_https_cert_domain": 'detail_web_tls_cert_hostmatch',
        "internet_nl_web_https_http_redirect": 'detail_web_tls_https_forced',
        "internet_nl_web_https_cert_chain": 'detail_web_tls_cert_trust',
        "internet_nl_web_https_tls_version": 'detail_web_tls_version',
        "internet_nl_web_https_tls_clientreneg": 'detail_web_tls_renegotiation_client',
        "internet_nl_web_https_tls_ciphers": 'detail_web_tls_ciphers',
        "internet_nl_web_https_http_available": 'detail_web_tls_https_exists',
        "internet_nl_web_https_dane_exist": 'detail_web_tls_dane_exists',
        "internet_nl_web_https_http_compress": 'detail_web_tls_http_compression',
        "internet_nl_web_https_http_hsts": 'detail_web_tls_https_hsts',
        "internet_nl_web_https_tls_secreneg": 'detail_web_tls_renegotiation_secure',
        "internet_nl_web_https_dane_valid": 'detail_web_tls_dane_valid',
        "internet_nl_web_https_cert_pubkey": 'detail_web_tls_cert_pubkey',
        "internet_nl_web_https_cert_sig": 'detail_web_tls_cert_signature',
        "internet_nl_web_https_tls_compress": 'detail_web_tls_compression',
        "internet_nl_web_https_tls_keyexchange": 'detail_web_tls_fs_params',
        "internet_nl_web_dnssec_valid": 'detail_web_dnssec_valid',
        "internet_nl_web_dnssec_exist": 'detail_web_dnssec_exists',
        "internet_nl_web_ipv6_ws_similar": 'detail_web_ipv6_web_ipv46',
        "internet_nl_web_ipv6_ws_address": 'detail_web_ipv6_web_aaaa',
        "internet_nl_web_ipv6_ns_reach": 'detail_web_mail_ipv6_ns_reach',
        "internet_nl_web_ipv6_ws_reach": 'detail_web_ipv6_web_reach',
        "internet_nl_web_ipv6_ns_address": 'detail_web_mail_ipv6_ns_aaaa',
        "internet_nl_web_https_tls_cipherorder": 'detail_web_tls_cipher_order',
        "internet_nl_web_https_tls_0rtt": 'detail_web_tls_zero_rtt',
        "internet_nl_web_https_tls_ocsp": 'detail_web_tls_ocsp_stapling',
        "internet_nl_web_https_tls_keyexchangehash": 'detail_web_tls_kex_hash_func',
        "internet_nl_mail_starttls_cert_domain": 'detail_mail_tls_cert_hostmatch',
        "internet_nl_mail_starttls_tls_version": 'detail_mail_tls_version',
        "internet_nl_mail_starttls_cert_chain": 'detail_mail_tls_cert_trust',
        "internet_nl_mail_starttls_tls_available": 'detail_mail_tls_starttls_exists',
        "internet_nl_mail_starttls_tls_clientreneg": 'detail_mail_tls_renegotiation_client',
        "internet_nl_mail_starttls_tls_ciphers": 'detail_mail_tls_ciphers',
        "internet_nl_mail_starttls_dane_valid": 'detail_mail_tls_dane_valid',
        "internet_nl_mail_starttls_dane_exist": 'detail_mail_tls_dane_exists',
        "internet_nl_mail_starttls_tls_secreneg": 'detail_mail_tls_renegotiation_secure',
        "internet_nl_mail_starttls_dane_rollover": 'detail_mail_tls_dane_rollover',
        "internet_nl_mail_starttls_cert_pubkey": 'detail_mail_tls_cert_pubkey',
        "internet_nl_mail_starttls_cert_sig": 'detail_mail_tls_cert_signature',
        "internet_nl_mail_starttls_tls_compress": 'detail_mail_tls_compression',
        "internet_nl_mail_starttls_tls_keyexchange": 'detail_mail_tls_fs_params',
        "internet_nl_mail_auth_dmarc_policy": 'detail_mail_auth_dmarc_policy',
        "internet_nl_mail_auth_dmarc_exist": 'detail_mail_auth_dmarc',
        "internet_nl_mail_auth_spf_policy": 'detail_mail_auth_spf_policy',
        "internet_nl_mail_auth_dkim_exist": 'detail_mail_auth_dkim',
        "internet_nl_mail_auth_spf_exist": 'detail_mail_auth_spf',
        "internet_nl_mail_dnssec_mailto_exist": 'detail_mail_dnssec_exists',
        "internet_nl_mail_dnssec_mailto_valid": 'detail_mail_dnssec_valid',
        "internet_nl_mail_dnssec_mx_valid": 'detail_mail_dnssec_mx_valid',
        "internet_nl_mail_dnssec_mx_exist": 'detail_mail_dnssec_mx_exists',
        "internet_nl_mail_ipv6_mx_address": 'detail_mail_ipv6_mx_aaaa',
        "internet_nl_mail_ipv6_mx_reach": 'detail_mail_ipv6_mx_reach',
        "internet_nl_mail_ipv6_ns_reach": 'detail_web_mail_ipv6_ns_reach',
        "internet_nl_mail_ipv6_ns_address": 'detail_web_mail_ipv6_ns_aaaa',
        "internet_nl_mail_starttls_tls_cipherorder": 'detail_mail_tls_cipher_order',
        "internet_nl_mail_starttls_tls_keyexchangehash": 'detail_mail_tls_kex_hash_func',
        "internet_nl_mail_starttls_tls_0rtt": 'detail_mail_tls_zero_rtt',
        "internet_nl_web_rpki_exists": 'detail_web_rpki_exists',
        "internet_nl_web_rpki_valid": 'detail_web_rpki_valid',
        "internet_nl_web_ns_rpki_exists": 'detail_web_mail_rpki_ns_exists',
        "internet_nl_web_ns_rpki_valid": 'detail_web_mail_rpki_ns_valid',
        "internet_nl_mail_rpki_exists": 'detail_mail_rpki_exists',
        "internet_nl_mail_rpki_valid": 'detail_mail_rpki_valid',
        "internet_nl_mail_ns_rpki_exists": 'detail_web_mail_rpki_ns_valid',
        "internet_nl_mail_ns_rpki_valid": 'detail_web_mail_rpki_ns_valid',
        "internet_nl_mail_mx_ns_rpki_exists": 'detail_mail_rpki_mx_ns_exists',
        "internet_nl_mail_mx_ns_rpki_valid": 'detail_mail_rpki_mx_ns_valid',
        "internet_nl_web_appsecpriv_securitytxt": 'detail_web_appsecpriv_http_securitytxt',
    },

    "categories": {
        "category_web": 'base_test_website',
        "category_web_ipv6_name_server": 'results_domain_mail_ipv6_name_servers',
        "category_web_ipv6_web_server": 'results_domain_ipv6_web_server',
        "category_web_dnssec_dnssec": 'test_sitednssec',
        "category_web_tls_http": 'results_domain_tls_https',
        "category_web_tls_tls": 'results_domain_tls_tls',
        "category_web_tls_certificate": 'results_domain_mail_tls_certificate',
        "category_web_tls_dane": 'results_domain_mail_tls_dane',
        "category_web_security_options_appsecpriv": 'results_domain_appsecpriv_http_headers',
        "category_mail": 'base_test_mail',
        "category_mail_ipv6_name_servers": 'results_domain_mail_ipv6_name_servers',
        "category_mail_ipv6_mail_servers": 'results_mail_ipv6_mail_servers',
        "category_mail_dnssec_email_address_domain": 'results_mail_dnssec_domain',
        "category_mail_dnssec_mail_server_domain": 'results_mail_dnssec_mail_servers',
        "category_mail_dashboard_auth_dmarc": 'results_mail_auth_dmarc',
        "category_mail_dashboard_auth_dkim": 'results_mail_auth_dkim',
        "category_mail_dashboard_auth_spf": 'results_mail_auth_spf',
        "category_mail_starttls_tls": 'results_mail_tls_starttls',
        "category_mail_starttls_certificate": 'results_domain_mail_tls_certificate',
        "category_mail_starttls_dane": 'results_domain_mail_tls_dane',
        "category_web_security_options_other": 'results_domain_appsecpriv_other_options',
        "category_web_rpki_name_server": 'results_domain_mail_rpki_name_servers',
        "category_web_rpki_web_server": 'results_domain_rpki_web_server',
        "category_mail_rpki_name_server": 'results_domain_mail_rpki_name_servers',
        "category_mail_rpki_name_mail_server": 'results_mail_rpki_mx_name_servers',
        "category_mail_rpki_mail_server": 'results_mail_rpki_mail_servers',
    }
}


def update_babel_translations():
    # this will read /src/locales/autogenerated_internet_nl.js and then per language in that file will overwrite
    # the corresponding translations in /src/locales/<language>.js in the metrics key.

    # match the keys
    for language in ['nl', 'en']:
        translate_language(language)


def translate_language(language):

    with open(f'./tools/convert_translations/from_internet_nl/internet_nl.{language}.json', 'r') as file:
        translations_input = json.load(file)


    with open(f'./src/locales/{language}.json', 'r') as file:
        translations_output = json.load(file)


    for out_key, in_key in mapping['metrics'].items():
        # typical metric content has the following fields: _exp, _label, _verdict...
        # "detail_web_appsecpriv_http_referrer_policy_exp": 'We testen of je webserver een HTTP header voor ...',
        # "detail_web_appsecpriv_http_referrer_policy_label": 'Referrer-Policy aanwezigheid',
        # "detail_web_appsecpriv_http_referrer_policy_tech_table": 'Webserver-IP-adres|Referrer-Policy waarde',
        # "detail_web_appsecpriv_http_referrer_policy_verdict_bad": 'Je webserver biedt <em>geen</em> ...',
        # "detail_web_appsecpriv_http_referrer_policy_verdict_good": 'Je webserver biedt Referrer-Policy aan.',
        # deal with all fields that start with the in_key:

        # we don't know what verdicts exist, therefore iterate over all items.
        for key, value in translations_input.items():
            # detail_web_appsecpriv_http_referrer_policy
            if not key.startswith(in_key):
                continue

            if key.endswith('_exp'):
                # wsm
                # translations_output['metric'][out_key]['extended-explanation'] = value
                # internet-nl:
                translations_output['metric'][out_key]['explanation'] = value

            if key.endswith('_label'):
                translations_output['metric'][out_key]['title'] = value

            if "verdict" in key:
                # create the label for the verdict by removing the whole key up until _verdict_:
                label = key[key.find('_verdict_')+9:]

                # for missing ratings....
                if "rating" not in translations_output['metric'][out_key]:
                    translations_output['metric'][out_key]['rating'] = {}

                translations_output['metric'][out_key]['rating'][label] = value

            # don't add the useless tech table item itself at this level
            if "tech_table" in key and not key.endswith('_tech_table'):

                label = key[key.find('_tech_table_')+12:]

                if "tech_table" not in translations_output['metric'][out_key]:
                    translations_output['metric'][out_key]['tech_table'] = {}

                translations_output['metric'][out_key]['tech_table'][label] = value

    # category_web_dnssec_dnssec results in "Domeinnaam <em>niet</em> ondertekend (DNSSEC)" instead of a label
    # the mail and web keys aren't getting any better with this translation.
    # Conclusion: do not use automated categories translations
    # for out_key, in_key in mapping['categories'].items():
    #     for key, value in translations_input.items():
    #         if not key.startswith(in_key):
    #             continue
    #         translations_output['metric'][out_key]['title'] = value

    with open(f'./src/locales/{language}_updated.json', 'w') as file:
        json.dump(translations_output, file, indent=4, ensure_ascii=False)

    # last step:
    # use babel to update the translations in other languages no mentioned in the file. You have to do that by hand.
    # and it will cost you money.


if __name__ == "__main__":
    # Run this via: `python3 tools/internet_nl_translations/main.py`
    update_babel_translations()