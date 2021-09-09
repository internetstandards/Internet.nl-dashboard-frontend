<style scoped>

</style>

<template>
  <div>

    <b-row>
      <b-col cols="4">
        <b-form-group
            label-for="filter-input"
            label-align-sm="right"
            class="mr-0"
        >
          <b-input-group>
            <b-form-input
                debounce="400"
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Type to Search"
            ></b-form-input>

            <b-input-group-append>
              <button :disabled="!filter" @click="filter = ''">Clear</button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col cols="6">

        <b-input-group>
          <v-select style="width: 60%" :options="tags" v-model="selected_tag" taggable>
            <template v-slot:option="option">
              <tag :value="option.label"/>
            </template>
          </v-select>
          <b-input-group-append>
            <button variant="success" @click="add_tags">+</button>
            <button variant="danger" @click="remove_tags">-</button>
          </b-input-group-append>
        </b-input-group>
      </b-col>

      <b-col cols="2">
        <button class="border-danger" @click="remove_urls">🗑️ Remove</button>
      </b-col>
    </b-row>


    <b-pagination v-if="urls.length > perPage"
          v-model="currentPage"
          :total-rows="urls.length"
          :per-page="perPage"
          align="left"
          class="my-0"
          first-number
          hide-ellipsis
          variant="info"
          :limit="8"
          last-number
          pills
    ></b-pagination>

    <b-table :busy="loading" striped hover small selectable responsive select-mode="multi"
             :items="urls"
             :fields="table_fields"
             :filter="filter"
             show-empty
               :current-page="currentPage"
              :per-page="perPage"
             primary-key="url"
             :filter-included-fields="['tags', 'url']"
             selected-variant="info"
             ref="selectableTable"
             @filtered="onFiltered"
             @row-selected="onRowSelected"
    >

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

      <template #cell(edit)="data">
        <button style="font-size: 12px;" class="inline-edit"
                :title="$t('start_editing_url', [data.item.url])"
                @click="start_url_editing()" aria-expanded="false">
          🖊
          <span class="visuallyhidden">{{ $t('start_editing_url', [data.item.url]) }}</span>
        </button>

      </template>

      <template #cell(tags)="data">
        <tag v-for="tag in data.item.tags" :key="tag" :value="tag"/>
      </template>

      <template #cell(url)="data">
        <template v-if="data.item.subdomain">
          {{ data.item.subdomain }}.
        </template>
        <b>{{ data.item.domain }}.{{ data.item.suffix }}</b>
      </template>

      <template #table-caption>

        <span v-if="filter">
          Showing {{ visibleRows }} of {{ urls.length }} domains.
        </span>
        <span v-else>
          Showing {{ urls.length }} domains.
        </span>

      </template>

    </b-table>

  </div>
</template>

<script>
import Tag from "@/components/domains/domain/tag";

export default {
  name: "DomainTable",
  components: {Tag},
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
  data() {
    return {
      filter: "",
      visibleRows: 0,
      selected_tag: null,
      allSelected: false,
      selected: [],
      currentPage: 0,
      perPage: 100,
      table_fields: [
        {
          key: 'selected',
          sortable: false,
          label: ""
        },
        {
          key: 'edit',
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
    onFiltered(filteredItems) {
      this.visibleRows = filteredItems.length;
      this.currentPage = 0;
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
    add_tags() {
      // todo: push changes to server
      this.selected.forEach((item) => {
        if (!item.tags.includes(this.selected_tag)) {
          item.tags.push(this.selected_tag)
        }
      })
    },
    remove_tags() {
      // todo: push changes to server
      this.selected.forEach((item) => {
        const index = item.tags.indexOf(this.selected_tag);
        if (index > -1) {
          item.tags.splice(index, 1);
        }
      })
    },
    remove_urls() {
      // todo: make a list of url id's, add that with the list id and send it to the server
      this.selected.forEach((item) => {
        let url_object = this.urls.filter(function (el) {
          return el.id === item.id;
        });
        if (url_object) {
          const index = this.urls.indexOf(url_object[0]);
          if (index > -1) {
            this.urls.splice(index, 1);
          }
        }
      });
    },

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