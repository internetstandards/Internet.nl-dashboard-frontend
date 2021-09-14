<style scoped>
.lastbutton {
  border-radius: 0 4px 4px 0 !important;
}
</style>
<template>
  <content-block v-if="available_tags.length > 0">[beta]
    Dit rapport ondersteund tags, hierop kan worden gefilterd. Dit gebeurd live op de database, dus het kan even duren voordat dit is toegepast.
    Meerdere tags selecteren betekent dat alle tags zijn toegepast op domeinen.
    Todo: timeline, sharing en download verbergen met ad-hoc rapporten.
    
    <b-input-group>
      <v-select :options="available_tags" v-model="selected_tags" multiple taggable style="width: 240px;" placeholder="-- filter by tag">
        <template v-slot:option="option">
          <tag :value="option.label"/>
        </template>
      </v-select>
      <b-input-group-append>
        <b-button @click="apply" variant="info" class="lastbutton">Toepassen</b-button>
      </b-input-group-append>
    </b-input-group>

  </content-block>
</template>

<script>
import http from "@/httpclient";
import Tag from "@/components/domains/domain/tag";
import {mapState} from 'vuex'

export default {
  name: "ReportTagFilter",
  components: {Tag},
  mounted() {
    this.load();
    this.selected_tags = this.$store.state.tags;
  },
  data() {
    return {
      available_tags: [],
      selected_tags: [],
    }
  },
  props: {
    urllist_id: {type: Number, required: true}
  },
  methods: {
    load() {
      http.get(`data/urllist/tag/list/${this.urllist_id}/`).then(response => {
        this.available_tags = response.data
      });
    },
    apply() {
      this.$store.commit("set_tags", this.selected_tags);
      this.$emit('tags_applied')
    }
  },
  ...mapState(['report_ids', 'tags']),
}
</script>
