<script>
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
use([ CanvasRenderer, BarChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent ])

export default {
    emits: [ 'alert' ],
    components: { VChart },
    data() {
        return { 
            chartOptions: {
                title: {
                    text: 'Example chart'
                },
                legend: {
                    orient: 'horizontal',
                    left: 'center',
                    bottom: 0,
                    data: [ 'Feature 1', 'Feature 2' ],
                },
                xAxis: {
                    type: 'category',
                    data: [],
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: 'Feature 1',
                        data: [ 3.10, 2.89, 4.36 ],
                        type: 'bar',
                    },
                    {
                            name: 'Feature 2',
                            data: [ 10.46, 12.78, 9.97 ],
                            type: 'bar',
                    }
                ],
            }
        }
    }
}
</script>

<template>
    <v-card>
        <v-card-text>
            <v-chart :option="chartOptions" class="barChart"></v-chart>
        </v-card-text>
    </v-card>
</template>

<style>
.barChart {
  height: 80vh;
}
</style>