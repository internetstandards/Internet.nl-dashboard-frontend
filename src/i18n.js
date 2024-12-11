import {createI18n} from 'vue-i18n'


import nl from "./locales/nl.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";


const i18n = createI18n({
  // todo: locale from store
  // locale: store.state.locale || 'en',
  // something vue-i18n options here ...
  warnHtmlMessage: false,
  fallbackLocale: 'en',
  messages: {nl: nl, en: en, fr: fr, de: de},
})

export default i18n
