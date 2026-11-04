<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <form @submit.prevent="submit" @dragover.prevent @drop.prevent="dropFile">
    <template v-if="mode === 'text'">
      <label :for="`batch-text-${list.id}`">{{ $t('domain.list.add-domains.domains_label') }}</label>
      <textarea :id="`batch-text-${list.id}`" v-model="text" class="form-control mb-3" rows="12" :disabled="submitting" />
    </template>
    <template v-else>
      <button v-if="autoUpload" type="button" class="spreadsheet-drop-zone mb-3"
              :class="{'is-dragging': dragging}" :disabled="submitting"
              @click="$refs.fileInput.click()"
              @dragenter.prevent="dragging = !submitting" @dragover.prevent="dragging = !submitting"
              @dragleave.prevent="dragging = dragging && $event.currentTarget.contains($event.relatedTarget)"
              @drop.prevent.stop="dropFile">
        <i-bi-cloud-arrow-up class="drop-zone-icon" aria-hidden="true" />
        <strong>{{ $t('domain.batch.dropzoneTitle') }}</strong>
        <span>{{ $t('domain.batch.dropzoneBrowse') }}</span>
        <small>{{ $t('domain.batch.dropzoneFormats') }}</small>
      </button>
      <label v-else :for="`batch-file-${list?.id || 'all'}`">{{ $t('domain.batch.chooseFile') }}</label>
      <input :id="`batch-file-${list?.id || 'all'}`" ref="fileInput" class="form-control mb-3"
             type="file" name="file" accept=".csv,.xls,.xlsx,.ods" :hidden="autoUpload"
             :aria-label="$t('domain.batch.chooseFile')" :disabled="submitting"
             @change="selectFile($event.target.files[0]); if (autoUpload) $event.target.value = ''" />
      <p v-if="file">{{ file.name }}</p>
    </template>
    <button v-if="!autoUpload" class="btn btn-primary" type="submit" :disabled="submitting || (mode === 'text' ? !text.trim() : !file)">
      {{ $t('domain.batch.validate') }}
    </button>
    <p v-if="submitting" role="status">{{ $t('domain.batch.uploading') }} {{ uploadPercentage }}%</p>
    <progress v-if="submitting" class="w-100 upload-progress" :value="uploadPercentage" max="100" :aria-label="$t('domain.batch.uploading')" />
    <server-response v-if="response" :response="response" />
    <button v-if="autoUpload && response" class="btn btn-primary" type="submit" :disabled="submitting || !file">
      {{ $t('domain.batch.retryUpload') }}
    </button>
  </form>
  <DomainBatchProgress v-if="batch" :batch="batch" :current-list-id="list?.id" @completed="$emit('added')" @cancelled="$emit('added')" />
</template>

<script>
import http from '@/httpclient'
import {requestError} from '@/requestError'
import DomainBatchProgress from './DomainBatchProgress.vue'

export default {
  components: {DomainBatchProgress},
  props: {list: {type: Object, default: null}, mode: {type: String, default: 'text'},
    autoUpload: {type: Boolean, default: false}},
  emits: ['added', 'accepted'],
  data() {return {text: '', file: null, dragging: false, submitting: false, uploadPercentage: 0, response: null, batch: null}},
  methods: {
    dropFile(event) {
      this.dragging = false
      if (this.mode === 'spreadsheet') this.selectFile(event.dataTransfer?.files[0])
    },
    selectFile(file) {
      if (this.submitting || !file) return
      this.file = file
      if (this.autoUpload) this.submit()
    },
    async submit() {
      if (this.submitting || (this.mode === 'text' ? !this.text.trim() : !this.file)) return
      this.submitting = true
      this.response = null
      this.uploadPercentage = 0
      let payload, url
      if (this.mode === 'text') {
        payload = {raw_urls: this.text}
        url = `/api/v1/urllists/${this.list.id}/urls`
      } else {
        payload = new FormData()
        payload.append('file', this.file)
        url = this.list ? `/api/v1/urllists/${this.list.id}/spreadsheets` : '/api/v1/urllists/import-spreadsheets'
      }
      try {
        const {data} = await http.post(url, payload, {onUploadProgress: event => {
          this.uploadPercentage = event.total ? Math.round(100 * event.loaded / event.total) : 0
        }})
        this.batch = data
        this.$emit('accepted', data)
      } catch (error) {this.response = requestError(error)}
      finally {this.submitting = false}
    },
  },
}
</script>

<style scoped>
.spreadsheet-drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  min-height: 220px;
  padding: 2rem;
  border: 2px dashed var(--bs-border-color);
  border-radius: 0.75rem;
  background: var(--bs-tertiary-bg);
  color: var(--bs-body-color);
  text-align: center;
  cursor: pointer;
}
.spreadsheet-drop-zone:hover,
.spreadsheet-drop-zone.is-dragging {
  border-color: var(--bs-primary);
  background: var(--bs-primary-bg-subtle);
}
.spreadsheet-drop-zone:focus-visible {
  outline: 3px solid var(--bs-primary);
  outline-offset: 3px;
}
.spreadsheet-drop-zone:disabled {
  cursor: progress;
  opacity: 0.65;
}
.drop-zone-icon {
  width: 2.5rem;
  height: 2.5rem;
}
.upload-progress {height: 16px; appearance: none; overflow: hidden; border: 1px solid #037584; border-radius: 10px; background: #eef6f9;}
.upload-progress::-webkit-progress-bar {background: #eef6f9;}
.upload-progress::-webkit-progress-value {background: linear-gradient(#45e7fb, #05bfd6);}
.upload-progress::-moz-progress-bar {background: linear-gradient(#45e7fb, #05bfd6);}
</style>
