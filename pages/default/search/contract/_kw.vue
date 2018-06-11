<template>
  <b-container fluid>
    <b-form @submit.prevent="doSearch()">
      <b-row class="py-2">
        <b-col>
          <b-form-input class="sm" type="text" v-model="kw" v-on:keyup.enter="submit" placeholder="Cuvinte cheie"/>
        </b-col>
        <b-col sm="1">
          <b-button type="submit" variant="primary">Caută</b-button>
        </b-col>
      </b-row>
    </b-form>
    <b-tabs>
      <b-tab title="Achiziții directe">
        <b-row>
          <b-col>
            <b-pagination :total-rows="contractsLength" :per-page="contractPageSize" v-model="contractPage" size="sm" :limit="10"/>
          </b-col>
          <b-col sm="1">
            <b-form-select v-model="contractPageSize" :options="[10,25,50,100]" size="sm"/>
          </b-col>
        </b-row>
        <b-row><b-col>
          <b-table id="contract-table" striped responsive stacked="md" small hover
          :items="getContracts" :per-page="contractPageSize" :current-page="contractPage" :fields="contractFields">
            <template slot="table-colgroup">
              <col width="*" />
              <col span="2" width="120px" />
              <col width="50px" />
            </template>
            <template slot="price_ron" slot-scope="data">
              {{data.item.price_ron | currency}}
            </template>
            <template slot="contract_date" slot-scope="data">
              {{data.item.contract_date | moment('DD/MM/YYYY')}}
            </template>
            <template slot="action" slot-scope="data">
              <b-btn size="sm" @click.stop="contractPop(data.item, $event.target)">Detalii</b-btn>
            </template>
          </b-table>
          <b-modal id="contractModal" ok-only size="lg" :title="currContract.TitluContract" >
            <b-container fluid v-if="currContract">
              <table class="table table-striped table-bordered" width="100%">
                <tbody>
                  <tr>
                    <th class="text-right">Număr contract</th>
                    <td>{{currContract.NumarContract}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Valoare RON</th>
                    <td>{{currContract.ValoareRON | currency}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Valoare EUR</th>
                    <td>{{currContract.ValoareEUR | currency('EUR')}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Dată contract</th>
                    <td>{{currContract.DataContract | moment('DD/MM/YYYY') }}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Dată anunț participare</th>
                    <td>{{currContract.DataAnuntParticipare | moment('DD/MM/YYYY')}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Cod CPV</th>
                    <td>{{currContract.CPVCode}}</td>
                  </tr>
                  <tr v-if="currContract.CPVCategory">
                    <th class="text-right">Categorie CPV</th>
                    <td>{{currContract.CPVCategory}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Tip procedură</th>
                    <td>{{currContract.TipProcedura}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Tip încheiere contract</th>
                    <td>{{currContract.TipIncheiereContract}}</td>
                  </tr>
                  <tr>
                    <th class="text-center" colspan="2">Instituție</th>
                  </tr>
                  <tr>
                    <td class="text-center" colspan="2">
                      <b-btn size="sm" :to="{name: 'default-institution-id', params: {id: currContract.InstitutiePublicaID}}">{{currContract.NumeInstitutie}}</b-btn>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-center" colspan="2">Companie</th>
                  </tr>
                  <tr>
                    <td class="text-center" colspan="2">
                      <b-btn size="sm" :to="{name: 'default-company-id', params: {type: 'AD', id: currContract.CompanieId}}">{{currContract.NumeCompanie}}</b-btn>
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-container>
          </b-modal>
        </b-col></b-row>
        <b-row>
          <b-col>
            <b-pagination :total-rows="contractsLength" :per-page="contractPageSize" v-model="contractPage" size="sm" :limit="10"/>
          </b-col>
          <b-col sm="1">
            <b-form-select v-model="contractPageSize" :options="[10,25,50,100]" size="sm"/>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab title="Licitații">
        <b-row>
          <b-col>
            <b-pagination :total-rows="tendersLength" :per-page="tenderPageSize" v-model="tenderPage" size="sm" :limit="10"/>
          </b-col>
          <b-col sm="1">
            <b-form-select v-model="tenderPageSize" :options="[10,25,50,100]" size="sm"/>
          </b-col>
        </b-row>
        <b-row><b-col>
          <b-table id="tender-table" striped responsive stacked="md" small hover :items="getTenders" :per-page="tenderPageSize" :current-page="tenderPage"
          :fields="tenderFields">
            <template slot="table-colgroup">
              <col width="*" />
              <col span="2" width="160px" />
              <col width="50px" />
            </template>
            <template slot="price_ron" slot-scope="data">
              {{data.item.price_ron | currency}}
            </template>
            <template slot="contract_date" slot-scope="data">
              {{data.item.contract_date | moment('DD/MM/YYYY')}}
            </template>
            <template slot="action" slot-scope="data">
              <b-btn size="sm" @click.stop="tenderPop(data.item, $event.target)">Detalii</b-btn>
            </template>
          </b-table>
          <b-modal id="tenderModal" ok-only size="lg" :title="currTender.TitluContract" >
            <b-container fluid v-if="currTender">
              <table class="table table-striped table-bordered" width="100%">
                <tbody>
                  <tr>
                    <th class="text-right">Număr contract</th>
                    <td>{{currTender.NumarContract}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Valoare RON</th>
                    <td>{{currTender.ValoareRON | currency}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Valoare EUR</th>
                    <td>{{currTender.ValoareEUR | currency('EUR')}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Dată contract</th>
                    <td>{{currTender.DataContract | moment('DD/MM/YYYY')}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Dată anunț participare</th>
                    <td>{{currTender.DataAnuntParticipare | moment('DD/MM/YYYY')}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Cod CPV</th>
                    <td>{{currTender.CPVCode}}</td>
                  </tr>
                  <tr v-if="currTender.CPVCategory">
                    <th class="text-right">Categorie CPV</th>
                    <td>{{currTender.CPVCategory}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Tip procedură</th>
                    <td>{{currTender.TipProcedura}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Tip încheiere contract</th>
                    <td>{{currTender.TipIncheiereContract}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Tip contract</th>
                    <td>{{currTender.TipContract}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Număr anunț participare</th>
                    <td>{{currTender.NumarAnuntParticipare}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Număr anunț atribuire</th>
                    <td>{{currTender.NumarAnuntAtribuire}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Dată anunț atribuire</th>
                    <td>{{currTender.DataAnuntAtribuire | moment('DD/MM/YYYY')}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Tip criterii atribuire</th>
                    <td>{{currTender.TipCriteriiAtribuire}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Număr oferte primite</th>
                    <td>{{currTender.NumarOfertePrimite}}</td>
                  </tr>
                  <tr>
                    <th class="text-right">Valoare estimată</th>
                    <td>{{currTender.ValoareEstimataParticipare | currency}}</td>
                  </tr>
                  <tr>
                    <th class="text-center" colspan="2">Instituție</th>
                  </tr>
                  <tr>
                    <td class="text-center" colspan="2">
                      <b-btn size="sm" :to="{name: 'default-institution-id', params: {id: currTender.InstitutiePublicaID}}">{{currTender.NumeInstitutie}}</b-btn>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-center" colspan="2">Companie</th>
                  </tr>
                  <tr>
                    <td class="text-center" colspan="2">
                      <b-btn size="sm" :to="{name: 'default-company-id', params: {type: 'Tender', id: currTender.CompanieId}}" >{{currTender.NumeCompanie}}</b-btn>
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-container>
          </b-modal>
        </b-col></b-row>
        <b-row>
          <b-col>
            <b-pagination :total-rows="tendersLength" :per-page="tenderPageSize" v-model="tenderPage" size="sm" :limit="10"/>
          </b-col>
          <b-col sm="1">
            <b-form-select v-model="tenderPageSize" :options="[10,25,50,100]" size="sm"/>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
  </b-container>
</template>
<script>
import Vue from 'vue'
import CPVLegend from '@/assets/js/cvplegend'

export default {
  name: 'SearchContract',
  data: function () {
    return {
      kw: this.$route.params.kw,
      contracts: [],
      contractPage: 1,
      contractPageSize: 10,
      contractsLength: 0,
      tenders: [],
      tenderPage: 1,
      tenderPageSize: 10,
      tendersLength: 0,
      contractFields: [
        {
          key: 'title',
          label: 'Denumire',
          sortable: true,
          isRowHeader: false,
          thStyle: { maxWidth: '350px', textColor: 'red' },
          tdClass: 'titlu'
        },
        { key: 'price_ron', label: 'Valoare', sortable: true },
        { key: 'contract_date', label: 'Dată', sortable: true },
        { key: 'action' }
      ],
      tenderFields: [
        {
          key: 'title',
          label: 'Denumire',
          sortable: true,
          isRowHeader: false,
          tdClass: 'titlu'
        },
        { key: 'price_ron', label: 'Valoare', sortable: true },
        { key: 'contract_date', label: 'Data', sortable: true },
        { key: 'action' }
      ],
      currContract: {},
      currTender: {}
    }
  },
  // async asyncData ({app, params}) {
  //   let tendersReq = app.$axios.get(`search/tender/${params.kw}?fetchAll=true`)
  //   let contractsReq = app.$axios.get(`search/contract/${params.kw}?fetchAll=true`)
  //   let [{data:tenders}, {data:contracts}] = await Promise.all([tendersReq, contractsReq])
  //   return {
  //     tenders: tenders.items,
  //     tendersCount: parseInt(tenders.count, 10),
  //     contracts: contracts.items,
  //     contractsCount: parseInt(contracts.count, 10)
  //   }
  // },
  beforeRouteEnter: function (to, from, next) {
    next(vm=>{ vm.kw = to.params.kw })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.kw = to.params.kw
    // this.$refs.contractTable.refresh()
    // this.$refs.tenderTable.refresh()
    this.$root.$emit('bv::refresh::table', 'contract-table');
    this.$root.$emit('bv::refresh::table', 'tender-table')
    next()
  },
  methods: {
    doSearch: function () {
      this.$router.replace({name: 'default-search-contract-kw', params: {kw: this.kw}})
    },
    getContracts: function (ctx) {
      // if (this.contracts)
      // {
      //   var ret = this.contracts;
      //   this.contracts = null;
      //   return ret;
      // }
      let req = this.$axios.get(`/search/contract/${this.kw}?page=${ctx.currentPage}` +
        `&perPage=${ctx.perPage}&sortBy=${ctx.sortBy}&sortDesc=${ctx.sortDesc}`)
      return req.then(({data}) => {
        this.contractsLength = parseInt(data.count, 10)
        return data.items
      })
    },
    getTenders: function (ctx) {
      // if (this.tenders)
      // {
      //   var ret = this.tenders;
      //   this.tenders = null;
      //   return this.tenders;
      // }
      let req = this.$axios.get(`/search/tender/${this.kw}?page=${ctx.currentPage}` +
        `&perPage=${ctx.perPage}&sortBy=${ctx.sortBy}&sortDesc=${ctx.sortDesc}`)
      return req.then(({data}) => {
        this.tendersLength = parseInt(data.count, 10)
        return data.items
      })
    },
    contractPop (data, button) {
      if ('details' in data) {
        this.currContract = data.details
        this.$root.$emit('bv::show::modal', 'contractModal', button)
        return
      }
      this.$axios.get('../api/Contract/' + data.id).then(cRet => {
        data.details = cRet.data[0]
        this.currContract = data.details
        var cpvCateg = this.currContract.CPVCode.substring(0, 2)
        if (cpvCateg in CPVLegend) {
          this.currContract.CPVCategory = CPVLegend[cpvCateg]
        }
        this.$root.$emit('bv::show::modal', 'contractModal', button)
      })
    },
    tenderPop (data, button) {
      if ('details' in data) {
        this.currTender = data.details
        this.$root.$emit('bv::show::modal', 'tenderModal', button)
        return
      }
      this.$axios.get('../api/Tender/' + data.id).then(cRet => {
        data.details = cRet.data[0]
        this.currTender = data.details
        var cpvCateg = this.currTender.CPVCode.substring(0, 2)
        if (cpvCateg in CPVLegend) {
          this.currTender.CPVCategory = CPVLegend[cpvCateg]
        }
        this.$root.$emit('bv::show::modal', 'tenderModal', button)
      })
    }
  }
}
</script>
