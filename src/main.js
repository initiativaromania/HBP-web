// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// axios imports
import axios from 'axios'
import VueAxios from 'vue-axios'
import {loadProgressBar} from 'axios-progress-bar'

// boostrap imports
// import 'bootstrap/dist/css/bootstrap.css'
import './assets/app.scss'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
import jquery from 'jquery'

// fontawesome
import 'font-awesome/css/font-awesome.css'

// chartKick
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'

// highcharts
import VueHighcharts from 'vue-highcharts'
import HighCharts from 'highcharts'
import loadMap from 'highcharts/modules/map'

import vueSlider from 'vue-slider-component'

// gmaps
// import * as VueGoogleMaps from 'vue2-google-maps'

// filters
import VueTruncate from 'vue-truncate'
import VueCurrencyFilter from 'vue-currency-filter'
import VueMoment from 'vue-moment'

import Toasted from 'vue-toasted'

Vue.use({
  install: function (Vue, options) {
    Vue.prototype.$ = jquery
  }
})

// boostrap use
Vue.use(BootstrapVue)

Vue.use(VueChartkick, {adapter: Chart})
loadMap(HighCharts)
Vue.use(VueHighcharts, { HighCharts })
Vue.use(vueSlider)

// axios config
axios.defaults.baseURL = process.env.API_URL
Vue.use(VueAxios, axios)
loadProgressBar()

// gmaps
// Vue.use(VueGoogleMaps, {
//   load: {
//     key: process.env.GMAP_API_KEY,
//     libraries: 'places,drawing,visualization'
//   }
// })

Vue.use(VueTruncate)
Vue.use(VueCurrencyFilter, {
  symbol: 'RON',
  thousandsSeparator: '.',
  fractionCount: 2,
  fractionSeparator: ',',
  symbolPosition: 'front',
  symbolSpacing: true
})
Vue.use(VueMoment)

Vue.config.productionTip = false

Vue.use(Toasted, {iconPack: 'fontawesome'})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
