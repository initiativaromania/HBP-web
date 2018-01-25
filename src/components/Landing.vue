<template>
  <div class="landing">
    <b-alert show>{{ msg }}</b-alert>
    <gmap-map :center="center" :zoom="zoom" ref="gmap"
        @center_changed="updateCenter"
        style="width: 100%; height: 600px;">
      <gmap-cluster>
        <gmap-marker
          :key="index"
          v-for="(m, index) in markers"
          :position="{lat: m.lat, lng: m.long}"
          :clickable="true"
          :draggable="false"
          @click="doSomething(m)"
        />
      </gmap-cluster>
    </gmap-map>
    {{ center }} {{zoom}}
  </div>
</template>

<script>
export default {
  name: 'Landing',
  data () {
    return {
      msg: 'Welcome to HPB',
      markers: [],
      center: {lat: 44.4267674, lng: 26.1025384},
      zoom: 7
    }
  },
  methods: {
    updateCenter (center) {
      this.center = { lat: center.lat(), lng: center.lng() }
    },
    doSomething (item) {
      console.log(item)
    }
  },
  created () {
    this.axios.get('http://hbp-api.azurewebsites.net/api/InstitutionByCity/Bucuresti')
      .then(response => {
        this.markers = response.data
        console.log(this.markers)
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
