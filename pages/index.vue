<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="primary" fixed="bottom" :sticky="false" class="nav-top">
      <b-navbar-nav class="pl-5" />
      <b-navbar-brand :to="{path: '/'}"><img src="/logo_landscape.svg"
        height="60" alt="Harta Banilor Publici"/></b-navbar-brand>
      <b-navbar-toggle target="nav_collapse" />
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto pr-5">
          <b-nav-item :to="{path: '/'}" exact>Hartă</b-nav-item>
          <b-nav-item :to="{path: '/default/info'}">Info</b-nav-item>
          <b-nav-item :to="{path: '/default/stats'}">Statistici</b-nav-item>
          <b-nav-item :to="{path: '/default/team'}">Echipa</b-nav-item>
          <b-nav-item :to="{path: '/default/contact'}">Contact</b-nav-item>
          <b-nav-item :to="{path: '/default/gdpr'}">GDPR</b-nav-item>
          <b-nav-item href="https://www.initiativaromania.ro/harta_banilor_publici" target="_blank">Donează</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid style="padding-bottom: 100px;" class="indexView">
      <b-row id="main" :no-gutters="true">
        <b-col><nuxt-child/></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  components: {
  },
  data: function () {
    return {
      routeIsHome: true
    }
  }
}
</script>

<style>
#app { position: relative; }

#app > .container-fluid.indexView {
    padding: 0;
    /*margin-bottom: 100px;*/
    height: 100%;
    top: 0; bottom: 0;
}

#main {
    width: 100%; height: 100%;
}

.navbar.nav-top {
  min-height: 100px;
}

.navbar-brand {
    font-size: 1.5em;
}

.navbar .nav-item {
    width: 75px;
    text-align: center;
}

.navbar .nav-item > a.active {
    border-bottom: 4px white solid;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
