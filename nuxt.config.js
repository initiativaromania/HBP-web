require('dotenv').config()

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'hbp-web',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Harta Banilor Publici' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },

    vendor: [ 'axios', 'bootstrap-vue', 'vue-currency-filter', 'vue-moment', 
              'vue-slider-component', 'chart.js', 'vue-chartkick', 'highcharts', 'vue-highcharts',
              'lodash', 
              '~/assets/js/romaniaMap.js', '~/assets/js/cvplegend.js',
              '~/assets/js/gmapsPopup.js']
  },

  modules: [
    ['bootstrap-vue/nuxt', { css: false }],
    ['@nuxtjs/axios'],
    ['@nuxtjs/dotenv'],
    ['nuxt-google-maps-module', { key: "AIzaSyA9NhBPMAbAkRR0_-yiO32gQr_vKUGqnsE", defer: false, async: false }]
  ],

  css: [
    '@/assets/css/app.scss'
  ],

  plugins: [
    '~plugins/filters.js',
    { src: '~plugins/slider.js', ssr: false },
    '~plugins/chartkick.js',
    { src: '~plugins/highcharts.js', ssr: false }
  ],

  axios: {
       baseURL: process.env.API_URL
  }
}
