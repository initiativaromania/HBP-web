<template>
    <div>
        <b-card :title="details.Nume" header-bg-variant="primary" header-text-variant="white"
            :sub-title="details.UAT + ' CUI ' + details.CUI" no-body header-tag="header">
            <template slot="header">
              Companie: <b>{{ details.Nume }}</b>
            </template>
            <!-- <p class="card-text">Adresă: {{ details.Adresa }}</p> -->
            <b-tabs card>
              <b-tab title="Sumar">
                <b-row>
                  <b-col>
                    <h6 class="text-muted"><b>Adresă:</b> {{details.Adresa}}</h6>
                    <h6 class="text-muted"><b>CUI:</b> {{details.CUI}}</h6>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <pie-chart :colors="['#b00', '#666']" :data="chart1Data" :donut="true" suffix=" RON"
                      thousands="." decimals="," title="Volum tranzacții"
                      :download="true" :library="chartOptions"/>
                    Total: {{ chart1Total | currency }}
                  </b-col>
                  <b-col>
                    <pie-chart :colors="['#b00', '#666']" :data="chart2Data" :donut="true"
                      thousands="." title="Număr contracte"
                      :download="true" :library="chartOptions"/>
                    Total: {{ chart2Total }}
                  </b-col>
                  <b-col>
                    <pie-chart :data="chart3Data" :donut="true" suffix=" RON"
                        thousands="." decimals="," title="Volum după CPV"
                        :download="true" :library="chartOptions" :legend="false"/>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <line-chart :data="chart4Data" :discrete="false" xtitle="Dată" :download="true"
                      suffix=" RON" thousands="." decimals=","
                      legend="bottom" title="Evoluție volum" :colors="['#b00', '#666']"/>
                    <br/>
                  </b-col>
                  <b-col>
                    <line-chart :data="chart5Data" :discrete="false" xtitle="Dată" :download="true"
                      thousands="." decimals=","
                      legend="bottom" title="Evoluție număr" :colors="['#b00', '#666']"/>
                    <br/>
                  </b-col>
                  <b-col>
                    <highmaps :options="mapOptions" />
                  </b-col>
                </b-row>
                <b-row><b-col>
                <vue-slider :data="dateRange" v-model="dateParams" :piecewise="true" />
                </b-col></b-row>
              </b-tab>
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
                              <b-btn size="sm" :to="{name:'InstitutionDetails', params: {id: currContract.InstitutiePublicaID}}">{{currContract.NumeInstitutie}}</b-btn>
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
                              <b-btn size="sm" :to="{name:'InstitutionDetails', params: {id: currTender.InstitutiePublicaID}}">{{currTender.NumeInstitutie}}</b-btn>
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
              <b-tab title="Instituții">
                <b-row>
                  <b-col>
                    <b-pagination :total-rows="institutions.length" :per-page="institutionPageSize" v-model="institutionPage" size="sm" :limit="10"/>
                  </b-col>
                  <b-col sm="1">
                    <b-form-select v-model="institutionPageSize" :options="[10,25,50,100]" size="sm"/>
                  </b-col>
                </b-row>
                <b-row><b-col>
                  <b-table striped responsive stacked="md" small hover :items="institutions" :per-page="institutionPageSize" :current-page="institutionPage"
                  :fields="institutionFields">
                    <template slot="table-colgroup">
                      <col width="*" />
                      <col span="2" width="160px" />
                      <col width="50px" />
                    </template>
                    <template slot="action" slot-scope="data">
                      <b-btn size="sm" :to="{name: 'InstitutionDetails', params: {id: data.item.Id}}">Detalii</b-btn>
                    </template>
                  </b-table>
                </b-col></b-row>
                <b-row>
                  <b-col>
                    <b-pagination :total-rows="institutions.length" :per-page="institutionPageSize" v-model="institutionPage" size="sm" :limit="10"/>
                  </b-col>
                  <b-col sm="1">
                    <b-form-select v-model="institutionPageSize" :options="[10,25,50,100]" size="sm"/>
                  </b-col>
                </b-row>
              </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import vueSlider from 'vue-slider-component'
import _ from 'lodash'
import RomaniaMap from '@/common/ro-all'
import CPVLegend from '@/common/cvplegend'

export default {
  name: 'CompanyDetails',
  components: { vueSlider },
  beforeRouteEnter (to, from, next) {
    var revType = to.params.type === 'AD' ? 'Tender' : 'AD'

    var detailsReq = Vue.axios.get(to.params.type + 'Company/' + to.params.id)
      .then(res => {
        var details = res.data[0]
        details[to.params.type + 'Id'] = details.CompanieId
        return Vue.axios.get(`${revType}CompanyByCUI/${details.CUI}`).then(tres => {
          if (tres.data.length === 0) {
            return new Promise(resolve => { resolve([details, null, null]) })
          }

          var detailsDReq = new Promise(resolve => { resolve(details) })
          details[revType + 'Id'] = tres.data[0].CompanieId
          var contracts2Req = Vue.axios.get(
            (revType === 'Tender' ? 'TenderCompanyTenders/' : 'ADCompanyContracts/') + details[revType + 'Id'] + '?fetchAll=true')
          var institutions2Req = Vue.axios.get(`InstitutionsBy${revType}Company/${details[revType + 'Id']}`)
          return Promise.all([detailsDReq, contracts2Req, institutions2Req])
        })
      })
    var contracts1Req = Vue.axios.get(
      (to.params.type === 'Tender' ? 'TenderCompanyTenders/' : 'ADCompanyContracts/') + to.params.id + '?fetchAll=true')
    var institutions1Req = Vue.axios.get(`InstitutionsBy${to.params.type}Company/${to.params.id}`)

    Promise.all([detailsReq, contracts1Req, institutions1Req])
      .then(([[details, contracts2, institutions2], contracts1, institutions1]) => {
        next(vm => {
          vm.details = details
          if (to.params.type === 'AD') {
            vm.tenders = contracts2 === null ? [] : contracts2.data
            vm.contracts = contracts1.data
          } else {
            vm.contracts = contracts2 === null ? [] : contracts2.data
            vm.tenders = contracts1.data
          }
          vm.institutions = [
            ...(institutions2 === null ? [] : institutions2.data),
            ...(institutions1.data)
          ]
        })
      })
  },
  beforeRouteUpdate (to, from, next) {
    var detailsReq = Vue.axios.get(to.params.type + 'Company/' + to.params.id)
    var contractsReq = Vue.axios.get(
      (to.params.type === 'Tender' ? 'TenderCompanyTenders/' : 'ADCompanyContracts/') + to.params.id + '?fetchAll=true')
    var institutionsReq = Vue.axios.get(`InstitutionsBy${to.params.type}Company/${to.params.id}`)

    Promise.all([detailsReq, contractsReq, institutionsReq])
      .then(([details, contracts, institutions]) => {
        this.details = details.data[0]
        this.contracts = contracts.data
        this.institutions = institutions
        next()
      })
  },
  data () {
    return {
      details: {},
      contracts: [],
      contractPage: 1,
      contractPageSize: 10,
      tenders: [],
      tenderPage: 1,
      tenderPageSize: 10,
      institutions: [],
      institutionPage: 1,
      institutionPageSize: 10,
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
          thStyle: { maxWidth: '350px', textColor: 'red' },
          tdClass: 'titlu'
        },
        { key: 'ValoareRON', label: 'Valoare', sortable: true },
        { key: 'DataContract', label: 'Dată', sortable: true },
        { key: 'action' }
      ],
      institutionFields: [
        {
          key: 'Nume',
          label: 'Denumire',
          sortable: true,
          isRowHeader: false,
          tdClass: 'titlu'
        },
        { key: 'action' }
      ],
      chart1Data: [],
      chart1Total: null,
      chart2Data: [],
      chart2Total: null,
      chart3Data: [],
      chart4Data: [],
      chart5Data: [
        {name: 'Număr AD', data: []},
        {name: 'Număr licitații', data: []}
      ],
      mapOptions: {
        chart: {borderWidth: 0},
        title: {text: 'Volum contracte și licitații'},
        legend: {enabled: true},
        series: [{
          name: 'Volum',
          mapData: RomaniaMap,
          data: [
            ['ro-bi', 2],
            ['ro-ph', 1],
            ['ro-ct', 3],
            ['ro-if', 4]
          ],
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          }
        }],
        colorAxis: {}
      },
      dateParams: ['01-2007', moment().format('MM-YYYY')],
      dateRange: (() => {
        var ret = []
        var curr = moment('2007-01-01')
        var now = moment()
        do {
          ret.push(curr.format('MM-YYYY'))
          curr.add(1, 'month')
        } while (now.isAfter(curr))
        return ret
      })(),
      chartOptions: {
        cutoutPercentage: 70,
        legend: { position: 'bottom' }
        // tooltips: {
        //   callbacks: {
        //     beforeTitle: (item, data) => { console.log(item, data); return 'what?' }
        //   }
        // }
      },
      currContract: {},
      currTender: {}
    }
  },
  methods: {
    contractPop (data, button) {
      if ('details' in data) {
        this.currContract = data.details
        this.$root.$emit('bv::show::modal', 'contractModal', button)
        return
      }
      Vue.axios.get('Contract/' + data.ID).then(cRet => {
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
      Vue.axios.get('Tender/' + data.ID).then(cRet => {
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
    },
    computeGraphs: _.debounce(
      function (params) {
        var min = moment(params[0], 'MM-YYYY')
        var max = moment(params[1], 'MM-YYYY')
        var contracts = this.contracts.filter(item => !moment(item.DataContract).isBefore(min) && !moment(item.DataContract).isAfter(max))
        // var contractCount = contracts.length
        var contractTotal = contracts.reduce((a, c) => a + c.ValoareRON, 0)
        var tenders = this.tenders.filter(item => !moment(item.DataContract).isBefore(min) && !moment(item.DataContract).isAfter(max))
        // var tendersCount = tenders.length
        var tendersTotal = tenders.reduce((a, c) => a + c.ValoareRON, 0)
        contractTotal = parseFloat(contractTotal.toFixed(2))
        tendersTotal = parseFloat(tendersTotal.toFixed(2))
        this.chart1Data = [['Achiziții directe', contractTotal], ['Licitații', tendersTotal]]
        this.chart1Total = parseFloat((contractTotal + tendersTotal).toFixed(2))
        this.chart2Data = [['Achiziții directe', contracts.length], ['Licitații', tenders.length]]
        this.chart2Total = contracts.length + tenders.length

        // process distribution by CPF
        var c3data = {}

        // process geographical distribution
        var mapData = {}

        // process histogram
        var keys = []
        var curr = moment(min)
        // scalable resolution? day, week, month
        var diff = moment.duration(max.diff(min))
        var unit = null
        var unitMul = 1
        var thresholdMin = 32
        var thresholdMax = 64
        var units = diff.asYears()
        if (units < thresholdMin) {
          units = diff.asMonths()
          if (units < thresholdMin) {
            units = diff.asWeeks()
            if (units < thresholdMin) {
              unit = 'days'
              units = diff.asDays()
              while (units / unitMul > thresholdMax) { unitMul++ }
            } else {
              unit = 'week'
              while (units / unitMul > thresholdMax) { unitMul++ }
            }
          } else {
            unit = 'month'
            while (units / unitMul > thresholdMax) { unitMul++ }
          }
        } else {
          unit = 'year'
          while (units / unitMul > thresholdMax) { unitMul++ }
        }

        do {
          keys.push(moment(curr))
          curr.add(unitMul, unit)
        } while (max.isAfter(curr))

        var contractCountHist = {}
        var tenderCountHist = {}
        var contractSumHist = {}
        var tenderSumHist = {}

        for (var contract of contracts) {
          var cpv = contract.CPVCode.substring(0, 2)
          if (!(cpv in c3data)) { c3data[cpv] = 0 }
          c3data[cpv] += contract.ValoareRON

          var cDate = moment(contract.DataContract)
          // nearest date in keys?
          var count = Math.round(moment.duration(cDate.diff(min)).as(unit) / unitMul) * unitMul
          var key = moment(min).add(count, unit).toISOString()

          if (!(key in contractCountHist)) {
            contractCountHist[key] = 1
          } else {
            contractCountHist[key]++
          }

          if (!(key in contractSumHist)) {
            contractSumHist[key] = contract.ValoareRON
          } else {
            contractSumHist[key] += contract.ValoareRON
          }

          if (!(contract.Judet in mapData)) {
            mapData[contract.Judet] = contract.ValoareRON
          } else {
            mapData[contract.Judet] += contract.ValoareRON
          }
        }

        for (var tender of tenders) {
          cpv = tender.CPVCode.substring(0, 2)
          if (!(cpv in c3data)) { c3data[cpv] = 0 }
          c3data[cpv] += tender.ValoareRON

          cDate = moment(tender.DataContract)
          // nearest date in keys?
          count = Math.round(moment.duration(cDate.diff(min)).as(unit) / unitMul) * unitMul
          key = moment(min).add(count, unit).toISOString()

          if (!(key in tenderCountHist)) {
            tenderCountHist[key] = 1
          } else {
            tenderCountHist[key]++
          }

          if (!(key in tenderSumHist)) {
            tenderSumHist[key] = tender.ValoareRON
          } else {
            tenderSumHist[key] += tender.ValoareRON
          }

          if (!(tender.Judet in mapData)) {
            mapData[tender.Judet] = tender.ValoareRON
          } else {
            mapData[tender.Judet] += tender.ValoareRON
          }
        }

        // postprocess: keep 20, aggregate rest
        c3data = Object.keys(c3data).map(k => [k, c3data[k]]).sort((i, j) => j[1] - i[1])
        this.chart3Data = [...c3data.slice(0, 19), ...(c3data.length > 19 ? [['Altele', c3data.slice(19).reduce((a, c) => a + c[1], 0)]] : [])]
          .map(i => [i[0] in CPVLegend ? CPVLegend[i[0]] : i[0], parseFloat(i[1].toFixed(2))])

        // this.chart4Data[0].data = keys.map(r => [r.toISOString(), Math.random()])
        // this.chart4Data[1].data = keys.map(r => [r.toISOString(), Math.random()])
        this.chart4Data = [
          { name: 'Volum AD', data: keys.map(r => [r.toISOString(), Math.round(contractSumHist[r.toISOString()] || 0)]) },
          { name: 'Volum Licitații', data: keys.map(r => [r.toISOString(), Math.round(tenderSumHist[r.toISOString()] || 0)]) }
        ]
        this.chart5Data = [
          { name: 'Număr AD', data: keys.map(r => [r.toISOString(), contractCountHist[r.toISOString()] || 0]) },
          { name: 'Număr Licitații', data: keys.map(r => [r.toISOString(), tenderCountHist[r.toISOString()] || 0]) }
        ]

        // postprocess: translate map keys
        var mapData2 = []
        for (let k of Object.keys(mapData)) {
          var r2 = RomaniaMap.features.find(r => r.properties.name === k || r.properties['woe-name'] === k ||
            (r.properties['alt-name'] && r.properties['alt-name'].includes(k)))
          if (r2 === undefined) { console.log(`Not found in map: ${k}`); continue }
          mapData2.push([r2.properties['hc-key'], mapData[k]])
        }
        this.mapOptions.series[0].data = mapData2
      }, 500
    )
  },
  watch: {
    dateParams: function (newParams, oldParams) {
      this.computeGraphs(newParams)
    }
  }
}
</script>
