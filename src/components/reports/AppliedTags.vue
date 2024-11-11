<template>
<div>
  <p v-if="$store.state.tags.length > 0">{{ $t("report.applied-tags.info") }}: <tag :value="tag" :key="tag" v-for="tag in $store.state.tags"/></p>
</div>
</template>

<script>
import Tag from "@/components/domains/domain/tag";
export default {
name: "AppliedTags",
  components: {Tag}
}
</script>
