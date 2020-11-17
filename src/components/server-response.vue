<style scoped>
/* Todo: add toast notification */

h2{
    font-size: 1.5em;
}

p {
    margin-bottom: 0;
}
</style>
<template>
    <div>
        <b-alert show variant="danger" v-if="response.error">
            <h2>❌ {{ $t('error') }}</h2>
            <p role="alert">
                <span v-if="!message">{{ response.message }}</span>
                <span v-if="message">{{ message }}</span>
            </p>
            <span><small>{{ $t('at') }} {{ humanize_date(response.timestamp) }} ({{ time_ago }}).</small></span>
        </b-alert>
        <b-alert show variant="success" v-if="response.success">
            <h2>✅ {{ $t('success') }}</h2>
            <p role="alert">
                <span v-if="!message">{{ response.message }}</span>
                <span v-if="message">{{ message }}</span>
            </p>
            <span><small>{{ $t('at') }} {{ humanize_date(response.timestamp) }} ({{ time_ago }}).</small></span>
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
    mounted: function(){
        this.update();
    },
    beforeDestroy () {
        clearInterval(this.timer)
    },
    methods: {
        update: function (){
            if (this.response !== undefined) {
                this.time_ago = this.humanize_relative_date(this.response.timestamp)
            }
        }
    },
    data:  function () {
        return {
            timer: '',
            time_ago: '',
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
        }
    }
}
</script>
<i18n>
{
    "en": {
        "error": "An error occurred",
        "success": "Success!",
        "at": "At"
    },
    "nl": {
        "error": "Er is iets mis gegaan",
        "success": "Gelukt!",
        "at": "Op"
    }
}
</i18n>