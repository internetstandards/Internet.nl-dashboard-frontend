<template>
  <div>
        <CoolLightBox
        :items="items"
        :index="index"
        @close="index = null">
    </CoolLightBox>
  <figure @click="index = 0" >
    <b-img-lazy fluid rounded blank-color="#777"
                :src="`/static_frontend/images/demo/${filename}.png`" :alt="caption"></b-img-lazy>
    <figcaption>{{ caption }}</figcaption>
  </figure>
  </div>
</template>

<script>

import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'

export default {
  name: "DemoImage",
  components: {CoolLightBox},
  props: {
    filename: {type: String, required: true},
    caption: {type: String, required: true},
  },
  data() {
    return {
      index: null,
      items: [{src: `/static_frontend/images/demo/${this.filename}.png`, caption: this.caption, title: this.caption}]
    }
  }
}
</script>

<style scoped>

</style>