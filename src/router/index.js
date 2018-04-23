import Vue from 'vue'
import Router from 'vue-router'
import InstitutionMap from '@/components/InstitutionMap'
import InstitutionDetails from '@/components/InstitutionDetails'
import CompanyDetails from '@/components/CompanyDetails'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: InstitutionMap
    },
    {
      path: '/institutionDetails/:id',
      name: 'InstitutionDetails',
      component: InstitutionDetails
    },
    {
      path: '/companyDetails/:type/:id',
      name: 'CompanyDetails',
      component: CompanyDetails
    }
  ],
  mode: 'history'
})
