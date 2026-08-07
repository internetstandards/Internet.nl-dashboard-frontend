<style scoped>
.domain-table-toolbar {
  align-items: end;
  display: grid;
  gap: 0.5rem;
  grid-template-areas: "filter tags actions";
  grid-template-columns: minmax(14rem, 1fr) minmax(14rem, 1fr) auto;
  margin: 1rem 0 0.75rem;
}

.domain-table-filter {
  grid-area: filter;
  min-width: 0;
}

.domain-table-filter .input-group {
  flex-wrap: nowrap;
}

.domain-table-filter :deep(.form-control) {
  min-width: 0;
}

.domain-table-tag-editor {
  display: grid;
  gap: 0.25rem;
  grid-area: tags;
  grid-template-columns: minmax(0, 1fr) auto auto;
  min-width: 0;
}

.domain-tag-select {
  min-width: 0;
}

.domain-tag-select :deep(.vs__dropdown-toggle) {
  border-radius: 4px;
  min-height: 38px;
}

.domain-tag-select :deep(.vs__selected-options) {
  flex-wrap: nowrap;
  min-width: 0;
  overflow: hidden;
}

.domain-tag-select :deep(.vs__selected) {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.domain-tag-select :deep(.vs__search) {
  min-width: 0;
}

.domain-table-actions {
  display: flex;
  gap: 0.25rem;
  grid-area: actions;
}

.domain-table-mobile-selection {
  display: none;
  grid-area: selection;
}

.domain-table-pagination {
  display: flex;
  justify-content: center;
  max-width: 100%;
  overflow: hidden;
}

.domain-table-pagination :deep(.pagination) {
  flex-wrap: nowrap;
  max-width: 100%;
}

.domain-table :deep(.domain-url-cell) {
  overflow-wrap: anywhere;
}

@media (min-width: 768px) {
  .domain-table :deep(.domain-url-column) {
    min-width: 300px;
  }

  .domain-table :deep(.domain-url-cell) {
    white-space: nowrap;
  }
}

@media (max-width: 767.98px) {
  .domain-table-toolbar {
    align-items: center;
    grid-template-areas:
      "filter actions"
      "tags tags"
      "selection selection";
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .domain-table-mobile-selection {
    display: block;
  }

  .domain-table :deep(.table.b-table > tbody > tr) {
    background-color: var(--bs-body-bg);
    border: 1px solid var(--bs-border-color);
    border-radius: 0.375rem;
    margin-bottom: 0.75rem;
    overflow: hidden;
  }

  .domain-table :deep(.table.b-table > tbody > tr:nth-of-type(odd)) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .domain-table :deep(.table.b-table > tbody > tr.selected) {
    background-color: var(--bs-primary-bg-subtle);
  }

  .domain-table :deep(.table.b-table > tbody > tr > td) {
    --bs-table-bg: transparent;
    --bs-table-bg-state: transparent;
    --bs-table-bg-type: transparent;
    background-color: transparent;
    border-top-width: 0;
    box-shadow: none;
    padding: 0.5rem 0.75rem;
  }

  .domain-table :deep(.table.b-table > tbody > tr > .domain-selection-cell),
  .domain-table :deep(.table.b-table > tbody > tr > .domain-scannable-cell) {
    display: inline-block !important;
    width: auto;
  }

  .domain-table :deep(.domain-selection-cell > div),
  .domain-table :deep(.domain-scannable-cell > div) {
    padding: 0 !important;
    width: auto !important;
  }

  .domain-table :deep(.domain-url-cell > .b-table-stacked-label),
  .domain-table :deep(.domain-tags-cell > .b-table-stacked-label) {
    display: block;
    padding: 0 0 0.25rem;
    text-align: left;
    width: 100%;
  }

  .domain-table :deep(.domain-url-cell > div) {
    display: block;
    padding: 0;
    width: 100%;
  }

  .domain-table :deep(.domain-url-cell input) {
    max-width: 100%;
  }
}
</style>

<template>
  <div class="domain-table">
    <div class="domain-table-toolbar">
      <div class="domain-table-filter">
        <b-input-group>
          <b-form-input
              debounce="200"
              id="filter-input"
              v-model="filter"
              type="search"
              :placeholder='$t("domain.list.domain-table.type to filter")'
          ></b-form-input>
          <b-button :disabled="!filter" @click="filter = ''" class="lastbutton">{{ $t("domain.list.domain-table.Clear") }}</b-button>
        </b-input-group>
      </div>

      <div class="domain-table-tag-editor" v-if="selectedItems.length > 0">
        <v-select :options="tags" :inputId='"tagselect"' @search:blur="searched_with_no_result" v-model="selected_tag" class="domain-tag-select" taggable :placeholder='$t("domain.list.domain-table.select label")'>
          <template v-slot:option="option">
            <tag :value="option.label" style="pointer-events: none; "/>
          </template>
        </v-select>

        <b-button variant="warning" @click="add_tags" class="intermediatebutton">+</b-button>
        <b-button variant="danger" @click="remove_tags" class="lastbutton">-</b-button>
      </div>

      <div class="domain-table-actions">
        <b-button class="normalbutton" variant="warning" @click="$emit('update')">🔁<span class="visually-hidden">{{ $t("domain.list.domain-table.update domain list") }}</span></b-button>
        <b-button variant="danger" @click="remove_urls" v-if="selectedItems.length > 0">🗑️</b-button>
      </div>

      <div class="domain-table-mobile-selection">
        <b-form-checkbox v-model="allSelected" :indeterminate="allSelectedIndeterminate" @change="toggleSelected">
          {{ $t("domain.list.domain-table.Selected") }}: {{ selectedItems.length }} / {{ visibleRows }}
        </b-form-checkbox>
      </div>
    </div>

    <div class="domain-table-pagination" v-if="urls.length > perPage">
      <b-pagination
          v-model="currentPage"
          :total-rows="visibleRows"
          :per-page="perPage"
          class="my-0"
          first-number
          hide-ellipsis
          :limit="3"
          last-number
          size="sm"
      ></b-pagination>
    </div>

    <b-table :busy="loading" striped hover small selectable stacked="md" label-stacked select-mode="multi"
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
             v-model:selected-items="selectedItems"
             @filtered="onFiltered"
             @row-selected="onRowSelected"
    >
      <template #head(selected)="">
        <b-form-checkbox v-model="allSelected" :indeterminate="allSelectedIndeterminate" @change="toggleSelected"></b-form-checkbox>
      </template>

      <template #cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <span aria-hidden="true">&check;</span>
          <span class="visually-hidden">{{ $t("domain.list.domain-table.Selected") }}</span>
        </template>
        <template v-else>
          <span aria-hidden="true">&nbsp;</span>
          <span class="visually-hidden">{{ $t("domain.list.domain-table.Not selected") }}</span>
        </template>
      </template>

      <template #empty="">
        <h4>{{ $t("domain.list.domain-table.Table empty") }}</h4>
      </template>
      <template #emptyfiltered="">
        <h4>{{ $t("domain.list.domain-table.No filtered results") }}</h4>
      </template>

      <template #cell(scannable)="data">
        <format-scan-eligibility :scan_type="urllist.scan_type" :url="data.item" />
      </template>

      <template #cell(tags)="data">
        <tag v-for="tag in data.item.tags" :key="tag" :value="tag" @tag_clicked="selected_tag=tag"/>
      </template>

      <template #cell(url)="data">
        <edit-domain :list="urllist" :url="data.item" @domain_deleted="remove_url(data.item)"></edit-domain>
      </template>

      <template #table-caption v-if="urls.length>0">
        <span v-if="filter">
          {{$t("domain.list.domain-table.filtered pagination", [currentPage, Math.ceil(urls.length / perPage), visibleRows, urls.length])}}
        </span>
        <span v-else>
          {{$t("domain.list.domain-table.pagination", [currentPage, Math.ceil(urls.length / perPage), urls.length])}}
        </span>
      </template>
    </b-table>
  </div>
</template>

<script>
import Tag from "@/components/domains/domain/tag.vue";
import EditDomain from "@/components/domains/domain/editDomain.vue";
import http from "@/httpclient";
import FormatScanEligibility from "@/components/domains/FormatScanEligibility.vue";
import vSelect from 'vue-select';

export default {
  name: "DomainTable",
  components: {FormatScanEligibility, EditDomain, Tag, vSelect},
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
      allSelectedIndeterminate: false,
      selectedItems: [],
      currentPage: 1,
      perPage: 100,
      table_fields: [
        {
          key: 'selected',
          sortable: false,
          label: "",
          tdClass: 'domain-selection-cell'
        },
        {
          key: 'scannable',
          sortable: false,
          label: "",
          tdClass: 'domain-scannable-cell'
        },
        {
          key: 'url',
          sortable: true,
          label: this.$t("domain.table.domain"),
          thClass: 'domain-url-column',
          tdClass: 'domain-url-cell'
        },
        {
          key: 'tags',
          sortable: true,
          label: this.$t("domain.table.tags"),
          tdClass: 'domain-tags-cell'
        },
      ],
    }
  },
  methods: {
    searched_with_no_result(){
      this.last_searched = document.getElementById('tagselect').value;
    },
    onFiltered(filteredItems) {
      this.visibleRows = filteredItems.length;
      this.currentPage = 1;
    },
    onRowSelected() {
      this.updateCheckBox();
    },
    selectAllRows() {
      this.selectedItems = this.urls;
      this.allSelected = true;
      this.allSelectedIndeterminate = false;
    },
    clearSelected() {
      this.selectedItems = [];
      this.allSelected = false;
      this.allSelectedIndeterminate = false;
    },
    toggleSelected() {

      // indeterminate state can reset all selected.
      if (this.allSelectedIndeterminate === true) {
        this.allSelectedIndeterminate = false;
        this.clearSelected();
        return
      }

      // otherwise normal selection happens: either all on or off... (todo: when selecting all, the items per page should increase to really select everything(?)
      this.allSelectedIndeterminate = false;
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
      // support the scenario from issue #344
      if (this.last_searched)
          this.selected_tag = this.last_searched.toLowerCase()

      // don't try to add empy tags...
      if (!this.selected_tag)
        return

      this.selectedItems.forEach((item) => {
        if (!item.tags.includes(this.selected_tag)) {
          item.tags.push(this.selected_tag)
        }
      })
      http.post(`/api/v1/urllists/${this.urllist.id}/urls/${this.selectedItems.map(item => item.id)}/tags`, {'tag': this.selected_tag});
    },
    remove_tags() {
      // support the scenario from issue #344
      if (this.last_searched)
          this.selected_tag = this.last_searched.toLowerCase()

      const ids = []
      this.selectedItems.forEach((item) => {
        const index = item.tags.indexOf(this.selected_tag);
        if (index > -1) {
          item.tags.splice(index, 1);
          ids.push(item.id)
        }
      })
      http.delete(`/api/v1/urllists/${this.urllist.id}/urls/${this.selectedItems.map(item => item.id)}/tags/${this.selected_tag}`);
    },
    remove_urls() {
      // todo: make a list of url id's, add that with the list id and send it to the server
      this.selectedItems.forEach((item) => {
        this.remove_url(item)
      });
    },
    remove_url(item) {
      const url_object = this.urls.filter(function (el) {
        return el.id === item.id;
      });
      if (url_object) {
        http.delete(`/api/v1/urllists/${this.urllist.id}/urls/${item.id}`);

        const index = this.urls.indexOf(url_object[0]);
        if (index > -1) {
          this.urls.splice(index, 1);
        }
      }
    },

    updateCheckBox(){
      // since a watch is always one step too late on tables for some reason, just compute this directly :)
      if (this.selectedItems.length === this.visibleRows){
        this.allSelectedIndeterminate = false
        this.allSelected = true
        return
      }

      if (this.selectedItems.length === 0){
        this.allSelectedIndeterminate = false
        this.allSelected = false
        return
      }

      this.allSelectedIndeterminate = true
    }

  },

  watch: {
    selected_tag(new_value) {
      if (new_value)
        this.selected_tag = new_value.toLowerCase()
    },
    urls(old_value, new_value) {
      if (old_value === new_value || !new_value)
        return
      this.visibleRows = new_value.length;
    },
  }

}
</script>
