<template>
  <b-iconstack :font-scale="stackscale" aria-hidden="true">
    <b-icon stacked icon="circle-fill" variant="info" :aria-label="ariaLabel"></b-icon>
    <b-icon stacked :icon="icon" :scale="scale" variant="white" :aria-label="ariaLabel"></b-icon>
  </b-iconstack>
</template>

<script>
export default {
name: "DashboardIcon",
  props: {
    icon: {type: String, required: true},
    scale: {type: Number, required: false, default: 0.7},
    stackscale: {type: Number, required: false, default: 1.3},
    ariaLabel: {type: String, required: false, default: ""}
  }
}
</script>

<style scoped>

</style>