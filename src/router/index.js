import Vue from 'vue'
import Router from 'vue-router'
import InstitutionMap from '@/components/InstitutionMap'
import InstitutionDetails from '@/components/InstitutionDetails'
import CompanyDetails from '@/components/CompanyDetails'
import MapMain from '@/components/Main'
import SearchCompany from '@/components/SearchCompany'
import SearchInstitution from '@/components/SearchInstitution'
import SearchContracts from '@/components/SearchContracts'
import Statistics from '@/components/Statistics'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/old',
      name: 'OldHome',
      component: InstitutionMap
    },
    {
      path: '/',
      name: 'Home',
      component: MapMain
    },
    {
      path: '/institutionDetails/:id',
      name: 'InstitutionDetails',
      component: InstitutionDetails
    },
    {
      path: '/companyDetails/:id',
      name: 'CompanyDetails',
      component: CompanyDetails
    },
    {
      path: '/searchCompany/:kw',
      name: 'SearchCompany',
      component: SearchCompany
    },
    {
      path: '/searchInstitution/:kw',
      name: 'SearchInstitution',
      component: SearchInstitution
    },
    {
      path: '/searchContracts/:kw',
      name: 'SearchContracts',
      component: SearchContracts
    },
    {
      path: '/stats',
      name: 'Statistics',
      component: Statistics
    }
  ],
  mode: 'history'
})
