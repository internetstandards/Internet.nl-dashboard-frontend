<template>
    <div>
        <p>{{ $t("intro") }}</p>
        <div v-for="scan_form in scan_methods" :key="scan_form.name">
            <b-card no-body>
                <b-tabs pills card v-if="scan_form.name === report_type && Object.keys(issue_filters).length > 0">
                    <b-tab v-for="category in scan_form.categories" :title="category.label" :key="category.label"
                           class="p-3">
                        <section class="test-header">
                            <div class="test-title">
                                <h4>{{ category.label }}</h4>
                                <p>
                                <span v-for="field in category.fields" :key="field.id">
                                    <b-form-checkbox v-model="issue_filters[field.name].show_dynamic_average"
                                                     @change="visible_metrics_see_if_category_is_relevant(category)"
                                                     switch>
                                        {{ $t("show_dynamic_average") }}
                                    </b-form-checkbox>
                                </span>
                                </p>
                            </div>
                        </section>
                        <section class="testresults">
                        <span class="select-deselect-category">
                            <a @click="check_fields(all_field_names_from_categories(category))"> {{ $t("check") }} </a>
                            /
                            <a @click="uncheck_fields(all_field_names_from_categories(category))">
                                {{ $t("uncheck") }}
                            </a>
                        </span>

                            <div v-for="subcategory in category.categories" :key="subcategory.name">
                                <div class="test-subsection">{{ subcategory.label }}<br></div>
                                <div v-for="field in subcategory.fields" :key="field.name"
                                     class="testresult_without_icon">

                                    <b-form-checkbox
                                        v-model="issue_filters[field.name].visible" :id="field.name + '_visible'"
                                        switch>
                                        {{ $t(field.name) }}
                                    </b-form-checkbox>

                                    <template v-if="field.explanation">
                                        <p><i>{{ $t(field.name + "_explanation") }}</i></p>
                                    </template>
                                </div>
                            </div>
                        </section>
                    </b-tab>
                    <b-tab :title="$t('main_category')" class="p-3">
                        <h4>{{ $t("main_category") }}</h4>

                        <b-form-checkbox v-model="issue_filters[scan_form.name].show_dynamic_average" switch>
                            {{ $t("show_dynamic_average") }}
                        </b-form-checkbox>
                    </b-tab>

                </b-tabs>
            </b-card>
        </div>
        <br>
        <button @click="reset_issue_filters()">{{ $t("buttons.reset") }}</button> &nbsp;
        <button @click="save_visible_metrics()">{{ $t("buttons.save") }}</button>
        <br><br>
        <server-response :response="issue_filters_response"
                         :message="$t(issue_filters_response.message)"></server-response>

    </div>
</template>

<script>
import field_translations from './../field_translations'
import {mapState} from 'vuex'

