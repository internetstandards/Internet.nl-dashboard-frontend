<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
h2 {
    font-size: 1.5em;
}

p {
    margin-bottom: 0;
}
</style>
<template>
    <div>
        <b-alert :show="show || force_show" variant="danger" v-if="response.error" dismissible fade>
            <h2>❌ {{ $t('app.server-response.error') }}</h2>
            <p role="alert">
                <span v-if="!message">{{ response.message }}</span>
                <span v-if="message">{{ message }}</span>
            </p>
          <span><small>{{ $t('app.server-response.at') }} {{ humanize_date(response.timestamp) }}<span v-if="time_ago">  ({{ time_ago }})</span>.</small></span>
        </b-alert>
        <b-alert :show="show || force_show" variant="success" v-if="response.success" dismissible fade>
            <h2>✅ {{ $t('app.server-response.success') }}</h2>
            <p role="alert">
                <span v-if="!message">{{ response.message }}</span>
                <span v-if="message">{{ message }}</span>
            </p>
            <span><small>{{ $t('app.server-response.at') }} {{ humanize_date(response.timestamp) }}<span v-if="time_ago"> ({{ time_ago }})</span>.</small></span>
        </b-alert>
    </div>
</template>
<script>
export default {
    // make sure the 'humanize_relative_date' is somewhat accurate, when the screen is open for a long while
    // https://stackoverflow.com/questions/36572540/vue-js-auto-reload-refresh-data-with-timer
    created: function () {
        this.timer = setInterval(this.update, 30000)
    },
    mounted: function () {
        this.update();
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
        update: function () {
            if (this.response !== undefined && this.response.timestamp !== undefined) {
                this.time_ago = this.humanize_relative_date(this.response.timestamp)
            }
        }
    },
    data: function () {
        return {
            timer: '',
            time_ago: '',
            show: false
        }
    },
    watch: {
        response: function () {

          // don't toast when there is nothing to say
          if (Object.keys(this.response).length === 0)
            return;

            // a new response, means this should be visible again:
            this.show = true;

            // a new response is made. Let's add a toast message.
            this.$bvToast.toast(this.message ? this.message : this.response.message, {
                title: this.response.error ? `❌ ${this.$i18n.t('error')}` : `✅ ${this.$i18n.t('success')}`,
                autoHideDelay: 5000,
                variant: this.response.error ? 'danger' : 'success',
                solid: true,
                isStatus: true,  // message is also displayed on the page using more accessible methods
              toaster: 'b-toaster-bottom-right',

                appendToast: false,
            })
        }
    },
    props: {
        response: {
            type: Object,
            default: null,
        },
        // This compponent does not have access to it's parent. To keep it simple, just allow a direct translation.
        message: {
            type: String,
            default: ""
        },
        force_show:{
            type:Boolean,
            default: false
        }
    }
}
</script>
