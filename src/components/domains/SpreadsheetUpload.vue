<!-- SPDX-License-Identifier: Apache-2.0 -->
<style>
#my-spreadsheet-upload-template .block form {
  overflow: visible;
}

/* Improve contrast for uploads, even though you might not see the right colors, you can now actually see the
 symbol and the result. */
.dropzone .dz-preview.dz-success .dz-success-mark svg g path {
  fill: green;
}

.dropzone .dz-preview.dz-error .dz-error-mark svg g g {
  fill: #ff0000;
}

.dz-error {
  border: 5px solid red;
  border-radius: 23px;
  width: 130px !important;
}

.dz-success {
  border: 5px solid green;
  border-radius: 23px;
  width: 130px !important;
}

/** Having the OK sign disappear does not help, and it flies over too fast... */
.dropzone .dz-preview.dz-success .dz-success-mark {
  opacity: 1;
  -webkit-animation: slide-in 3s cubic-bezier(0.77, 0, 0.175, 1) !important;
  -moz-animation: slide-in 3s cubic-bezier(0.77, 0, 0.175, 1) !important;
  -o-animation: slide-in 3s cubic-bezier(0.77, 0, 0.175, 1) !important;
  animation: slide-in 3s cubic-bezier(0.77, 0, 0.175, 1) !important;
}

