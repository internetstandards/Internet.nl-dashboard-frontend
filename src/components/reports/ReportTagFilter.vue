<style scoped>
.lastbutton {
  border-radius: 0 4px 4px 0 !important;
}
</style>
<template>
  <div v-if="available_tags.length > 0">
    <beta-label />
    Dit rapport ondersteund tags, hierop kan worden gefilterd. Dit gebeurd live op de database, hierdoor kan het even duren voordat dit is toegepast.
    Meerdere tags selecteren betekent dat deze allemaal zijn toegepast per domein.
    <b-input-group>
      <v-select :options="available_tags" v-model="selected_tags" multiple taggable style="width: 80%;" placeholder="-- filter by tag">
        <template v-slot:option="option">
          <tag :value="option.label"/>
        </template>
      </v-select>
      <b-input-group-append>
        <b-button @click="apply" variant="info" class="lastbutton">Toepassen</b-button>
      </b-input-group-append>
    </b-input-group>

  </div>
</template>

<script>
import http from "@/httpclient";
import Tag from "@/components/domains/domain/tag";
import {mapState} from 'vuex'
import BetaLabel from "@/components/BetaLabel";

export default {
  name: "ReportTagFilter",
  components: {BetaLabel, Tag},
  mounted() {
    this.load();
    // empty list of selected tags on reloads etc to make the UI more intuitive:
    this.$store.commit("set_tags", []);
    this.selected_tags = this.$store.state.tags;
  },
  data() {
    return {
      available_tags: [],
      selected_tags: [],
    }
  },
  beforeDestroy() {
    // empty list of selected tags on reloads etc to make the UI more intuitive:
    this.$store.commit("set_tags", []);
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
