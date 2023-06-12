<template>
  <b-table :items="items">

  </b-table>
</template>

<script>
export default {
  name: "ReportImprovementAndRegressionsTable",
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      fields: [

      ]
    }
  }
}
</script>

<style scoped>

</style>