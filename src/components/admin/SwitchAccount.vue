<template>
    <div id="switch-account" class="block fullwidth" style="min-height: 600px;">
        <h1>{{ $t("title") }}</h1>
        <p> {{ $t('intro') }}</p>
        <p><b>{{ $t('reload_page_warning') }}</b></p>

        <template v-if="server_response.success">
            <server-response :response="server_response"
                             :message="$t('switched_account', [server_response.data.account_name])"></server-response>
        </template>
        <template v-else>
            <server-response :response="server_response"></server-response>
        </template>

        <p>
            <button role="link" @click="get_accounts">{{ $t("reload_list") }}</button>
            <br><br>
            <label for="account_selection">{{ $t("select") }}:</label>

            <!--
            We want to see everything, :sticky-header="true" disabled.
            -->
            <b-form-input
                v-model="filter"
                type="search"
                id="filterInput"
                placeholder="Type to Search"
            ></b-form-input>

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

            <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                pills
                size="sm"
                class="my-0"
            ></b-pagination>
        </p>
    </div>
</template>

<script>
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
            fetch(`${this.$store.state.dashboard_endpoint}/data/powertools/get_accounts/`, {credentials: 'include'})
                .then(response => response.json()).then(data => {
                this.accounts = data['accounts'];
                this.current_account = data['current_account'];
                this.selected = [data['current_account']];
                this.initial_selected = data['current_account'];
                this.totalRows = this.accounts.length;
                this.loading = false;
                // set the initial value.
                this.$nextTick(() => {
                    this.selectAccountRow();
                })

            }).catch((fail) => {
                console.log('A loading error occurred: ' + fail);
                this.loading = false;
            });
        },
        set_account: function (account_id) {
            let data = {'id': account_id};
            this.asynchronous_json_post(
                `${this.$store.state.dashboard_endpoint}/data/powertools/set_account/`, data, (server_response) => {
                    this.server_response = server_response;

                    // enabling this will flash the table, which is annoying
                    // this.get_accounts();
                }
            );
        }
    }
}
</script>
<i18n>
{
    "en": {
        "title": "Switch Account",
        "intro": "This feature allows you to switch to another account, and use this site as them.",
        "reload_page_warning": "Important: refresh the page after choosing an account!",
        "select": "Select account to use, the account is instantly switched",
        "reload_list": "Reload account list",
        "switched_account": "Switched to account {0}. Refresh the page to use this account."
    },
    "nl": {
        "title": "Wissel van account",
        "intro": "Hiermee is te wisselen van account. Na een wissel voer je bijvoorbeeld scans uit vanuit die organisatie.",
        "reload_page_warning": "Let op: herlaad de pagina na het wisselen van account!",
        "select": "Selecteer het account om te gebruiken, wisselen gebeurd direct",
        "reload_list": "Lijst met accounts verversen",
        "switched_account": "Geswitched naar account {0}. Ververs de pagina om dit account te gebruiken."
    }
}
</i18n>