// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// v-model imports
import axios from 'axios'
import VueAxios from 'vue-axios'

// boostrap imports
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'

// gmaps
import * as VueGoogleMaps from 'vue2-google-maps'

// boostrap use
Vue.use(BootstrapVue)

// v-model config
axios.defaults.baseURL = process.env.API_URL
Vue.use(VueAxios, axios)

// gmaps
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GMAP_API_KEY,
    libraries: 'places,drawing,visualization'
  }
})

console.log(process.env)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
