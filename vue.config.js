// The syntax and complexity in this file is in unacceptable condition.

// from https://bootstrap-vue.org/docs, Aliasing Vue import
const path = require('path')

module.exports = {
    devServer: {
        // // To test CSP, set the server to production (see makefile) and enable below CSP header.
        // the data: part is explained here: https://security.stackexchange.com/questions/94993/is-including-the-data-scheme-in-your-content-security-policy-safe/167244#167244
        // Issue about the data part is here: https://github.com/bootstrap-vue/bootstrap-vue/issues/6805
        // headers: {"Content-Security-Policy": "default-src 'self' http://localhost:8000; img-src 'self' data:"}
    },
    chainWebpack: config => {
        config.module
            .rule("i18n")
            .resourceQuery(/blockType=i18n/)
            .type('javascript/auto')
            .use("i18n")
            .loader("@kazupon/vue-i18n-loader")
            .end();
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "Internet.nl Dashboard";
                return args;
            })
        config.resolve.alias.set(
            'vue$',
            // If using the runtime only build
            path.resolve(__dirname, 'node_modules/vue/dist/vue.runtime.esm.js')
            // Or if using full build of Vue (runtime + compiler)
            // path.resolve(__dirname, 'node_modules/vue/dist/vue.esm.js')
        )
    }
}