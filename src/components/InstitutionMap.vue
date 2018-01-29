<template>
  <div class="landing">
    <gmap-map :center="center" :zoom="zoom" :options="{styles: styles}"
      ref="gmap" style="width: 100%; height: 600px;">
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
      styles: [
        {
          featureType: 'administrative',
          elementType: 'all',
          stylers: [ { saturation: -100 } ]
        }, {
          featureType: 'administrative.province',
          elementType: 'all'
          // stylers: [ { visibility: 'off' } ]
        }, {
          featureType: 'landscape',
          elementType: 'all',
          stylers: [
            { saturation: -100 },
            { lightness: 65 },
            { visibility: 'on' }
          ]
        }, {
          featureType: 'poi',
          elementType: 'all',
          stylers: [
            { saturation: -100 },
            { lightness: 50 },
            { visibility: 'simplified' }
          ]
        }, {
          featureType: 'road',
          elementType: 'all',
          stylers: [ { saturation: -100 } ]
        }, {
          featureType: 'road.highway',
          elementType: 'all',
          stylers: [ { visibility: 'simplified' } ]
        }, {
          featureType: 'road.arterial',
          elementType: 'all',
          stylers: [ { lightness: 30 } ]
        }, {
          featureType: 'road.local',
          elementType: 'all',
          stylers: [ { lightness: 40 } ]
        }, {
          featureType: 'transit',
          elementType: 'all',
          stylers: [
            { saturation: -100 },
            { visibility: 'simplified' }
          ]
        }, {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [
            { hue: '#0000ff' },
            { lightness: -25 },
            { saturation: -87 }
          ]
        }, {
          featureType: 'water',
          elementType: 'labels',
          stylers: [
            { lightness: -25 },
            { saturation: -100 }
          ]
        }
      ]
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
  created () {
    this.axios.get('InstitutionByCity/Bucuresti')
      .then(response => {
        this.markers = response.data
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
