<template>
  <b-container fluid>
    <b-tabs>

      <b-tab title="Top achiziții directe">
        <b-table striped hover :items="stats.contracts" style="wdith: 100%;"
          :fields="[
            { key: 'title', label: 'Nume' },
            { key: 'price_ron', label: 'Preț' },
            { key: 'contract_date', label: 'Dată' },
            { key: 'company', label: 'Companie' },
            { key: 'institution', label: 'Instituție' },
            { key: 'action', label: '' }
          ]">
          <template slot="price_ron" slot-scope="data">{{ data.item.price_ron | currency('RON') }}</template>
          <template slot="action" slot-scope="data">
            <b-btn size="sm" @click.stop="contractPop(data.item, $event.target)">Detalii</b-btn>
          </template>
        </b-table>
      </b-tab>

      <b-tab title="Top licitații">
        <b-table striped hover :items="stats.tenders" style="wdith: 100%;"
          :fields="[
            { key: 'title', label: 'Nume' },
            { key: 'price_ron', label: 'Preț' },
            { key: 'contract_date', label: 'Dată' },
            { key: 'company', label: 'Companie' },
            { key: 'institution', label: 'Instituție' },
            { key: 'action', label: '' }
          ]">
          <template slot="price_ron" slot-scope="data">{{ data.item.price_ron | currency('RON') }}</template>
          <template slot="action" slot-scope="data">
            <b-btn size="sm" @click.stop="tenderPop(data.item, $event.target)">Detalii</b-btn>
          </template>
        </b-table>
      </b-tab>

      <b-tab title="Top instituții">
        <b-row>
          <b-col>
            <b-table striped hover :items="stats.institutions.by_contract" style="wdith: 100%;" caption-top
              :fields="[
                { key: 'name', label: 'Titlu' },
                { key: 'reg_no', label: 'CUI' },
                { key: 'count', label: 'Număr contracte' },
                { key: 'action', label: '' }
              ]">
              <template slot="table-caption">După numărul de achiziții directe</template>
              <template slot="action" slot-scope="data">
                <b-btn size="sm" :to="{name: 'default-institution-id', params: {id: data.item.id}}">Detalii</b-btn>
              </template>
            </b-table>
            <b-table striped hover :items="stats.institutions.by_tender" style="wdith: 100%;" caption-top
              :fields="[
                { key: 'name', label: 'Titlu' },
                { key: 'reg_no', label: 'CUI' },
                { key: 'count', label: 'Număr contracte' },
                { key: 'action', label: '' }
              ]">
              <template slot="table-caption">După numărul de licitații</template>
              <template slot="action" slot-scope="data">
                <b-btn size="sm" :to="{name: 'default-institution-id', params: {id: data.item.id}}">Detalii</b-btn>
              </template>
            </b-table>
          </b-col>
        </b-row>
      </b-tab>

      <b-tab title="Top companii">
        <b-row>
          <b-col>
            <b-table striped hover :items="stats.companies.by_contract" style="wdith: 100%;" caption-top
            :fields="[
                { key: 'name', label: 'Titlu' },
                { key: 'reg_no', label: 'CUI' },
                { key: 'count', label: 'Număr contracte' },
                { key: 'action', label: '' }
              ]">
              <template slot="table-caption">După numărul de achiziții directe</template>
              <template slot="action" slot-scope="data">
                <b-btn size="sm" :to="{name: 'default-company-id', params: {id: data.item.id}}">Detalii</b-btn>
              </template>
            </b-table>
            <b-table striped hover :items="stats.companies.by_tender" style="wdith: 100%;" caption-top
            :fields="[
                { key: 'name', label: 'Titlu' },
                { key: 'reg_no', label: 'CUI' },
                { key: 'count', label: 'Număr contracte' },
                { key: 'action', label: '' }
              ]">
              <template slot="table-caption">După numărul de licitații</template>
              <template slot="action" slot-scope="data">
                <b-btn size="sm" :to="{name: 'default-company-id', params: {id: data.item.id}}">Detalii</b-btn>
              </template>
            </b-table>
          </b-col>
        </b-row>
      </b-tab>

     <b-tab title="Statistci globale">
          <p class="card-text">
            <table class="table table-striped" style="wdith: 100%;">
              <thead>
                <th scope="col">Contracte</th>
                <th scope="row">Licitații</th>
                <th scope="row">Companii</th>
                <th scope="row">Instituții publice</th>
              </thead>
              <tbody>
                <tr>
                    <td>{{stats.general.contracts}}</td>
                    <td>{{stats.general.tenders}}</td>
                    <td>{{stats.general.companies}}</td>
                    <td>{{stats.general.institutions}}</td>
                </tr>
              </tbody>
            </table>
          </p>
      </b-tab>
    </b-tabs>
    <b-modal id="contractModal" ok-only size="lg" :title="currContract.TitluContract" >
      <b-container fluid v-if="currContract">
        <table class="table table-striped table-bordered table-sm" width="100%">
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
                <b-btn size="sm" :to="{name:'default-institution-id', params: {id: currContract.InstitutiePublicaID}}">{{currContract.NumeInstitutie}}</b-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </b-container>
    </b-modal>

    <b-modal id="tenderModal" ok-only size="lg" :title="currTender.TitluContract" >
      <b-container fluid v-if="currTender">
        <table class="table table-striped table-bordered table-sm" width="100%">
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
                <b-btn size="sm" :to="{name:'default-institution-id', params: {id: currTender.InstitutiePublicaID}}">{{currTender.NumeInstitutie}}</b-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </b-container>
    </b-modal>

  </b-container>
</template>

<script>
import Vue from 'vue'
import CPVLegend from '@/assets/js/cvplegend'

export default {
  name: 'Statistics',
  data: function () {
    return {
      stats: {general: {}, companies: {}, institutions: {}},
      currContract: {},
      currTender: {}
    }
  },
  async asyncData ({app}) {
    let {data} = await app.$axios.get('stats')
    return { stats: data }
  },
  methods: {
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
  },
  head () {
    return {
      title: 'Harta banilor publici / Statistici',
      meta: [
        { hid: 'description', name: 'description', content: 'Harta banilor publici - Statistici' }
      ]
    }
  }
}
</script>