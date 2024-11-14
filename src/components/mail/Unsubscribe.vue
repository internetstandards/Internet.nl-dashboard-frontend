<!-- SPDX-License-Identifier: Apache-2.0 -->
<template type="text/x-template" id="unsubscribe_template">
    <div>
        <content-block>
            <h1>{{ $t("mail.unsubscribe.title") }}</h1>

            <loading :loading="loading"></loading>

            <div v-if="unsubscribed">
                <div class="server-response-success">
                    <span>✅ {{ $t("mail.unsubscribe.success") }}</span>
                </div>
            </div>

            <div v-if="error_occurred">
                <div class="server-response-error">
                    <span>❌ {{ $t("mail.unsubscribe.error") }}</span>
                </div>
            </div>

            <template v-if="show_unsubscribe_form">
                <p>{{ $t("mail.unsubscribe.intro") }}</p>

                <b>{{ $t("mail.unsubscribe.label_feed") }}</b><br>
                <input id="feed" type="text" maxlength="120" v-model="feed"><br><br>
                <br>
                <b>{{ $t("mail.unsubscribe.label_unsubscribe_code") }}</b><br>
                <input id="unsubscribe_code" type="text" maxlength="120" v-model="unsubscribe_code"><br><br>
                <template v-if="!unsubscribe_code || !feed">
                    <button class="defaultbutton modal-default-button" disabled>
                        {{ $t("mail.unsubscribe.perform_unsubscribe") }}
                    </button>
                </template>
                <template v-else>
                    <button class="defaultbutton modal-default-button" @click="unsubscribe()">
                        {{ $t("mail.unsubscribe.perform_unsubscribe") }}
                    </button>
                </template>
            </template>

        </content-block>
    </div>
</template>

<script>
import http from "@/httpclient";

export default {
    data: function () {
        return {
            feed: "",
            unsubscribe_code: "",
            unsubscribed: false,
            error_occurred: false,
            show_unsubscribe_form: false,
            loading: false,
        }
    },
    mounted: function () {
        // support: http://[]/spa/#/unsubscribe?feed=asdasd&unsubscribe_code=3819318
        if (this.$route.query.feed !== undefined) {
            this.feed = this.$route.query.feed;
        }
        if (this.$route.query.unsubscribe_code !== undefined) {
            this.unsubscribe_code = this.$route.query.unsubscribe_code;
        }

        // if both are set, just immediately unsubscribe.
        // and do not show the form to prevent confusion.
        if (this.feed && this.unsubscribe_code) {
            this.unsubscribe()
            this.show_unsubscribe_form = false;
        } else {
            this.show_unsubscribe_form = true;
        }
    },
    methods: {
        unsubscribe: function () {
            // credentials not needed
            // this will always take about a second to deter brute force / account guessing.
            this.loading = true;
            this.unsubscribed = false;
            this.error = false;
            http.get(`/mail/unsubscribe/${this.feed}/${this.unsubscribe_code}/`).then(data => {
                if (data.data['unsubscribed']) {
                    this.unsubscribed = true;
                    this.error_occurred = false;
                }
                this.loading = false;
            });
        },
    },
    name: 'unsubscribe',
}
</script>
