<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.domain-display,
.domain-editor,
.domain-editor-actions {
  align-items: center;
  display: flex;
  gap: 0.5rem;
}

.domain-display,
.domain-editor {
  flex-wrap: wrap;
  min-width: 0;
  white-space: normal;
}

.domain-value {
  min-width: 0;
  overflow-wrap: anywhere;
}

.domain-editor-input {
  flex: 1 1 18rem;
  min-width: min(12rem, 100%);
}

.domain-editor-actions {
  flex-wrap: wrap;
  gap: 0.25rem;
}

.domain-action-icon {
  flex: 0 0 auto;
}
</style>

<template>
  <div v-if="!editing" class="domain-display">
    <span class="domain-value">
      <template v-if="displayed_url.subdomain">
        {{ displayed_url.subdomain }}.</template><b>{{ displayed_url.domain }}.{{ displayed_url.suffix }}</b>
    </span>

    <b-button
        size="sm"
        variant="outline-primary"
        type="button"
        @click="start_url_editing"
    >
      <i-bi-pencil class="domain-action-icon" aria-hidden="true" />
      {{ $t("domain.edit-domain.edit") }}
    </b-button>
  </div>

  <form v-else :id="editorId" class="domain-editor" @submit.prevent="save" @keydown.esc="cancel">
    <label class="visually-hidden" :for="inputId">{{ $t("domain.edit-domain.domain") }}</label>
    <b-form-input
        :id="inputId"
        ref="urlInput"
        v-model="edited_url_value"
        class="domain-editor-input"
        type="text"
    />

    <div class="domain-editor-actions">
      <b-button size="sm" variant="success" type="submit">
        <i-bi-floppy class="domain-action-icon" aria-hidden="true" />
        {{ $t("domain.edit-domain.save") }}
      </b-button>
      <b-button size="sm" variant="outline-secondary" type="button" @click="cancel">
        <i-bi-arrow-counterclockwise class="domain-action-icon" aria-hidden="true" />
        {{ $t("domain.edit-domain.undo") }}
      </b-button>
      <b-button size="sm" variant="danger" type="button" @click="request_delete">
        <i-bi-trash class="domain-action-icon" aria-hidden="true" />
        {{ $t("domain.edit-domain.delete") }}
      </b-button>
    </div>
  </form>

  <b-modal
      v-if="deleteConfirmationVisible"
      v-model="deleteConfirmationVisible"
      :id="deleteModalId"
      :title="$t('domain.edit-domain.delete-confirmation-title')"
      header-bg-variant="danger"
      header-text-variant="light"
      no-fade
  >
    <p>
      {{ $t("domain.edit-domain.delete-confirmation-message", {
        domain: url.url,
        list: list.name,
      }) }}
    </p>

    <b-form-checkbox :id="deleteSuppressionId" v-model="suppressDeleteConfirmation">
      {{ $t("domain.edit-domain.skip-delete-confirmation") }}
    </b-form-checkbox>

    <template #footer>
      <b-button variant="secondary" type="button" @click="cancel_delete">
        {{ $t("domain.edit-domain.cancel") }}
      </b-button>
      <b-button variant="danger" type="button" @click="confirm_delete">
        <i-bi-trash class="domain-action-icon" aria-hidden="true" />
        {{ $t("domain.edit-domain.delete") }}
      </b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import http from "@/httpclient";
import {
  isDomainDeleteConfirmationSuppressed,
  suppressDomainDeleteConfirmationForOneHour,
} from '@/components/domains/domain/deleteConfirmation'

export default {
  name: "editDomain",
  computed: {
    editorId() {
      return `domain-editor-${this.list.id}-${this.url.id}`
    },
    inputId() {
      return `domain-url-${this.list.id}-${this.url.id}`
    },
    deleteModalId() {
      return `delete-domain-modal-${this.list.id}-${this.url.id}`
    },
    deleteSuppressionId() {
      return `skip-delete-domain-confirmation-${this.list.id}-${this.url.id}`
    },
  },
  data: function () {
    return {
      editing: false,
      deleteConfirmationVisible: false,
      suppressDeleteConfirmation: false,


      url_edit: '',
      original_url_value: '',

      edited_url_value: '',
      displayed_url: {
        subdomain: "",
        domain: "",
        suffix: "",
      }
    }
  },
  props: {
    list: {
      type: Object
    },
    url: {
      type: Object
    }
  },
  mounted: function () {
    this.edited_url_value = this.url.url;
    this.displayed_url.subdomain = this.url.subdomain;
    this.displayed_url.domain = this.url.domain;
    this.displayed_url.suffix = this.url.suffix;
    this.original_url_value = this.url.url;
  },
  methods: {
    start_url_editing: function () {
      this.editing = true;
      this.$nextTick(() => this.$refs.urlInput?.$el?.focus())
    },
    cancel: function () {
      this.edited_url_value = this.original_url_value;
      this.editing = false;
    },
    delete_url: function () {
      this.$emit('domain_deleted');
    },
    request_delete: function () {
      if (this.is_delete_confirmation_suppressed()) {
        this.delete_url()
        return
      }

      this.suppressDeleteConfirmation = false
      this.deleteConfirmationVisible = true
    },
    cancel_delete: function () {
      this.deleteConfirmationVisible = false
      this.suppressDeleteConfirmation = false
    },
    confirm_delete: function () {
      if (this.suppressDeleteConfirmation) {
        this.suppress_delete_confirmation_for_one_hour()
      }

      this.deleteConfirmationVisible = false
      this.delete_url()
    },
    is_delete_confirmation_suppressed: function () {
      return isDomainDeleteConfirmationSuppressed(this.list.id)
    },
    suppress_delete_confirmation_for_one_hour: function () {
      suppressDomainDeleteConfirmationForOneHour(this.list.id)
    },
    save: function () {
      /*
      * This is not a real 'save' but an add to list and create if it doesn't exist operation.
      * The save does not 'alter' the existing URL in the database. It will do some list operations.
      * */
      const data = {'new_url_string': this.edited_url_value}
      http.put(`/api/v1/urllists/${this.list.id}/urls/${this.url.id}`, data).then(server_response => {
        if (server_response.data.success === true) {
          // now that saving was succesful, undo=ing should be to the newely saved url.
          this.original_url_value = this.edited_url_value;

          // in case the url is the same as the original, do not update it.
          this.displayed_url.subdomain = server_response.data.data.created.subdomain;
          this.displayed_url.domain = server_response.data.data.created.domain;
          this.displayed_url.suffix = server_response.data.data.created.suffix;

          this.editing = false;
        } else {
          this.edited_url_value = this.original_url_value;
        }
      });
    },
  }
}
</script>
