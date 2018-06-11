<template>
    <div>
      <h1 class="mt-2"> {{details.name}} - statistici instituție publică </h1>
      <b-tabs card>
        <b-tab title="Sumar">
          <b-row>
            <b-col>
              <b-card-group>
                <b-card :title="details.name" :sub-title="details.locality" header="Coordonatele instituției publice">
                  <p class="card-text">{{details.address}}
                    <br/>
                    CUI: {{details.reg_no}}
                  </p>
                </b-card>
                <b-card>
                  <p class="card-text">Această pagină îți oferă informații despre toate achizițiile publice contractate de
                    instituția publică aleasă de tine, în intervalul de timp selectat de tine (vezi mai jos).
                    <br/>
                  <b>Instituția publică</b> - instituţie cu personalitate juridică, a administraţiei publice centrale, locale sau europene, care gestionează resurse financiare publice.
                    <br/>
                  <b>Achiziție directă</b> - achiziționarea de produse, servicii sau lucrări în măsura în care valoarea estimată a achiziției nu depășește echivalentul în lei a 15.000 Euro pentru fiecare achiziție de produse, servicii sau lucrări.
                    <br/>
                  Achiziția directă rămâne în exteriorul definiției propriu-zise a contractului de achiziție publică întrucât nu esste corelată cu o procedură de atribuire. Achiziția directă se realizează pe bază de document justificativ.

                    <br/>
                  <b>Licitația</b> - Procedura de licitație deschisă este reglementată de legea 98/2016. Este vorba de modul de realizare a achizițiilor publice și de organizare a concursurilor de soluții, instrumentele și tehnicile specifice care pot fi utilizate pentru atribuirea de contracte de achiziție publică, precum și anumite aspecte specific în legătură cu executarea contractelor de achiziție publică.
                    <br/>
                  <b>CPV</b> - Codul CPV stabileşte un singur sistem de clasificare pentru achiziţiile publice cu scopul de a standardiza referinţele utilizate de autorităţile şi entităţile contractante pentru a descrie obiectul contractelor de achiziţii publice.
                  
                    <br/>
                  Dacă dorești să faci propria analiză folosește butonul <b>Descarcă date</b> de lângă fiecare diagramă de pe pagină.
                    </p>
                </b-card>
              </b-card-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-card header="Selectează intervalul de timp">
                <p class="card-text">
                   Selectează intervalul de timp pentru care dorești să vezi statisticile privind achizițiile publice
                   Îl poți schimba oricând dacă te răzgândești. Diagramele de mai jos vor reflecta valorile din
                   intervalul de timp selectat de tine.
                </p>
                <vue-slider :data="dateRange" v-model="dateParams" :piecewise="true" />
              </b-card>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              Valoarea totală a achizițiilor publice contractate de instituția aleasă de tine, în intervalul de timp selectat
              <br/>
              Total: {{ volume_pie.reduce((sum, x) => sum + x[1], 0) | currency }}
            </b-col>
            <b-col cols="2">
              <b-button variant="primary" @click="getVolumeChart()">Descarcă date</b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4">
              <pie-chart :colors="['#b00', '#666']" :data="volume_pie" :donut="true" suffix=" RON"
                thousands=" " decimals="," title="Volum tranzacții"
                :download="true" :library="chartOptions"/>
            </b-col>
            <b-col cols="8">
              <line-chart :data="volume_hist" :discrete="false" xtitle="Dată" :download="true"
                suffix=" RON" thousands=" " decimals=","
                legend="bottom" title="Evoluție volum" :colors="['#b00', '#666']"/>
            </b-col>
          </b-row>
          <b-row><b-col><hr/></b-col></b-row>

          <b-row>
            <b-col>
              Numărul total de achiziții publice contractate de instituția aleasă de tine, în intervalul de timp selectat.
              <br/>
              Total: {{ count_pie.reduce((sum, x) => sum + x[1], 0) }}
            </b-col>
            <b-col cols="2">
              <b-button variant="primary" @click="getVolumeChart()">Descarcă date</b-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4">
              <pie-chart :colors="['#b00', '#666']" :data="count_pie" :donut="true"
                thousands=" " title="Număr contracte"
                :download="true" :library="chartOptions"/>
            </b-col>
            <b-col cols="8">
              <line-chart :data="count_hist" :discrete="false" xtitle="Dată" :download="true"
                thousands=" " decimals=","
                legend="bottom" title="Evoluție număr" :colors="['#b00', '#666']"/>
              <br/>
            </b-col>
          </b-row>
          <b-row><b-col><hr/></b-col></b-row>


          <b-row>
            <b-col>
              Află care este valoarea totală a achizițiilor publice în funcție de domeniul achiziției (<b>CPV</b>).
              Diagrama arată valoarea în funcție de intervalul de timp selectat de tine.
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4">
              <pie-chart :data="cpv_pie" :donut="true" suffix=" RON"
                  thousands=" " decimals="," title="Volum după CPV"
                  :download="true" :library="chartOptions" :legend="false"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="text-center">
              <b-button variant="primary" sm @click="getCPVStats()">Descarcă date</b-button>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab :title="'Achiziții directe ('+ details.contract_count +')'">
          <b-row>
            <b-col>
              <b-pagination :total-rows="contractsLength" :per-page="contractPageSize" v-model="contractPage" size="sm" :limit="10"/>
            </b-col>
            <b-col sm="1">
              <b-form-select v-model="contractPageSize" :options="[10,25,50,100]" size="sm"/>
            </b-col>
          </b-row>
          <b-row><b-col>
            <b-table striped responsive stacked="md" small hover
            :items="getContracts" :per-page="contractPageSize" :current-page="contractPage" :fields="contractFields"
            >
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
                      <th class="text-center" colspan="2">Companie</th>
                    </tr>
                    <tr>
                      <td class="text-center" colspan="2">
                        <b-btn size="sm" :to="{name: 'default-company-id', params: {id: currContract.CompanieId}}">{{currContract.NumeCompanie}}</b-btn>
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
          <b-row>
            <b-col>
              <b-button variant="primary" @click="getAllContracts()">Descarcă date</b-button>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab :title="'Licitații (' + details.tender_count + ')'">
          <b-row>
            <b-col>
              <b-pagination :total-rows="tendersLength" :per-page="tenderPageSize" v-model="tenderPage" size="sm" :limit="10"/>
            </b-col>
            <b-col sm="1">
              <b-form-select v-model="tenderPageSize" :options="[10,25,50,100]" size="sm"/>
            </b-col>
          </b-row>
          <b-row><b-col>
            <b-table striped responsive stacked="md" small hover :items="getTenders" :per-page="tenderPageSize" :current-page="tenderPage"
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
                      <th class="text-center" colspan="2">Companie</th>
                    </tr>
                    <tr>
                      <td class="text-center" colspan="2">
                        <b-btn size="sm" :to="{name: 'default-company-id', params: {id: currTender.CompanieId}}" >{{currTender.NumeCompanie}}</b-btn>
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
          <b-row>
            <b-col>
              <b-button variant="primary" @click="getAllTenders()">Descarcă date</b-button>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Companii">
          <b-row>
            <b-col>
              <b-pagination :total-rows="companiesLength" :per-page="companyPageSize" v-model="companyPage" size="sm" :limit="10"/>
            </b-col>
            <b-col cols="1">
              <b-form-select v-model="companyPageSize" :options="[10,25,50,100]" size="sm"/>
            </b-col>
          </b-row>
          <b-row><b-col>
            <b-table striped responsive stacked="md" small hover :items="getCompanies" :per-page="companyPageSize" :current-page="companyPage"
            :fields="companyFields">
              <template slot="table-colgroup">
                <col width="*" />
                <col span="4" width="160px" />
                <col width="50px" />
              </template>
              <template slot="action" slot-scope="data">
                <b-btn size="sm" :to="{name: 'default-company-id', params: {id: data.item.id}}">Detalii</b-btn>
              </template>
              <template slot="contract_total_ron" slot-scope="data">
                {{data.item.contract_total_ron | currency('RON')}}
              </template>
              <template slot="tender_total_ron" slot-scope="data">
                {{data.item.tender_total_ron | currency('RON')}}
              </template>
            </b-table>
          </b-col></b-row>
          <b-row>
            <b-col>
              <b-pagination :total-rows="companiesLength" :per-page="companyPageSize" v-model="companyPage" size="sm" :limit="10"/>
            </b-col>
            <b-col sm="1">
              <b-form-select v-model="companyPageSize" :options="[10,25,50,100]" size="sm"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-button variant="primary" @click="getAllCompanies()">Descarcă date</b-button>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import _ from 'lodash'
