<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div id="demo-template">
    <content-block>
      <h1>
        <i-bi-info-circle />
        {{ $t("tour.title") }}
      </h1>
      <p class="lead" v-html="$t('tour.introduction')"></p>
    </content-block>


      <div class="d-grid">
        <feature-row
          v-for="(feature, index) in features"
          :key="feature"
          :feature="feature"
          :image-right="index % 2 === 1"
          @open="openLightbox(index)"
        />
      </div>


    <vue-easy-lightbox
      :visible="lightboxVisible"
      :imgs="lightboxImages"
      :index="lightboxIndex"
      loop
      move-disabled
      teleport="body"
      @hide="closeLightbox"
      @on-index-change="changeLightboxIndex"
    >
      <template #title="{currentImg}">
        <div class="tour-lightbox-caption" role="status" aria-live="polite">
          {{ currentImg.title }}
        </div>
      </template>
    </vue-easy-lightbox>
  </div>
</template>

<script lang="ts">
import VueEasyLightbox from "vue-easy-lightbox";

import FeatureRow from "@/components/tour/FeatureRow.vue";

export default {
  name: "TourPage",
  components: {FeatureRow, VueEasyLightbox},
  data() {
    return {
      features: [
        "manage_domains",
        "import_domains",
        "scan",
        "focus_on_metrics",
        "report_table",
        "report_bar_chart",
        "report_timeline",
        "export_spreadsheet",
        "report_sharing",
        "account_notifications",
      ],
      lightboxVisible: false,
      lightboxIndex: 0,
    }
  },
  computed: {
    lightboxImages() {
      return this.features.map((feature) => {
        const title = this.$t(`tour.${feature}.title`)
        const caption = this.$t(`tour.${feature}.caption`)

        return {
          src: `/static_frontend/images/demo/${feature}.png`,
          alt: caption,
          title: `${title}: ${caption}`,
        }
      })
    },
  },
  methods: {
    openLightbox(index) {
      this.lightboxIndex = index
      this.lightboxVisible = true
    },
    closeLightbox() {
      this.lightboxVisible = false
    },
    changeLightboxIndex(_oldIndex, newIndex) {
      this.lightboxIndex = newIndex
    },
  },
}
</script>

<style>
.vel-modal {
  background: rgba(4, 20, 25, 0.94);
  backdrop-filter: blur(4px);
}

.vel-img {
  max-width: min(92vw, 1400px);
  max-height: calc(100vh - 14rem);
  border-radius: var(--bs-border-radius-lg);
}

.tour-lightbox-caption {
  position: fixed;
  left: 50%;
  bottom: 3.75rem;
  width: max-content;
  max-width: min(92vw, 70rem);
  padding: 0.75rem 1rem;
  border-radius: var(--bs-border-radius);
  background: rgba(0, 0, 0, 0.78);
  color: white;
  font-size: 0.95rem;
  line-height: 1.4;
  text-align: center;
  transform: translateX(-50%);
}

@media (max-width: 750px) {
  .vel-img {
    max-width: 92vw;
    max-height: calc(100vh - 18rem);
  }

  .tour-lightbox-caption {
    bottom: 3.5rem;
    width: calc(100vw - 4.75rem);
    max-height: 8rem;
    padding: 0.6rem 0.75rem;
    overflow-y: auto;
    font-size: 0.85rem;
  }
}
</style>
