import Vue from 'vue'
import VueCurrencyFilter from 'vue-currency-filter'
import VueMoment from 'vue-moment'

Vue.use(VueCurrencyFilter, {
  symbol: 'RON',
  thousandsSeparator: '.',
  fractionCount: 2,
  fractionSeparator: ',',
  symbolPosition: 'front',
  symbolSpacing: true
})
Vue.use(VueMoment)