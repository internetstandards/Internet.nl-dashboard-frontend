<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
    <content-block>
        <h1><i-bi-person-bounding-box /> {{ $t("admin.switch_account.title") }}</h1>
        <p> {{ $t("admin.switch_account.intro") }}</p>

      {{this.current_account.id}}: {{this.current_account.name}}

        <template v-if="server_response.success">
            <server-response :response="server_response"
                             :message='$t("admin.switch_account.switched_account", [server_response.data.account_name])'></server-response>
        </template>
        <template v-else>
            <server-response :response="server_response"></server-response>
        </template>

        <p>
            <b-button variant="warning" role="link" @click="get_accounts">🔁 {{ $t("admin.switch_account.reload_list") }}</b-button>
            <br><br>
            <label for="account_selection">{{ $t("admin.switch_account.select") }}:</label>

            <!--
            We want to see everything, :sticky-header="true" disabled.
            -->
            <b-form-input
                v-model="filter"
                type="search"
                id="filterInput"
                placeholder="Type to Search"
            ></b-form-input>
            <br />
            <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                v-if="totalRows > perPage"
                size="sm"
                class="my-0"
            ></b-pagination>
            <br />

            <b-table striped hover selectable
                     v-model:selected-items="selected_items"
                     :responsive="'sm'"
                     :select-mode="'single'"
                     :no-border-collapse="true"
                     :items="accounts"
                     :fields="fields"
                     :primary-key="'id'"
                     :busy="loading"
                     :filter-included-fields="filterOn"
                     :current-page="currentPage"
                     :per-page="perPage"
                     :filter="filter"

                     @row-selected="onRowSelected"
            >
                <template #cell(selected)="{ rowSelected }">
                    <template v-if="rowSelected">
                        <span aria-hidden="true">&check;</span>
                        <span class="visually-hidden">Selected</span>
                    </template>
                    <template v-else>
                        <span aria-hidden="true">&nbsp;</span>
                        <span class="visually-hidden">Not selected</span>
                    </template>
                </template>

                <template #cell(users)="data">
                   {{ data.value.join(", ") }}
                </template>

                <template #table-busy>
                    <loading :loading="loading"/>
                </template>
            </b-table>
        </p>
    </content-block>
</template>

<script>
import http from "@/httpclient";

export default {
    data: function () {
        return {
            fields: [
                {key: "selected", sortable: false, label: 'Activated'},
                {key: "id", sortable: true, label: 'Id'},
                {key: "name", sortable: true, label: 'Name'},
                {key: "scans", sortable: true, label: 'Scans'},
                {key: "lists", sortable: true, label: 'Lists'},
                {key: "users", sortable: true, label: 'Users'}
            ],

          selected_items: [],

            filter: "",
            filterOn: ['name', 'id', 'users'],
            perPage: 10,
            totalRows: 1,
            currentPage: 1,

            accounts: [],
            current_account: {},
            server_response: {},
            loading: false,
            selected: [],
            initial_selected: {}
        }
    },
    beforeMount: function () {
        this.get_accounts();
    },
    methods: {
        onRowSelected(x) {
          if (x.id !== this.current_account.id) {
            this.set_account(x.id)
          }
        },
        selectAccountRow(x) {
          this.selected_items = [this.current_account];
        },
        get_accounts: function () {
            this.loading = true;
            http.get('/data/powertools/get_accounts/').then(data => {
                this.accounts = data.data['accounts'];
                this.current_account = data.data['current_account'];
                this.selected = [data.data['current_account']];
                this.initial_selected = data.data['current_account'];
                this.totalRows = this.accounts.length;
                this.loading = false;
                // set the initial value.
                this.$nextTick(() => {
                    this.selectAccountRow();
                })

            });
        },
        set_account: function (account_id) {
            http.post('/data/powertools/set_account/', {'id': account_id}).then(server_response => {
                this.server_response = server_response.data;
                // not the nicest solution, but it works and prevents mistakes by not reloading the page...
                location.reload();
            });
        }
    },
}
</script>
