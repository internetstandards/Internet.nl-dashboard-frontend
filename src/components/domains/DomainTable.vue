<style scoped>
.form-group {
  margin-bottom: 0 !important;
}

.intermediatebutton {
  border-radius: 0 0 0 0 !important;
}

.lastbutton {
  border-radius: 0 4px 4px 0 !important;
}
</style>
<style>
.vs__dropdown-toggle {
  min-height: 38px;
  border-radius: 4px 0 0 4px !important;
}
</style>

<template>
  <div>

    <b-table :busy="loading" striped hover small selectable responsive select-mode="multi"
             :items="urls"
             :fields="table_fields"
             :filter="filter"
             show-empty
             :current-page="currentPage"
             :per-page="perPage"
             primary-key="url"
             :filter-function="myFilterFunction"
             :filter-included-fields="['tags', 'url']"
             selected-variant="info"
             ref="selectableTable"
             @filtered="onFiltered"
             @row-selected="onRowSelected"
    >

      <template #thead-top="">

        <b-tr>
          <b-th colspan='3' class="col-6">
            <b-form-group
                label-for="filter-input"
                label-align-sm="right"
                class="mr-0"
            >
              <b-input-group>
                <b-form-input
                    debounce="200"
                    id="filter-input"
                    v-model="filter"
                    type="search"
                    placeholder="-- type to filter"
                ></b-form-input>

                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''" class="lastbutton">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>

          </b-th>
          <b-th class="col-6">

            <div class="float-left" style="width: 350px">
              <b-input-group>
                <v-select :options="tags" v-model="selected_tag" taggable style="width: 240px;" placeholder="-- add or select tag">
                  <template v-slot:option="option">
                    <tag :value="option.label"/>
                  </template>
                </v-select>
                <b-input-group-append>
                  <b-button variant="success" @click="add_tags" class="intermediatebutton">+</b-button>
                  <b-button variant="danger" @click="remove_tags" class="lastbutton">-</b-button>
                </b-input-group-append>
              </b-input-group>
            </div>

            <button class="border-danger float-right" @click="remove_urls" v-if="selected.length > 0">🗑️ Remove</button>

          </b-th>
        </b-tr>

        <b-tr v-if="urls.length > perPage">
          <b-th colspan='4' class="col-12">
            <b-pagination
                v-model="currentPage"
                :total-rows="visibleRows"
                :per-page="perPage"
                class="my-0"
                first-number
                hide-ellipsis
                :limit="8"
                last-number
                pills
                @page-click="nextpage"
            ></b-pagination>
          </b-th>
        </b-tr>

      </template>

      <template #head(selected)="">
        <b-check v-model="allSelected" @change="toggleSelected"></b-check>
      </template>

      <template #cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <span aria-hidden="true">&check;</span>
          <span class="sr-only">Selected</span>
        </template>
        <template v-else>
          <span aria-hidden="true">&nbsp;</span>
          <span class="sr-only">Not selected</span>
        </template>
      </template>

      <template #empty="scope">
        <h4>{{ scope.emptyText }}</h4>
      </template>
      <template #emptyfiltered="scope">
        <h4>{{ scope.emptyFilteredText }}</h4>
      </template>

      <template #cell(scannable)="data">
        <template v-if="urllist.scan_type === 'mail'">
            <span v-if="data.item.has_mail_endpoint === true" :title="$t('eligeble_mail', [data.item.url])">
                <span role="img" :aria-label="$t('eligeble_mail', [data.item.url])">🌍</span>
            </span>
          <span v-if="data.item.has_mail_endpoint === 'unknown'" :title="$t('unknown_eligeble_mail', [data.item.url])">
                <span role="img" :aria-label="$t('unknown_eligeble_mail', [data.item.url])">❓</span>
            </span>
          <span v-if="data.item.has_mail_endpoint === false" :title="$t('not_eligeble_mail', [data.item.url])">
                <span role="img" :aria-label="$t('not_eligeble_mail', [data.item.url])">🚫</span>
            </span>
        </template>

        <template v-if="urllist.scan_type === 'web'">
            <span v-if="data.item.has_web_endpoint === true" :title="$t('eligeble_web', [data.item.url])">
                <span role="img" :aria-label="$t('eligeble_web', [data.item.url])">🌍</span>
            </span>
          <span v-if="data.item.has_web_endpoint === 'unknown'" :title="$t('unknown_eligeble_web', [data.item.url])">
                <span role="img" :aria-label="$t('unknown_eligeble_web', [data.item.url])">❓</span>
            </span>
          <span v-if="data.item.has_web_endpoint === false" :title="$t('not_eligeble_web', [data.item.url])">
                <span role="img" :aria-label="$t('not_eligeble_web', [data.item.url])">🚫</span>
            </span>
        </template>
      </template>

      <template #cell(tags)="data">
        <tag v-for="tag in data.item.tags" :key="tag" :value="tag" @tag_clicked="selected_tag=tag"/>
      </template>

      <template #cell(url)="data">
        <edit-domain :list="urllist" :url="data.item" @domain_deleted="remove_url(data.item)"></edit-domain>
      </template>

      <template #table-caption v-if="urls.length>0">

        <span v-if="filter">
          Page {{ currentPage }}/{{ Math.ceil(urls.length / perPage) }} of {{ visibleRows }} filtered from {{ urls.length }} domains.
        </span>
        <span v-else>
          Page {{ currentPage }}/{{ Math.ceil(urls.length / perPage) }} of {{ urls.length }} domains.
        </span>

      </template>

    </b-table>

  </div>
