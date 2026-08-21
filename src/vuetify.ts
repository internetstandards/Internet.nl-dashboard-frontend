// SPDX-License-Identifier: Apache-2.0
import {createVuetify} from 'vuetify'
import {aliases, mdi} from 'vuetify/iconsets/mdi-svg'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {mdi},
  },
  theme: {
    defaultTheme: 'internetNl',
    themes: {
      internetNl: {
        dark: false,
        colors: {
          primary: '#00689d',
          secondary: '#495057',
          info: '#00a0c6',
          warning: '#ffb612',
          error: '#dc3545',
          success: '#198754',
        },
      },
    },
  },
})
