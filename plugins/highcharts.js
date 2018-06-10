import Vue from 'vue'
import VueHighcharts from 'vue-highcharts'
import HighCharts from 'highcharts'
import loadMap from 'highcharts/modules/map'

loadMap(HighCharts)
Vue.use(VueHighcharts, { HighCharts })