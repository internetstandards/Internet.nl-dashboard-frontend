// SPDX-License-Identifier: Apache-2.0
// Match complete RFC 9457 type URIs; deployment URLs and human text are not identifiers.
const namespace = 'tag:internet.nl,2026:dashboard:'

export const problemTypes = Object.freeze({
  INVALID_INPUT: `${namespace}invalid-input`,
  INVALID_CAPTCHA: `${namespace}invalid-captcha`,
  USER_SETTINGS_NOT_FOUND: `${namespace}user-settings-not-found`,
  UNSUPPORTED_LANGUAGE: `${namespace}unsupported-language`,
  INVALID_EMAIL_ADDRESS: `${namespace}invalid-email-address`,
  USERNAME_REQUIRED: `${namespace}username-required`,
  PASSWORD_TOO_SHORT: `${namespace}password-too-short`,
  ACCOUNT_NAME_REQUIRED: `${namespace}account-name-required`,
  USERNAME_ALREADY_EXISTS: `${namespace}username-already-exists`,
  ACCOUNT_NAME_ALREADY_EXISTS: `${namespace}account-name-already-exists`,
  ACCOUNT_NOT_FOUND: `${namespace}account-not-found`,
  LIST_NOT_FOUND: `${namespace}list-not-found`,
  DOMAIN_LIMIT_EXCEEDED: `${namespace}domain-limit-exceeded`,
  REPORT_SHARING_UNAVAILABLE: `${namespace}report-sharing-unavailable`,
  DISCOVERY_NOT_STARTED: `${namespace}discovery-not-started`,
  REPORT_ACCESS_DENIED: `${namespace}report-access-denied`,
})

// The frontend owns locale keys, including historical names in the translation files.
const translations = {
  [problemTypes.INVALID_INPUT]: 'account.notifications.save_user_settings_error_incomplete_data',
  [problemTypes.INVALID_CAPTCHA]: 'signup.form.incorrect_captcha',
  [problemTypes.USER_SETTINGS_NOT_FOUND]: 'account.notifications.save_user_settings_error_could_not_retrieve_user',
  [problemTypes.UNSUPPORTED_LANGUAGE]: 'account.notifications.save_user_settings_error_form_unsupported_language',
  [problemTypes.INVALID_EMAIL_ADDRESS]: 'account.notifications.save_user_settings_error_form_incorrect_mail_address',
  [problemTypes.USERNAME_REQUIRED]: 'admin.instant_add_account.error_no_username_supplied',
  [problemTypes.PASSWORD_TOO_SHORT]: 'admin.instant_add_account.error_password_too_short',
  [problemTypes.ACCOUNT_NAME_REQUIRED]: 'admin.instant_add_account.error_no_account_name_supplied',
  [problemTypes.USERNAME_ALREADY_EXISTS]: 'admin.instant_add_account.error_username_already_exists',
  [problemTypes.ACCOUNT_NAME_ALREADY_EXISTS]: 'admin.instant_add_account.error_account_name_already_exists',
  [problemTypes.ACCOUNT_NOT_FOUND]: 'admin.instant_add_account.error_account_not_found',
  [problemTypes.LIST_NOT_FOUND]: 'domain.list.add-domains.add_domains_list_does_not_exist',
  [problemTypes.DOMAIN_LIMIT_EXCEEDED]: 'domain.list.add-domains.too_many_domains',
  [problemTypes.REPORT_SHARING_UNAVAILABLE]: 'report.sharing_configuration.response_no_report_found',
}

export function problemTranslationKey(type) {
  return Object.hasOwn(translations, type) ? translations[type] : null
}
