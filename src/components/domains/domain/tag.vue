<style scoped>
span {
  font-size: 0.9em;
  border: 1px solid;
  font-weight: bolder;
  color: #00000088;
  margin: 0.1em;
  border-radius: 21px;
  font-family: arial;
  min-width: 38px;
  display: inline-block;
  padding-left: 0.7em;
  padding-right: 0.7em;
}
</style>

<template>
  <span
      :style="`background-color: #${value_color.substr(0,6)}22; color: #${value_color.substr(0,6)}ff; border-color: #${value_color.substr(0,6)}ff;`">{{
      value
    }}</span>
</template>

<script>
export default {
  name: "tag",
  props: {
    value: {type: String, required: true}
  },
  data() {
    return {
      color_hashtable: {
        a: {border: '', background: ''}
      }
    }
  },
  methods: {
    // fallback algorithm as long as there is no tag manager.
    crc32(r) {
      for (var a, o = [], c = 0; c < 256; c++) {
        a = c;
        for (var f = 0; f < 8; f++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
        o[c] = a
      }
      for (var n = -1, t = 0; t < r.length; t++) n = n >>> 8 ^ o[255 & (n ^ r.charCodeAt(t))];
      return (-1 ^ n) >>> 0
    },
  },
  computed: {
    value_color() {
      return this.crc32(this.value).toString(16)
    }
  }
}
</script>

