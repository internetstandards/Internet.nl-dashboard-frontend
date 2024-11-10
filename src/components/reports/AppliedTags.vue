<template>
<div>
  <p v-if="$store.state.tags.length > 0">{{ $t("info") }}: <tag :value="tag" :key="tag" v-for="tag in $store.state.tags"/></p>
</div>
</template>

<script>
import Tag from "@/components/domains/domain/tag";
export default {
name: "AppliedTags",
  components: {Tag}
}
</script>
<i18n>
{
  "en": {
    "info": "Applied labels"
  },
  "nl": {
    "info": "Toegepaste labels"
  }
}

</i18n>