<template>

  <b-card no-body class="tour-feature-card overflow-hidden border-0 p-2 mb-4">
    <b-row class="g-0">
      <b-col cols="12" md="7" :class="{'order-md-2': imageRight}">
        <demo-image
          :filename="feature"
          :caption="$t(`tour.${feature}.caption`)"
          @open="$emit('open')"
        />
      </b-col>
      <b-col cols="12" md="5" class="d-flex" :class="{'order-md-1': imageRight}">
        <b-card-body class="d-flex flex-column justify-content-center p-4 p-lg-5 text-start">
          <b-card-title tag="h2" class="h3 mb-3">
            {{ $t(`tour.${feature}.title`) }}
          </b-card-title>
          <div class="tour-feature-copy" v-html="$t(`tour.${feature}.introduction`)"></div>
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>

</template>

<script lang="ts">
import DemoImage from "@/components/tour/DemoImage.vue";

export default {
  name: "FeatureRow",
  components: {DemoImage},
  emits: ["open"],
  props: {
    feature: {type: String, required: true},
    imageRight: {type: Boolean, default: false},
  },
}
</script>

<style scoped>
.tour-feature-card {
  border-radius: var(--bs-border-radius-lg);
}

.tour-feature-copy :deep(p:first-child) {
  padding-top: 0;
}

.tour-feature-copy :deep(p:last-child) {
  margin-bottom: 0;
  padding-bottom: 0;
}
</style>
