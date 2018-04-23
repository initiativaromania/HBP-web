<template>
    <div id="gmapParent">
      <gmap-map :center="center" :zoom="zoom" :options="mapOptions"
        ref="gmap" id="gmap">
        <gmap-cluster
          :styles="
            [{url:'/static/cluster.svg', width: 40, height: 40, textSize: 1,
            anchorIcon: [20,20]
            }]"
          >
          <gmap-marker
            :key="m.InstitutiePublicaId"
            v-for="m in markers"
            :position="{lat: m.lat, lng: m.long}"
            :clickable="true"
            :draggable="false"
            :icon="{url: '/static/pin.svg', scaledSize: {width: 28, height: 40}, anchor: {x: 14, y: 40}}"
            :shape="{coords: [14,40, 5,28,  0,14, 4,4, 14,0, 24,4, 28,14, 23,28], type: 'poly'}"
            @click="selectMark(m)"
          />
        </gmap-cluster>
        <gmap-info-window :position="{lat: selected.lat, lng: selected.long}" v-if="selected!==null" :opened="true"
              ref="infowindow" :options="{maxWidth: 350}">
              <b-link :to="{name: 'InstitutionDetails', params: {id: selected.InstitutiePublicaId}}">
                <b-card :title="selected.Nume" class="gmap-iw-card" style="width: 350px;">
                  <table style="width: 100%;">
                    <tr><th>Achiziții directe</th><td>{{ selected.nr_achizitii }}</td></tr>
                    <tr><th>Licitații</th><td>{{ selected.nr_licitatii }}</td></tr>
                  </table>
                </b-card>
              </b-link>
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
          <b-button type="submit" variant="primary" style="width: 100%;">Caută</b-button>
        </b-form>
      </div>
      <!-- <div id="gmapDebug">
        <b-btn v-b-toggle.collapse1>Toggle</b-btn>
        <b-collapse id="collapse1">
          <pre>{{selected}}</pre>
        </b-collapse>
      </div> -->
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
      this.selected = item
      this.$refs.gmap.panTo({lat: item.lat, lng: item.long})
      this.axios.get(`PublicInstitutionSummary/${item.InstitutiePublicaId}`)
        .then(response => {
          this.selected = {...item, ...response.data[0]}
          if (this.$refs.infowindow != null) {
            this.$refs.infowindow.openInfoWindow()
            var iwOuter = this.$('.gm-style-iw')
            var iwBackground = iwOuter.prev()
            iwBackground.children(':nth-child(2)').css({display: 'none'})
            iwBackground.children(':nth-child(4)').css({display: 'none'})
            // iwOuter.parent().parent().css({left: '115px', border: '1px red dashed'})
            // iwBackground.children(':nth-child(1)').attr('style', function (i, s) { return s + 'left: 76px !important;' })
            // console.log(iwBackground.children(':nth-child(1)'))
            // iwBackground.children(':nth-child(3)').attr('style', function (i, s) { console.log(s); return s + 'left: 76px !important;' })
            // iwBackground.children(':nth-child(3)').css({left: '76px;'})
            // console.log(iwBackground.children(':nth-child(3)').css('left'))
            // iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index': '1'})
            var iwCloseBtn = iwOuter.next()
            iwCloseBtn.css({display: 'none'})
            // iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'})
          }
        })
      var iwOuter = this.$('.gm-style-iw')
      var iwBackground = iwOuter.prev()
      iwBackground.children(':nth-child(2)').css({display: 'none'})
      iwBackground.children(':nth-child(4)').css({display: 'none'})
      // iwOuter.parent().parent().css({left: '115px', border: '1px red dashed'})
      // iwBackground.children(':nth-child(1)').attr('style', function (i, s) { return s + 'left: 76px !important;' })
      // console.log(iwBackground.children(':nth-child(1)'))
      // iwBackground.children(':nth-child(3)').attr('style', function (i, s) { console.log(s); return s + 'left: 76px !important;' })
      // iwBackground.children(':nth-child(3)').css({left: '76px;'})
      // console.log(iwBackground.children(':nth-child(3)').css('left'))
      // iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index': '1'})
      var iwCloseBtn = iwOuter.next()
      iwCloseBtn.css({display: 'none'})
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
  width: 260px;
  position: absolute;
  top: 10%; left: 10%;
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
