<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
    <content-block>
        <h1><b-icon icon="person-bounding-box" /> {{ $t("admin.switch_account.title") }}</h1>
        <p> {{ $t("admin.switch_account.intro") }}</p>
        <p><b>{{ $t("admin.switch_account.reload_page_warning") }}</b></p>

        <template v-if="server_response.success">
            <server-response :response="server_response"
                             :message='$t("admin.switch_account.switched_account", [server_response.data.account_name])'></server-response>
        </template>
        <template v-else>
            <server-response :response="server_response"></server-response>
        </template>

        <p>
            <button role="link" @click="get_accounts">🔁 {{ $t("admin.switch_account.reload_list") }}</button>
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
                pills
                size="sm"
                class="my-0"
            ></b-pagination>
            <br />

            <b-table striped hover selectable
                     ref="selectableTable"
                     :responsive="'sm'"
                     :select-mode="'single'"
                     :no-border-collapse="true"
                     :items="accounts"
                     :fields="fields"
                     :primary-key="'id'"
                     :busy="loading"
                     :filter-included-fields="filterOn"
                     :sort-by.sync="sortBy"
                     :sort-desc.sync="sortDesc"
                     sort-icon-left
                     :current-page="currentPage"
                     :per-page="perPage"
                     :filter="filter"
                     @row-selected="onRowSelected"
            >
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
            sortBy: 'id',
            sortDesc: false,
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
    mounted: function () {
        this.get_accounts();
    },
    methods: {
        onRowSelected(items) {
            if (this.initial_selected.id !== items[0]['id']) {
                this.set_account(items[0]['id'])
                this.selected = items;
                this.initial_selected = items[0];
            }
        },
        selectAccountRow() {
            for (let i = 0; i < this.$refs.selectableTable.items.length; i++) {
                if (this.$refs.selectableTable.items[i]['id'] === this.current_account['id']) {
                    this.$refs.selectableTable.selectRow(i);
                }
            }
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
                // enabling this will flash the table, which is annoying
                // this.get_accounts();

                // not the nicest solution, but it works and prevents mistakes by not reloading the page...
                location.reload();
            });
        }
    }
}
</script>