</template>

<script>
import Tag from "@/components/domains/domain/tag";
import EditDomain from "@/components/domains/domain/editDomain";
import http from "@/httpclient";

export default {
  name: "DomainTable",
  components: {EditDomain, Tag},
  props: {
    urls: {
      type: Array, required: true,
    },
    urllist: {
      type: Object, required: true,
    },
    loading: {
      type: Boolean, required: false, default: false
    }
  },
  computed: {
    // can also do this in a request. but that will require updating every time something happens.
    tags() {
      let tags = []
      this.urls.forEach(url => {
        tags = tags.concat(url.tags);
      })
      // uniques and alphabetical sorting
      return tags.filter((x, i, a) => a.indexOf(x) === i).sort()
    }
  },
  mounted() {
    this.visibleRows = this.urls.length;
  },
  data() {
    return {
      filter: "",
      visibleRows: 0,
      selected_tag: null,
      allSelected: false,
      selected: [],
      currentPage: 1,
      perPage: 100,
      table_fields: [
        {
          key: 'selected',
          sortable: false,
          label: ""
        },
        {
          key: 'scannable',
          sortable: false,
          label: ""
        },
        {
          key: 'url',
          sortable: true,
          label: "Domain",
          thStyle: 'min-width: 300px',
          tdClass: 'nowrap'
        },
        {
          key: 'tags',
          sortable: true,
          label: "Tags"
        },
      ],
    }
  },
  methods: {
    nextpage() {
      this.allSelected = false;
    },
    onFiltered(filteredItems) {
      this.visibleRows = filteredItems.length;
      this.currentPage = 1;
      this.allSelected = false;
    },
    onRowSelected(items) {
      this.selected = items
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows()
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected()
    },
    toggleSelected() {
      if (this.allSelected) {
        this.selectAllRows()
      } else {
        this.clearSelected()
      }
    },
    myFilterFunction(row, search_term) {
      // The original filter function is slow because it stringifies all items inline, of which tags is an array.
      // With these modifications searching 10.000 domains takes way less than a second, instead of 10 seconds.
      if (row['url'].includes(search_term))
        return true
      if (row['tags'].includes(search_term))
        return true

      // using !! in a statement is not simplification, pycharm :)
      return false
    },
    add_tags() {
      // todo: push changes to server
      this.selected.forEach((item) => {
        if (!item.tags.includes(this.selected_tag)) {
          item.tags.push(this.selected_tag)
        }
      })
      http.post('/data/urllist/tag/add/', {'urllist_id': this.urllist.id, 'url_ids': this.selected.map(item => item.id), 'tag': this.selected_tag});
    },
    remove_tags() {
      // todo: push changes to server
      let ids = []
      this.selected.forEach((item) => {
        const index = item.tags.indexOf(this.selected_tag);
        if (index > -1) {
          item.tags.splice(index, 1);
          ids.push(item.id)
        }
      })
      http.post('/data/urllist/tag/remove/', {'urllist_id': this.urllist.id, 'url_ids': this.selected.map(item => item.id), 'tag': this.selected_tag});
    },
    remove_urls() {
      // todo: make a list of url id's, add that with the list id and send it to the server
      this.selected.forEach((item) => {
        this.remove_url(item)
      });
    },
    remove_url(item) {
      let url_object = this.urls.filter(function (el) {
        return el.id === item.id;
      });
      if (url_object) {
        http.post('/data/urllist/url/delete/', {'urllist_id': this.urllist.id, 'url_id': item.id});

        const index = this.urls.indexOf(url_object[0]);
        if (index > -1) {
          this.urls.splice(index, 1);
        }
      }
    }
  },

  watch: {
    selected_tag(new_value) {
      if (new_value)
        this.selected_tag = new_value.toLowerCase()
    }
  }

}
</script>

<i18n>
{
  "en": {
    "start_editing_url": "Edit {0}.",
    "cancel_editing_url": "Cancel editing and store the original value: {0}",
    "eligeble_mail": "{0} is eligible for e-mail scans",
    "unknown_eligeble_mail": "Not yet known if {0} can be mail scanned.",
    "not_eligeble_mail": "{0} is not eligible for e-mail scans. Will be checked again when starting a scan.",
    "eligeble_web": "{0} is eligible for web scans",
    "unknown_eligeble_web": "Not yet known if {0} can be web scanned.",
    "not_eligeble_web": "{0} is not eligible for web scans. Will be checked again when starting a scan.",
    "save_edited_url": "Save changes, the change will be applied to {0}.",
    "delete_edited_url": "Delete {0} from this list.",
    "button_labels": {
      "save": "Save",
      "cancel": "Cancel",
      "remove": "Remove"
    }
  },
  "nl": {
    "eligeble_mail": "E-mail scannen is mogelijk",
    "start_editing_url": "Bewerk {0}.",
    "unknown_eligeble_mail": "Onbekend of E-mail scannen mogelijk is",
    "not_eligeble_mail": "Kan geen E-mail scan uitvoeren (wordt opnieuw gecheckt bij het starten van de scan)",
    "eligeble_web": "Web scan is mogelijk",
    "unknown_eligeble_web": "Niet bekend of het mogelijk is een web scan uit te voeren",
    "not_eligeble_web": "Web scan kan niet worden uitgevoerd. Dit wordt opnieuw gecheckt bij het starten van de scan.",
    "button_labels": {
      "save": "Opslaan",
      "cancel": "Annuleren",
      "remove": "Verwijderen"
    }
  }
}
</i18n>