<template>
    <b-row class="mb-4" cols="1" cols-md="2">
      <b-col cols="7">
        <demo-image :filename="`${feature}`" :caption=" translation.t(`tour.${feature}.caption`)"  />
      </b-col>
      <b-col>
        <h2>{{ translation.t(`tour.${feature}.title`) }}</h2>
        <div v-html="translation.t(`tour.${feature}.introduction`)"></div>
      </b-col>
    </b-row>
</template>

<script>
import DemoImage from "@/components/tour/DemoImage.vue";
export default {
name: "FeatureRow",
  components: {DemoImage},
  props: {
    translation: {type: Object, required: true},
    feature: {type: String, required: true},
  }
}
</script>
