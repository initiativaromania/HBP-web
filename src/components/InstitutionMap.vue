<template>
    <div id="gmapParent">
      <gmap-map :center="center" :zoom="zoom" :options="mapOptions"
        ref="gmap" id="gmap">
        <gmap-cluster>
          <gmap-marker
            :key="m.InstitutiePublicaId"
            v-for="m in markers"
            :position="{lat: m.lat, lng: m.long}"
            :clickable="true"
            :draggable="false"
            @click="selectMark(m)"
          />
        </gmap-cluster>
        <gmap-info-window :position="{lat: selected.lat, lng: selected.long}" v-if="selected!==null" :opened="true" ref="infowindow">
            <h5>{{selected.Nume}}</h5>
            <h6>{{selected.UAT}}</h6>
            <p>Adresă: {{ selected.Adresa }}</p>
            <b>{{ selected.nr_achizitii }} achiziții, {{ selected.nr_licitatii }} licitații</b>
            <b-link :to="{name: 'InstitutionDetails', params: {id: selected.InstitutiePublicaId}}">(detaill)</b-link>
        </gmap-info-window>
      </gmap-map>
      <div id="gmapSearch">
        <b-form>
          <b-form-group>
          <b-form-text tag="h4" text-variant="darkq">Caută achiziții</b-form-text>
          </b-form-group>
          <b-form-group id="keywordsGroup">
            <b-form-input id="keywordsInput" type="text" placeholder="Cuvinte cheie"/>
          </b-form-group>
          <b-form-group id="institutionsGroup">
            <b-form-input id="institutionsInput" type="text" placeholder="Instituții"/>
          </b-form-group>
          <b-form-group id="companiesGroup">
            <b-form-input id="companiesInput" type="text" placeholder="Societăți comerciale"/>
          </b-form-group>
          <b-form-group id="vatGroup">
            <b-form-input id="vatInput" type="text" placeholder="CUI"/>
          </b-form-group>
          <b-button type="submit" style="width: 100%;">Caută</b-button>
        </b-form>
      </div>
    </div>
</template>

<script>
export default {
  name: 'InstitutionMap',
  data () {
    return {
      markers: [],
      selected: null,
      center: {lat: 44.4267674, lng: 26.1025384},
      currCenter: null,
      zoom: 7,
      mapOptions: {
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'administrative',
            elementType: 'all',
            stylers: [ { saturation: -100 } ]
          },
          {
            featuretype: 'administrative.country',
            elementType: 'geometry.stroke',
            stylers: [ { color: '#ffffff' } ]
          },
          {
            featuretype: 'administrative.province',
            elementType: 'geometry.stroke',
            stylers: [ { color: '#000000' } ]
          },
          {
            featureType: 'administrative.province',
            elementType: 'all'
            // stylers: [ { visibility: 'off' } ]
          },
          {
            featureType: 'landscape',
            elementType: 'all',
            stylers: [
              { saturation: -100 },
              { lightness: 65 },
              { visibility: 'off' }
            ]
          }, {
            featureType: 'poi',
            elementType: 'all',
            stylers: [
              { saturation: -100 },
              { lightness: -50 },
              { visibility: 'off' }
            ]
          },
          {
            featureType: 'road',
            elementType: 'all',
            stylers: [ { saturation: -100 }, { lightness: 0 }, { visibility: 'on' } ]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [ { saturation: -100 }, { lightness: 0 }, { visibility: 'off' } ]
          },
          {
            featureType: 'road.highway',
            elementType: 'all',
            stylers: [ { lightness: 20 } ]
          },
          {
            featureType: 'road.highway',
            elementType: 'label',
            stylers: [ { visibility: 'simplified' } ]
          },
          {
            featureType: 'road.arterial',
            elementType: 'all',
            stylers: [ { lightness: 30 } ]
          },
          {
            featureType: 'road.arterial',
            elementType: 'label',
            stylers: [ { visibility: 'simplified' } ]
          },
          {
            featureType: 'road.local',
            elementType: 'all',
            stylers: [ { lightness: 40 } ]
          }, {
            featureType: 'transit',
            elementType: 'all',
            stylers: [
              { saturation: -100 },
              { visibility: 'off' }
            ]
          }, {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
              { hue: '#000000' },
              { lightness: 0 },
              { saturation: -100 }
            ]
          }, {
            featureType: 'water',
            elementType: 'labels',
            stylers: [
              { lightness: -25 },
              { saturation: -100 },
              { visibility: 'off' }
            ]
          }
        ]
      }
    }
  },
  methods: {
    selectMark (item) {
      this.axios.get(`PublicInstitutionSummary/${item.InstitutiePublicaId}`)
        .then(response => {
          this.selected = {...item, ...response.data[0]}
          if (this.$refs.infowindow != null) { this.$refs.infowindow.openInfoWindow() }
        })
      this.selected = item
    }
  },
  mounted () {
    this.axios.get('InstitutionByCity/Bucuresti')
      .then(response => {
        this.markers = response.data
      })
  }
}
</script>

<style scoped>
#gmapParent { height: 100%; width: 100%; position: relative; }
#gmap { width: 100%; height: 100%; }
#gmapSearch {
  width: 300px;
  position: absolute;
  top: 10%; left: 10%;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
}
</style>
