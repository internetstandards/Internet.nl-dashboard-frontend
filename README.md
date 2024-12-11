# dashboard_frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

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
