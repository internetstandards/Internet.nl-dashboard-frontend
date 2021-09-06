# dashboard_frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

# Deployment

## On staging
`/usr/local/bin/dashboard-frontend-update`


## For live

1: make promote_staging_to_live on this repo
2: on the server: `/usr/local/bin/dashboard-frontend-update`

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# Dependencies:

## "bootstrap": "^4.5.3",
Required by bootstrapvue

## "bootstrap-vue": "^2.18.1",
Todo: only use the parts you need to reduce bundle size

## "chart.js": "^2.9.4",
Used to create nice charts

## "chartjs-plugin-datalabels": "^0.7.0",
Used to show amounts of data in charts

## "core-js": "^3.6.5",
Used to support old browsers, android

## "debounce": "^1.2.0",
Used to prevent sudden re-rendering of charts when data changes

## "headroom.js": "^0.12.0",
Part of the internet.nl design, moves the header out of the way when scrolling down

## "matomo-tracker": "^2.2.4",
Used for stats tracking

## "portal-vue": "^2.1.7",
Used for toast notifications in bootstrapvue

## "vue": "^2.6.12",
Used for easy development and dynamic pages

## "vue-i18n": "^8.22.1",
Used for translations

## "date-fns": "^2.16.1",
Replacement of moment.js

## "vue-router": "^3.4.8",
Used for navigation

## "vue-select": "^3.10.8",
Used for report-selection

## "vue2-dropzone": "^3.6.0",
Used for spreadsheet uploads

## "vuex": "^3.5.1",
Used to share application state amongst components

## "vuex-persistedstate": "^4.0.0-beta.1"
Used to save the language and other app settings after first visit
