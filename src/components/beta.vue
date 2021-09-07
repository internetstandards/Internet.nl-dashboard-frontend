<template>
  <div>
    <content-block>
      <h1>This page is used to test components.</h1>
    </content-block>

    <content-block>
      <b-row cols-sm="1" cols-md="2">
        <b-col>
          <donut :data="donut_data['statistics_per_issue_type']['internet_nl_mail_auth_dkim_exist']"
                 title="internet_nl_mail_auth_dkim_exist"/>
        </b-col>
        <b-col>
          <donut :data="donut_data['statistics_per_issue_type']['high']" title="internet_nl_mail_dashboard_tls"/>
        </b-col>
        <b-col>
          <donut :data="donut_data['statistics_per_issue_type']['zeros']" title="zeros"/>
        </b-col>
        <b-col>
          <donut :data="donut_data['statistics_per_issue_type']['hundreds']" :axis="['pct_high', 'pct_low', 'pct_ok']"
                 title="Different first axis and too much data"/>
        </b-col>
        <b-col>
          <donut :data="internetnlscore" :axis="['internetnlscore', 'internetnlscore_rest']" title="Internet.nl score"/>
        </b-col>
        <b-col>
          <donut :data="internetnlscore" :axis="['internetnlscore', 'clear']" :height='300' title="Internet.nl score"/>
        </b-col>
        <b-col>
          <donut :data="internetnlscore" :axis="['internetnlscore', 'clear']" :datalabels="false" :height='100' title="height: 100, no datalabels"/>
        </b-col>
        <b-col>
          <donut :data="internetnlscore" :axis="['internetnlscore', 'clear']" :datalabels="false" :height='200' title="height: 200, no datalabels"/>
        </b-col>
        <b-col>
          <donut :data="internetnlscore" :axis="['internetnlscore', 'clear']" :height='300' title="height: 300, rest defaults"/>
        </b-col>
        <b-col>
          <donut :data="internetnlscore" :axis="['internetnlscore', 'clear']" :tooltip="false" :height='400' title="height: 400, tooltip disabled, only donut" :elements="['donut']" />
        </b-col>
        <b-col>
          <donut :data="{'score': 42, 'clear': 58}" :axis="['score', 'clear']" :tooltip="false" :datalabels="false" :height='100' :elements="['donut']" />
        </b-col>
      </b-row>
    </content-block>


    <content-block>
      <h2>Modal</h2>
      <b-button v-b-modal="'my-modal'">Launch demo modal</b-button>
      <b-modal id="my-modal">Hello From My Modal!</b-modal>

      <!-- Button trigger modal -->
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
        Launch demo modal
      </button>

      <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
           aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              ...
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </content-block>

    <content-block>
      <h2>Collapse</h2>
      <b-button v-b-toggle.collapse-2 class="m-1">Toggle Collapse</b-button>
      <b-collapse id="collapse-2">
        <b-card>I am collapsible content!</b-card>
      </b-collapse>
    </content-block>

    <content-block>
      <h2>Progress</h2>
      <b-progress :value="value" :max="max" show-progress animated></b-progress>
      <b-progress class="mt-2" :max="max" show-value>
        <b-progress-bar :value="value * (6 / 10)" variant="success"></b-progress-bar>
        <b-progress-bar :value="value * (2.5 / 10)" variant="warning"></b-progress-bar>
        <b-progress-bar :value="value * (1.5 / 10)" variant="danger"></b-progress-bar>
      </b-progress>

      <b-button class="mt-3" @click="randomValue">Click me</b-button>
    </content-block>

    <content-block>
      <h2>Tabs</h2>
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Tab 1" active>
            <b-card-text>Tab contents 1</b-card-text>
          </b-tab>
          <b-tab title="Tab 2">
            <b-card-text>Tab contents 2</b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>
    </content-block>


    <content-block>
      <h2>Tabs</h2>

      <b-tabs>
        <b-tab title="Tab 1" active>
          <b-card-text>Tab contents 1</b-card-text>
        </b-tab>
        <b-tab title="Tab 2">
          Tab contents 2
        </b-tab>
      </b-tabs>

    </content-block>

  </div>
</template>
<script>
import Donut from "@/components/charts/donut";

export default {
  components: {Donut},
  data() {
    return {
      value: 45,
      max: 100,

      donut_data: {
        "statistics_per_issue_type": {
          "internet_nl_mail_auth_dkim_exist": {
            "high": 0,
            "medium": 0,
            "low": 0,
            "ok": 2,
            "not_ok": 0,
            "not_testable": 0,
            "not_applicable": 0,
            "error_in_test": 0,
            "pct_high": 10.0,
            "pct_medium": 10.0,
            "pct_low": 10.0,
            "pct_not_applicable": 10.0,
            "pct_not_testable": 10.0,
            "pct_error_in_test": 10.0,
            "pct_ok": 40.0,
            "pct_not_ok": 0.0
          },
          "high": {
            "high": 0,
            "medium": 0,
            "low": 0,
            "ok": 2,
            "not_ok": 0,
            "not_testable": 0,
            "not_applicable": 0,
            "error_in_test": 0,
            "pct_high": 100.0,
            "pct_medium": 10.0,
            "pct_low": 0.0,
            "pct_not_applicable": 0.0,
            "pct_not_testable": 0.0,
            "pct_error_in_test": 0.0,
            "pct_ok": 0.0,
            "pct_not_ok": 0.0
          },
          "zeros": {
            "high": 0,
            "medium": 0,
            "low": 0,
            "ok": 2,
            "not_ok": 0,
            "not_testable": 0,
            "not_applicable": 0,
            "error_in_test": 0,
            "pct_high": 0.0,
            "pct_medium": 0.0,
            "pct_low": 0.0,
            "pct_not_applicable": 0.0,
            "pct_not_testable": 0.0,
            "pct_error_in_test": 0.0,
            "pct_ok": 0.0,
            "pct_not_ok": 0.0
          },
          "hundreds": {
            "high": 0,
            "medium": 0,
            "low": 0,
            "ok": 2,
            "not_ok": 0,
            "not_testable": 0,
            "not_applicable": 0,
            "error_in_test": 0,
            "pct_high": 100.0,
            "pct_medium": 100.0,
            "pct_low": 100.0,
            "pct_not_applicable": 100.0,
            "pct_not_testable": 100.0,
            "pct_error_in_test": 100.0,
            "pct_ok": 100.0,
            "pct_not_ok": 100.0
          },
        }
      },

      internetnlscore: {
        "internetnlscore": 42,
        "internetnlscore_rest": 58,
        "clear": 58,
      },

    }
  },
  methods: {
    randomValue() {
      this.value = Math.random() * this.max
    }
  }

}
</script>
