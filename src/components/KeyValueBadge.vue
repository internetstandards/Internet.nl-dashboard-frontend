<template>
  <b-badge variant="info" class="p-2 m-1"> {{ k }} <b-badge variant="light" style="font-size: 1.0em" class="m-1p-2" v-if="v" v-html="v"></b-badge></b-badge>
</template>

<script>
export default {
  name: "KeyValueBadge",
  props: {
    k: {type: String, required: true},
    v: {type: String, required: false}
  }
}
</script>

<style scoped>

</style>