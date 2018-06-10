<template>
    <div id="gmapParent">
      <div id="gmap" />
      <div id="popup">
        <b-link :to="{name: 'default-institution-id', params: {id: selected.id}}" v-if="selected">
          <b-card :title="selected.name" class="gmap-iw-card" style="width: 350px;">
            <table style="width: 100%;">
              <tr><th>Achiziții directe</th><td>{{ selected.contract_count }}</td></tr>
              <tr><th>Licitații</th><td>{{ selected.tender_count }}</td></tr>
            </table>
          </b-card>
        </b-link>
      </div>
      <div id="gmapSearch">
        <b-form @submit.prevent="doSearch()">
          <b-form-group>
          <b-form-text tag="h4" text-variant="darkq">Caută achiziții</b-form-text>
          </b-form-group>
          <b-form-group id="keywordsGroup">
            <b-form-input id="keywordsInput" type="text" v-model="params.keywords" placeholder="Cuvinte cheie"/>
          </b-form-group>
          <b-form-group id="institutionsGroup">
            <b-form-input id="institutionsInput" type="text" v-model="params.institution" placeholder="Instituții"/>
          </b-form-group>
          <b-form-group id="companiesGroup">
            <b-form-input id="companiesInput" type="text" v-model="params.company" placeholder="Societăți comerciale"/>
          </b-form-group>
          <b-form-group id="vatGroup">
            <b-form-input id="vatInput" type="text" v-model="params.reg_no" placeholder="CUI"/>
          </b-form-group>
          <b-button type="submit" variant="primary" style="width: 100%;">Caută</b-button>
        </b-form>
      </div>
    </div>
</template>

<script>
import _ from 'lodash'
import definePopupClass from '@/assets/js/gmapsPopup'

const pinIcon = {url: '/pin.svg', scaledSize: {width: 28, height: 40}, anchor: {x: 14, y: 40}}
const groupIcon = {url: '/cluster.svg', scaledSize: {width: 40, height: 40}, anchor: {x: 20, y: 20}}
const pinShape = {coords: [14, 40, 5, 28, 0, 14, 4, 4, 14, 0, 24, 4, 28, 14, 23, 28], type: 'poly'}

let markers = []

export default {
  name: 'Main',
  data: function () {
    return {
      selected: null,
      params: {}
    }
  },
  methods: {
    getPins: function () {
      let zoom = this.map.getZoom()
      let bounds = this.map.getBounds()
      let ne = bounds.getNorthEast()
      let sw = bounds.getSouthWest()
      let width = this.map.getDiv().offsetWidth
      let height = this.map.getDiv().offsetHeight
      let mapSize = Math.sqrt(width * width + height * height)
      this.$axios.get(`institutions?cluster=true&n=${ne.lat()}&s=${sw.lat()}&e=${ne.lng()}&w=${sw.lng()}&zoom=${zoom}&size=${mapSize}`).then(response => {
        var self = this
        if (markers) {
          for (let marker of markers) {
            marker.setMap(null)
          }
        }
        markers = []
        for (let item of response.data) {
          let marker = null
          if (item.count && item.count > 1) {
            marker = new window.google.maps.Marker({
              position: {lat: item.lat, lng: item.lng},
              icon: groupIcon,
              map: this.map
            })
            marker.addListener('click', function () {
              this.map.setCenter(marker.getPosition())
              this.map.setZoom(this.map.getZoom() + 1)
            })
          } else {
            marker = new window.google.maps.Marker({
              position: {lat: item.lat, lng: item.lng},
              icon: pinIcon,
              shape: pinShape,
              map: this.map,
              metadata: {id: item.id}
            })
            marker.addListener('click', function () {
              let position = marker.getPosition()
              this.map.setCenter(position)
              self.selected = null
              let id = marker.metadata.id
              self.$axios.get(`institution_summary/${id}`).then(response => {
                self.selected = response.data
                if (!self.popup) {
                  self.popup = new self.Popup(position, document.getElementById('popup'))
                  self.popup.setMap(self.map)
                  console.log(self.Popup)
                } else {
                  self.popup.position = position
                }
              })
            })
          }
          markers.push(marker)
        }
      })
    },
    doSearch: function () {
      if ('company' in this.params) {
        this.$router.push({name: 'default-search-company-kw', params: {kw: this.params.company}})
      } else if ('reg_no' in this.params) {
        this.$axios.get(`search/reg_no/${this.params.reg_no}`).then(({data}) => {
          if (data.is_company)
            this.$router.push({name: 'default-company-id', params: {id: data.id}})
          else
            this.$router.push({name: 'default-institution-id', paras: {id: data.id}})
        }).catch(error => {
          this.$toasted.error('Codul unic nu există în baza de date', {
            position: 'top-left',
            duration: 5000,
            icon: 'exclamation-circle'
          })
        })
      } else if ('institution' in this.params) {
        this.$router.push({name: 'default-search-institution-kw', params: {kw: this.params.institution}})
      } else if ('keywords' in this.params) {
        this.$router.push({name: 'default-search-contract-kw', params: {kw: this.params.keywords}})
      }
    }
  },
  mounted () {
    const mapOptions = {
      zoom: 7,
      center: {lat: 45.8, lng: 26.1025384},
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          elementType: 'geometry',
          stylers: [{color: '#f5f5f5'}]
        },
        {
          elementType: 'labels.icon',
          stylers: [{visibility: 'off'}]
        },
        {
          elementType: 'labels.text.fill',
          stylers: [{color: '#616161'}]
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{color: '#f5f5f5'}]
        },
        {
          featureType: 'administrative.country',
          stylers: [
            {color: '#a5a59f'},
            {lightness: -5},
            {visibility: 'on'}
          ]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'labels.text.fill',
          stylers: [{color: '#bdbdbd'}]
        },
        {
          featureType: 'administrative.locality',
          stylers: [
            {color: '#5f5f5d'},
            {visibility: 'simplified'}
          ]
        },
        {
          featureType: 'administrative.province',
          stylers: [{color: '#bcbcbc'}]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{color: '#eeeeee'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#757575'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#e5e5e5'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9e9e9e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#ffffff'}]
        },
        {
          featureType: 'road.arterial',
          elementType: 'labels.text.fill',
          stylers: [{color: '#757575'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#dadada'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#616161'}]
        },
        {
          featureType: 'road.local',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9e9e9e'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'geometry',
          stylers: [{color: '#e5e5e5'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'geometry',
          stylers: [{color: '#eeeeee'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#c9c9c9'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9e9e9e'}]
        }
      ]
    }
    if (typeof window !== undefined) {
      if (this.$google !== undefined) {
        let map = new window.google.maps.Map(document.getElementById('gmap'), mapOptions)
        this.map = map
        map.addListener('bounds_changed', _.debounce(this.getPins, 200))
        this.Popup = definePopupClass()
      } else {
        var self = this
        // wait for google maps api to initialize
        window.addEventListener('maps-module:loaded', function () {
          let map = new window.google.maps.Map(document.getElementById('gmap'), mapOptions)
          self.map = map
          map.addListener('bounds_changed', _.debounce(self.getPins, 200))
          self.Popup = definePopupClass()
        })
      }
    }
  }
}
</script>

<style scoped>
#gmapParent { height: 100%; width: 100%; }
#gmap { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
#gmapSearch {
  width: 260px;
  position: absolute;
  top: 10%; left: 5%;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
}

#gmapDebug {
  width: 100%;
  position: absolute;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
}

#gmapWindow {
  width: 350px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0;
}
</style>
