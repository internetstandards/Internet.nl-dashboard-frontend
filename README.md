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


# Deployment:

## Step 1: make new image from this repository
make image
make push_image

## Step 2: on the server run the update
/usr/local/bin/dashboard-frontend-update


# issues:

## ERR_OSSL_EVP_UNSUPPORTED
`export NODE_OPTIONS=--openssl-legacy-provider`
https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported
