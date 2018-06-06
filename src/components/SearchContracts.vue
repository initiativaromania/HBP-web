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
    <b-tabs>
      <b-tab :title="'Achiziții directe ('+ contracts.length +')'">
        <b-row>
          <b-col>
            <b-pagination :total-rows="contracts.length" :per-page="contractPageSize" v-model="contractPage" size="sm" :limit="10"/>
          </b-col>
          <b-col sm="1">
            <b-form-select v-model="contractPageSize" :options="[10,25,50,100]" size="sm"/>
          </b-col>
        </b-row>
        <b-row><b-col>
          <b-table striped responsive stacked="md" small hover
          :items="contracts" :per-page="contractPageSize" :current-page="contractPage" :fields="contractFields">
            <template slot="table-colgroup">
              <col width="*" />
              <col span="2" width="120px" />
              <col width="50px" />
            </template>
            <template slot="ValoareRON" slot-scope="data">
              {{data.item.ValoareRON | currency}}
            </template>
            <template slot="DataContract" slot-scope="data">
              {{data.item.DataContract | moment('DD/MM/YYYY')}}
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
                      <b-btn size="sm" :to="{name: 'InstitutionDetails', params: {id: currContract.InstitutiePublicaID}}">{{currContract.NumeInstitutie}}</b-btn>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-center" colspan="2">Companie</th>
                  </tr>
                  <tr>
                    <td class="text-center" colspan="2">
                      <b-btn size="sm" :to="{name: 'CompanyDetails', params: {type: 'AD', id: currContract.CompanieId}}">{{currContract.NumeCompanie}}</b-btn>
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-container>
          </b-modal>
        </b-col></b-row>
        <b-row>
          <b-col>
            <b-pagination :total-rows="contracts.length" :per-page="contractPageSize" v-model="contractPage" size="sm" :limit="10"/>
          </b-col>
          <b-col sm="1">
            <b-form-select v-model="contractPageSize" :options="[10,25,50,100]" size="sm"/>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab :title="'Licitații (' + tenders.length + ')'">
        <b-row>
          <b-col>
            <b-pagination :total-rows="tenders.length" :per-page="tenderPageSize" v-model="tenderPage" size="sm" :limit="10"/>
          </b-col>
          <b-col sm="1">
            <b-form-select v-model="tenderPageSize" :options="[10,25,50,100]" size="sm"/>
          </b-col>
        </b-row>
        <b-row><b-col>
          <b-table striped responsive stacked="md" small hover :items="tenders" :per-page="tenderPageSize" :current-page="tenderPage"
          :fields="tenderFields">
            <template slot="table-colgroup">
              <col width="*" />
              <col span="2" width="160px" />
              <col width="50px" />
            </template>
            <template slot="ValoareRON" slot-scope="data">
              {{data.item.ValoareRON | currency}}
            </template>
            <template slot="DataContract" slot-scope="data">
              {{data.item.DataContract | moment('DD/MM/YYYY')}}
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
                      <b-btn size="sm" :to="{name: 'InstitutionDetails', params: {id: currTender.InstitutiePublicaID}}">{{currTender.NumeInstitutie}}</b-btn>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-center" colspan="2">Companie</th>
                  </tr>
                  <tr>
                    <td class="text-center" colspan="2">
                      <b-btn size="sm" :to="{name: 'CompanyDetails', params: {type: 'Tender', id: currTender.CompanieId}}" >{{currTender.NumeCompanie}}</b-btn>
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-container>
          </b-modal>
        </b-col></b-row>
        <b-row>
          <b-col>
            <b-pagination :total-rows="tenders.length" :per-page="tenderPageSize" v-model="tenderPage" size="sm" :limit="10"/>
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
import CPVLegend from '@/common/cvplegend'

export default {
  name: 'SearchCompany',
  data: function () {
    return {
      kw: this.$route.params.kw,
      contracts: [],
      contractPage: 1,
      contractPageSize: 10,
      tenders: [],
      tenderPage: 1,
      tenderPageSize: 10,
      contractFields: [
        {
          key: 'TitluContract',
          label: 'Denumire',
          sortable: true,
          isRowHeader: false,
          thStyle: { maxWidth: '350px', textColor: 'red' },
          tdClass: 'titlu'
        },
        { key: 'ValoareRON', label: 'Valoare', sortable: true },
        { key: 'DataContract', label: 'Dată', sortable: true },
        { key: 'action' }
      ],
      tenderFields: [
        {
          key: 'TitluContract',
          label: 'Denumire',
          sortable: true,
          isRowHeader: false,
          tdClass: 'titlu'
        },
        { key: 'ValoareRON', label: 'Valoare', sortable: true },
        { key: 'DataContract', label: 'Data', sortable: true },
        { key: 'action' }
      ],
      currContract: {},
      currTender: {}
    }
  },
  beforeRouteEnter: function (to, from, next) {
    let tendersReq = Vue.axios.get(`../api/SearchTender/${to.params.kw}?fetchAll=true`)
    let contractsReq = Vue.axios.get(`../api/SearchAD/${to.params.kw}?fetchAll=true`)
    Promise.all([tendersReq, contractsReq]).then(([tenders, contracts]) => {
      next(vm => {
        vm.tenders = tenders.data
        vm.contracts = contracts.data
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    let tendersReq = Vue.axios.get(`../api/SearchTender/${to.params.kw}?fetchAll=true`)
    let contractsReq = Vue.axios.get(`../api/SearchAD/${to.params.kw}?fetchAll=true`)
    Promise.all([tendersReq, contractsReq]).then(([tenders, contracts]) => {
      this.tenders = tenders.data
      this.contracts = contracts.data
      next()
    })
  },
  methods: {
    doSearch: function () {
      this.$router.replace({name: 'SearchContracts', params: {kw: this.kw}})
    },
    contractPop (data, button) {
      if ('details' in data) {
        this.currContract = data.details
        this.$root.$emit('bv::show::modal', 'contractModal', button)
        return
      }
      Vue.axios.get('../api/Contract/' + data.ContracteId).then(cRet => {
        data.details = cRet.data[0]
        this.currContract = data.details
        var cpvCateg = this.currContract.CPVCode.substring(0, 2)
        if (cpvCateg in CPVLegend) {
          this.currContract.CPVCategory = CPVLegend[cpvCateg]
        }
        this.$root.$emit('bv::show::modal', 'contractModal', button)
        // Vue.axios.get('ADCompany/' + data.details.CompanieId).then(adRet => {
        //   Vue.set(this.currContract, 'CompanieNume', adRet.data[0].Nume)
        // })
      })
    },
    tenderPop (data, button) {
      if ('details' in data) {
        this.currTender = data.details
        this.$root.$emit('bv::show::modal', 'tenderModal', button)
        return
      }
      console.log(data)
      Vue.axios.get('../api/Tender/' + data.LicitatieId).then(cRet => {
        data.details = cRet.data[0]
        this.currTender = data.details
        var cpvCateg = this.currTender.CPVCode.substring(0, 2)
        if (cpvCateg in CPVLegend) {
          this.currTender.CPVCategory = CPVLegend[cpvCateg]
        }
        this.$root.$emit('bv::show::modal', 'tenderModal', button)
        // Vue.axios.get('TenderCompany/' + data.details.CompanieId).then(adRet => {
        //   Vue.set(this.currTender, 'CompanieNume', adRet.data[0].Nume)
        // })
      })
    }
  }
}
</script>
