<template>
    <div class="block fullwidth">
        <b-table-simple hover small caption-top striped responsive="true">
            <caption>{{ total }} {{ title }}</caption>
            <b-tr>
                <b-th>Year</b-th>
                <b-th>Total</b-th>
                <b-th>Jan</b-th>
                <b-th>Feb</b-th>
                <b-th>Mar</b-th>
                <b-th>Apr</b-th>
                <b-th>May</b-th>
                <b-th>Jun</b-th>
                <b-th>Jul</b-th>
                <b-th>Aug</b-th>
                <b-th>Sep</b-th>
                <b-th>Oct</b-th>
                <b-th>Nov</b-th>
                <b-th>Dec</b-th>
            </b-tr>
            <b-tr v-for="year in years" :key="year">
                <b-th>{{year}}</b-th>
                <b-th>{{data.per_year[year]}}</b-th>
                <b-td>{{data.per_month[year][1]}}</b-td>
                <b-td>{{data.per_month[year][2]}}</b-td>
                <b-td>{{data.per_month[year][3]}}</b-td>
                <b-td>{{data.per_month[year][4]}}</b-td>
                <b-td>{{data.per_month[year][5]}}</b-td>
                <b-td>{{data.per_month[year][6]}}</b-td>
                <b-td>{{data.per_month[year][7]}}</b-td>
                <b-td>{{data.per_month[year][8]}}</b-td>
                <b-td>{{data.per_month[year][9]}}</b-td>
                <b-td>{{data.per_month[year][10]}}</b-td>
                <b-td>{{data.per_month[year][11]}}</b-td>
                <b-td>{{data.per_month[year][12]}}</b-td>
            </b-tr>
        </b-table-simple>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Object
        },
        total: {
            type: Number
        },
        title: {
            type: String
        }
    },
    computed: {
        years: function() {
            if (this.data === undefined) return [];
            return Object.keys(this.data.per_year)
        },
    }
}
</script>
<i18n>
{}
</i18n>