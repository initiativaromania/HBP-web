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
        <b-pagination :total-rows="resultsLength" :per-page="pageSize" v-model="page" size="sm" :limit="10"/>
      </b-col>
      <b-col sm="1">
        <b-form-select v-model="pageSize" :options="[10,25,50,100]" size="sm"/>
      </b-col>
    </b-row>
    <b-row><b-col>
      <b-table ref="institutionTable" striped responsive stacked="md" small hover :items="getResults" :per-page="pageSize" :current-page="page"
      :fields="fields">
        <template slot="table-colgroup">
          <col width="*" />
          <col span="2" width="160px" />
          <col width="50px" />
        </template>
        <template slot="action" slot-scope="data">
          <b-btn size="sm" :to="{name: 'default-institution-id', params: {id: data.item.InstitutiePublicaId}}">Detalii</b-btn>
        </template>
      </b-table>
    </b-col></b-row>
    <b-row>
      <b-col>
        <b-pagination :total-rows="resultsLength" :per-page="pageSize" v-model="page" size="sm" :limit="10"/>
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
  name: 'SearchInstitution',
  data: function () {
    return {
      kw: this.$route.params.kw,
      resultsLength: 0,
      pageSize: 10,
      page: 1,
      fields: [
        {
          key: 'name',
          label: 'Denumire',
          sortable: true,
          isRowHeader: false,
          tdClass: 'titlu'
        },
        { key: 'locality', label: 'Localitate' },
        { key: 'county' },
        { key: 'reg_no', label: 'CUI' },
        { key: 'action' }
      ]
    }
  },
  // async asyncData ({app, params}) {
  //   let { data } = await app.$axios.get(`search/institution/${params.kw}`)
  //   return { results: data.items, resultsLength: parseInt(data.count, 10) }
  // },
  beforeRouteUpdate: function (to, from, next) {
    this.kw = to.params.kw
    this.$refs.institutionTable.refresh()
    next()
  },
  methods: {
    doSearch: function () {
      this.$router.replace({name: 'default-search-institution-kw', params: {kw: this.kw}})
    },
    getResults: function (ctx) {
      // if (this.results)
      // {
      //   var ret = this.results;
      //   this.results = null;
      //   return ret;
      // }
      let req = this.$axios.get(`/search/institution/${this.kw}?page=${ctx.currentPage}` +
        `&perPage=${ctx.perPage}&sortBy=${ctx.sortBy}&sortDesc=${ctx.sortDesc}`)
      return req.then(({data}) => {
        this.resultsLength = parseInt(data.count, 10)
        return data.items
      })
    }
  }
}
</script>
