# dashboard_frontend

This template should help get you started developing with Vue 3 in Vite.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
make run
```

### Type-Check, Compile and Minify for Production

```sh
make build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```



## Translations
Translations are maintained by babeledit in the locales directory. A mapping.md is present
that helps mapping from the merged-to-js internet.nl repository values to dashboard metrics.

Use the conversion tool `python3 tools/convert_translations/main.py` to convert the .po stuff from the dashboard
backend to the frontend. This will overwrite the keys as needed.


# Deployment

## On staging
`/usr/local/bin/dashboard-frontend-update`


## For live

1: make promote_staging_to_live on this repo
2: on the server: `/usr/local/bin/dashboard-frontend-update`

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# Deployment:

## Step 1: make new image from this repository
make image
make push_image

## Step 2: on the server run the update
/usr/local/bin/dashboard-frontend-update



# Testing a build locally:
```sh
make build
cd dist && python -m http.server 7777
```