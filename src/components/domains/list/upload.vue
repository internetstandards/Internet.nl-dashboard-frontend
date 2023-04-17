<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
    <b-modal size="lg" :visible="visible" @hidden="cancel()" header-bg-variant="info" header-text-variant="light" no-fade
             scrollable>
        <h3 slot="modal-title">📝 {{ $t("title") }}</h3>
        <div slot="default">

            <server-response :response="response"></server-response>

          <p><i>Let op: het uploaden van domeinen vervangt alle domeinen in deze lijst. Dit kan niet ongedaan
          worden gemaakt. Zorg dus dat je een backup heb gedownload van deze lijst.</i></p>

          <input
            type="file"
            ref="file"
            id="file"
            v-on:change="handleFileUpload()"
            name="file"
            accept="text/csv, application/vnd.oasis.opendocument.spreadsheet, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          >

        </div>
        <div slot="modal-footer">
            <button class='altbutton' @click="cancel()">{{ $t("cancel") }}</button>
            &nbsp;
            <button class="modal-default-button defaultbutton border-danger" @click="upload()">
                {{ $t("ok") }}
            </button>
        </div>
    </b-modal>
</template>

<script>
import sharedMessages from "@/components/translations/dashboard";
import http from "@/httpclient";

export default {
    name: "upload-domains",
    i18n: {
        sharedMessages: sharedMessages,
    },
    props: {
        list: {
            type: Object,
        },
        visible: {
            type: Boolean,
        }
    },
    data: function () {
        return {
            file: '',
            response: {}
        }
    },
    methods: {
        cancel: function () {
            this.$emit('cancel')
        },
        handleFileUpload() {
          this.file = this.$refs.file.files[0];
          console.log('>>>> 1st element in files array >>>> ', this.file);
        },
        upload: function () {

            let formData = new FormData();
            formData.append('file', this.file);

            http.post(`/data/urllist/upload/${this.list.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }},
            ).then(server_response => {
                this.response = server_response.data;
                if (server_response.data.success) {
                  this.$emit("done")
                }
            });
        },
    },
    mounted: function () {
        this.response = {};
    }
}
</script>

<i18n>
{
    "en": {
        "title": "Upload domains (overwrite)",
        "cancel": "Cancel",
        "ok": "Overwrite domains"
    },
    "nl": {
        "title": "Domeinen uploaden (overschrijven)",
        "cancel": "Annuleer",
        "ok": "Overschrijf domeinen"
    }
}
</i18n>