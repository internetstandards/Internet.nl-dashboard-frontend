<template>
    <b-row class="mb-4">
      <b-col cols="7">
        <demo-image :filename="`${feature}`" :caption=" translation.t(`${feature}.caption`)"  />
      </b-col>
      <b-col>
        <h3>{{ translation.t(`${feature}.title`) }}</h3>
        <div v-html="translation.t(`${feature}.introduction`)"></div>
      </b-col>
    </b-row>
</template>

<script>
import DemoImage from "@/components/tour/DemoImage";
export default {
name: "FeatureRow",
  components: {DemoImage},
  props: {
    translation: {type: Object, required: true},
    feature: {type: String, required: true},
  }
}
</script>

<style scoped>

</style>