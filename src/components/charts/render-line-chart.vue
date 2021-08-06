<template>
  <div>
    <div style="height:300px;">
    <canvas ref="canvas" role="img" class="graph-image" >
      <p>{{ $t("accessibility_text") }}</p>
    </canvas>
    </div>
    <!-- <button @click="download('png')">Download PNG</button> <button @click="download('jpg')">Download JPG</button> -->
  </div>
</template>

<script>
import chart_mixin from './chart_mixin.vue'

export default {
  mixins: [chart_mixin],

  data() {
    return {
      color_scheme: [
          {background: 'rgba(21, 66, 115, 1)', border: 'rgba(21, 66, 115, 1)'},
          {background: 'rgba(225, 112, 0, 1)', border: 'rgba(225, 112, 0, 1)'},
          {background: 'rgba(57, 135, 12, 1)', border: 'rgba(57, 135, 12, 1)'},
          {background: 'rgba(115, 21, 66, 1)', border: 'rgba(115, 21, 66, 1)'},
          {background: 'rgb(89, 88, 92)', border: 'rgb(89, 88, 92)'},
          {background: 'rgb(0, 0, 0)', border: 'rgba(0, 0, 0, 1)'},
      ],
    }
  },

  methods: {

    /*
    * [
          {
            "id": 3,
            "name": "testsites",
            "data": [
              {
                "date": "2020-01-07",
                "urls": 3,
                "average_internet_nl_score": 87.33
              },
              {
                "date": "2020-01-07",
                "urls": 3,
                "average_internet_nl_score": 87.33
              },
              {
                "date": "2020-01-07",
                "urls": 3,
                "average_internet_nl_score": 87.33
              }
            ]
          },
    * */
    renderData: function () {
      this.configure_linechart();

      let data = this.chart_data;

      let labels = Array();

      // There will be a large assortment of moment in time. These are added in random order, charts.js fixes it
      data.forEach((item) => {
        for (let i = 0; i < item.data.length; i++) {
          labels.push(item.data[i].date);
        }
      });

      // the trick to time series is that you can add data with both an x and y.
      // see: view-source:https://www.chartjs.org/samples/latest/scales/time/line.html
      this.chart.data.labels = labels;

      let datasets = [];
      let colorset = 0;
      data.forEach((item) => {

        let line_data = [];
        item.data.forEach((item_data) => {
          line_data.push({
            x: item_data.date,
            y: item_data.average_internet_nl_score,
            z: item_data.urls,
            is_selected: this.highlight_report_ids.includes(item_data.report),
            report: item_data.report
          })
        });

        let line_dataset =
            {
              // Each report has their own set of dates and such, there will be many gaps.
              spanGaps: true,
              label: item.name,
              data: line_data,
              // backgrounds do not work with multiple sets, only lines.
              fill: false,
              backgroundColor: this.color_scheme[colorset].background,
              borderColor: this.color_scheme[colorset].border,
              borderWidth: 3,
              lineTension: 0,
            };

        colorset += 1;
        datasets.push(line_dataset);
      });

      this.chart.data.datasets = datasets;

      this.chart.update();
    },
    renderTitle: function () {
      this.chart.options.plugins.title.text = this.$i18n.t('title');
    },
  }
}
</script>
<i18n>
{
  "en": {
    "title": "Average internet.nl score over time.",
    "month": "Month",
    "yAxis_label": "Average internet.nl score",
    "xAxis_label": "Date",
    "average_internet_nl_score": "Average internet.nl score",
    "accessibility_text": "A table with the content of this graph is shown below."
  },
  "nl": {
    "title": "Adoptie van standaarden over tijd.",
    "month": "Maand",
    "yAxis_label": "Gemiddelde internet.nl score",
    "xAxis_label": "Datum",
    "average_internet_nl_score": "Gemiddelde internet.nl score",
    "accessibility_text": "Een tabel met de inhoud van deze grafiek wordt hieronder getoond."
  }
}
</i18n>
