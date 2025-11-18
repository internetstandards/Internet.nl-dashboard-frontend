<style scoped>
span {
  font-size: 0.9em;
  border: 1px solid;
  font-weight: bolder;
  color: #00000088;
  margin: 0.1em;
  border-radius: 5px;
  font-family: arial, sans-serif;
  min-width: 38px;
  display: inline-block;
  padding-left: 0.7em;
  padding-right: 0.7em;
}
</style>

<template>
  <!-- click.stop is used so the table above it does not select a row (and interferes with selection) -->
  <span
      :style="`background-color: #${value_color.substr(0,6)}22; color: ${darker.substr(0,7)}ff; border-color: #${value_color.substr(0,6)}ff;`"
  @click.stop="$emit('tag_clicked')"
  >{{
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
      pSBCr: null,
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
        for (let f = 0; f < 8; f++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
        o[c] = a
      }
      for (var n = -1, t = 0; t < r.length; t++) n = n >>> 8 ^ o[255 & (n ^ r.charCodeAt(t))];
      return (-1 ^ n) >>> 0
    },
    pSBC(p, c0, c1, l) {
      // https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
      let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof (c1) == "string";
      if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
      if (!this.pSBCr) this.pSBCr = (d) => {
        let n = d.length, x = {};
        if (n > 9) {
          [r, g, b, a] = d = d.split(","), n = d.length;
          if (n < 3 || n > 4) return null;
          x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
        } else {
          if (n == 8 || n == 6 || n < 4) return null;
          if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
          d = i(d.slice(1), 16);
          if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
          else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
        }
        return x
      };
      h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = this.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? this.pSBCr(c1) : P ? {r: 0, g: 0, b: 0, a: -1} : {r: 255, g: 255, b: 255, a: -1}, p = P ? p * -1 : p, P = 1 - p;
      if (!f || !t) return null;
      if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
      else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
      a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
      if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
      else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
    }
  },
  computed: {
    value_color() {
      return this.crc32(this.value).toString(16)
    },
    darker(){
      // makes the tag darker so it complies to readability standards
      const vc = this.pSBC(-0.62, "#" + this.value_color, false, true)
      if (vc === null)
        return this.value_color;
      return vc
    }
  }
}
</script>

