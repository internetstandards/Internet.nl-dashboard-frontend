<template>
  <figure class="d-flex h-100 flex-column m-0 bg-body-tertiary">
    <button
      type="button"
      class="tour-image-button flex-grow-1"
      :aria-label="caption"
      @click="$emit('open')"
    >
      <b-img
        fluid
        class="tour-image w-100"
        :src="`/static_frontend/images/demo/${filename}.png`"
        :alt="caption"
        loading="lazy"
        decoding="async"
      />
      <span class="tour-image-expand rounded-circle bg-dark text-white shadow" aria-hidden="true">
        <i-bi-arrows-fullscreen />
      </span>
    </button>
    <figcaption class="px-3 py-2 text-start small text-body-secondary">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script lang="ts">
export default {
  name: "DemoImage",
  emits: ["open"],
  props: {
    filename: {type: String, required: true},
    caption: {type: String, required: true},
  },
}
</script>

<style scoped>
.tour-image-button {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0;
  overflow: hidden;
  border: 0;
  background: white;
  cursor: zoom-in;
}

.tour-image-button:focus-visible {
  z-index: 1;
  outline: 3px solid var(--bs-info);
  outline-offset: -3px;
}

.tour-image {
  display: block;
  transition: transform 180ms ease;
}

.tour-image-button:hover .tour-image {
  transform: scale(1.015);
}

.tour-image-expand {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  opacity: 0.82;
  transition: opacity 180ms ease, transform 180ms ease;
}

.tour-image-button:hover .tour-image-expand,
.tour-image-button:focus-visible .tour-image-expand {
  opacity: 1;
  transform: scale(1.06);
}

figcaption {
  font-style: italic;
  line-height: 1.45;
}

@media (prefers-reduced-motion: reduce) {
  .tour-image,
  .tour-image-expand {
    transition: none;
  }
}
</style>
