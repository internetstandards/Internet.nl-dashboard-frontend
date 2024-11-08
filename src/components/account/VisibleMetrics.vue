<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
    <div>
        <p>{{ $t("account.visible-metrics.intro") }}</p>
        <server-response :response="issue_filters_response"
                         :message="$t(issue_filters_response.message)"></server-response>

        <div v-for="scan_form in scan_methods" :key="scan_form.name">
            <b-card no-body>
                <b-tabs pills vertical card v-if="scan_form.name === report_type && Object.keys(issue_filters).length > 0" id="visible_metrics_tabs">
                    <b-tab v-for="category in scan_form.categories" :title="category.label" :key="category.label"
                           class="p-3">
                        <section class="test-header">
                            <div class="test-title">
                                <h4>{{ category.label }}</h4>

                                <span v-for="field in category.fields" :key="field.id">
                  <b-form-checkbox v-model="issue_filters[field.name].show_dynamic_average"
                                   @change="visible_metrics_see_if_category_is_relevant(category)" switch>
                      {{ $t("account.visible-metrics.show_dynamic_average") }}
                  </b-form-checkbox>
                </span>

                            </div>
                        </section>
                        <section class="testresults">
              <span class="select-deselect-category">
                  <a @click="check_fields(all_field_names_from_categories(category))"> {{ $t("account.visible-metrics.check") }} </a>
                  /
                  <a @click="uncheck_fields(all_field_names_from_categories(category))">{{ $t("account.visible-metrics.uncheck") }} </a>
              </span>

                            <div v-for="subcategory in category.categories" :key="subcategory.name">
                                <div class="test-subsection">{{ subcategory.label }}<br></div>
                                <div v-for="field in subcategory.fields" :key="field.name"
                                     class="testresult_without_icon">

                                    <b-form-checkbox v-model="issue_filters[field.name].visible"
                                                     :id="field.name + '_visible'" switch>
                                        {{ $t('metric.' + field.name + ".title") }}
                                    </b-form-checkbox>

                                    <template v-if="field.explanation">
                                        <p><i>{{ $t('metric.' + field.name + ".explanation") }}</i></p>
                                    </template>
                                </div>
                            </div>
                        </section>
                    </b-tab>
                    <b-tab :title="$t('account.visible-metrics.main_category')" class="p-3">
                        <h4>{{ $t("account.visible-metrics.main_category") }}</h4>

                        <b-form-checkbox v-model="issue_filters[scan_form.name].show_dynamic_average" switch>
                            {{ $t("account.visible-metrics.show_dynamic_average") }}
                        </b-form-checkbox>
                    </b-tab>

                </b-tabs>
            </b-card>
        </div>
        <br>
        <button @click="reset_issue_filters()">{{ $t("account.visible-metrics.buttons.reset") }}</button> &nbsp;
        <button @click="save_visible_metrics()">{{ $t("account.visible-metrics.buttons.save") }}</button>
        <br><br>
    </div>
</template>

<script>
import field_translations from '../FieldTranslations'
import {mapState} from 'vuex'
import http from "@/httpclient";
import report_mixin from "@/components/reports/report_mixin"

