<template>
  <b-container fluid>
    <b-row class="py-2">
      <b-col>
        <b-form-input class="sm" type="text" v-model="kw" placeholder="Cuvinte cheie"/>
      </b-col>
      <b-col sm="1">
        <b-button type="submit" variant="primary" @click="doSearch()">Caută</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-pagination :total-rows="results.length" :per-page="pageSize" v-model="page" size="sm" :limit="10"/>
      </b-col>
      <b-col sm="1">
        <b-form-select v-model="pageSize" :options="[10,25,50,100]" size="sm"/>
      </b-col>
    </b-row>
    <b-row><b-col>
      <b-table striped responsive stacked="md" small hover :items="results" :per-page="pageSize" :current-page="page"
      :fields="fields">
        <template slot="table-colgroup">
          <col width="*" />
          <col span="2" width="160px" />
          <col width="50px" />
        </template>
        <template slot="action" slot-scope="data">
          <b-btn size="sm" :to="{name: 'CompanyDetails', params: {id: data.item.CompanieId, type: 'AD'}}">Detalii</b-btn>
        </template>
      </b-table>
    </b-col></b-row>
    <b-row>
      <b-col>
        <b-pagination :total-rows="results.length" :per-page="pageSize" v-model="page" size="sm" :limit="10"/>
      </b-col>
      <b-col sm="1">
        <b-form-select v-model="pageSize" :options="[10,25,50,100]" size="sm"/>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'SearchCompany',
  data: function () {
    return {
      kw: this.$route.params.kw,
      results: [],
      pageSize: 10,
      page: 0,
      fields: [
        {
          key: 'Nume',
          label: 'Denumire',
          sortable: true,
          isRowHeader: false,
          tdClass: 'titlu'
        },
        { key: 'Localitate', label: 'Localitate' },
        { key: 'CUI', label: 'CUI' },
        { key: 'action' }
      ]
    }
  },
  beforeRouteEnter: function (to, from, next) {
    Vue.axios.get(`../api/SearchCompany/${to.params.kw}`).then(response => {
      next(vm => { vm.results = response.data })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    Vue.axios.get(`../api/SearchCompany/${to.params.kw}`).then(response => {
      this.results = response.data
      next()
    })
  },
  methods: {
    doSearch: function () {
      this.$router.replace({name: 'SearchCompany', params: {kw: this.kw}})
    }
  }
}
</script>
