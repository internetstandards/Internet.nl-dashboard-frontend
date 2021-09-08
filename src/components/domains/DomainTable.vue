<template>
  <div>
    <b-form-group
        label="Filter"
        label-for="filter-input"
        label-cols-sm="1"
        label-align-sm="right"
        label-size="sm"
        class="mb-0"
    >
      <b-input-group size="sm">
        <b-form-input
            id="filter-input"
            v-model="filter"
            type="search"
            placeholder="Type to Search"
        ></b-form-input>

        <b-input-group-append>
          <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>

    


    <b-table :busy="loading" striped hover small selectable responsive select-mode="range"
             :items="urls"
             :fields="table_fields"
             :filter="filter"
             :filter-included-fields="['tags', 'url']"
             selected-variant="info"
    >
      <template #cell(scannable)="data">
        <template v-if="urllist.scan_type === 'mail'">
            <span v-if="data.item.has_mail_endpoint === true" :title="$t('eligeble_mail', [data.item.url])">
                <span role="img" :aria-label="$t('eligeble_mail', [edited_url_value])">🌍</span>
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
    }
  },
  data() {
    return {
      filter: "",
      table_fields: [
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
        }
      ],
    }
  }

}
</script>

<style scoped>

</style>