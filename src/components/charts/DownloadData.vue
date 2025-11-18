<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-button variant="warning" @click="download_data_as_csv">Download</b-button>
</template>

<script>
export default {
name: "DownloadData",
  props: {
    fields: {type: Array, required: true},
    data: {type: Array, required: true},
  },

  methods: {
    download_data_as_csv(){
      let csv = "";

      const labels = this.fields.map(field => field.label)
      const keys = this.fields.map(field => field.key)
      csv += labels.join(',');
      csv += "\n";

      this.data.forEach((row) => {
        // todo: this is very slow, could be much faster, given there is little data it's ok for now...
        const record = []
        keys.forEach((key) => {
          record.push(row[key]);
        })
        csv += record.join(',');
        csv += "\n";
      });

      this.download(csv, "data.csv")
    },

    download(data, filename){
      const aDownloadLink = document.createElement('a');
      aDownloadLink.download = filename;
      aDownloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
      aDownloadLink.click();
    }
  }
}
</script>

<style scoped>

</style>
