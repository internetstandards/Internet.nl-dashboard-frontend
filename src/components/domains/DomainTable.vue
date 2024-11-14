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

.normalbutton {
  border-radius: 4px !important;
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
                    :placeholder='$t("domain.list.domain-table.type to filter")'
                ></b-form-input>

                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''" class="lastbutton">{{ $t("domain.list.domain-table.Clear") }}</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>

          </b-th>
          <b-th class="col-6">

            <div class="float-left w-75" v-if="selected.length > 0">
              <b-input-group>
                <v-select :options="tags" :inputId='"tagselect"' @search:blur="searched_with_no_result" v-model="selected_tag" class="w-75" taggable :placeholder='$t("domain.list.domain-table.select label")'>
                  <template v-slot:option="option">
                    <!-- Allow clicking on the tag to select it... -->
                    <tag :value="option.label" style="pointer-events: none; "/>
                  </template>
                </v-select>
                <b-input-group-append>
                  <b-button variant="success" @click="add_tags" class="intermediatebutton">+</b-button>
                  <b-button variant="danger" @click="remove_tags" class="lastbutton">-</b-button>
                </b-input-group-append>
              </b-input-group>
            </div>

            <b-button class="float-right normalbutton" variant="info" @click="$emit('update')">🔁<span class="sr-only">{{ $t("domain.list.domain-table.update domain list") }}</span></b-button>
            <button class="border-danger float-right mr-2" @click="remove_urls" v-if="selected.length > 0">🗑️</button>

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
        <b-check v-model="allSelected" :indeterminate="allSelectedIndeterminate" @change="toggleSelected"></b-check>
      </template>

      <template #cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <span aria-hidden="true">&check;</span>
          <span class="sr-only">{{ $t("domain.list.domain-table.Selected") }}</span>
        </template>
        <template v-else>
          <span aria-hidden="true">&nbsp;</span>
          <span class="sr-only">{{ $t("domain.list.domain-table.Not selected") }}</span>
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
import Tag from "@/components/domains/domain/tag";
import EditDomain from "@/components/domains/domain/editDomain";
import http from "@/httpclient";
import FormatScanEligibility from "@/components/domains/FormatScanEligibility";
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
          label: this.$t("Domain"),
          thStyle: 'min-width: 300px',
          tdClass: 'nowrap'
        },
        {
          key: 'tags',
          sortable: true,
          label: this.$t("tags")
        },
      ],
    }
  },
  methods: {
    searched_with_no_result(){
      this.last_searched = document.getElementById('tagselect').value;
    },
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

      // indeterminate state can reset all selected.
      if (this.allSelectedIndeterminate === true) {
        this.allSelectedIndeterminate = false;
        this.allSelected = false;
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

      this.selected.forEach((item) => {
        if (!item.tags.includes(this.selected_tag)) {
          item.tags.push(this.selected_tag)
        }
      })
      http.post('/data/urllist/tag/add/', {'urllist_id': this.urllist.id, 'url_ids': this.selected.map(item => item.id), 'tag': this.selected_tag});
    },
    remove_tags() {
      // support the scenario from issue #344
      if (this.last_searched)
          this.selected_tag = this.last_searched.toLowerCase()

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
    },
    urls(old_value, new_value) {
      if (old_value === new_value || !new_value)
        return
      this.visibleRows = new_value.length;
    },
    selected(old_value, new_value) {
      console.log(old_value)
      console.log(new_value)
      console.log(`${new_value.length} / ${ this.visibleRows}`)
      if (new_value.length === this.visibleRows){
        this.allSelectedIndeterminate = false
        this.allSelected = true
        return
      }

      if (new_value.length === 0){
        this.allSelectedIndeterminate = false
        this.allSelected = false
        return
      }
      this.allSelectedIndeterminate = true
    }

  }

}
</script>
