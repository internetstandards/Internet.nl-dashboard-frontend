<template>
  <figure>
    <BImg fluid rounded blank-color="#777"
                :src="`/static_frontend/images/demo/${filename}.png`" :alt="caption"></BImg>
    <figcaption>{{ caption }}</figcaption>
  </figure>
</template>

<script>

export default {
  name: "DemoImage",
  components: {},
  props: {
    filename: {type: String, required: true},
    caption: {type: String, required: true},
  },
}
</script>
