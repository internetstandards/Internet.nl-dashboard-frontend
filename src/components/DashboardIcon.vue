<template>
  <b-iconstack :font-scale="stackscale">
    <b-icon stacked icon="circle-fill" variant="info"></b-icon>
    <b-icon stacked :icon="icon" :scale="scale" variant="white"></b-icon>
  </b-iconstack>
</template>

<script>
export default {
name: "DashboardIcon",
  props: {
    icon: {type: String, required: true},
    scale: {type: Number, required: false, default: 0.7},
    stackscale: {type: Number, required: false, default: 1.3},
  }
}
</script>

<style scoped>

</style>