export default {
    i18n: {
        sharedMessages: field_translations,
    },
    name: "VisibleMetrics",
    props: {
        scan_methods: {
            type: Array
        },
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
            fetch(`${this.$store.state.dashboard_endpoint}/data/account/report_settings/get/`, {credentials: 'include'}).then(response => response.json()).then(data => {
                if (!this.isEmptyObject(data)) {
                    this.issue_filters = data.data;
                    this.issue_filters_response = data;
                }
            });
            this.load_issue_filters();

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

        save_visible_metrics: function () {
            /*
            * This overrides the account level issue filters. Filters are saved per account and this is done by
            * design. This prevents the 'having to reset for each report or for each user' dilemma, which results
            * in some kind of hierarchical settings mess that results in incomparable reports over several users.
            * And then the users need to sync the settings and so on. Knowing this limitation would probably remove
            * a lot of time of development while end users can still have an organization wide consistent experience
            * on what they are focussing on. Humans > tech.
            * */
            this.asynchronous_json_post(
                `${this.$store.state.dashboard_endpoint}/data/account/report_settings/save/`, {'filters': this.issue_filters}, (server_response) => {
                    this.issue_filters_response = server_response;
                    if (server_response.success) {
                        // load the metrics into the application
                        this.load_visible_metrics();
                    }
                }
            );
        },
        check_fields: function (list_of_fields) {
            list_of_fields.forEach((field) => {
                this.issue_filters[field].visible = true;
            })
        },

        uncheck_fields: function (list_of_fields) {
            list_of_fields.forEach((field) => {
                this.issue_filters[field].visible = false;
            })
        },
        visible_metrics_see_if_category_is_relevant: function (category_name) {
            // if all fields in the category are deselected, deselect the category, otherwise, select it.
            // console.log(category_name);

            let fields = this.all_subcategory_fields_from_category(category_name);

            let should_be_visible = false;
            for (let i = 0; i < fields.length; i++) {

                // alerting if fields are missing:
                if (this.issue_filters[fields[i]] === undefined) {
                    // console.log(`Missing field ${fields[i]} in issue filters.`)
                }

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
    },
    computed: mapState(['visible_metrics']),
    watch: {
        visible_metrics: function (new_value) {
            this.issue_filters = new_value;
        },
        issue_filters: function () {
            /**
             * Using the 'switch' button has a side effect: the value is set _after_ the @change is performed.
             * Therefore there is no up to date data inside the data. What we will do is iterate over all fields
             * and make sure that the correct categories are set. This is a hack to be somewhat efficient and not
             * go over the scan methods object. This will bite if there is more demand for doing things dynamically.
             * */

            const categories = [
                {key: 'internet_nl_web_ipv6'},
                {key: 'internet_nl_web_dnssec'},
                {key: 'internet_nl_web_tls'},
                {key: 'internet_nl_web_appsecpriv'},
                {key: 'web_legacy'},
                {key: 'internet_nl_mail_dashboard_ipv6'},
                {key: 'internet_nl_mail_dashboard_dnssec'},
                {key: 'internet_nl_mail_dashboard_auth'},
                {key: 'internet_nl_mail_dashboard_tls'},
                {key: 'mail_legacy'}
            ];
            categories.forEach((category) => {
                this.visible_metrics_see_if_category_is_relevant(category)
            });
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
</style>
<i18n>
{
    "en": {
        "check": "Select all",
        "uncheck": "Deselect all",
        "title": "Select visible metrics",
        "main_category": "Average adoption of standards",
        "intro": "Focusing on specific metrics is possibly using this this selection tool. For example it's possible to only select HTTPS metrics or DNSSEC. Visible metrics are applied to all users of your organization.",
        "buttons": {
            "reset": "Reset",
            "reset_label": "Resets all values to their original status.",
            "save": "Save",
            "save_label": "Save the changes made in this form."
        },
        "show_category": "Show this category",
        "show_dynamic_average": "Show the average of selected fields",
        "only_show_dynamic_average": "Only show dynamic average",
        "settings": {
            "restored_from_database": "Settings restored from database",
            "updated": "Settings updated"
        }
    },
    "nl": {
        "check": "Selecteer alle",
        "uncheck": "Deselecteer alle",
        "title": "Selecteer zichtbare meetwaarden",
        "main_category": "Adoptie van standaarden",
        "intro": "Het richten op specifieke meetwaarden is mogelijk met onderstaande selectie-tool. Hiermee is het mogelijk om enkel HTTPS of DNSSEC informatie in de rapportages te zien. De zichtbare meetwaarden gelden voor alle gebruikers in je organisatie.",
        "buttons": {
            "reset": "Reset",
            "reset_label": "Zet de originele waardes terug naar de waardes in de database",
            "save": "Opslaan",
            "save_label": "Sla de wijzigingen in de zichtbare meetwaarden op."
        },
        "show_category": "Toon deze categorie",
        "show_dynamic_average": "Toon het gemiddelde van de geselecteerde velden",
        "only_show_dynamic_average": "Toon alleen het dynamisch berekende gemiddelde",
        "settings": {
            "restored_from_database": "Zichtbare meetwaarden zijn teruggezet naar de waardes in de database",
            "updated": "Zichtbare meetwaarden opgeslagen"
        }
    }
}
</i18n>