import CPVLegend from '@/assets/js/cvplegend'

function updateStats ({details, hist, cpv}) {
  let vm = {}
  vm.details = details
  vm.volume_pie = [
    ['Achiziții directe', hist.reduce((sum, x) => sum + parseInt(x.contract_total_ron, 10), 0)],
    ['Licitații', hist.reduce((sum, x) => sum + parseInt(x.tender_total_ron, 10), 0)]
  ]
  vm.count_pie = [
    ['Achiziții directe', hist.reduce((sum, x) => sum + parseInt(x.contract_count, 10), 0)],
    ['Licitați', hist.reduce((sum, x) => sum + parseInt(x.tender_count, 10), 0)]
  ]
  vm.volume_hist = [{
    name: 'Achiziții directe',
    data: hist.map(r => [r.date, r.contract_total_ron])
  },
  {
    name: 'Licitații',
    data: hist.map(r => [r.date, r.tender_total_ron])
  }]
  vm.count_hist = [{
    name: 'Achiziții directe',
    data: hist.map(r => [r.date, r.contract_count])
  },
  {
    name: 'Licitații',
    data: hist.map(r => [r.date, r.tender_count])
  }]
  vm.cpv_pie = cpv.map(i => [i.category in CPVLegend ? CPVLegend[i.category] : i.category, parseFloat(i.total).toFixed(2)])
  return vm
}

