<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-container class="page-header-container px-0 mb-3 mt-2" fluid="xl">
    <b-card no-body class="page-header border-0 shadow-sm">
      <b-card-header
        class="page-header-main d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 border-0 bg-info-subtle p-4"
      >
        <div class="page-header-heading d-flex align-items-start gap-3">
          <span
            v-if="$slots.icon"
            class="page-header-icon d-inline-flex align-items-center justify-content-center flex-shrink-0 rounded-circle bg-info text-white"
            aria-hidden="true"
          >
            <slot name="icon" />
          </span>

          <div class="page-header-copy">
            <component :is="titleTag" class="h2 mb-1">
              {{ title }}
            </component>
            <p v-if="$slots.subtitle || subtitle" class="mb-0 text-body-secondary">
              <slot name="subtitle">{{ subtitle }}</slot>
            </p>
          </div>
        </div>

        <div
          v-if="$slots.actions"
          class="page-header-actions d-flex flex-wrap align-items-center gap-2 flex-shrink-0"
        >
          <slot name="actions" />
        </div>
      </b-card-header>

      <b-card-body v-if="$slots.default" class="page-header-content p-4">
        <slot />
      </b-card-body>
    </b-card>
  </b-container>
</template>

<script lang="ts">
export default {
  name: "PageHeader",
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: "",
    },
    titleTag: {
      type: String,
      default: "h1",
    },
  },
}
</script>

<style scoped>
.page-header {
  overflow: visible;
  border-radius: var(--bs-border-radius-lg);
}

.page-header-heading,
.page-header-copy {
  min-width: 0;
}

.page-header-icon {
  width: 3.5rem;
  height: 3.5rem;
  font-size: 1.65rem;
}

.page-header-copy .h2,
.page-header-copy p {
  overflow-wrap: anywhere;
}

@media (max-width: 767.98px) {
  .page-header-actions {
    width: 100%;
  }
}
</style>
