<template>
<div>
  <p v-if="tags.length > 0">{{ $t("report.applied-tags.info") }}: <tag :value="tag" :key="tag" v-for="tag in tags"/></p>
</div>
</template>

<script>
import { dashboardStore } from '@/dashboardStore'
import {mapState} from 'pinia'

import Tag from "@/components/domains/domain/tag.vue";
export default {
name: "AppliedTags",
  components: {Tag},
  computed: mapState(dashboardStore, ['tags']),
}
</script>