export default {
  name: 'InstitutionDetails',
  components: { },
  async asyncData ({app, params}) {
    let {data} = await app.$axios.get(`institution_stats/${params.id}`)
    return updateStats(data)
  },
  data () {
    return {
      details: {},
      contractsLength: 0,
      contractPage: 1,
      contractPageSize: 10,
      contractsCount: 0,
      tendersLength: 0,
      tenderPage: 1,
      tenderPageSize: 10,
      companiesLength: 0,
      companyPage: 1,
      companyPageSize: 10,
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
        { key: 'action', label: '' }
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
        { key: 'action', label: '' }
      ],
      companyFields: [
        {
          key: 'name',
          label: 'Denumire',
          sortable: true,
          isRowHeader: false,
          tdClass: 'titlu'
        },
        { key: 'contract_count', label: 'Nr contracte', sortable: true },
        { key: 'contract_total_ron', label: 'Total contracte', sortable: true },
        { key: 'tender_count', label: 'Nr licitații', sortable: true },
        { key: 'tender_total_ron', label: 'Total licitații', sortable: true },
        { key: 'action', label: '' }
      ],
      volume_pie: [],
      volume_hist: [],
      count_pie: [],
      count_hist: [],
      cpv_pie: [],
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
    getContracts (ctx) {
      let req = this.$axios.get(`institution/${this.$route.params.id}/contracts?page=${ctx.currentPage}` +
        `&perPage=${ctx.perPage}&sortBy=${ctx.sortBy}&sortDesc=${ctx.sortDesc}`)
      return req.then(({data}) => {
        this.contractsLength = parseInt(data.count, 10)
        return data.items
      })
    },
    getAllContracts () {
      let req = this.$axios.get(`institution/${this.$route.params.id}/contracts.csv`)
      req.then(response => {
        let blob = new Blob([response.data], { type: 'application/csv' } )
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `achizitii_institutie_${this.$route.params.id}.csv`
        link.click()
      })
    },
    getAllTenders () {
      let req = this.$axios.get(`institution/${this.$route.params.id}/tenders.csv`)
      req.then(response => {
        let blob = new Blob([response.data], { type: 'application/csv' } )
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `licitatii_institutie_${this.$route.params.id}.csv`
        link.click()
      })
    },
    getAllCompanies () {
      let req = this.$axios.get(`institution/${this.$route.params.id}/companies.csv`)
      req.then(response => {
        let blob = new Blob([response.data], { type: 'application/csv' } )
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `companii_institutie_${this.$route.params.id}.csv`
        link.click()
      })
    },
    getVolumeChart () {
      var min = moment(this.dateParams[0], 'MM-YYYY').local().format('YYYY-MM-DD')
      var max = moment(this.dateParams[1], 'MM-YYYY').local().format('YYYY-MM-DD')
      let req = this.$axios.get(`institution/${this.$route.params.id}/volume_chart.csv?start=${min}&end=${max}`)
      req.then(response => {
        let blob = new Blob([response.data], { type: 'application/csv' } )
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `histograma_institutie_${this.$route.params.id}.csv`
        link.click()
      })
    },
    getCPVStats () {
      var min = moment(this.dateParams[0], 'MM-YYYY').local().format('YYYY-MM-DD')
      var max = moment(this.dateParams[1], 'MM-YYYY').local().format('YYYY-MM-DD')
      let req = this.$axios.get(`institution/${this.$route.params.id}/cpv_stats.csv?start=${min}&end=${max}`)
      req.then(response => {
        let blob = new Blob([response.data], { type: 'application/csv' } )
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `cpv_institutie_${this.$route.params.id}.csv`
        link.click()
      })
    },
    getTenders (ctx) {
      let req = this.$axios.get(`institution/${this.$route.params.id}/tenders?page=${ctx.currentPage}` +
        `&perPage=${ctx.perPage}&sortBy=${ctx.sortBy}&sortDesc=${ctx.sortDesc}`)
      return req.then(({data}) => {
        this.tendersLength = parseInt(data.count, 10)
        return data.items
      })
    },
    getCompanies (ctx) {
      let req = this.$axios.get(`institution/${this.$route.params.id}/companies?page=${ctx.currentPage}` +
        `&perPage=${ctx.perPage}&sortBy=${ctx.sortBy}&sortDesc=${ctx.sortDesc}`)
      return req.then(({data}) => {
        this.companiesLength = parseInt(data.count, 10)
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
      this.$axios.get('../api/Tender/' + data.id).then(cRet => {
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
    // getShareLink () {
    //   return 
    //   console.log(document.URL)
    //   //console.log(this.$router)
    // }
  },
  watch: {
    dateParams: _.debounce(function (params, oldParams) {
      var min = moment(params[0], 'MM-YYYY').local().format('YYYY-MM-DD')
      var max = moment(params[1], 'MM-YYYY').local().format('YYYY-MM-DD')
      this.$axios.get(`institution_stats/${this.$route.params.id}?start=${min}&end=${max}`).then(({data}) => {
        let details = updateStats(data)
        this.details = details.details
        this.volume_pie = details.volume_pie
        this.volume_hist = details.volume_hist
        this.count_pie = details.count_pie
        this.count_hist = details.count_hist
        this.cpv_pie = details.cpv_pie
      })
    }, 500)
  },
  head () {
    return {
      title: `Harta banilor publici / statistici instituție publică / ${this.details.name}`,
      meta: [
        { hid: 'description', name: 'description', content: `Statistici instituție publică ${this.details.name}` }
      ]
    }
  }
}
</script>