export default {
    mixins: [report_mixin],
    i18n: {
        sharedMessages: field_translations,
    },
    name: "VisibleMetrics",
    props: {
        report_type: {
            type: String,
            default: "web",
        }
    },
    data: function () {
        return {
            issue_filters_response: {},
            issue_filters: {}
        }
    },
    mounted: function () {
        this.load_visible_metrics();
    },
    methods: {
        reset_issue_filters: function () {
            http.get(`/data/account/report_settings/get/`).then(data => {
                if (!this.isEmptyObject(data.data)) {
                    this.issue_filters = data.data.data;
                    this.issue_filters_response = data.data;
                }
            });
            this.load_visible_metrics();
        },

        all_field_names_from_categories(categories) {
            let fields = [];
            categories.categories.forEach((category) => {
                category.fields.forEach((field) => {
                    fields.push(field.name);
                });
            });
            return fields;
        },

        save_visible_metrics() {
            /*
            * This overrides the account level issue filters. Filters are saved per account and this is done by
            * design. This prevents the 'having to reset for each report or for each user' dilemma, which results
            * in some kind of hierarchical settings mess that results in incomparable reports over several users.
            * And then the users need to sync the settings and so on. Knowing this limitation would probably remove
            * a lot of time of development while end users can still have an organization wide consistent experience
            * on what they are focussing on. Humans > tech.
            * */
            this.automatically_set_category();

            http.post(`/data/account/report_settings/save/`, {'filters': this.issue_filters}).then(server_response => {
                this.issue_filters_response = server_response.data;
                if (server_response.data.success) {
                    // load the metrics into the application
                    this.load_visible_metrics();
                }
            });
        },
        check_fields(list_of_fields) {
            list_of_fields.forEach((field) => {
                this.issue_filters[field].visible = true;
            })
        },

        uncheck_fields(list_of_fields) {
            list_of_fields.forEach((field) => {
                this.issue_filters[field].visible = false;
            })
        },
        visible_metrics_see_if_category_is_relevant(category_name) {
            // if all fields in the category are deselected, deselect the category, otherwise, select it.
            // console.log(category_name);

            let fields = this.all_subcategory_fields_from_category(category_name);

            let should_be_visible = false;
            for (let i = 0; i < fields.length; i++) {

                // alerting if fields are missing:
                // if (this.issue_filters[fields[i]] === undefined) {
                // console.log(`Missing field ${fields[i]} in issue filters.`)
                // }

                if (this.issue_filters[fields[i]].visible) {
                    // console.log(` ${fields[i]} is visible, so should the category.`)
                    should_be_visible = true;
                    break;
                }
            }

            // console.log(` ${category_name.key} should be visible: ${should_be_visible}`)
            this.issue_filters[category_name.key].visible = should_be_visible;
        },
        all_subcategory_fields_from_category(category_name) {
            const mail = 1;
            const web = 0;
            let fields = [];
            let method = (this.report_type === 'mail') ? mail : web;

            this.scan_methods[method].categories.forEach((category) => {
                // console.log(`Comparing ${category.key} to ${category_name.key}.`)
                if (category.key === category_name.key) {
                    category.categories.forEach((subcategory) => {
                        subcategory.fields.forEach((field) => {
                            fields.push(field.name);
                        });
                    });
                }
            });
            return fields;
        },
        automatically_set_category() {
            /**
             * Using the 'switch' button has a side effect: the value is set _after_ the @change is performed.
             * Therefore there is no up to date data inside the data. What we will do is iterate over all fields
             * and make sure that the correct categories are set. This is a hack to be somewhat efficient and not
             * go over the scan methods object. This will bite if there is more demand for doing things dynamically.
             * */

            // this.debug_state("automatically_set_category")
            let categories = []
            if (this.report_type === 'web'){
                categories = [
                    {key: 'internet_nl_web_ipv6'},
                    {key: 'internet_nl_web_dnssec'},
                    {key: 'internet_nl_web_tls'},
                    {key: 'internet_nl_web_appsecpriv'},
                    {key: 'internet_nl_web_rpki'},
                    {key: 'internet_nl_web_legacy_category'},
                ]
            } else {
                categories = [
                    {key: 'internet_nl_mail_dashboard_ipv6'},
                    {key: 'internet_nl_mail_dashboard_dnssec'},
                    {key: 'internet_nl_mail_dashboard_auth'},
                    {key: 'internet_nl_mail_dashboard_tls'},
                    {key: 'internet_nl_mail_dashboard_rpki'},
                    {key: 'internet_nl_mail_legacy_category'}
                ];
            }
            categories.forEach((category) => {
                this.visible_metrics_see_if_category_is_relevant(category)
            });

        },
        debug_state(where) {
            console.log(where)
            console.log(this.issue_filters['internet_nl_mail_starttls_tls_available']['visible'])
            console.log(this.issue_filters['internet_nl_web_https_tls_version']['visible'])
        }
    },
    computed: mapState(['visible_metrics']),
    watch: {
        visible_metrics(new_value) {
            // console.log('Visible metrics changed, saved to issue filters...')
            this.issue_filters = new_value;
            // this.debug_state("watch")
        },
        issue_filters() {
            this.automatically_set_category()
        }
    }
}
</script>

<style>
.select-deselect-category {
    font-size: 0.9em;
    display: block;
    width: 100%;
    text-align: right;
    padding-top: 5px;
    padding-bottom: 10px;
}

#visible_metrics_tabs .nav-item .active{
  color: white !important;

}
</style>
