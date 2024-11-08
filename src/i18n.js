import VueI18n from "vue-i18n";
import Vue from "vue";

import store from './store';

// this is used to convert internet.nl messages to the console log. From there you can move them to a translation file.
// import interpolate_translations from "@/locales/merge_wsm_inl";

import nl from "./locales/nl.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";


// todo: lazy loading.
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: store.state.locale || 'en',
  fallbackLocale: 'en',
  // this is needed to silence warnings when usin lazy loading?
  // TODO: find out if this is really needed, there should be none to little missing translations.
  silentFallbackWarn: false,
  // it's requformatDistanceired this is called messages.
  messages: {nl: nl, en: en, fr: fr, de: de},
  sharedMessages: {}
});

export default i18n