</style>
<template>
  <div id="my-spreadsheet-upload-template">
    <content-block>
      <p>&nbsp;
        <router-link to="/domains" custom v-slot="{ navigate }">
          <b-button variant="warning" @click="navigate" @keypress.enter="navigate">
            📚 {{ $t("domain.spreadsheet-upload.back_to_domains") }}
          </b-button>
        </router-link>
      </p>
      <h1>{{ $t("domain.spreadsheet-upload.upload.bulk_data_uploader.title") }}</h1>
      <p>{{ $t("domain.spreadsheet-upload.upload.bulk_data_uploader.introduction") }}</p>
      <table>
        <tbody>
        <tr>
          <th></th>
          <th>{{ $t("domain.spreadsheet-upload.upload.empty_file") }}</th>
          <th>{{ $t("domain.spreadsheet-upload.upload.file_with_example_data") }}</th>
        </tr>
        <tr>
          <td>
            {{ $t("domain.spreadsheet-upload.upload.open_document_spreadsheet") }}
          </td>
          <td>
            <a href="/static_frontend/sample_spreadsheets/libre_office_spreadsheet_empty.ods">Empty.ods</a>
          </td>
          <td>
            <a href="/static_frontend/sample_spreadsheets/libre_office_spreadsheet_with_example_data.ods">Example.ods</a>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("domain.spreadsheet-upload.upload.microsoft_office_excel") }}
          </td>
          <td>
            <a href="/static_frontend/sample_spreadsheets/microsoft_office_spreadsheet_empty.xlsx">Empty.xlsx</a>
          </td>
          <td>
            <a href="/static_frontend/sample_spreadsheets/microsoft_office_spreadsheet_with_example_data.xlsx">Example.xlsx</a>
          </td>
        </tr>
        </tbody>
      </table>
    </content-block>
    <content-block>
      <h3>{{ $t("domain.spreadsheet-upload.upload.drag_and_drop_uploader.title") }}</h3>
      <p>{{ $t("domain.spreadsheet-upload.upload.drag_and_drop_uploader.first_instruction") }}</p>
      <p>{{ $t("domain.spreadsheet-upload.upload.drag_and_drop_uploader.nomouse") }}</p>
      <p>{{ $t("domain.spreadsheet-upload.upload.drag_and_drop_uploader.process") }}</p>
      <p>{{ $t("domain.spreadsheet-upload.upload.drag_and_drop_uploader.details_after_upload") }}</p>
      <p><i>{{ $t("domain.spreadsheet-upload.upload.drag_and_drop_uploader.warnings", [max_urls, max_lists]) }}</i></p>

      <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot=true
                    v-on:vdropzone-sending="dropzone_sendingEvent">
        <div class="dropzone-custom-content">
          <h3 class="dropzone-custom-title">{{ $t("domain.spreadsheet-upload.dropzone.title") }}</h3>
          <div class="subtitle">{{ $t("domain.spreadsheet-upload.dropzone.subtitle") }}</div>
        </div>
      </vue-dropzone>

      <form :action="`${$baseUrl}/data/upload-spreadsheet/`" method="POST"
            enctype="multipart/form-data">
        <div class="fallback">
          <p>{{ $t("domain.spreadsheet-upload.upload.drag_and_drop_uploader.fallback_select_a_file") }}</p>
          <input name="file" type="file"/>
          <input type="submit">
        </div>
        <input type="hidden" name="csrfmiddlewaretoken" :value="csrf_token">
      </form>

    </content-block>
    <content-block>
      <h3>{{ $t("domain.spreadsheet-upload.upload.recent_uploads.title") }}</h3>
      <p>{{ $t("domain.spreadsheet-upload.upload.recent_uploads.intro") }}</p>

      <b-table-simple hover striped responsive small v-if="upload_history">
        <thead>
        <tr>
          <th>{{ $t("domain.spreadsheet-upload.upload.recent_uploads.date") }}</th>
          <th>{{ $t("domain.spreadsheet-upload.upload.recent_uploads.filename") }}</th>
          <th>{{ $t("domain.spreadsheet-upload.upload.recent_uploads.status") }}</th>
          <th>{{ $t("domain.spreadsheet-upload.upload.recent_uploads.progress") }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(upload, index) in upload_history" :key="index">
          <td width="22%"><span :title="upload.upload_date">{{ humanize_date(upload.upload_date) }}</span></td>

          <td width="22%">
            {{ upload.original_filename }}
            <b-badge :title="upload.filesize + ' bytes'">{{
              humanize_filesize(upload.filesize)
            }}</b-badge></td>
          <td>{{ upload.message }}</td>
          <td width="15%"><b-progress class="mt-2" :max="100"><b-progress-bar variant="success" :show-progress="false" :value="upload.percentage" /></b-progress></td>
        </tr>
        </tbody>
      </b-table-simple>

      <autorefresh :visible="true" :callback="get_recent_uploads" :refresh_per_seconds="30" v-if="store.user.is_authenticated" />

      <span v-if="!upload_history.length">{{ $t("domain.spreadsheet-upload.upload.recent_uploads.no_uploads") }}</span>
    </content-block>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone-vue3'
// import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import http from "@/httpclient";
import Autorefresh from "@/components/autorefresh.vue";
import { dashboardStore } from '@/dashboardStore'

export default {
  mixins: [],
  data: function () {
    let self = this;
    return {
      store: dashboardStore(),
      loading: false,
      csrf_token: "",
      upload_history: [],
      dropzoneOptions: {
        url: `${this.$baseUrl}/data/upload-spreadsheet/`,
        thumbnailWidth: 150,
        // in megabytes, 25 k domains is 1.2 megabyte so it is barred from uploading on the client side
        maxFilesize: 2,

        // no need for CSRF token here anymore...
        withCredentials: true,
        paramName: "file",
        headers: {"X-CSRFToken": this.get_cookie('csrftoken')},

        // https://gitlab.com/meno/dropzone#enqueuing-file-uploads
        parallelUploads: 1, // handle one at a time to reduce load a bit (except not if you bypass this)
        autoProcessQueue: true,

        /*
        * Client side protection to accept only excel and ods files. Note that given the complexity of these formats,
        * there's a wide window of uploading corrupted or malicious files.
        *
        * More info about mime types:
        * https://stackoverflow.com/questions/4212861/what-is-a-correct-mime-type-for-docx-pptx-etc#4212908
        * https://www.openoffice.org/framework/documentation/mimetypes/mimetypes.html
        * */
        acceptedFiles:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' +
            'application/vnd.ms-excel,' +
            'application/vnd.oasis.opendocument.spreadsheet,' +
            'text/plain,' +
            'text/x-csv,' +
            'text/csv',

        // Use this to test when there is a malfunction in the uploader code.
        forceFallback: false,

        // Some events reload the recent uploaded file list.
        init: function () {
          // function(file, server_response)
          this.on("success", function () {
            // todo: update the domain lists...
            // That can be done with a state change...
            self.get_recent_uploads();
          });
          this.on("error", function () {
            self.get_recent_uploads();
          });
        }
      }
    }
  },
  props: {
    // Something weird happens when an integer is passed, it is still seen as a string.
    max_urls: {type: Number, required: true},
    max_lists: {type: Number, required: true},
  },
  mounted: function () {
    this.get_recent_uploads();
    this.csrf_token = this.get_cookie('csrftoken');
  },
  components: {
    Autorefresh,
    vueDropzone: vue2Dropzone
  },
  methods: {
    get_cookie: function (name) {
      // isn't there a nicer vue alternative instead of the crude get_cookie parsing misery?
      let value = "; " + document.cookie;
      let parts = value.split("; " + name + "=");
      if (parts.length === 2) {
        return parts.pop().split(";").shift();
      }
    },
    humanize_filesize: function (size_in_bytes, decimals = 0) {
        if (size_in_bytes === 0) {
          return '0 Bytes';
        }
        let k = 1024,
          dm = decimals <= 0 ? 0 : decimals || 2,
          sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(size_in_bytes) / Math.log(k));
        return parseFloat((size_in_bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      },

    dropzone_sendingEvent(file, xhr, formData) {
      // add the csrfmiddlewaretoken to the form.
      formData.append('csrfmiddlewaretoken', this.get_cookie('csrftoken'));
    },

    get_recent_uploads: function () {
      http.get(`/data/upload-history`).then(data => {
        // don't create a very long list because updates can flash
        this.upload_history = data.data.splice(0, 10);
        this.store.set_uploads_performed(data.data.length);
      });
    },
  }
}
</script>
