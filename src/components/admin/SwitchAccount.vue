<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.switch-account-current,
.switch-account-users {
    overflow-wrap: anywhere;
}

.switch-account-table :deep(thead th) {
    overflow-wrap: normal;
    white-space: nowrap;
    word-break: normal;
}

.switch-account-table :deep(.b-table-stacked-label) {
    overflow-wrap: normal;
    word-break: normal;
}

.switch-account-table-container {
    position: relative;
}

.switch-account-reload {
    position: absolute;
    right: 0.25rem;
    top: 0.25rem;
    z-index: 2;
}

.switch-account-table :deep(caption) {
    min-height: 2.75rem;
    padding-right: 3.25rem;
}

@media (max-width: 767.98px) {
    .switch-account-table :deep(td) {
        white-space: normal;
    }
}
</style>

<template>
  <div>
    <page-header
        :title="$t('admin.switch_account.title')"
        :subtitle="$t('admin.switch_account.intro')"
    >
      <template #icon>
        <i-bi-person-bounding-box />
      </template>
    </page-header>

    <content-block>

        <template v-if="server_response.success">
            <server-response :response="server_response"
                             :message='$t("admin.switch_account.switched_account", [server_response.data.account_name])'></server-response>
        </template>
        <template v-else>
            <server-response :response="server_response"></server-response>
        </template>

        <div>
            <b-form-input
                v-model="filter"
                type="search"
                id="account_selection"
                placeholder="Type to Search"
                debounce="200"
                class="mb-3"
            />

            <div class="switch-account-table-container">
                <b-button
                    class="switch-account-reload"
                    variant="warning"
                    size="sm"
                    :disabled="loading || switching"
                    :aria-label="$t('admin.switch_account.reload_list')"
                    :title="$t('admin.switch_account.reload_list')"
                    @click="get_accounts"
                >
                    <i-bi-arrow-repeat aria-hidden="true" />
                </b-button>

                <b-table
                     v-model:selected-items="selected_items"
                     v-model:current-page="currentPage"
                     :items="accounts"
                     :fields="fields"
                     :busy="loading || switching"
                     :caption="$t('admin.switch_account.select')"
                     :filterable="filterOn"
                     :per-page="perPage"
                     :filter="filter"
                     primary-key="id"
                     select-mode="single"
                     stacked="md"
                     caption-top
                     selection-variant="warning"
                     class="switch-account-table"
                     label-stacked
                     responsive
                     no-border-collapse
                     selectable
                     show-empty
                     small
                     striped
                     hover
                     @filtered="onFiltered"
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
                   <span class="switch-account-users">{{ data.value.join(", ") }}</span>
                </template>

                <template #table-busy>
                    <loading :loading="loading || switching"/>
                </template>
                </b-table>
            </div>

            <b-pagination
                v-if="totalRows > perPage"
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                :limit="3"
                size="sm"
                class="justify-content-center flex-wrap mt-3 mb-0"
                first-number
                last-number
                hide-ellipsis
            />
        </div>
    </content-block>
  </div>
</template>

<script>
import http from "@/httpclient";

export default {
    data: function () {
        return {
            fields: [
                {key: "selected", sortable: false, label: 'Activated'},
                {key: "id", sortable: true, label: 'ID'},
                {key: "name", sortable: true, label: 'Name'},
                {key: "scans", sortable: true, label: 'Scans'},
                {key: "lists", sortable: true, label: 'Lists'},
                {key: "users", sortable: true, label: 'Users'}
            ],

          selected_items: [],

            filter: "",
            filterOn: ['name', 'id', 'users'],
            perPage: 50,
            totalRows: 0,
            currentPage: 1,

            accounts: [],
            current_account: {},
            server_response: {},
            loading: false,
            switching: false
        }
    },
    beforeMount: function () {
        this.get_accounts();
    },
    watch: {
        selected_items(selectedRows) {
            this.onSelectedItemsChanged(selectedRows);
        },
    },
    methods: {
        onFiltered(filteredItems) {
          this.totalRows = filteredItems.length
          this.currentPage = 1
        },
        onSelectedItemsChanged(selectedRows) {
          const selectedValue = Array.isArray(selectedRows) ? selectedRows[0] : selectedRows
          const selectedAccountId = typeof selectedValue === 'object' && selectedValue !== null
            ? selectedValue.id
            : selectedValue
          const accountId = Number(selectedAccountId)

          if (!Number.isInteger(accountId) || this.switching || accountId === Number(this.current_account.id)) {
            return
          }

          this.set_account(accountId)
        },
        selectAccountRow() {
          const accountId = Number(this.current_account.id);
          this.selected_items = Number.isInteger(accountId) ? [accountId] : [];
        },
        get_accounts: function () {
            this.loading = true;
            this.server_response = {};
            return http.get('/api/v1/admin/accounts').then(data => {
                this.accounts = data.data['accounts'];
                this.current_account = data.data['current_account'];
                this.totalRows = this.accounts.length;
                // set the initial value.
                this.$nextTick(() => {
                    this.selectAccountRow();
                })
            }).catch(error => {
                this.server_response = this.errorResponse(error, 'Unable to load accounts.');
            }).finally(() => {
                this.loading = false;
            });
        },
        set_account: function (account_id) {
            const accountId = Number(account_id);
            if (!Number.isInteger(accountId)) {
                this.server_response = {
                    error: true,
                    success: false,
                    message: 'Unable to switch accounts: invalid account ID.',
                    timestamp: new Date().toISOString(),
                };
                this.restoreCurrentAccountSelection();
                return Promise.resolve();
            }

            this.switching = true;
            this.server_response = {};

            return http.post(`/api/v1/admin/accounts/${accountId}/impersonation`).then(server_response => {
                this.server_response = server_response.data;

                if (server_response.data.success) {
                    this.reloadApplication();
                    return;
                }

                this.restoreCurrentAccountSelection();
            }).catch(error => {
                this.server_response = this.errorResponse(error, 'Unable to switch accounts.');
                this.restoreCurrentAccountSelection();
            }).finally(() => {
                this.switching = false;
            });
        },
        restoreCurrentAccountSelection: function () {
            this.$nextTick(() => {
                this.selectAccountRow();
            });
        },
        reloadApplication: function () {
            window.location.reload();
        },
        errorResponse: function (error, fallbackMessage) {
            const response = error.response?.data;
            if (response && typeof response === 'object') {
                return {
                    ...response,
                    error: true,
                    success: false,
                };
            }

            return {
                error: true,
                success: false,
                message: error.message || fallbackMessage,
                timestamp: new Date().toISOString(),
            };
        }
    },
}
</script>
