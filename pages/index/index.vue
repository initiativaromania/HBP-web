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
        <b-btn v-b-toggle.searchBar variant="outline-primary" size="sm"><span class="when-closed">+</span><span class="when-opened">-</span></b-btn>
        <b-collapse id="searchBar" visible>
          <b-form @submit.prevent="doSearch()">
            <b-form-group>
            <b-form-text tag="h4" text-variant="darkq">Caută achiziții</b-form-text>
            </b-form-group>
            <b-form-group id="keywordsGroup">
              <b-form-input id="keywordsInput" type="text" v-model="params.keywords" v-on:keyup.enter="submit" placeholder="Cuvinte cheie"/>
            </b-form-group>
            <b-form-group id="institutionsGroup">
              <b-form-input id="institutionsInput" type="text" v-model="params.institution" v-on:keyup.enter="submit" placeholder="Instituții"/>
            </b-form-group>
            <b-form-group id="companiesGroup">
              <b-form-input id="companiesInput" type="text" v-model="params.company" v-on:keyup.enter="submit" placeholder="Societăți comerciale"/>
            </b-form-group>
            <b-form-group id="vatGroup">
              <b-form-input id="vatInput" type="text" v-model="params.reg_no" v-on:keyup.enter="submit" placeholder="CUI"/>
            </b-form-group>
            <b-button type="submit" variant="primary" style="width: 100%;">Caută</b-button>
          </b-form>
        </b-collapse>
      </div>
      <div id="gmapMobile">
        <div class="text-muted">
          <b>Încearcă varianta de mobil a HBP!</b>
          <p>Descoperă instituțiile publice din jurul tău, oriunde te-ai afla în România, și cum se cheltuie
            banii publici!
          </p>
          <a href="https://itunes.apple.com/us/app/harta-banilor-publici/id1396034488" target="_blank" class="m-2" ><img src="/appstore.png" alt="Descarcă din Apple AppStore"></a>
          <a href="https://play.google.com/store/apps/details?id=initiativaromania.hartabanilorpublici" target="_blank" class="m-2" ><img src="/google-play.png" alt="Descarcă din Google Play"></a>
        </div>
      </div>
      <div id="gmapLogo">
          <img src="/by-ir-grey.png" />
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
            this.$router.push({name: 'default-institution-id', params: {id: data.id}})
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
  },
  head: {
    title: 'Harta Banilor Publici',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'Harta Banilor Publici', name: 'Harta Banilor Publici', content: 'Harta Banilor Publici' },
      { property: 'og:image', content: 'https://www.hartabanilorpublici.ro/preview.jpg' },
      { property: 'og:description', content: `Harta Banilor Publici vă permite să faceti propriiile voastre analize la nivel național privind cheltuirea banului public. Listează toate instituțiile publice din țară pe o hartă Google si permite accesarea tuturor contractelor pentru fiecare instituție. De asemenea, prin aplicație puteți să cautați companii, contracte sau instituții dupa nume și să listați topuri și statistici relevante:
evoluţia numărului de contracte de achiziţii publice (licitaţii + achiziţii directe) per instituţie/companie;
evoluţia valorii în RON a contractelor de achiziţie publică (licitaţii + achiziţii directe) per instituţie/companie
posibilitatea de a filtra în funcţie de data achiziţiei publice (licitaţii+achiziţii directe), statistici legate de CPV.` }
    ]
  }
}
</script>

<style scoped>
#gmapParent { height: 100%; width: 100%; }
#gmap { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
#gmapSearch {
  /* width: 260px; */
  position: absolute;
  top: 0; left: 5%;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  pointer-events: none;
}

#gmapSearch input, #gmapSearch button {
  pointer-events: initial;
}

#gmapMobile {
  max-width: 550px;
  position: absolute;
  bottom: 1rem; left: 0;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  pointer-events: none;
}

#gmapMobile a[href] {
  pointer-events: initial;
}

#gmapMobile > div {
  padding-left: 4rem;
}

#gmapLogo {
  position: absolute;
  bottom: 1rem; right: 2rem;
  background-color: rgba(255, 255, 255, 0.0);
  padding: 10px;
  pointer-events: none;
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
